import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useReducer } from "react";

import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
  FETCH_TAGS_FAILURE,
  FETCH_TAGS_REQUEST,
  FETCH_TAGS_SUCCESS,
} from "../../utils/action-types";

import './styles.scss'

const initialState = {
  tagsList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_TAGS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_TAGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        tagsList: action.payload.tags,
      };
    case FETCH_TAGS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const TagsList = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: FETCH_TAGS_REQUEST,
    });
    fetch(apiUrl("/tags"), {
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
          type: FETCH_TAGS_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error trying to fetch the tags", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_TAGS_FAILURE,
          });
        }
      });
  }, [authDispatch, authState.refreshToken, authState.token, navigate]);

  return (
    <div className="tag-list">
      <h4>Etiquetas</h4>
      <div className="separator"></div>
      {state.tagsList.length === 0 ? (
        <p>No hay etiquetas que mostrar</p>
      ) : (
        state.tagsList.map((tag, i) => {
          return <a href={`/articulos/etiqueta/${tag}`} key={i}>{tag}</a>;
        })
      )}
    </div>
  );
};
