import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_LIVE_EVENT_FAILURE,
  EDIT_LIVE_EVENT_REQUEST,
  EDIT_LIVE_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../action-types";
import {
  FETCH_LIVE_EVENT_FAILURE,
  FETCH_LIVE_EVENT_REQUEST,
  FETCH_LIVE_EVENT_SUCCESS,
} from "../../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

const initialState = {
  title: "",
  day: "",
  month: "",
  beginHour: "",
  endHour: "",
  location: "",
  organizer: "",
  coverImgName: undefined,
  broadcastLinkId: undefined,
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
    case FETCH_LIVE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case FETCH_LIVE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.event.title,
        day: action.payload.event.day,
        month: action.payload.event.month,
        beginHour: action.payload.event.beginHour,
        endHour: action.payload.event.endHour,
        location: action.payload.event.location,
        organizer: action.payload.event.organizer,
        broadcastLinkId: `https://www.youtube.com/watch/${action.payload.event.broadcastLinkId}`
      };
    case FETCH_LIVE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case EDIT_LIVE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_LIVE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case EDIT_LIVE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function UpdateLiveEvent() {
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
      type: FETCH_LIVE_EVENT_REQUEST,
    });

    fetch(apiUrl(`/live-events/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: FETCH_LIVE_EVENT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the live event", error);

        if (error) {
          dispatch({
            type: FETCH_LIVE_EVENT_FAILURE,
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
      type: EDIT_LIVE_EVENT_REQUEST,
    });

    fetch(apiUrl(`live-events/${id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        day: state.day,
        month: state.month,
        beginHour: state.beginHour,
        endHour: state.endHour,
        location: state.location,
        organizer: state.organizer,
        coverImgName: state.coverImgName,
        broadcastLinkId:
          state.broadcastLinkId === undefined
            ? null
            : getYoutubeId(state.broadcastLinkId),
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
          type: EDIT_LIVE_EVENT_SUCCESS,
          payload: data,
        });

        navigate("/admin/");
      })
      .catch((error) => {
        console.error("Error al editar el remate en vivo", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_LIVE_EVENT_FAILURE,
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
        <Breadcrumbs location={"Editar remate en vivo"} />
      </motion.div>
      <section className="update-live-event-page">
        <article className="container">
          <Title
            title="Editar remate en vivo"
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
                <div className="col-6">
                  <label htmlFor="day">
                    Día *
                    <input
                      required
                      type="text"
                      value={state.day}
                      onChange={handleInputChange}
                      name="day"
                      id="day"
                    />
                  </label>
                </div>
                <div className="col-6">
                  <label htmlFor="month">
                    Mes *
                    <input
                      required
                      type="text"
                      value={state.month}
                      onChange={handleInputChange}
                      name="month"
                      id="month"
                    />
                  </label>
                </div>
                <div className="col-6">
                  <label htmlFor="beginHour">
                    Hora inicio *
                    <input
                      required
                      type="text"
                      value={state.beginHour}
                      onChange={handleInputChange}
                      name="beginHour"
                      id="beginHour"
                    />
                  </label>
                </div>
                <div className="col-6">
                  <label htmlFor="endHour">
                    Hora cierre *
                    <input
                      required
                      type="text"
                      value={state.endHour}
                      onChange={handleInputChange}
                      name="endHour"
                      id="endHour"
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
                <div className="col-6">
                  <label htmlFor="organizer">
                    Organización *
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
                <label htmlFor="broadcastLinkId">
                  Enlace transmisión
                  <input
                    required
                    type="text"
                    value={state.broadcastLinkId}
                    onChange={handleInputChange}
                    name="broadcastLinkId"
                    id="broadcastLinkId"
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

export default UpdateLiveEvent;
