import React, { useContext, useEffect, useReducer, useState } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../utils/action-types";
import { getDate } from "../../utils/get-date";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
  FETCH_LIVE_EVENTS_FAILURE,
  FETCH_LIVE_EVENTS_REQUEST,
  FETCH_LIVE_EVENTS_SUCCESS,
} from "../backoffice/action-types";

import { ScrollTop } from "../../components/ScrollTop";
import LiveEventCard from "./components/LiveEventCard";
import { Loader } from "../../components/Loader";
import { Intro } from "../../components/Intro";
import { Title } from "../../components/Title";
import Pagination from "../../components/Pagination";

import "./styles.scss";

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

export const Home = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  let currentDate = new Date().toJSON();

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
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: FETCH_LIVE_EVENTS_REQUEST,
    });

    fetch(
      apiUrl(`live-events?page=${currentPage}&itemsPerPage=${itemsPerPage}`)
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
        if (error) {
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
  }, [authDispatch, currentPage]);

  return (
    <React.Fragment>
      <Intro />
      <div className="broadcast-section">
        <div className="container">
          <div className="row">
            {state.liveEventsList.map((el, i) => {
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
      <section className="live-events-list">
        <article className="container">
          <Title
            title="Cartelera de remates"
            subtitle="Estos son los próximos remates que estaremos transmitiendo en vivo."
          />
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
                      <p>En este momento, no hay remates previstos.</p>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
            <Pagination
              elementList={state.liveEventsList}
              currentPage={currentPage}
              prevPageFunction={prevPage}
              nextPageFunction={nextPage}
            />
          </div>
        </article>
      </section>
      <ScrollTop scrollTo={"#top"} />
    </React.Fragment>
  );
};
