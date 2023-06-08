import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import { refreshToken } from "../../../../../../../../../../utils/refresh-token";
import { apiUrl } from "../../../../../../../../../../utils/api-url";
import { AuthContext } from "../../../../../../../../../../App";
import {
  EDIT_PREOFFER_FAILURE,
  EDIT_PREOFFER_REQUEST,
  EDIT_PREOFFER_SUCCESS,
} from "../../../../../../../../action-types";

import "./styles.scss";

const initialState = {
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case EDIT_PREOFFER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case EDIT_PREOFFER_SUCCESS:
      return {
        ...state,
        isSending: false,
      };
    case EDIT_PREOFFER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function RefuseAcceptPreoffer({ preoffer }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch({
      type: EDIT_PREOFFER_REQUEST,
    });

    fetch(apiUrl(`preoffers/${preoffer.id}`), {
      method: "PUT",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accepted: !preoffer.accepted,
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
          type: EDIT_PREOFFER_SUCCESS,
          payload: data,
        });
        navigate(`/preoferta-editada`);
      })
      .catch((error) => {
        console.error("Error trying to edit the preoffer", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleClick()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: EDIT_PREOFFER_FAILURE,
          });
        }
      });
  };

  if (preoffer.accepted) {
    return (
      <span className="tag acepted-preoffer" onClick={handleClick}>
        Aceptada
      </span>
    );
  } else {
    return (
      <span className="tag refused-preoffer" onClick={handleClick}>
        No aceptada
      </span>
    );
  }
}

export default RefuseAcceptPreoffer;
