import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useReducer } from "react";

import { HIDE_LOADER, SHOW_LOADER } from "../../../utils/action-types";
import { refreshToken } from "../../../utils/refresh-token";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_PREOFFER_REQUEST,
  FETCH_PREOFFER_FAILURE,
  FETCH_PREOFFER_SUCCESS,
} from "../action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Loader } from "../../../components/Loader";

const initialState = {
  preoffer: undefined,
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_PREOFFER_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_PREOFFER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        preoffer: action.payload.preoffer,
      };
    case FETCH_PREOFFER_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function PreofferEdit() {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispacth] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispacth({
        type: FETCH_PREOFFER_REQUEST,
      });

      fetch(apiUrl(`preoffers/${id}`), {
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
          dispacth({
            type: FETCH_PREOFFER_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error fetching the preoffer", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.state === 403) {
            navigate("/forbidden");
          } else {
            dispacth({
              type: FETCH_PREOFFER_FAILURE,
            });
          }
        })
        .finally(() => {
          authDispatch({
            type: HIDE_LOADER,
          });
        });
    }
  }, [authDispatch, authState.refreshToken, authState.token, id, navigate]);

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Editar preoferta"} />
      </motion.div>
      <section>
        <article className="container">
          <div className="row mb-5">
            <div className="col-lg-6 preoffer-detail">
              <h3>Datos de la preoferta:</h3>
              {state.isFetching ? (
                <Loader />
              ) : state.hasError ? (
                <p>Error al fetchear</p>
              ) : (
                state.preoffer && (
                  <div className="border p-3 my-3">
                    <p>
                      <b>Monto: </b>
                      {state.preoffer.amount}
                    </p>
                    <p>
                      <b>Fecha: </b>
                      {state.preoffer.date}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className="col-lg-6 user-detail">
              <h3>Datos del usuario:</h3>
            </div>
          </div>
          <div className="row">
            <hr />
            <div className="col-12 accept-cancel-btns text-center">
              <p>¿Que desea hacer con esta preoferta?</p>
              <a href="" className="button button-dark me-3">
                <i className="fas fa-check"></i> Aceptar
              </a>
              <a href="" className="button button-dark">
                <i className="fas fa-times"></i> Rechazar
              </a>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default PreofferEdit;
