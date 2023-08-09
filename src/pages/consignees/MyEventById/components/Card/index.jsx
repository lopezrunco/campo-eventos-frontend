import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import imgUrl from "../../../../../assets/no-img.jpg";

import { refreshToken } from "../../../../../utils/refresh-token";
import { getDate } from "../../../../../utils/get-date";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  GET_LOTS_FAILURE,
  GET_LOTS_REQUEST,
  GET_LOTS_SUCCESS,
} from "../../../../../utils/action-types";

import LotCard from "../../../MyEvents/EventByUserCard/components/LotCard";
import DeleteEventModal from "./components/DeleteEventModal";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showLots: false,
  showDeleteModal: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_LOTS_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case GET_LOTS_SUCCESS:
      return {
        ...state,
        isSending: false,
        data: action.payload.lots,
        showLots: true,
      };
    case GET_LOTS_FAILURE:
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

function Card({ myEvent }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: GET_LOTS_REQUEST,
    });

    fetch(apiUrl("/lots"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: myEvent.id,
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
          type: GET_LOTS_SUCCESS,
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
            type: GET_LOTS_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    myEvent.id,
    navigate,
  ]);

  const handleDeleteModal = () => {
    dispatch({
      type: "SHOW_DELETE_MODAL",
    });
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-3 mb-5">
          <span className="event-type-tag">{myEvent.eventType}</span>
          {myEvent.imageUrl ? (
            <img src={myEvent.imageUrl} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
          <a
            className="rounded-icon primary over-top"
            href={`/consignatarios/mis-remates/${myEvent.id}/upload`}
          >
            <i className="fas fa-camera"></i>
          </a>
        </div>
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">{myEvent.title}</h4>
              <p className="mt-2 mb-0">{getDate(myEvent.eventTimestamp)}</p>
            </div>
            <div className="options-buttons">
              <a
                className="rounded-icon primary"
                href={`/consignatarios/mis-remates/editar/${myEvent.id}`}
              >
                <i className="fas fa-pen"></i>
              </a>
              <a className="rounded-icon danger" onClick={handleDeleteModal}>
                <i className="fas fa-trash"></i>
              </a>
            </div>
          </div>
          <div className="row">
            {myEvent.description && (
              <div className="col-12">
                <p>
                  <b>Descripción: </b>
                  {myEvent.description}
                </p>
              </div>
            )}
            <div className="col-lg-4">
              {myEvent.company && (
                <p>
                  <b>Remata: </b>
                  {myEvent.company}
                </p>
              )}
              {myEvent.funder && (
                <p>
                  <b>Financiación: </b>
                  {myEvent.funder}
                </p>
              )}
              {myEvent.rp && (
                <p>
                  <b>RP: </b>
                  {myEvent.rp}
                </p>
              )}
              {myEvent.category && (
                <p>
                  <b>Categoría: </b>
                  {myEvent.category}
                </p>
              )}
            </div>
            <div className="col-lg-4">
              {myEvent.organizer && (
                <p>
                  <b>Organiza: </b>
                  {myEvent.organizer}
                </p>
              )}
              {myEvent.location && (
                <p>
                  <b>Lugar: </b>
                  {myEvent.location}
                </p>
              )}
              {myEvent.weight && (
                <p>
                  <b>Peso: </b>
                  {myEvent.weight}
                </p>
              )}
              {myEvent.birthDate && (
                <p>
                  <b>Nacimiento: </b>
                  {myEvent.birthDate}
                </p>
              )}
            </div>
            <div className="col-lg-4">
              {myEvent.pedigree && (
                <p>
                  <b>Pedigree: </b>
                  {myEvent.pedigree}
                </p>
              )}
              {myEvent.breeder && (
                <p>
                  <b>Cabaña: </b>
                  {myEvent.breeder}
                </p>
              )}
            </div>
            {myEvent.other && (
              <div className="col-12">
                <p>
                  <b>Otro dato: </b>
                  {myEvent.other}
                </p>
              </div>
            )}
          </div>
          {myEvent.broadcastLink && (
            <a
              className="button view-more"
              href={`https://www.youtube.com/watch/${myEvent.broadcastLink}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fas fa-play"></i> Enlace transmisión
            </a>
          )}
        </div>

        {state.showLots ? (
          <div className="col-12">
            <div className="container">
              <div className="row">
                {state.data.length === 0 ? (
                  <div className="col-12 mt-5">
                    <p>Aún no hay lotes en este remate.</p>
                  </div>
                ) : (
                  <h4 className="mb-4 mt-5">
                    <i className="fas fa-layer-group me-2"></i> Lotes de{" "}
                    {myEvent.title}:
                  </h4>
                )}
                {state.data.map((lot) => {
                  return <LotCard key={lot.id} lot={lot} />;
                })}
              </div>
              <a
                className="button button-dark me-3"
                href={`/consignatarios/mis-remates/${myEvent.id}/crear-lote`}
              >
                <i className="fas fa-plus"></i> Subir lote
              </a>
            </div>
          </div>
        ) : (
          <div className="col-12 mt-5">
            <p>Cargando lotes...</p>
          </div>
        )}
      </div>
      {state.showDeleteModal && (
        <DeleteEventModal
          eventId={myEvent.id}
          closeFunction={handleDeleteModal}
        />
      )}
    </React.Fragment>
  );
}

export default Card;
