import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useContext, useReducer } from "react";

const CLOUDINARY_ID = import.meta.env.VITE_CLOUDINARY_ID;
import {
  CREATE_AD_FAILURE,
  CREATE_AD_REQUEST,
  CREATE_AD_SUCCESS,
  FORM_INPUT_CHANGE,
  UPDATE_IMAGE_PREVIEW,
  UPLOAD_IMAGE_FAILURE,
  UPLOAD_IMAGE_REQUEST,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_INPUT_CHANGE,
} from "../../../utils/action-types";
import { AuthContext } from "../../../App";
import { apiUrl } from "../../../utils/api-url";
import { refreshToken } from "../../../utils/refresh-token";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

const initialState = {
  title: "",
  position: "",
  imgUrl: "",
  link: "",
  published: true,
  image: undefined,
  userId: "",
  isSending: false,
  hasError: false,
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

const positionDisplayNames = {
  "news-1-left": "Después de Últimas noticias (izquierda)",
  "news-1-right": "Después de Últimas noticias (derecha)",
  "news-2-left": "Después de Zafras (izquierda)",
  "news-2-right": "Después de Zafras (derecha)",
  "news-3-left": "Después de Ferias (izquierda)",
  "news-3-right": "Después de Ferias (derecha)",
  "news-4-left": "Después de Pantalla (izquierda)",
  "news-4-right": "Después de Pantalla (derecha)",
  "news-5-left": "Después de Equinos (izquierda)",
  "news-5-right": "Después de Equinos (derecha)",
};

const reducer = (state, action) => {
  switch (action.type) {
    case FORM_INPUT_CHANGE:
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case CREATE_AD_REQUEST:
      return {
        ...state,
        isSending: true,
        hasError: false,
      };
    case CREATE_AD_SUCCESS:
      return {
        ...state,
        isSending: false,
        ad: action.payload.ad,
      };
    case CREATE_AD_FAILURE:
      return {
        ...state,
        isSending: false,
        hasError: true,
      };
    case UPLOAD_INPUT_CHANGE:
      return {
        ...state,
        image: action.payload,
      };
    case UPDATE_IMAGE_PREVIEW:
      return {
        ...state,
        imagePreview: action.payload,
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

export const CreateAd = () => {
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

  const cancelImageUpload = () => {
    dispatch({
      type: UPDATE_IMAGE_PREVIEW,
      payload: undefined,
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
      })
      .finally(() => {
        dispatch({
          type: UPDATE_IMAGE_PREVIEW,
          payload: undefined,
        });
      });
  };

  const handleFormSubmit = () => {
    dispatch({
      type: CREATE_AD_REQUEST,
    });

    fetch(apiUrl("/ads/create"), {
      method: "POST",
      headers: {
        Authorization: authState.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: state.title,
        position: state.position,
        imgUrl: state.imgUrl,
        link: state.link,
        published: state.published,
        userId: authState.user.id,
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
          type: CREATE_AD_SUCCESS,
          payload: data,
        });
        navigate("/mensaje", {
          state: {
            title: "Anuncio creado",
            message: "El anuncio ha sido creado con éxito.",
            duration: "2000",
            navigateTo: "/autor/anuncios/mis-anuncios",
          },
        });
      })
      .catch((error) => {
        console.error("Error al crear el remate", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate, () =>
            handleFormSubmit()
          );
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: CREATE_AD_FAILURE,
          });
        }
      });
  };

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Crear anuncio"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section>
          <article className="container">
            <Title
              title="Crear anuncio"
              subtitle="Los campos marcados con * son obligatorios"
            />
            <div className="form-container row">
              <div className="col-lg-6">
                <label htmlFor="title">
                  Título *
                  <input
                    required
                    type="text"
                    value={state.title}
                    onChange={handleInputChange}
                    name="title"
                    id="title"
                  />
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="position">
                  Posición *
                  <select
                    value={state.position}
                    onChange={handleInputChange}
                    name="position"
                    id="position"
                  >
                    <option value="">Seleccionar posición</option>
                    {/* Shows a user-friendly name but keeps the original value */}
                    {allowedPositions.map((position, index) => (
                      <option key={index} value={position}>
                        {positionDisplayNames[position]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="link">
                  Enlace
                  <input
                    type="text"
                    value={state.link}
                    onChange={handleInputChange}
                    name="link"
                    id="link"
                  />
                </label>
              </div>

              <div className="col-lg-6">
                <label htmlFor="published">
                  Publicado
                  <select
                    value={state.published}
                    onChange={handleInputChange}
                    name="published"
                    id="published"
                  >
                    <option value={true}>Sí</option>
                    <option value={false}>No</option>
                  </select>
                </label>
              </div>

              <div className="add-ad-img">
                <label htmlFor="adImg">
                  <div className="row align-items-center">
                    <div className="col-lg-3">Imagen</div>
                    <div className="col-lg-9">
                      <input
                        id="adImg"
                        name="adImg"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleUploadInputChange(e.target.files[0])
                        }
                      ></input>
                    </div>
                  </div>
                </label>
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
                            El archivo <i>{state.image.name}</i> se usará como
                            anuncio.
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
              </div>

              <button
                className="button button-dark"
                onClick={handleFormSubmit}
                disabled={state.isSending}
              >
                <i className="fas fa-plus"></i>
                {state.isSending ? "Por favor, espere..." : "Crear anuncio"}
              </button>

              {state.hasError &&
                (state.errorMessage ? (
                  <span className="error-message">{state.errorMessage}</span>
                ) : (
                  <span className="error-message">
                    Ocurrió un error. Revise los datos e intente nuevamente.
                  </span>
                ))}
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
