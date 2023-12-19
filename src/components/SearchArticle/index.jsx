import { useNavigate } from "react-router-dom";
import { useContext, useReducer, useState } from "react";

import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  NO_RESULTS,
} from "../../utils/action-types";

import "./styles.scss";

const initialState = {
  searchResults: [],
  isSearching: false,
  hasError: false,
  noResults: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        isSearching: true,
        hasError: false,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isSearching: false,
        searchResults: action.payload.posts,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        isSearching: false,
        hasError: true,
      };
    case NO_RESULTS:
      return {
        ...state,
        isSearching: false,
        noResults: true,
      };
    default:
      return state;
  }
};

export const SearchArticle = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      dispatch({
        type: FETCH_POSTS_REQUEST,
      });

      fetch(apiUrl(`/posts/search?title=${encodeURIComponent(searchQuery)}`))
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
          if (data.posts.length > 0) {
            navigate("/resultados-busqueda", {
              state: { results: data.posts },
            });
          }
        })
        .catch((error) => {
          console.error("Error trying to fetch posts by title", error);
          if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
          } else if (error.status === 403) {
            navigate("/forbidden");
          } else if (error.status === 404) {
            dispatch({
              type: NO_RESULTS,
            });
          } else {
            dispatch({
              type: FETCH_POSTS_FAILURE,
            });
          }
        });
    }
  };

  return (
    <div className="search-article">
      <div className="wrapper">
        <label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </label>
      </div>
      {state.hasError && <p>Ocurrió un error.</p>}
      {state.noResults && <p>No hay coincidencias.</p>}
    </div>
  );
};
