import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useReducer, useState } from "react";

import { refreshToken } from "../../../utils/refresh-token";
import { ALL } from "../../../utils/blog-card-types";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { Loader } from "../../../components/Loader";
import { PostCard } from "../../Home/components/PostCard";
import Pagination from "../../../components/Pagination";

const initialState = {
  postsList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        postsList: action.payload.posts,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const BlogHome = () => {
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
    dispatch({
      type: SHOW_LOADER,
    });
    dispatch({
      type: FETCH_POSTS_REQUEST,
    });
    fetch(apiUrl(`posts?page=${currentPage}&itemsPerPage=${itemsPerPage}`), {
      method: "GET",
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
          type: FETCH_POSTS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the posts", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_POSTS_FAILURE,
          });
        }
      })
      .finally(() => {
        authDispatch({
          type: HIDE_LOADER,
        });
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    currentPage,
    itemsPerPage,
    navigate,
  ]);

  return (
    <section className="latest-posts">
      <article className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
        >
          <div className="row">
            {state.isFetching ? (
              <Loader />
            ) : state.hasError ? (
              <p>Error al obtener los datos</p>
            ) : (
              <React.Fragment>
                {state.postsList.length > 0 ? (
                  state.postsList.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      colClass={"col-lg-4"}
                      btnClass="button-dark"
                      cardType={ALL}
                    />
                  ))
                ) : (
                  <p>No hay artículos para mostrar...</p>
                )}
              </React.Fragment>
            )}
            <Pagination
              elementList={state.postsList}
              currentPage={currentPage}
              prevPageFunction={prevPage}
              nextPageFunction={nextPage}
            />
          </div>
        </motion.div>
      </article>
    </section>
  );
};
