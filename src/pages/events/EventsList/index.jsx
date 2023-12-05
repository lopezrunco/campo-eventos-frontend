import { motion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { refreshToken } from "../../../utils/refresh-token.js";
import { getDate } from "../../../utils/get-date";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_EVENTS_FAILURE,
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
} from "../../../utils/action-types";

// import EventCard from "./components/EventCard";
import { Intro } from "../../../components/Intro";
import Pagination from "../../../components/Pagination";
import { Title } from "../../../components/Title";
import LoadingMessage from "../../../components/LoadingMessage/index.jsx";
import Card from "./components/Card/index.jsx";

import "./styles.scss";

// Create context to manage events
export const EventsContext = createContext();

const initialState = {
  eventsList: [],
  selectedEventId: undefined,
  isFetching: false,
  eventsFetched: false,
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
        eventsFetched: true,
      };
    case FETCH_EVENTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
        eventsFetched: true,
      };
    default:
      return state;
  }
};

function EventsList() {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  let currentDate = new Date().toJSON();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 15;
  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  useEffect(() => {
    fetch(apiUrl(`events?page=${currentPage}&itemsPerPage=${itemsPerPage}`), {
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
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
          type: FETCH_EVENTS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the events", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_EVENTS_FAILURE,
          });
        }
      });
  }, [
    authDispatch,
    authState.token,
    authState.refreshToken,
    navigate,
    currentPage,
  ]);

  return (
    <EventsContext.Provider value={{ state, dispatch }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Intro />
      </motion.div>

      {/* Broadcast section only active at hour of the event */}
      <div className="broadcast-section">
        <div className="container">
          <div className="row">
            {state.eventsList.map((el, i) => {
              let setEventDuration = el.duration ? el.duration : 12;
              let finishDate = new Date(
                new Date(el.startBroadcastTimestamp).setHours(
                  new Date(el.startBroadcastTimestamp).getHours() +
                    setEventDuration
                )
              ).toJSON();

              return el.startBroadcastTimestamp < currentDate &&
                finishDate > currentDate ? (
                <div key={i} className="col-12 items-container">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: true }}
                  >
                    {i === 0 ? <Title title="En vivo" /> : null}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="item">
                      <iframe
                        src={`https://www.youtube.com/embed/${el.broadcastLinkId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                      <div className="event-description">
                        <h2>{el.title}</h2>
                        <span className="event-date">
                          <i className="fas fa-calendar-alt"></i>{" "}
                          {getDate(el.startBroadcastTimestamp)}
                        </span>
                        {el.location && (
                          <span>
                            <b>Lugar: </b>
                            {el.location}
                          </span>
                        )}
                        {el.organizer && (
                          <span>
                            <b>Organiza: </b>
                            {el.organizer}
                          </span>
                        )}
                        <a
                          className="button button-light-outline"
                          href={`/remates/${el.id}`}
                        >
                          <i className="fas fa-play"></i> Ver más
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Event list (Cartelera) */}
      <section className="events">
        <article className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <Title
              title="Cartelera de remates"
              subtitle="Estos son los próximos remates que estaremos transmitiendo en vivo."
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
            viewport={{ once: true }}
          >
            <div className="row">
              <div className="col-12">
                <div className="row">
                  {state.isFetching ? (
                    <LoadingMessage
                      title="Cargando eventos..."
                      message="Esto puede tardar un poco dependiendo de la cantidad de eventos en nuestro sistema."
                    />
                  ) : state.hasError ? (
                    <p>Error al obtener los datos</p>
                  ) : (
                    <>
                      {state.eventsList.length > 0
                        ? state.eventsList.map((event) => (
                            <Card key={event.id} event={event} />
                          ))
                        : state.eventsFetched && (
                            <p>No hay remates para mostrar...</p>
                          )}
                    </>
                  )}
                </div>
              </div>
              <Pagination
                elementList={state.eventsList}
                currentPage={currentPage}
                prevPageFunction={prevPage}
                nextPageFunction={nextPage}
              />
            </div>
          </motion.div>
        </article>
      </section>
    </EventsContext.Provider>
  );
}

export default EventsList;
