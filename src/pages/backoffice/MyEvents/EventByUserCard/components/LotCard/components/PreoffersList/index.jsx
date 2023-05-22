import { useNavigate } from "react-router-dom";
import { useContext, useReducer } from "react";

import {
  CREATE_PREOFFER_FAILURE,
  CREATE_PREOFFER_REQUEST,
  CREATE_PREOFFER_SUCCESS,
  FORM_INPUT_CHANGE,
} from "../../../../../../../events/EventsList/action-types";
import { AuthContext } from "../../../../../../../../App";
import { apiUrl } from "../../../../../../../../utils/api-url";
import { refreshToken } from "../../../../../../../../utils/refresh-token";

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

  // TO TO: On Preoffer Detail take to edit preoffer
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
        console.log("preoffer created!");
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
          <div className="col-12">
            <h3>Preofertas:</h3>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Monto</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Estado</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {preoffers.map((preoffer) => {
                  return (
                    <tr key={preoffer.id}>
                      <td>{preoffer.amount}</td>
                      <td>{preoffer.date}</td>
                      <td>
                        {preoffer.accepted ? (
                          <span className="tag">Aceptada</span>
                        ) : (
                          <span className="tag">No aceptada</span>
                        )}
                      </td>
                      <td>
                        <a href="mis-eventos/preofertas">
                          Ver detalle / Editar
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreoffersList;
