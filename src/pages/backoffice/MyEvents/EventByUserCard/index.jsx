import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import {
  GET_LOTS_FAILURE,
  GET_LOTS_REQUEST,
  GET_LOTS_SUCCESS,
} from "../../../events/action-types";
import { AuthContext } from "../../../../App";
import { apiUrl } from "../../../../utils/api-url";
import { refreshToken } from "../../../../utils/refresh-token";

import LotCard from "./components/LotCard";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showLots: false,
};

// Handle lots state
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
    default:
      return state;
  }
};

function EventByUserCard({ event }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
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
        eventId: event.id,
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
  };

  return (
    <React.Fragment>
      <div className="col-12 event-card">
        <div className="border mb-3 p-4">
          <div className="row">
            <div className="col-lg-2">
              <img
                src="https://images.pexels.com/photos/51311/cow-calf-cattle-stock-51311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width="100%"
              />
            </div>
            <div className="col-lg-10">
              <p>
                <b>{event.title}</b> <small># {event.id}</small>
              </p>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Remata</th>
                    <th scope="col">Organiza</th>
                    <th scope="col">Lugar</th>
                    <th scope="col">Financiación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{event.company}</td>
                    <td>{event.organizer}</td>
                    <td>{event.location}</td>
                    <td>{event.funder}</td>
                  </tr>
                </tbody>
              </table>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Enlace vivo</th>
                    <th scope="col">Video de los lotes</th>
                    <th scope="col">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{event.broadcastLink}</td>
                    <td>{event.videoLink}</td>
                    <td>{event.description}</td>
                  </tr>
                </tbody>
              </table>

              <a className="button button-dark me-3" onClick={handleClick}>
                <i className="fas fa-edit"></i> Editar
              </a>
              <a className="button button-dark me-3" onClick={handleClick}>
                <i className="fas fa-minus-circle"></i> Borrar
              </a>
              <a className="button button-dark me-3" onClick={handleClick}>
                <i className="fas fa-layer-group"></i> Ver lotes
              </a>
            </div>
          </div>
        </div>
      </div>
      {state.showLots && (
        <div className="col-12">
          <div className="container">
            <h1>Lotes:</h1>
            <div className="row">
              {state.data.map((lot) => {
                return <LotCard key={lot.id} lot={lot} />;
              })}
            </div>
            <a className="button button-dark me-3">
              <i className="fas fa-plus"></i> Crear nuevo lote
            </a>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default EventByUserCard;
