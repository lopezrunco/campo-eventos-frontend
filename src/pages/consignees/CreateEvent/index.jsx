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
  TAB_CHANGE,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { cleanTextareas } from "../../../utils/cleanTextareas";

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
    case TAB_CHANGE:
      return {
        title: "",
        eventType: action.payload,
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
        broadcastLink: "",
        eventDate: "",
        eventHour: "",
        isSending: false,
        hasError: false,
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

  const handleTabChange = (event) => {
    dispatch({
      type: TAB_CHANGE,
      payload: event.target.getAttribute("aria-controls"),
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
        eventType: state.eventType,
        description: state.description,
        // description: cleanTextareas(state.description),
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

          <div className="accordion form-accordion" id="accordionExample">
            {/* Remate por pantalla */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#pantalla"
                  aria-expanded="true"
                  aria-controls="pantalla"
                  onClick={handleTabChange}
                >
                  Remate por pantalla
                </button>
              </h2>
              <div
                id="pantalla"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
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

                    <button
                      className="button button-dark"
                      onClick={handleFormSubmit}
                      disabled={state.isSubmitting}
                    >
                      <i className="fas fa-plus"></i>
                      {state.isSubmitting
                        ? "Por favor, espere..."
                        : "Crear remate"}
                    </button>

                    {state.errorMessage && (
                      <span className="form-error">{state.errorMessage}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Equinos */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#equinos"
                  aria-expanded="false"
                  aria-controls="equinos"
                  onClick={handleTabChange}
                >
                  Equinos
                </button>
              </h2>
              <div
                id="equinos"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
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

                    <button
                      className="button button-dark"
                      onClick={handleFormSubmit}
                      disabled={state.isSubmitting}
                    >
                      <i className="fas fa-plus"></i>
                      {state.isSubmitting
                        ? "Por favor, espere..."
                        : "Crear remate"}
                    </button>

                    {state.errorMessage && (
                      <span className="form-error">{state.errorMessage}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bovinos */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#bovinos"
                  aria-expanded="false"
                  aria-controls="bovinos"
                  onClick={handleTabChange}
                >
                  Bovinos
                </button>
              </h2>
              <div
                id="bovinos"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
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

                      <button
                        className="button button-dark"
                        onClick={handleFormSubmit}
                        disabled={state.isSubmitting}
                      >
                        <i className="fas fa-plus"></i>
                        {state.isSubmitting
                          ? "Por favor, espere..."
                          : "Crear remate"}
                      </button>

                      {state.errorMessage && (
                        <span className="form-error">{state.errorMessage}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ovinos */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#ovinos"
                  aria-expanded="false"
                  aria-controls="ovinos"
                  onClick={handleTabChange}
                >
                  Ovinos
                </button>
              </h2>
              <div
                id="ovinos"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
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

                    <button
                      className="button button-dark"
                      onClick={handleFormSubmit}
                      disabled={state.isSubmitting}
                    >
                      <i className="fas fa-plus"></i>
                      {state.isSubmitting
                        ? "Por favor, espere..."
                        : "Crear remate"}
                    </button>

                    {state.errorMessage && (
                      <span className="form-error">{state.errorMessage}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default CreateEvent;
