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
import { Title } from "../../../components/Title";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { cleanTextareas } from "../../../utils/cleanTextareas";

const initialState = {
  title: "",
  description: "",
  company: "",
  organizer: "",
  funder: "",
  location: "",
  broadcastLink: "",
  eventDate: "",
  eventHour: "",
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

  const getTimeStamp = (date, hour) => {
    return new Date(`${date}T${hour}`).getTime();
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
        // description: cleanTextareas(state.description),
        company: state.company,
        organizer: state.organizer,
        funder: state.funder,
        location: state.location,
        broadcastLink:
          state.broadcastLink === undefined
            ? undefined
            : getYoutubeId(state.broadcastLink),
        eventTimestamp: getTimeStamp(state.eventDate, state.eventHour),
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
          <Title
            title="Crear remate"
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
                  Descripción
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

                <div className="col-lg-6">
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

                <div className="col-lg-6">
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

                <div className="col-lg-6">
                  <label htmlFor="funder">
                    Financiación
                    <input
                      type="text"
                      value={state.funder}
                      onChange={handleInputChange}
                      name="funder"
                      id="funder"
                    />
                  </label>
                </div>

                <div className="col-lg-6">
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
                    type="text"
                    value={state.broadcastLink}
                    onChange={handleInputChange}
                    name="broadcastLink"
                    id="broadcastLink"
                  />
                </label>

                <div className="col-lg-6">
                  <label htmlFor="eventDate">
                    Fecha
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      // value={state.eventDate}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                <div className="col-lg-6">
                  <label htmlFor="eventHour">
                    Hora
                    <input
                      type="time"
                      id="eventHour"
                      name="eventHour"
                      pattern="[0-9]{2}:[0-9]{2}"
                      // value={state.eventHour}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

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
