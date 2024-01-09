import { useEffect, useReducer } from "react";

import { apiUrl } from "../../utils/api-url";
import {
  GET_ADS_FAILURE,
  GET_ADS_REQUEST,
  GET_ADS_SUCCESS,
} from "../../utils/action-types";

const initialState = {
  ads: [],
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
        ads: action.payload.ads,
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

const allowedPositions = [
  "news-1-left",
  "news-1-right",
  "news-2-left",
  "news-2-right",
  "news-3-left",
  "news-3-right",
  "news-4-left",
  "news-4-right",
  "news-5-left",
  "news-5-right",
];

export const Ad = ({ position }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(apiUrl(`/ads/position/${position}`))
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
        console.error("Error trying to fetch the ads", error);
        dispatch({
          type: GET_ADS_FAILURE,
        });
      });
  }, [position]);

  const isPositionAllowed = allowedPositions.includes(position);
  !isPositionAllowed && <p>Ocurrió un error al cargar el anuncio.</p>;

  if (state.ads.length > 0) {
    const publishedAds = state.ads.filter((ad) => ad.published);
    return (
      <div className="ad">
        {publishedAds.map((ad) => (
          <div key={ad.id} className="text-center my-5 overflow-hidden">
            {ad.link ? (
              <a href={ad.link} target="_blank" rel="noreferrer">
                <img
                  src={ad.imgUrl}
                  alt={ad.title}
                  width="100%"
                  className="sm-border-radius"
                  title={`Visitar ${ad.title}`}
                />
              </a>
            ) : (
              <img
                src={ad.imgUrl}
                alt={ad.title}
                width="100%"
                className="sm-border-radius"
                title={`Visitar ${ad.title}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  return null; // If no ads associated
};
