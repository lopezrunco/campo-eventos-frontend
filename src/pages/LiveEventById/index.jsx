import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import { HIDE_LOADER, SHOW_LOADER } from "../../utils/action-types";
import {
  FETCH_LIVE_EVENT_FAILURE,
  FETCH_LIVE_EVENT_REQUEST,
  FETCH_LIVE_EVENT_SUCCESS,
} from "../action-types";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import Card from "./Card";

const initialState = {
  liveEvent: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_LIVE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case FETCH_LIVE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        liveEvent: action.payload.event,
      };
    case FETCH_LIVE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function LiveEventById() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    authDispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: FETCH_LIVE_EVENT_REQUEST,
    });

    fetch(apiUrl(`/live-events/${id}`))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        dispatch({
          type: FETCH_LIVE_EVENT_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the live event", error);

        if (error) {
          dispatch({
            type: FETCH_LIVE_EVENT_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [authDispatch, id]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Detalles del remate"} />
      </motion.div>

      <article className="container">
        {state.liveEvent && <Card liveEvent={state.liveEvent} />}
        {state.hasError && <p>Error al cargar los datos.</p>}
      </article>
    </React.Fragment>
  );
}

export default LiveEventById;
