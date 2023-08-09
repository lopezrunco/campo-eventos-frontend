import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_EVENT_FAILURE,
  EDIT_EVENT_REQUEST,
  EDIT_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_MY_EVENT_FAILURE,
  GET_MY_EVENT_REQUEST,
  GET_MY_EVENT_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

const initialState = {
  title: "",
  eventType: "",
  description: "",
  rp: "",
  category: "",
  weight: "",
  birthDate: "",
  pedigree: "",
  breeder: "",
  other: "",
  company: "",
  organizer: "",
  funder: "",
  location: "",
  broadcastLink: undefined,
  eventDate: "",
  eventHour: "",
  eventTimestamp: "",
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
        eventType: action.payload.event.eventType,
        description: action.payload.event.description,
        rp: action.payload.event.rp,
        category: action.payload.event.category,
        weight: action.payload.event.weight,
        birthDate: action.payload.event.birthDate,
        pedigree: action.payload.event.pedigree,
        breeder: action.payload.event.breeder,
        other: action.payload.event.other,
        company: action.payload.event.company,
        organizer: action.payload.event.organizer,
        funder: action.payload.event.funder,
        location: action.payload.event.location,
        broadcastLink: `https://www.youtube.com/watch/${action.payload.event.broadcastLink}`,
        eventTimestamp: action.payload.event.eventTimestamp,
        eventDate: action.payload.event.eventTimestamp.split("T")[0],
        eventHour: new Date(action.payload.event.eventTimestamp).toLocaleString(
          "es-uy",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
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
  const [editDate, setEditDate] = useState(false);
  const [editHour, setEditHour] = useState(false);
  const navigate = useNavigate();

  let actualDate = new Date(state.eventTimestamp).toLocaleDateString("es-uy");
  let actualHour = new Date(state.eventTimestamp).toLocaleString("es-uy", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEditDateClick = () => {
    setEditDate(true);
  };

  const handleEditHourClick = () => {
    setEditHour(true);
  };

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

  const getTimeStamp = (date, hour) => {
    return new Date(`${date}T${hour}`).getTime();
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
        eventType: state.eventType,
        description: state.description,
        rp: state.rp,
        category: state.category,
        weight: state.weight,
        birthDate: state.birthDate,
        pedigree: state.pedigree,
        breeder: state.breeder,
        other: state.other,
        company: state.company,
        organizer: state.organizer,
        funder: state.funder,
        location: state.location,
        broadcastLink:
          state.broadcastLink === undefined
            ? null
            : getYoutubeId(state.broadcastLink),
        eventTimestamp: getTimeStamp(state.eventDate, state.eventHour),
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

        navigate("/remate-editado");
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

          {state.eventType === "pantalla" ? (
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
                      Rematador
                      <input
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
                      Organizador
                      <input
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
                      Lugar
                      <input
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
                      Fecha *
                      {!editDate && (
                        <span className="editable-data">
                          <div className="content">
                            <i className="fas fa-calendar"></i>
                            {actualDate}
                          </div>
                          <i
                            className="fas fa-pencil-alt edit-icon"
                            onClick={handleEditDateClick}
                          ></i>
                        </span>
                      )}
                      {/* TO DO: Chequear si en uruguay se muestra en formato DD MM YYYY */}
                      <input
                        hidden={!editDate ? "hidden" : null}
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        onChange={handleInputChange}
                        required
                      />
                    </label>
                  </div>

                  <div className="col-lg-6">
                    <label htmlFor="eventHour">
                      Hora *
                      {!editHour && (
                        <span className="editable-data">
                          <div className="content">
                            <i className="fas fa-clock"></i>
                            {actualHour}
                          </div>
                          <i
                            className="fas fa-pencil-alt edit-icon"
                            onClick={handleEditHourClick}
                          ></i>
                        </span>
                      )}
                      <input
                        hidden={!editHour ? "hidden" : null}
                        type="time"
                        id="eventHour"
                        name="eventHour"
                        pattern="[0-9]{2}:[0-9]{2}"
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
                    <i className="fas fa-sync-alt"></i>
                    {state.isSubmitting ? "Por favor, espere..." : "Actualizar"}
                  </button>

                  {state.errorMessage && (
                    <span className="form-error">{state.errorMessage}</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            (state.eventType === "equinos" ||
              state.eventType === "bovinos" ||
              state.eventType === "ovinos") && (
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

                    <div className="col-lg-6">
                      <label htmlFor="rp">
                        R.P.
                        <input
                          type="text"
                          value={state.rp}
                          onChange={handleInputChange}
                          name="rp"
                          id="rp"
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="category">
                        Categoría
                        <input
                          type="text"
                          value={state.category}
                          onChange={handleInputChange}
                          name="category"
                          id="category"
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="weight">
                        Peso
                        <input
                          type="number"
                          value={state.weight}
                          onChange={handleInputChange}
                          name="weight"
                          id="weight"
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="birthDate">
                        Fecha de nacimiento
                        <input
                          type="text"
                          value={state.birthDate}
                          onChange={handleInputChange}
                          name="birthDate"
                          id="birthDate"
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="pedigree">
                        Pedigree
                        <input
                          type="text"
                          value={state.pedigree}
                          onChange={handleInputChange}
                          name="pedigree"
                          id="pedigree"
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="breeder">
                        Cabaña
                        <input
                          type="text"
                          value={state.breeder}
                          onChange={handleInputChange}
                          name="breeder"
                          id="breeder"
                        />
                      </label>
                    </div>

                    <label htmlFor="other">
                      Otro dato
                      <textarea
                        value={state.other}
                        onChange={handleInputChange}
                        name="other"
                        id="other"
                        cols="10"
                        rows="7"
                        maxLength="600"
                      ></textarea>
                    </label>

                    <div className="col-lg-6">
                      <label htmlFor="eventDate">
                        Fecha *
                        {!editDate && (
                          <span className="editable-data">
                            <div className="content">
                              <i className="fas fa-calendar"></i>
                              {actualDate}
                            </div>
                            <i
                              className="fas fa-pencil-alt edit-icon"
                              onClick={handleEditDateClick}
                            ></i>
                          </span>
                        )}
                        {/* TO DO: Chequear si en uruguay se muestra en formato DD MM YYYY */}
                        <input
                          hidden={!editDate ? "hidden" : null}
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          onChange={handleInputChange}
                          required
                        />
                      </label>
                    </div>

                    <div className="col-lg-6">
                      <label htmlFor="eventHour">
                        Hora *
                        {!editHour && (
                          <span className="editable-data">
                            <div className="content">
                              <i className="fas fa-clock"></i>
                              {actualHour}
                            </div>
                            <i
                              className="fas fa-pencil-alt edit-icon"
                              onClick={handleEditHourClick}
                            ></i>
                          </span>
                        )}
                        <input
                          hidden={!editHour ? "hidden" : null}
                          type="time"
                          id="eventHour"
                          name="eventHour"
                          pattern="[0-9]{2}:[0-9]{2}"
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
                      <i className="fas fa-sync-alt"></i>
                      {state.isSubmitting
                        ? "Por favor, espere..."
                        : "Actualizar"}
                    </button>

                    {state.errorMessage && (
                      <span className="form-error">{state.errorMessage}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </article>
      </section>
    </React.Fragment>
  );
}

export default UpdateEvent;
