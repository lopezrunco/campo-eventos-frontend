import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { AuthContext } from "../../../App";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";
import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import {
  FETCH_LIVE_EVENTS_FAILURE,
  FETCH_LIVE_EVENTS_REQUEST,
  FETCH_LIVE_EVENTS_SUCCESS,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Loader } from "../../../components/Loader";
import LiveEventCard from "./components/LiveEventCard";

// Create context to manage live events
export const LiveEventsContext = createContext();

const initialState = {
  liveEventsList: [],
  selectedLiveEventId: undefined,
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_LIVE_EVENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_LIVE_EVENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        liveEventsList: action.payload.events,
      };
    case FETCH_LIVE_EVENTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

function LiveEvents() {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

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
        type: FETCH_LIVE_EVENTS_REQUEST,
      });

      fetch(
        apiUrl(`live-events?page=${currentPage}&itemsPerPage=${itemsPerPage}`),
        {
          headers: {
            Authorization: authState.token,
            "Content-Type": "application/json",
          },
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
            type: FETCH_LIVE_EVENTS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the live events", error);

          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: FETCH_LIVE_EVENTS_FAILURE,
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
    currentPage,
    navigate,
  ]);

  return (
    <LiveEventsContext.Provider value={{ state, dispatch }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Remates en vivo"} />
      </motion.div>
      <section className="backoffice-live-events-page">
        <article className="container">
          <div className="row">
            <div className="col-12">
              <div className="row">
                {state.isFetching ? (
                  <Loader />
                ) : state.hasError ? (
                  <p>Error al obtener los datos</p>
                ) : (
                  <React.Fragment>
                    {state.liveEventsList.length > 0 ? (
                      state.liveEventsList.map((liveEvent) => (
                        <LiveEventCard
                          key={liveEvent.id}
                          liveEvent={liveEvent}
                        />
                      ))
                    ) : (
                      <p>En este momento, no hay remates en vivo.</p>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
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
                {currentPage < state.liveEventsList.length && (
                  <button
                    className="button button-light"
                    onClick={() => nextPage()}
                  >
                    Siguiente <i className="fa fa-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
    </LiveEventsContext.Provider>
  );
}

export default LiveEvents;
