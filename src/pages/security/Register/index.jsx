import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import React, { useContext, useState } from "react";

import { LOGIN } from "../../../utils/action-types";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

import "./style.scss";

function Register() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const initialState = {
    nickname: "",
    email: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  };

  const [data, setData] = useState(initialState);

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  // Send data to the API
  const handleFormSubmit = () => {
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });

    fetch(apiUrl("register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: data.nickname,
        email: data.email,
        password: data.password,
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
        // Login type dispatch with the data sent by the API
        dispatch({
          type: LOGIN,
          payload: data,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: "Invalid credentials",
        });
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
        <Breadcrumbs location={"Registro"} />
      </motion.div>
      <section>
        <article className="container">
          <div className="row">
            <div className="col">
              <div className="register-container">
                <h1>Registrarme</h1>
                <div className="separator"></div>
                <p>Regístrese para acceder a la plataforma de preofertas.</p>

                <label htmlFor="nickname">
                  <input
                    type="text"
                    value={data.nickname}
                    onChange={handleInputChange}
                    name="nickname"
                    id="nickname"
                  />
                  Nombre de usuario *
                </label>

                <label htmlFor="email">
                  <input
                    type="email"
                    value={data.email}
                    onChange={handleInputChange}
                    name="email"
                    id="email"
                  />
                  Email *
                </label>

                <label htmlFor="password">
                  <input
                    type="password"
                    value={data.password}
                    onChange={handleInputChange}
                    name="password"
                    id="password"
                  />
                  Contraseña *
                </label>

                <button
                  onClick={handleFormSubmit}
                  disabled={data.isSubmitting}
                  className="button button-dark"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  {data.isSubmitting ? "Enviando datos..." : "Registrar"}
                </button>

                {data.errorMessage && (
                  <span className="form-error">{data.errorMessage}</span>
                )}
              </div>

              <div className="links">
                <small>
                  ¿Ya tiene una cuenta? <Link to="/login">Iniciar sesión</Link>
                </small>
                <small>
                  <Link to="/">Volver a la página de inicio</Link>
                </small>
              </div>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
}

export default Register;
