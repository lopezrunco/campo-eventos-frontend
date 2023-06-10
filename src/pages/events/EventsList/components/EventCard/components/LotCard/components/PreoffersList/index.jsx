import { useContext, useReducer } from "react";
import { AuthContext } from "../../../../../../../../../App";
import {
  CREATE_PREOFFER_FAILURE,
  CREATE_PREOFFER_REQUEST,
  CREATE_PREOFFER_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../../../../../../../action-types";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../../../../../../../../utils/api-url";
import { refreshToken } from "../../../../../../../../../utils/refresh-token";

const initialState = {
  userId: undefined,
  amount: undefined,
  accepted: false,
  date: "Viernes",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    // Update state on input change
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        amount: action.payload.value,
      };
    case CREATE_PREOFFER_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_PREOFFER_SUCCESS:
      return {
        ...state,
        isSending: false,
        amount: action.payload.amount,
      };
    case CREATE_PREOFFER_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    default:
      return state;
  }
};

function PreoffersList({ preoffers, lotId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    dispatch({
      type: FORM_INPUT_CHANGE,
      payload: {
        input: event.target.name,
        value: event.target.value,
      },
    });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: CREATE_PREOFFER_REQUEST,
    });

    fetch(apiUrl("/preoffers/create"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: authState.user.id,
        date: state.date,
        amount: state.amount,
        accepted: state.accepted,
        lotId: lotId,
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
          type: CREATE_PREOFFER_SUCCESS,
          payload: data,
        });
        navigate("/preoffer-done");
      })
      .catch((error) => {
        console.error("Error creating the preoffer", error);

        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_PREOFFER_FAILURE,
          });
        }
      });
  };

  return (
    <div className="col-12 preoffers-container border p-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            <h3>Preofertas:</h3>
            {preoffers.map((preoffer) => {
              return (
                <p key={preoffer.id}>
                  <b>Monto: {preoffer.amount}</b> {preoffer.date}{" "}
                  {preoffer.accepted ? (
                    <span className="tag acepted-preoffer">Aceptada</span>
                  ) : (
                    <span className="tag refused-preoffer">No aceptada</span>
                  )}
                </p>
              );
            })}
          </div>
          <div className="col-lg-3">
            <h3>Hacer Preoferta:</h3>

            <input
              type="number"
              onChange={handleInputChange}
              min="1"
              name="quantity"
              id="quantity"
              placeholder="Ingrese cantidad"
            />

            <button
              className="button button-light-outline"
              onClick={handleFormSubmit}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? "Espere..." : "Preofertar"}
            </button>

            {state.errorMessage && (
              <span className="form-error">{state.errorMessage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreoffersList;
