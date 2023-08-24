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

import EventCard from "./components/EventCard";
import { Intro } from "../../../components/Intro";
import Pagination from "../../../components/Pagination";
import { Title } from "../../../components/Title";
import LoadingMessage from "../../../components/LoadingMessage/index.jsx";

// Create context to manage events
export const EventsContext = createContext();

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

function EventsList() {
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  let currentDate = new Date().toJSON();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 6;
  function prevPage() {
    setCurentPage(currentPage - 1);
  }
  function nextPage() {
    setCurentPage(currentPage + 1);
  }

  useEffect(() => {
    // if (authState.token) {
    //   dispatch({
    //     type: FETCH_EVENTS_REQUEST,
    //   });

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
    // }
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

      <div className="broadcast-section">
        <div className="container">
          <div className="row">
            {state.eventsList.map((el, i) => {
              let finishDate = new Date(
                new Date(el.startBroadcastTimestamp).setHours(
                  new Date(el.startBroadcastTimestamp).getHours() + el.duration
                )
              ).toJSON();

              return el.startBroadcastTimestamp < currentDate &&
                finishDate > currentDate ? (
                <div key={i} className="col-12 items-container">
                  {i === 0 ? <Title title="En vivo" /> : null}
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
                      <span>
                        <b>Lugar: </b>
                        {el.location}
                      </span>
                      <span>
                        <b>Organiza: </b>
                        {el.organizer}
                      </span>
                      <a
                        className="button button-light-outline"
                        href={`https://www.youtube.com/watch/${el.broadcastLinkId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="fas fa-play"></i> Ver en vivo
                      </a>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>

      <section className="events">
        <article className="container">
          <Title
            title="Cartelera de remates"
            subtitle="Estos son los próximos remates que estaremos transmitiendo en vivo."
          />
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
                    {state.eventsList.length > 0 ? (
                      state.eventsList.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
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
        </article>
      </section>
    </EventsContext.Provider>
  );
}

export default EventsList;
