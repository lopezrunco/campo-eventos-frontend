import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import imgUrl from "../../../../../assets/no-img.jpg";

import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  GET_LOTS_REQUEST,
  GET_LOTS_FAILURE,
  GET_LOTS_SUCCESS,
} from "../../../action-types";

import "./styles.scss";

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
        <div className="border mb-3">
          <div className="row">
            <div className="col-lg-9">
              <div className="p-4">
                <h6>{event.title}</h6>
                <div className="separator"></div>
                <p>
                  <b>Descripción:</b> {event.description}
                </p>
                <p>
                  <b>Remata:</b> {event.company}︱<b>Organiza:</b>{" "}
                  {event.organizer}︱<b>Lugar:</b> {event.location}︱
                  <b>Financiación:</b> {event.funder}
                </p>

                {!state.showLots ? (
                  <a className="button view-more me-3" onClick={handleClick}>
                    <i className="fas fa-chevron-down"></i> Ver lotes
                  </a>
                ) : null}

                {event.broadcastLink && (
                  <a
                    className="button view-more"
                    href={`https://www.youtube.com/watch/${event.broadcastLink}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-play"></i> Enlace transmisión
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-3">
              {event.imageUrl ? (
                <img src={event.imageUrl} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
          </div>
          {state.showLots && (
            <div className="lot-list-container">
              <div className="container">
                <h4>
                  <i className="fas fa-layer-group me-2"></i> Lotes de{" "}
                  {event.title}:
                </h4>
                <div className="row">
                  {state.data.length === 0
                    ? "Aún no hay lotes en este remate"
                    : null}
                  {state.data.map((lot) => {
                    return (
                      <React.Fragment key={lot.id}>
                        <div className="col-lg-4 my-3">
                          <div className="lot-card">
                            <div className="title-animals">
                              <h4>{lot.title}</h4>
                              <p>
                                <i className="fas fa-horse-head"></i>{" "}
                                {lot.animals}
                              </p>
                            </div>
                            <a
                              className="button button-dark mt-0"
                              href={`/lotes/${lot.id}`}
                            >
                              Ver lote{" "}
                              <i className="fas fa-chevron-right ms-2"></i>
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
