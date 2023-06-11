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
import ActualLiveEventData from "./ActualLiveEventData";

import "./styles.scss";

const initialState = {
  liveEvent: "",
  title: "",
  day: "",
  month: "",
  beginHour: "",
  endHour: "",
  location: "",
  organizer: "",
  coverImgName: undefined,
  broadcastLinkId: "",
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
        liveEvent: action.payload.event,
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

  // On component mount, fetch the event
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
            ? undefined
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
        <Breadcrumbs location={"Editar evento en vivo"} />
      </motion.div>
      <section className="update-live-event-page">
        <article className="container">
          <div className="row">
            <div className="col-lg-7">
              <h3>Ingrese la nueva información</h3>
              <div className="update-live-event-container">
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
                <label htmlFor="day">
                  Día
                  <input
                    required
                    type="text"
                    value={state.day}
                    onChange={handleInputChange}
                    name="day"
                    id="day"
                  />
                </label>
                <label htmlFor="month">
                  Mes
                  <input
                    required
                    type="text"
                    value={state.month}
                    onChange={handleInputChange}
                    name="month"
                    id="month"
                  />
                </label>
                <label htmlFor="beginHour">
                  Hora de inicio
                  <input
                    required
                    type="text"
                    value={state.beginHour}
                    onChange={handleInputChange}
                    name="beginHour"
                    id="beginHour"
                  />
                </label>
                <label htmlFor="endHour">
                  Hora de finalización
                  <input
                    required
                    type="text"
                    value={state.endHour}
                    onChange={handleInputChange}
                    name="endHour"
                    id="endHour"
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
                <label htmlFor="organizer">
                  Organización
                  <input
                    required
                    type="text"
                    value={state.organizer}
                    onChange={handleInputChange}
                    name="organizer"
                    id="organizer"
                  />
                </label>
                <label htmlFor="broadcastLinkId">
                  Link de la transmisión (YouTube)
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
            <div className="col-lg-5">
              <h3>Datos actuales:</h3>
              <ActualLiveEventData liveEvent={state.liveEvent} />
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default UpdateLiveEvent;