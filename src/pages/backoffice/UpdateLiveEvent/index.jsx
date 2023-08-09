import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_LIVE_EVENT_FAILURE,
  EDIT_LIVE_EVENT_REQUEST,
  EDIT_LIVE_EVENT_SUCCESS,
  FETCH_LIVE_EVENT_FAILURE,
  FETCH_LIVE_EVENT_REQUEST,
  FETCH_LIVE_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

const initialState = {
  title: "",
  eventDate: "",
  eventHour: "",
  startBroadcastTimestamp: "",
  duration: "",
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
        startBroadcastTimestamp: action.payload.event.startBroadcastTimestamp,
        eventDate: action.payload.event.startBroadcastTimestamp.split("T")[0],
        eventHour: new Date(
          action.payload.event.startBroadcastTimestamp
        ).toLocaleString("es-uy", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: action.payload.event.duration,
        location: action.payload.event.location,
        organizer: action.payload.event.organizer,
        broadcastLinkId: `https://www.youtube.com/watch/${action.payload.event.broadcastLinkId}`,
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
  const [editDate, setEditDate] = useState(false);
  const [editHour, setEditHour] = useState(false);
  const navigate = useNavigate();

  let actualDate = new Date(state.startBroadcastTimestamp).toLocaleDateString(
    "es-uy"
  );
  let actualHour = new Date(state.startBroadcastTimestamp).toLocaleString(
    "es-uy",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

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

  const getTimeStamp = (date, hour) => {
    return new Date(`${date}T${hour}`).getTime();
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
        duration: state.duration,
        location: state.location,
        organizer: state.organizer,
        coverImgName: state.coverImgName,
        broadcastLinkId:
          state.broadcastLinkId === undefined
            ? null
            : getYoutubeId(state.broadcastLinkId),
        startBroadcastTimestamp: getTimeStamp(state.eventDate, state.eventHour),
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

        navigate("/admin/remate-vivo-editado");
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
                <div className="col-lg-6">
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
                <div className="col-lg-6">
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
                </div>

                <div className="col-lg-6">
                  <label htmlFor="duration">
                    Duración (hs.)
                    <input
                      required
                      type="number"
                      value={state.duration}
                      onChange={handleInputChange}
                      name="duration"
                      id="duration"
                    />
                  </label>
                </div>

                <div className="col-lg-6">
                  <label htmlFor="eventDate">
                    Fecha
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
                    Hora
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
        </article>
      </section>
    </React.Fragment>
  );
}

export default UpdateLiveEvent;
