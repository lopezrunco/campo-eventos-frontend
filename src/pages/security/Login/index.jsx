import { motion } from "framer-motion";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { servicesMenu } from "../../../data/services-menu";
import { LOGIN } from "../../../utils/action-types";
import { apiUrl } from "../../../utils/api-url";
import { AuthContext } from "../../../App";

import { Header } from "../../../components/Header";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

import "./style.scss";

function Login() {
  // From auth AuthContext take the dispatch function to indicate a possible login
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const initialState = {
    nickname: "",
    password: "",
    token: "",
    isSubmitting: false,
    errorMessage: null,
  };

  const [data, setData] = useState(initialState);

  // Set all state data at one time
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
      errorMessage: null, // Avoid error messages during the fetch
    });

    fetch(apiUrl("login"), {
      method: "POST",
      headers: {
        // Declare type of content sended to the API
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: data.nickname,
        password: data.password,
        token: data.token,
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
        // Dispatch the data sended by the API
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
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Header menuItems={servicesMenu} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Iniciar sesión"} />
      </motion.div>
      <section>
      <article className="container">
        <div className="row">
          <div className="col">
            <div className="login-container">
              <h1>Iniciar sesión</h1>
              <div className="separator"></div>
              <p>Inicie sesión para acceder a la plataforma de preofertas.</p>

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

              <label htmlFor="token">
                <input
                  type="password"
                  value={data.token}
                  onChange={handleInputChange}
                  name="token"
                  id="token"
                />
                Token
              </label>

              <button
                onClick={handleFormSubmit}
                disabled={data.isSubmitting}
                className="primary-button"
              >
                {data.isSubmitting ? "Enviando datos..." : "Iniciar sesión"}
              </button>

              {data.errorMessage && (
                <span className="form-error">{data.errorMessage}</span>
              )}
            </div>

            <div className="links">
              <small>
                ¿No tiene una cuenta? <Link to="/register">Regístrese</Link>
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

export default Login;
