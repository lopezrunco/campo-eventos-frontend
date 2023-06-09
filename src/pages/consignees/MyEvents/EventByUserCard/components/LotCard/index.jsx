import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import {
  GET_PREOFFERS_FAILURE,
  GET_PREOFFERS_REQUEST,
  GET_PREOFFERS_SUCCESS,
} from "../../../../../events/action-types";
import { AuthContext } from "../../../../../../App";
import { apiUrl } from "../../../../../../utils/api-url";
import { refreshToken } from "../../../../../../utils/refresh-token";

import NoVideoMsj from "../../../../../../components/NoVideoMsj";
import PreoffersList from "./components/PreoffersList";
import DeleteLotModal from "./components/DeleteLotModal";

import "./styles.scss";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showPreoffers: false,
  showDeleteModal: false,
};

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
    case "SHOW_DELETE_MODAL":
      return {
        ...state,
        showDeleteModal: !state.showDeleteModal,
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

  const handleDeleteModal = () => {
    dispatch({
      type: "SHOW_DELETE_MODAL",
    });
  };

  return (
    <React.Fragment>
      <div className="my-event-lot-card row p-0 p-lg-3 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="mb-0">Nombre del lote: {lot.title}</h3>
          <div className="options-buttons">
            <a
              className="rounded-icon primary"
              href={`/consignatarios/mis-remates/lotes/editar/${lot.id}`}
            >
              <i className="fas fa-pen"></i>
            </a>
            <a className="rounded-icon danger" onClick={handleDeleteModal}>
              <i className="fas fa-trash"></i>
            </a>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="category-tag mt-0">{lot.category}</div>
          <p>
            <b>Descripción:</b> {lot.description}
          </p>
          <p>
            <b>Animales:</b> {lot.animals} | <b>Peso(Kg):</b> {lot.weight} |{" "}
            <b>Edad:</b> {lot.age} | <b>Clase:</b> {lot.class} | <b>Estado:</b>{" "}
            {lot.state} | <b>Raza:</b> {lot.race} | <b>Certificado:</b>{" "}
            {lot.certificate} | <b>Tipo:</b> {lot.type} | <b>Moneda:</b>{" "}
            {lot.currency} | <b>Abierto:</b> {lot.open ? "Si" : "No"} |{" "}
            <b>Vendido:</b> {lot.sold ? "Si" : "No"} | <b>Completado:</b>{" "}
            {lot.completed ? "Si" : "No"}
          </p>
          <p>
            <b>Observaciones:</b> {lot.observations}
          </p>
          {!state.showPreoffers && (
            <a className="button view-more" onClick={handleClick}>
              <i className="fas fa-chevron-down"></i> Preofertas
            </a>
          )}
        </div>
        <div className="col-lg-5">
          {lot.YTVideoSrc ? (
            <iframe
              width="100%"
              height="300"
              src={`https://www.youtube.com/embed/${lot.YTVideoSrc}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          ) : (
            <NoVideoMsj msj="Este lote no tiene video" />
          )}
          <a
            className="rounded-icon primary over-top"
            href={`/consignatarios/mis-remates/lotes/${lot.id}/upload`}
          >
            <i className="fas fa-video"></i>
          </a>
        </div>

        {state.showPreoffers && (
          <PreoffersList
            preoffers={state.data}
            lotId={lot.id}
            currency={lot.currency}
          />
        )}
        {state.showDeleteModal && (
          <DeleteLotModal lotId={lot.id} closeFunction={handleDeleteModal} />
        )}
      </div>
    </React.Fragment>
  );
}

export default LotCard;
