import { motion } from "framer-motion";
import React, { useContext, useEffect, useReducer } from "react";

import {
  GET_MY_PREOFFERS_FAILURE,
  GET_MY_PREOFFERS_REQUEST,
  GET_MY_PREOFFERS_SUCCESS,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { AuthContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../utils/api-url";
import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
import { Loader } from "../../../components/Loader";
import MyPreofferCard from "./components/MyPreofferCard";

const initialState = {
  preoffersList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_MY_PREOFFERS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case GET_MY_PREOFFERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        preoffersList: action.payload.preoffers,
      };
    case GET_MY_PREOFFERS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

function MyPreOffers() {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: GET_MY_PREOFFERS_REQUEST,
      });

      fetch(apiUrl(`/preoffers/user/${authState.user.id}`), {
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
            type: GET_MY_PREOFFERS_SUCCESS,
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
              type: GET_MY_PREOFFERS_FAILURE,
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
    navigate,
  ]);

  return (
    // TO DO: Cuando se crea la preoferta que sea undefined, hasta que el consignatario la acepte o rechaze
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Mis preofertas"} />
      </motion.div>
      <section>
        <article className="container">
          <div className="row">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los datos</p>
            ) : (
              <React.Fragment>
                {state.preoffersList.length > 0 ? (
                  state.preoffersList.map((preoffer) => (
                    <MyPreofferCard key={preoffer.id} preoffer={preoffer} />
                  ))
                ) : (
                  <p>No hay preofertas para mostrar...</p>
                )}
              </React.Fragment>
            )}
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default MyPreOffers;
