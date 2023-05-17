import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import {
  GET_PREOFFERS_REQUEST,
  GET_PREOFFERS_FAILURE,
  GET_PREOFFERS_SUCCESS,
} from "../../../../action-types";
import { AuthContext } from "../../../../../../../App";
import { apiUrl } from "../../../../../../../utils/api-url";
import { refreshToken } from "../../../../../../../utils/refresh-token";

import PreoffersList from "./components/PreoffersList";

import "./styles.scss";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showPreoffers: false,
};

// Handle preoffers state
const reducer = (state, action) => {
  switch (action.type) {
    case GET_PREOFFERS_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_PREOFFERS_SUCCESS:
      return {
        ...state,
        isSending: false,
        data: action.payload.preoffers,
        showPreoffers: true,
      };
    case GET_PREOFFERS_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function LotCard({ lot }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch({
      type: GET_PREOFFERS_REQUEST,
    });

    fetch(apiUrl("/preoffers"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lotId: lot.id,
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
          type: GET_PREOFFERS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to get the lots", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: GET_PREOFFERS_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <div className="col-12 border mb-3 p-4 lot-card">
        <div className="container">
          <h3>{lot.title}</h3>
          <p>
            <b>Categoria:</b> {lot.category}
          </p>
          <p>{lot.description}</p>
          <p>
            <b>Animales:</b> {lot.animals} | <b>Peso:</b> {lot.weight} |{" "}
            <b>Edad:</b> {lot.age}
            <b>Clase:</b> {lot.class} | <b>Estado:</b> {lot.state} |{" "}
            <b>Raza:</b> {lot.race} | <b>Certificado:</b> {lot.certificate} |{" "}
            <b>Tipo:</b> {lot.type} | <b>Moneda:</b> {lot.currency} |{" "}
            <b>Abierto:</b> {lot.open ? "Si" : "No"} | <b>Vendido:</b>{" "}
            {lot.sold ? "Si" : "No"} | <b>Completado:</b>{" "}
            {lot.completed ? "Si" : "No"}
          </p>
          <p>
            <b>Observaciones:</b> {lot.observations}
          </p>
        </div>
        <a className="button button-dark me-3">
          <i className="fas fa-video"></i> Video de lote
        </a>
        <a className="button button-dark" onClick={handleClick}>
          <i className="fas fa-comments-dollar"></i> Preofertas
        </a>
        {state.showPreoffers && <PreoffersList preoffers={state.data} lotId={lot.id} />}
      </div>
    </React.Fragment>
  );
}

export default LotCard;
