import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../utils/action-types";
import { refreshToken } from "../../utils/refresh-token";
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
  const navigate = useNavigate();
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: FETCH_LIVE_EVENTS_REQUEST,
      });

      fetch(apiUrl(`live-events`), {
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
  }, [authDispatch, authState.refreshToken, authState.token, navigate]);

  return (
    <React.Fragment>
      <Intro />
      <section className="home-page">
        <article className="container">
          <Title
            title="Cartelera de eventos"
            subtitle="Estos son los próximos eventos en los que estaremos trabajado."
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
                      <p>En este momento, no hay remates en vivo.</p>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>
      <ScrollTop scrollTo={"#top"} />
    </React.Fragment>
  );
};
