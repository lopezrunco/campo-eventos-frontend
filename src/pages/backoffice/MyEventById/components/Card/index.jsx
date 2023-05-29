import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  GET_LOTS_FAILURE,
  GET_LOTS_REQUEST,
  GET_LOTS_SUCCESS,
} from "../../../../events/action-types";

import LotCard from "../../../MyEvents/EventByUserCard/components/LotCard";

const initialState = {
  data: undefined,
  isSending: false,
  hasError: false,
  showLots: false,
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
    default:
      return state;
  }
};

function Card({ myEvent }) {
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
  };

  return (
    <div className="row">
      <div className="col-lg-2">
        <img
          src="https://images.pexels.com/photos/51311/cow-calf-cattle-stock-51311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          width="100%"
        />
      </div>
      <div className="col-lg-10">
        <p>
          <b>{myEvent.title}</b> <small># {myEvent.id}</small>
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
              <td>{myEvent.company}</td>
              <td>{myEvent.organizer}</td>
              <td>{myEvent.location}</td>
              <td>{myEvent.funder}</td>
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
              <td>{myEvent.broadcastLink}</td>
              <td>{myEvent.videoLink}</td>
              <td>{myEvent.description}</td>
            </tr>
          </tbody>
        </table>

        <a className="button button-dark me-3">
          <i className="fas fa-edit"></i> Editar
        </a>
        <a className="button button-dark me-3">
          <i className="fas fa-minus-circle"></i> Borrar
        </a>
        <a className="button button-dark me-3" onClick={handleClick}>
          <i className="fas fa-layer-group"></i> Ver lotes
        </a>
        {state.showLots && (
          <div className="col-12">
            <div className="container">
              <h3>Lotes:</h3>
              <div className="row">
                {state.data.map((lot) => {
                  return <LotCard key={lot.id} lot={lot} />;
                })}
              </div>
              <a
                className="button button-dark me-3"
                href={`/consignatarios/mis-eventos/${myEvent.id}/crear-lote`}
              >
                <i className="fas fa-plus"></i> Crear nuevo lote
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
