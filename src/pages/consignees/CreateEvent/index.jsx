import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  CREATE_EVENT_FAILURE,
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

import "./styles.scss";

const initialState = {
  title: "",
  description: "",
  company: "",
  organizer: "",
  funder: "",
  location: "",
  broadcastLink: "",
  imageUrl: undefined,
  userId: "",
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
    case CREATE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case CREATE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function CreateEvent() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: CREATE_EVENT_REQUEST,
    });

    fetch(apiUrl("/events/create"), {
      method: "POST",
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
        broadcastLink: state.broadcastLink,
        imageUrl: state.imageUrl,
        userId: authState.user.id,
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
          type: CREATE_EVENT_SUCCESS,
          payload: data,
        });

        navigate("/remate-creado");
      })
      .catch((error) => {
        console.error("Error al crear el remate", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_EVENT_FAILURE,
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
        <Breadcrumbs location={"Crear remate"} />
      </motion.div>
      <section>
        <article className="container">
          <div className="row">
            <div className="col-12">
              <div className="create-event-container">
                <label htmlFor="title">
                  Título
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
                  Descripción
                  <input
                    required
                    type="text"
                    value={state.description}
                    onChange={handleInputChange}
                    name="description"
                    id="description"
                  />
                </label>

                <label htmlFor="company">
                  Rematador
                  <input
                    required
                    type="text"
                    value={state.company}
                    onChange={handleInputChange}
                    name="company"
                    id="company"
                  />
                </label>

                <label htmlFor="organizer">
                  Organizador
                  <input
                    required
                    type="text"
                    value={state.organizer}
                    onChange={handleInputChange}
                    name="organizer"
                    id="organizer"
                  />
                </label>

                <label htmlFor="funder">
                  Financiación
                  <input
                    required
                    type="text"
                    value={state.funder}
                    onChange={handleInputChange}
                    name="funder"
                    id="funder"
                  />
                </label>

                <label htmlFor="location">
                  Lugar
                  <input
                    required
                    type="text"
                    value={state.location}
                    onChange={handleInputChange}
                    name="location"
                    id="location"
                  />
                </label>

                <label htmlFor="broadcastLink">
                  Enlace a transmisión en vivo
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
                  <i className="fas fa-plus"></i>
                  {state.isSubmitting ? "Por favor, espere..." : "Crear remate"}
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

export default CreateEvent;
