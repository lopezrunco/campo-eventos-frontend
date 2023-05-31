import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import {
  GET_LOTS_REQUEST,
  GET_LOTS_FAILURE,
  GET_LOTS_SUCCESS,
} from "../../../action-types";
import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";

import "./styles.scss";
import FetchImage from "../../../../../components/FetchImage";

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

function EventCard({ event }) {
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
            <div className="col-lg-9">
              <h1>{event.title}</h1>
              <small>{event.id}</small>
              <p>{event.description}</p>
              <p>
                <b>Remata:</b> {event.company}
              </p>
              <p>
                <b>Organiza:</b> {event.organizer}
              </p>
              <p>
                <b>Lugar:</b> {event.location}
              </p>
              <p>
                <b>Enlace vivo:</b> {event.broadcastLink}
              </p>
              <p>
                <b>Financiación:</b> {event.funder}
              </p>
              <p>
                <b>Video de los lotes:</b> {event.videoLink}
              </p>
              <a className="button button-dark" onClick={handleClick}>
                <i className="fas fa-layer-group"></i> Ver lotes
              </a>
            </div>
            <div className="col-lg-3">
              {event.imageUrl ? (
                <FetchImage name={event.imageUrl} />
              ) : (
                <img src="../../src/assets/no-img.jpg" width="100%" />
              )}
            </div>
          </div>
          {state.showLots && (
            <div className="lot-list-container">
              <div className="container">
                <h3>Lotes:</h3>
                <div className="row">
                  {state.data.map((lot) => {
                    return (
                      <React.Fragment key={lot.id}>
                        <div className="col-lg-4">
                          <div className="border mb-3 p-3">
                            <h4>{lot.title}</h4>
                            <p>Animales: {lot.animals}</p>
                            <a
                              className="button button-dark"
                              href={`/lotes/${lot.id}`}
                            >
                              Ver lote
                            </a>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventCard;
