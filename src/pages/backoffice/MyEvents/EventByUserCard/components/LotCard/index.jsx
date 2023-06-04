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

import PreoffersList from "./components/PreoffersList";
import FetchVideo from "../../../../../../components/FetchVideo";
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
      <div className="col-12 border mb-3 p-4 lot-card">
        <div className="container">
          <p>
            <b>{lot.title}</b> <small># {lot.id}</small>
          </p>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Categoria</th>
                <th scope="col">Animales</th>
                <th scope="col">Peso</th>
                <th scope="col">Edad</th>
                <th scope="col">Clase</th>
                <th scope="col">Estado</th>
                <th scope="col">Raza</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{lot.category}</td>
                <td>{lot.animals}</td>
                <td>{lot.weight}</td>
                <td>{lot.age}</td>
                <td>{lot.class}</td>
                <td>{lot.state}</td>
                <td>{lot.race}</td>
              </tr>
            </tbody>
          </table>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Certificado</th>
                <th scope="col">Tipo</th>
                <th scope="col">Moneda</th>
                <th scope="col">Abierto</th>
                <th scope="col">Vendido</th>
                <th scope="col">Completado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{lot.certificate}</td>
                <td>{lot.type}</td>
                <td>{lot.currency}</td>
                <td>{lot.open ? "Si" : "No"}</td>
                <td>{lot.sold ? "Si" : "No"}</td>
                <td>{lot.completed ? "Si" : "No"}</td>
              </tr>
            </tbody>
          </table>

          <p>
            <b>Descripción:</b>
            <br />
            {lot.description}
          </p>
          <p>
            <b>Observaciones:</b>
            <br />
            {lot.observations}
          </p>
        </div>

        {lot.videoSrc ? (
          <FetchVideo name={lot.videoSrc} />
        ) : (
          <p>Este lote no tiene video</p>
        )}
        <a
          className="button button-dark me-3"
          href={`/consignatarios/mis-eventos/lotes/${lot.id}/upload`}
        >
          <i className="fas fa-video"></i> Agregar / cambiar video
        </a>
        <a className="button button-dark me-3" onClick={handleClick}>
          <i className="fas fa-comments-dollar"></i> Preofertas
        </a>
        <a className="button button-dark" onClick={handleDeleteModal}>
          <i className="fas fa-trash"></i> Eliminar
        </a>
        {state.showPreoffers && (
          <PreoffersList preoffers={state.data} lotId={lot.id} />
        )}
      </div>
      {state.showDeleteModal && (
        <DeleteLotModal lotId={lot.id} closeFunction={handleDeleteModal} />
      )}
    </React.Fragment>
  );
}

export default LotCard;
