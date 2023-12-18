import { motion } from "framer-motion";
import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";

import imgUrl from "../../../assets/no-img.jpg";

import { refreshToken } from "../../../utils/refresh-token";
import { getDate } from "../../../utils/get-date";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";
import {
  FETCH_POST_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  HIDE_LOADER,
  SHOW_LOADER,
} from "../../../utils/action-types";

import { ShareOnSocialMedia } from "../../../components/ShareOnSocialMedia";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { LatestPostsAside } from "../../../components/LatestPostsAside";

import "./styles.scss";

const initialState = {
  post: undefined,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_POST_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case FETCH_POST_SUCCESS:
      return {
        ...state,
        isSending: false,
        post: action.payload.post,
      };
    case FETCH_POST_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

export const PostById = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  useEffect(() => {
    if (authState.token) {
      authDispatch({
        type: SHOW_LOADER,
      });
      dispatch({
        type: FETCH_POST_REQUEST,
      });

      fetch(apiUrl(`/posts/${id}`), {
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
            type: FETCH_POST_SUCCESS,
            payload: data,
          });
        })
        .catch((error) => {
          console.error("Error trying to fetch the post", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else {
            dispatch({
              type: FETCH_POST_FAILURE,
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
        {state.post && state.post.title && (
          <Breadcrumbs location={state.post.title} />
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="post-by-id">
          <article className="container">
            <div className="row">
              <div className="col-lg-9">
                {state.post ? (
                  <Post post={state.post} />
                ) : state.hasError ? (
                  <p>Error al obtener el artículo</p>
                ) : (
                  <p>Cargando artículo...</p>
                )}
              </div>
              <div className="col-lg-3">
                <LatestPostsAside numbOfItems="4" />
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};

const Post = ({ post }) => {
  const { id, title, category, picture, headline, content, tags, createdAt } =
    post;

  return (
    <div className="post-wapper">
      {picture ? (
        <img src={picture} width="100%" />
      ) : (
        <img src={imgUrl} width="100%" />
      )}
      <div className="content-wrapper">
        <h6>{title}</h6>
        <div className="details">
          <small>
            <i className="fas fa-calendar"></i> {getDate(createdAt)}
          </small>
          <small>
            <i className="fa fa-user"></i> CampoEventos
          </small>
          <small>
            <i className="fa fa-folder"></i> {category}
          </small>
        </div>
        <div className="content">
          <p>
            <b>{headline}</b>
          </p>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <hr className="mt-4" />
          <div className="article-tag-container">
            <i className="fas fa-tags me-3"></i>
            {tags.map((tag, i) => {
              return (
                <span className="tag gray" key={i}>
                  {tag}
                </span>
              );
            })}
          </div>
          <ShareOnSocialMedia
            url={`https://campoeventos.com.uy/articulos/${id}`}
          />
        </div>
      </div>
    </div>
  );
};
