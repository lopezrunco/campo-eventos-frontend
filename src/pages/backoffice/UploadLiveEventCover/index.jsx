import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useReducer } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;
import { refreshToken } from "../../../utils/refresh-token";
import { AuthContext } from "../../../App";
import {
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../../utils/action-types";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import AppendImage from "./components/AppendImage";
import { Title } from "../../../components/Title";

const initialState = {
  image: "",
  url: "",
  appendImageToEvent: false,
  isSending: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
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
        url: action.payload.url,
        appendImageToEvent: true,
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

const UploadLiveEventCover = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleUploadInputChange = (imgElement) => {
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
      });
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Subir imagen"} />
      </motion.div>
      <section className="upload-file-page">
        <article className="container">
          <Title
            title="Subir nueva imagen"
            subtitle="El archivo no puede pesar más de 10 megabytes"
          />
          <div className="row">
            <div className="col-12">
              <div className="select-file">
                <label>
                  <input
                    type="file"
                    onChange={(e) => handleUploadInputChange(e.target.files[0])}
                  ></input>
                </label>
                <button
                  className="button button-dark"
                  onClick={handleImageSubmit}
                  disabled={state.isSending}
                >
                  <i className="fas fa-upload"></i>
                  {state.isSending ? "Subiendo..." : "Subir"}
                </button>
              </div>
              <div className="file-preview">
                {state.url !== "" && <img src={state.url} />}
                {state.appendImageToEvent && (
                  <AppendImage liveEventId={id} imageName={state.url} />
                )}
                <a
                  className="button button-dark-outline"
                  href="/admin/remates-vivo/"
                >
                  <i className="fas fa-times"></i> Cancelar
                </a>
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};

export default UploadLiveEventCover;
