import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useReducer } from "react";

// import { cleanTextareas } from "../../../utils/cleanTextareas";
const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;
import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  CREATE_EVENT_FAILURE,
  CREATE_EVENT_REQUEST,
  CREATE_EVENT_SUCCESS,
  FORM_INPUT_CHANGE,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

const initialState = {
  title: "",
  eventType: "",
  category: "",
  description: "",
  company: "",
  organizer: "",
  breeder: "",
  funder: "",
  location: "",
  duration: "",
  startBroadcastTimestamp: "",
  eventDate: "",
  eventHour: "",
  broadcastLinkId: "",
  externalLink: "",
  image: undefined,
  coverImgName: undefined,
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
    case UPLOAD_INPUT_CHANGE:
      return {
        ...state,
        image: action.payload,
      };
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imageUrl: action.payload.url,
        isSending: false,
      };
    case UPLOAD_IMAGE_FAILURE:
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
  // Add a new state to store the image preview URL
  const [imagePreview, setImagePreview] = useState("");
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

  const handleUploadInputChange = (imgElement) => {
    // Update the image preview when a new image is selected
    if (imgElement) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(imgElement);
    }

    dispatch({
      type: UPLOAD_INPUT_CHANGE,
      payload: imgElement,
    });
  };

  const handleImageSubmit = () => {
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
    });

    const data = new FormData();
    data.append("file", state.image);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", "dvkq2sewj");

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload`, {
      method: "post",
      body: data,
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
          type: UPLOAD_IMAGE_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error uploading the image: ", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleImageSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: UPLOAD_IMAGE_FAILURE,
          });
        }
      })
      .finally(() => {
        setImagePreview("")
      })
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
        eventType: state.eventType,
        category: state.category,
        description: state.description,
        // description: cleanTextareas(state.description),
        company: state.company,
        organizer: state.organizer,
        breeder: state.breeder,
        funder: state.funder,
        location: state.location,
        duration: state.duration,
        startBroadcastTimestamp: getTimeStamp(state.eventDate, state.eventHour),
        broadcastLinkId:
          state.broadcastLinkId === undefined
            ? undefined
            : getYoutubeId(state.broadcastLinkId),
        externalLink: state.externalLink,
        coverImgName: state.imageUrl,
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
              <label htmlFor="eventType">
                Tipo de remate
                <input
                  type="text"
                  value={state.eventType}
                  onChange={handleInputChange}
                  name="eventType"
                  id="eventType"
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

            <div className="col-lg-6">
              <label htmlFor="duration">
                Duración (hs.)
                <input
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
                Fecha *
                <input
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
                <input
                  type="time"
                  id="eventHour"
                  name="eventHour"
                  pattern="[0-9]{2}:[0-9]{2}"
                  onChange={handleInputChange}
                  required
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

            <label htmlFor="externalLink">
              Enlace Preofertas
              <input
                type="text"
                value={state.externalLink}
                onChange={handleInputChange}
                name="externalLink"
                id="externalLink"
              />
            </label>

            <div className="add-event-img">
              <label htmlFor="eventImg">
                Afiche del evento
                <input
                  id="eventImg"
                  name="eventImg"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadInputChange(e.target.files[0])}
                ></input>
              </label>
              {imagePreview && (
                <div className="confirmation-modal">
                  <img src={imagePreview} alt="Preview" />
                  <p>Desea usar esta imagen?</p>
                  <button className="button button-dark" onClick={handleImageSubmit} disabled={state.isSending}>
                    <i className="fas fa-upload"></i> {state.isSending ? "Cargando..." : "Aceptar"}
                  </button>
                </div>
              )}
            </div>

            <button
              className="button button-dark"
              onClick={handleFormSubmit}
              disabled={state.isSending}
            >
              <i className="fas fa-plus"></i>
              {state.isSending ? "Por favor, espere..." : "Crear remate"}
            </button>

            {state.hasError &&
              (state.errorMessage ? (
                <span className="error-message">{state.errorMessage}</span>
              ) : (
                <span className="error-message">
                  Ocurrió un error. Revise los datos e intente nuevamente.
                </span>
              ))}
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default CreateEvent;
