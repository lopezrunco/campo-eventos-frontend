import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { AuthContext } from "../../../App";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";
import {
  GET_ADS_FAILURE,
  GET_ADS_REQUEST,
  GET_ADS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";
import { Loader } from "../../../components/Loader";
import Pagination from "../../../components/Pagination";

const initialState = {
  adsList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_ADS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case GET_ADS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        adsList: action.payload.ads,
      };
    case GET_ADS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const MyAds = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Handle pagination
  const [currentPage, setCurentPage] = useState(1);
  const itemsPerPage = 12;
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
        type: GET_ADS_REQUEST,
      });

      fetch(apiUrl(`my-ads?page=${currentPage}&itemsPerPage=${itemsPerPage}`), {
        method: "POST",
        headers: {
          Authorization: authState.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authState.user.id,
        }),
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
            type: GET_ADS_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the ads by user", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: GET_ADS_FAILURE,
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
        <Breadcrumbs location={"Mis anuncios"} />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <Title
            title="Mis anuncios"
            subtitle="Cree, edite y elimine sus anuncios."
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
        >
          <article className="row">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los datos</p>
            ) : state.adsList.length > 0 ? (
              state.adsList.map((ad) => <AdCard key={ad.id} ad={ad} />)
            ) : (
              <p>No hay anuncios para mostrar...</p>
            )}
            <Pagination
              elementList={state.adsList}
              currentPage={currentPage}
              prevPageFunction={prevPage}
              nextPageFunction={nextPage}
            />
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
};

const AdCard = ({ ad }) => {
  const handleSwitchPublishModal = () => {
    // TODO: Update ad
  };

  const handleDeleteModal = () => {
    // TODO: Delete ad
  };

  return (
    <div className="col-lg-4 mb-3">
      <div key={ad.id} className="overflow-hidden sm-border-radius">
        <img
          src={ad.imgUrl}
          alt={ad.title}
          width="100%"
          className="sm-border-radius border"
        />
        <div className="options-buttons bottom">
          <a
            className="rounded-icon blue box-shadow"
            href={`/autor/anuncios/mis-anuncios/editar/${ad.id}`}
            title={`Editar ${ad.title}`}
          >
            <i className="fas fa-pen"></i>
          </a>
          <a
            className="rounded-icon blue box-shadow"
            onClick={handleSwitchPublishModal}
            title={ad.published ? `Despublicar ${ad.title}` : `Publicar ${ad.title}`}
          >
            <i className={ad.published ? "far fa-eye-slash" : "far fa-eye"}></i>
          </a>
          <a
            className="rounded-icon danger box-shadow"
            onClick={handleDeleteModal}
            title={`Eliminar ${ad.title}`}
          >
            <i className="fas fa-trash"></i>
          </a>
        </div>
      </div>
    </div>
  );
};