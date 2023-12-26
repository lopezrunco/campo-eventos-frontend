import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;

import {
  UPDATE_IMAGE_PREVIEW,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../utils/action-types";
import { refreshToken } from "../../utils/refresh-token";
import { AuthContext } from "../../App";

const initialState = {
  image: undefined,
  imgUrl: "",
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_IMAGE_PREVIEW:
      return {
        ...state,
        imagePreview: action.payload,
      };
    case UPLOAD_INPUT_CHANGE:
      return {
        ...state,
        image: action.payload,
      };
    case UPLOAD_IMAGE_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imgUrl: action.payload.url,
        isSending: false,
      };
    case UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };

    default:
      return state;
  }
};

export const UploadImage = ({ onImageUpload }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUploadInputChange = (imgElement) => {
    // Update the image preview when a new image is selected
    if (imgElement) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: reader.result,
        });
      };
      reader.readAsDataURL(imgElement);
    }
    dispatch({
      type: UPLOAD_INPUT_CHANGE,
      payload: imgElement,
    });
  };

  const handleImageSubmit = () => {
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
    });

    const data = new FormData();
    data.append("file", state.image);
    data.append("upload_preset", "campoeventos");
    data.append("cloud_name", "dvkq2sewj");

    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_ID}/image/upload`, {
      method: "post",
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        onImageUpload(data.url);
        dispatch({
          type: UPLOAD_IMAGE_SUCCESS,
          payload: data,
        });
      })
      .catch((error) => {
        console.error("Error uploading the image: ", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleImageSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: UPLOAD_IMAGE_FAILURE,
          });
        }
      })
      .finally(() => {
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: undefined,
        });
      });
  };

  const cancelImageUpload = () => {
    dispatch({
      type: UPDATE_IMAGE_PREVIEW,
      payload: undefined,
    });
  };

  return (
    <React.Fragment>
      <input
        id="adImg"
        name="adImg"
        type="file"
        accept="image/*"
        onChange={(e) => handleUploadInputChange(e.target.files[0])}
      ></input>
      {state.imagePreview && (
        <div className="confirmation-modal">
          <div className="container">
            <div className="row">
              <div className="col-12 modal-container">
                <img
                  src={state.imagePreview}
                  alt="Previsualización del anuncio."
                />
                <p>
                  El archivo <i>{state.image.name}</i> se usará como anuncio.
                </p>
                <button
                  className="button button-dark"
                  onClick={handleImageSubmit}
                  disabled={state.isSending}
                >
                  <i className="fas fa-check"></i>{" "}
                  {state.isSending ? "Cargando..." : "Confirmar"}
                </button>
                <button
                  className="button button-dark-outline"
                  onClick={cancelImageUpload}
                  disabled={state.isSending}
                >
                  <i className="fas fa-times"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
