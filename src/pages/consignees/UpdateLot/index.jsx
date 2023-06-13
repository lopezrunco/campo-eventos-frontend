import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
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

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import ActualLotData from "./components/ActualLotData";

import "./styles.scss";

const initialState = {
  lot: "",
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
  type: "",
  currency: "",
  open: true,
  sold: false,
  completed: false,
  YTVideoSrc: undefined,
  videoSrc: undefined,
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
        lot: action.payload.lot,
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

  // On component mount, fetch the lot
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
        lot: state.lot,
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
        type: state.type,
        currency: state.currency,
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
          <div className="row">
            <div className="col-lg-7">
              <h3>Ingrese la nueva información</h3>
              <div className="edit-lot-container">
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

                <label htmlFor="category">
                  Categoría
                  <input
                    required
                    type="text"
                    value={state.category}
                    onChange={handleInputChange}
                    name="category"
                    id="category"
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

                <label htmlFor="animals">
                  Cantidad de animales
                  <input
                    required
                    type="number"
                    value={state.animals}
                    onChange={handleInputChange}
                    name="animals"
                    id="animals"
                  />
                </label>

                <label htmlFor="weight">
                  Peso
                  <input
                    required
                    type="number"
                    value={state.weight}
                    onChange={handleInputChange}
                    name="weight"
                    id="weight"
                  />
                </label>

                <label htmlFor="age">
                  Edad
                  <input
                    required
                    type="number"
                    value={state.age}
                    onChange={handleInputChange}
                    name="age"
                    id="age"
                  />
                </label>

                <label htmlFor="class">
                  Clase
                  <input
                    required
                    type="text"
                    value={state.class}
                    onChange={handleInputChange}
                    name="class"
                    id="class"
                  />
                </label>

                <label htmlFor="state">
                  Estado
                  <input
                    required
                    type="text"
                    value={state.state}
                    onChange={handleInputChange}
                    name="state"
                    id="state"
                  />
                </label>

                <label htmlFor="observations">
                  Observaciones
                  <input
                    required
                    type="text"
                    value={state.observations}
                    onChange={handleInputChange}
                    name="observations"
                    id="observations"
                  />
                </label>

                <label htmlFor="race">
                  Raza
                  <input
                    required
                    type="text"
                    value={state.race}
                    onChange={handleInputChange}
                    name="race"
                    id="race"
                  />
                </label>

                <label htmlFor="certificate">
                  Certificado
                  <input
                    required
                    type="text"
                    value={state.certificate}
                    onChange={handleInputChange}
                    name="certificate"
                    id="certificate"
                  />
                </label>

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

                <label htmlFor="currency">
                  Moneda
                  <input
                    required
                    type="text"
                    value={state.currency}
                    onChange={handleInputChange}
                    name="currency"
                    id="currency"
                  />
                </label>

                <button
                  className="button button-dark"
                  onClick={handleFormSubmit}
                  disabled={state.isSubmitting}
                >
                  <i className="fas fa-sync-alt"></i>
                  {state.isSubmitting ? "Por favor, espere..." : "Editar lote"}
                </button>

                {state.errorMessage && (
                  <span className="form-error">{state.errorMessage}</span>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <h3>Datos actuales:</h3>
              <ActualLotData lot={state.lot} />
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default UpdateLot;
