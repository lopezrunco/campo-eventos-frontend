import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import {
  EDIT_EVENT_FAILURE,
  EDIT_EVENT_REQUEST,
  EDIT_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_MY_EVENT_FAILURE,
  GET_MY_EVENT_REQUEST,
  GET_MY_EVENT_SUCCESS,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

const initialState = {
  title: "",
  description: "",
  company: "",
  organizer: "",
  funder: "",
  location: "",
  broadcastLink: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case GET_MY_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_MY_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.event.title,
        description: action.payload.event.description,
        company: action.payload.event.company,
        organizer: action.payload.event.organizer,
        funder: action.payload.event.funder,
        location: action.payload.event.location,
        broadcastLink: `https://www.youtube.com/watch/${action.payload.event.broadcastLink}`,
      };
    case GET_MY_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case EDIT_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case EDIT_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function UpdateEvent() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // On component mount, fetch the event and set data in the form
  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: GET_MY_EVENT_REQUEST,
    });

    fetch(apiUrl(`/events/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: GET_MY_EVENT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the event", error);

        if (error) {
          dispatch({
            type: GET_MY_EVENT_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, id]);

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  // On form submit, call the update event endpoint
  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_EVENT_REQUEST,
    });

    fetch(apiUrl(`events/${id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        description: state.description,
        company: state.company,
        organizer: state.organizer,
        funder: state.funder,
        location: state.location,
        broadcastLink:
          state.broadcastLink === undefined
            ? null
            : getYoutubeId(state.broadcastLink),
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: EDIT_EVENT_SUCCESS,
          payload: data,
        });

        navigate(`/consignatarios/mis-remates/${id}`);
      })
      .catch((error) => {
        console.error("Error al editar el remate.", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_EVENT_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Editar remate"} />
      </motion.div>
      <section className="update-event-page">
        <article className="container">
          <Title
            title="Editar remate"
            subtitle="Los campos marcados con * son obligatorios"
          />
          <div className="row">
            <div className="col-12">
              <div className="form-container row">
                <label htmlFor="title">
                  Título *
                  <input
                    required
                    type="text"
                    value={state.title}
                    onChange={handleInputChange}
                    name="title"
                    id="title"
                  />
                </label>

                <label htmlFor="description">
                  Descripción *
                  <textarea
                    value={state.description}
                    onChange={handleInputChange}
                    name="description"
                    id="description"
                    cols="10"
                    rows="7"
                    maxLength="600"
                  ></textarea>
                </label>

                <div className="col-6">
                  <label htmlFor="company">
                    Rematador *
                    <input
                      required
                      type="text"
                      value={state.company}
                      onChange={handleInputChange}
                      name="company"
                      id="company"
                    />
                  </label>
                </div>

                <div className="col-6">
                  <label htmlFor="organizer">
                    Organizador *
                    <input
                      required
                      type="text"
                      value={state.organizer}
                      onChange={handleInputChange}
                      name="organizer"
                      id="organizer"
                    />
                  </label>
                </div>

                <div className="col-6">
                  <label htmlFor="funder">
                    Financiación *
                    <input
                      required
                      type="text"
                      value={state.funder}
                      onChange={handleInputChange}
                      name="funder"
                      id="funder"
                    />
                  </label>
                </div>

                <div className="col-6">
                  <label htmlFor="location">
                    Lugar *
                    <input
                      required
                      type="text"
                      value={state.location}
                      onChange={handleInputChange}
                      name="location"
                      id="location"
                    />
                  </label>
                </div>

                <label htmlFor="broadcastLink">
                  Enlace transmisión
                  <input
                    required
                    type="text"
                    value={state.broadcastLink}
                    onChange={handleInputChange}
                    name="broadcastLink"
                    id="broadcastLink"
                  />
                </label>

                <button
                  className="button button-dark"
                  onClick={handleFormSubmit}
                  disabled={state.isSubmitting}
                >
                  <i className="fas fa-sync-alt"></i>
                  {state.isSubmitting ? "Por favor, espere..." : "Actualizar"}
                </button>

                {state.errorMessage && (
                  <span className="form-error">{state.errorMessage}</span>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default UpdateEvent;
