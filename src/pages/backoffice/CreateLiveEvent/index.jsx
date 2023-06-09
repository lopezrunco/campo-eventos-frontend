import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  CREATE_LIVE_EVENT_FAILURE,
  CREATE_LIVE_EVENT_REQUEST,
  CREATE_LIVE_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../action-types";

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
    case CREATE_LIVE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_LIVE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        event: action.payload.event,
      };
    case CREATE_LIVE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function CreateLiveEvent() {
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
      type: CREATE_LIVE_EVENT_REQUEST,
    });

    fetch(apiUrl("/live-events/create"), {
      method: "POST",
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
          type: CREATE_LIVE_EVENT_SUCCESS,
          payload: data,
        });

        navigate("/admin/remate-vivo-creado");
      })
      .catch((error) => {
        console.error("Error al crear el remate en vivo", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_LIVE_EVENT_FAILURE,
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
        <Breadcrumbs location={"Crear remate en vivo"} />
      </motion.div>
      <section className="create-live-event-page">
        <article className="container">
          <Title
            title="Crear remate en vivo"
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
                <div className="col-3">
                  <label htmlFor="day">
                    Día *
                    <input
                      required
                      type="text"
                      value={state.day}
                      onChange={handleInputChange}
                      name="day"
                      id="day"
                      placeholder="Ej: 07, 15, 29"
                    />
                  </label>
                </div>
                <div className="col-3">
                  <label htmlFor="month">
                    Mes *
                    <input
                      required
                      type="text"
                      value={state.month}
                      onChange={handleInputChange}
                      name="month"
                      id="month"
                      placeholder="Ej: 09, 12"
                    />
                  </label>
                </div>
                <div className="col-3">
                  <label htmlFor="beginHour">
                    Hora inicio *
                    <input
                      required
                      type="text"
                      value={state.beginHour}
                      onChange={handleInputChange}
                      name="beginHour"
                      id="beginHour"
                      placeholder="Ej: 09:00, 18:00"
                    />
                  </label>
                </div>
                <div className="col-3">
                  <label htmlFor="endHour">
                    Hora cierre *
                    <input
                      required
                      type="text"
                      value={state.endHour}
                      onChange={handleInputChange}
                      name="endHour"
                      id="endHour"
                      placeholder="Ej: 09:00, 18:00"
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
                  <i className="fas fa-plus"></i>
                  {state.isSubmitting ? "Por favor, espere..." : "Crear"}
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

export default CreateLiveEvent;
