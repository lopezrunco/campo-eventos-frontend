import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
} from "../../events/action-types";

import { Loader } from "../../../components/Loader";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import EventByUserCard from "./EventByUserCard";
import { Title } from "../../../components/Title";

const initialState = {
  eventsList: [],
  selectedEventId: undefined,
  isFetching: false,
  hasError: false,
};

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
    default:
      return state;
  }
};

function MyEvents() {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

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
        <Breadcrumbs location={"Consignatarios"} />
      </motion.div>
      <section className="container">
        <Title
          title="Mis remates"
          subtitle="Gestione preofertas, cree, edite y elimine remates."
        />
        <article className="row">
          <div className="col-lg-12 d-flex justify-content-end">
            <a
              className="button button-dark"
              href="/consignatarios/crear-remate"
            >
              <i className="fas fa-plus"></i> Crear remate
            </a>
          </div>
          {state.isFetching ? (
            <Loader />
          ) : state.hasError ? (
            <p>Error al obtener los datos</p>
          ) : (
            <>
              {state.eventsList.length > 0 ? (
                state.eventsList.map((event) => (
                  <EventByUserCard key={event.id} event={event} />
                ))
              ) : (
                <p>No hay remates para mostrar...</p>
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
        </article>
      </section>
    </React.Fragment>
  );
}

export default MyEvents;
