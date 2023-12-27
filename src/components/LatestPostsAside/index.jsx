import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";

import imgUrl from "../../assets/no-img.jpg";

import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../../utils/action-types";

import "./styles.scss";

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

export const LatestPostsAside = ({ numbOfItems }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: FETCH_POSTS_REQUEST,
    });
    fetch(apiUrl(`posts/published?page=1&itemsPerPage=${numbOfItems}`), {
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
      });
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    navigate,
    numbOfItems,
  ]);

  return (
    <div className="latest-posts-aside">
      <h4>Últimos artículos</h4>
      <div className="separator"></div>
      {state.isFetching ? (
        <p>Cargando...</p>
      ) : state.hasError ? (
        <p>Error al obtener los datos</p>
      ) : state.postsList.length > 0 ? (
        state.postsList.map((post) => <LatestPosts key={post.id} post={post} />)
      ) : (
        <p>No hay artículos para mostrar...</p>
      )}
    </div>
  );
};

const LatestPosts = ({ post }) => {
  const { id, title, picture, createdAt } = post;

  return (
    <Link to={`/articulos/${id}`}>
      <div className="wapper">
        <div className="post-img">
          {picture ? (
            <img src={picture} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
        </div>
        <div className="content">
          <p>
            <b>{title}</b>
          </p>
          <small>{new Date(createdAt).toLocaleDateString("es-UY")}</small>
        </div>
      </div>
    </Link>
  );
};
