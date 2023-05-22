import { motion } from "framer-motion";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
} from "../../events/EventsList/action-types";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../App";
import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";
import { Loader } from "../../../components/Loader";
import EventByUserCard from "./EventByUserCard";

const initialState = {
  eventsList: [],
  selectedEventId: undefined,
  isFetching: false,
  hasError: false,
};

// Reducer to manage events
const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        eventsList: action.payload.events,
      };
    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    case "SET_EVENT":
      return {
        ...state,
        selectedEventId: action.payload,
      };
    default:
      return state;
  }
};

function MyEvents() {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 9;

  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: FETCH_EVENTS_REQUEST,
      });

      fetch(
        apiUrl(`my-events?page=${currentPage}&itemsPerPage=${itemsPerPage}`),
        {
          method: "POST",
          headers: {
            Authorization: authState.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authState.user.id,
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response;
          }
        })
        .then((data) => {
          dispatch({
            type: FETCH_EVENTS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the events by user", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: FETCH_EVENTS_FAILURE,
            });
          }
        })
        .finally(() => {
          authDispatch({
            type: HIDE_LOADER,
          });
        });
    }
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    authState.user.id,
    currentPage,
    navigate,
  ]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Mis remates"} />
      </motion.div>
      <section className="container">
        <article className="row">
          {state.isFetching ? (
            <Loader />
          ) : state.hasError ? (
            <p>Error al fetchear</p>
          ) : (
            <>
              {state.eventsList.length > 0 ? (
                state.eventsList.map((event) => (
                  <EventByUserCard key={event.id} event={event} />
                ))
              ) : (
                <p>No hay eventos para mostrar...</p>
              )}
            </>
          )}

          <div className="col-12">
            <div className="pagination">
              {currentPage > 1 && (
                <button
                  className="button button-light me-3"
                  onClick={() => prevPage()}
                >
                  <i className="fa fa-chevron-left"></i> Anterior
                </button>
              )}
              {currentPage < state.eventsList.length && (
                <button
                  className="button button-light"
                  onClick={() => nextPage()}
                >
                  Siguiente <i className="fa fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>

          <a className="button button-dark me-3">
            <i className="fas fa-plus"></i> Crear nuevo evento
          </a>
        </article>
      </section>
    </React.Fragment>
  );
}

export default MyEvents;
