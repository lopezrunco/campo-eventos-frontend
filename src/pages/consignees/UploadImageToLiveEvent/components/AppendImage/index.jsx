import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../utils/api-url";
import { AuthContext } from "../../../../../App";
import {
  EDIT_LIVE_EVENT_FAILURE,
  EDIT_LIVE_EVENT_REQUEST,
  EDIT_LIVE_EVENT_SUCCESS,
} from "../../../action-types";

const initialState = {
  coverImgName: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_LIVE_EVENT_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_LIVE_EVENT_SUCCESS:
      return {
        ...state,
        isSending: false,
        coverImgName: action.payload.coverImgName,
      };
    case EDIT_LIVE_EVENT_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function AppendImage({ liveEventId, imageName }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch({
      type: EDIT_LIVE_EVENT_REQUEST,
    });

    fetch(apiUrl(`live-events/${liveEventId}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverImgName: imageName,
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
          type: EDIT_LIVE_EVENT_SUCCESS,
          payload: data,
        });
        navigate(`/admin/remates-vivo`);
      })
      .catch((error) => {
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_LIVE_EVENT_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <p>
        El archivo <i>{imageName}</i> se usará como afiche del evento a transmitir.
      </p>
      <a className="button button-dark" onClick={handleSubmit}>
        <i className="fas fa-check"></i> Aceptar
      </a>
    </React.Fragment>
  );
}

export default AppendImage;
