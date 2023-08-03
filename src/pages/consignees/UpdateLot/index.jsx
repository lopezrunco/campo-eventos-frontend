import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
import { getYoutubeId } from "../../../utils/getYoutubeID";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  EDIT_LOT_FAILURE,
  EDIT_LOT_REQUEST,
  EDIT_LOT_SUCCESS,
  FORM_INPUT_CHANGE,
  GET_LOT_FAILURE,
  GET_LOT_REQUEST,
  GET_LOT_SUCCESS,
} from "../action-types";

import { Title } from "../../../components/Title";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

import "./styles.scss";

const initialState = {
  title: "",
  category: "",
  description: "",
  animals: "",
  weight: "",
  age: "",
  class: "",
  state: "",
  observations: "",
  race: "",
  certificate: "",
  location: "",
  type: "",
  open: true,
  sold: false,
  completed: false,
  YTVideoSrc: undefined,
  eventId: "",
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
    case GET_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        title: action.payload.lot.title,
        category: action.payload.lot.category,
        description: action.payload.lot.description,
        animals: action.payload.lot.animals,
        weight: action.payload.lot.weight,
        age: action.payload.lot.age,
        class: action.payload.lot.class,
        state: action.payload.lot.state,
        observations: action.payload.lot.observations,
        race: action.payload.lot.race,
        certificate: action.payload.lot.certificate,
        location: action.payload.lot.location,
        type: action.payload.lot.type,
        YTVideoSrc: `https://www.youtube.com/watch/${action.payload.lot.YTVideoSrc}`,
      };
    case GET_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case EDIT_LOT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_LOT_SUCCESS:
      return {
        ...state,
        isSending: false,
        lot: action.payload.lot,
      };
    case EDIT_LOT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function UpdateLot() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // On component mount, fetch the lot and set data in the form
  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: GET_LOT_REQUEST,
    });

    fetch(apiUrl(`/lots/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: GET_LOT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the lot", error);
        if (error) {
          dispatch({
            type: GET_LOT_FAILURE,
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

  // On form submit, call the update lot endpoint
  const handleFormSubmit = () => {
    dispatch({
      type: EDIT_LOT_REQUEST,
    });

    fetch(apiUrl(`lots/${id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        category: state.category,
        description: state.description,
        animals: state.animals,
        weight: state.weight,
        age: state.age,
        class: state.class,
        state: state.state,
        observations: state.observations,
        race: state.race,
        certificate: state.certificate,
        location: state.location,
        type: state.type,
        YTVideoSrc:
          state.YTVideoSrc === undefined
            ? undefined
            : getYoutubeId(state.YTVideoSrc),
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
          type: EDIT_LOT_SUCCESS,
          payload: data,
        });
        navigate(`/consignatarios/mis-remates`);
      })
      .catch((error) => {
        console.error("Error al editar el lote.", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_LOT_FAILURE,
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
        <Breadcrumbs location={"Editar lote"} />
      </motion.div>
      <section className="edit-lot-page">
        <article className="container">
          <Title
            title="Editar lote"
            subtitle="Los campos marcados con * son obligatorios"
          />
          <div className="row">
            <div className="col-12">
              <div className="form-container row">
                <div className="col-lg-6">
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
                </div>

                <div className="col-lg-6">
                  <label htmlFor="category">
                    Categoría *
                    <input
                      required
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

                <div className="col-lg-3">
                  <label htmlFor="animals">
                    Cantidad
                    <input
                      type="number"
                      value={state.animals}
                      onChange={handleInputChange}
                      name="animals"
                      id="animals"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
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

                <div className="col-lg-3">
                  <label htmlFor="age">
                    Edad
                    <input
                      type="number"
                      value={state.age}
                      onChange={handleInputChange}
                      name="age"
                      id="age"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="class">
                    Clase
                    <input
                      type="text"
                      value={state.class}
                      onChange={handleInputChange}
                      name="class"
                      id="class"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="state">
                    Estado
                    <input
                      type="text"
                      value={state.state}
                      onChange={handleInputChange}
                      name="state"
                      id="state"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="race">
                    Raza
                    <input
                      type="text"
                      value={state.race}
                      onChange={handleInputChange}
                      name="race"
                      id="race"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="certificate">
                    Certificado
                    <input
                      type="text"
                      value={state.certificate}
                      onChange={handleInputChange}
                      name="certificate"
                      id="certificate"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
                  <label htmlFor="type">
                    Tipo
                    <input
                      required
                      type="text"
                      value={state.type}
                      onChange={handleInputChange}
                      name="type"
                      id="type"
                    />
                  </label>
                </div>

                <div className="col-lg-3">
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

                <div className="col-lg-9">
                  <label htmlFor="ytvideo">
                    Enlace (YouTube)
                    <input
                      type="text"
                      value={state.YTVideoSrc}
                      onChange={handleInputChange}
                      name="YTVideoSrc"
                      id="ytvideo"
                    />
                  </label>
                </div>

                <label htmlFor="observations">
                  Observaciones
                  <textarea
                    value={state.observations}
                    onChange={handleInputChange}
                    name="observations"
                    id="observations"
                    cols="10"
                    rows="7"
                    maxLength="600"
                  ></textarea>
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

export default UpdateLot;
