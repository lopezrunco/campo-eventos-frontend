import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";

import { aboutData } from "../../data/about";
import { LOGOUT } from "../../utils/action-types";
import { AuthContext } from "../../App";

import "./styles.scss";

export const Top = () => {
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    authDispatch({ type: LOGOUT });
    navigate("/logged-out");
  };

  return (
    <div className="top" id="top">
      <div className="container">
        <div className="row">
          <div className="content-wrapper">
            <div className="social">
              {aboutData.social.map((socialEl, socialIdx) => (
                <div className="item" key={socialIdx}>
                  <a
                    href={socialEl.link}
                    title={socialEl.info}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className={socialEl.iconClassname}></i>
                  </a>
                </div>
              ))}
            </div>
            <div className="user-links">
              {authState.user ? (
                <small>
                  <a href="/login" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i> Cerrar sesión
                  </a>
                </small>
              ) : (
                <React.Fragment>
                  <small>
                    <a href="/login">
                      <i className="fas fa-user"></i> Iniciar sesión
                    </a>
                  </small>
                  <small>
                    <a href="/register">
                      <i className="fa fa-sign-in-alt"></i>Registro
                    </a>
                  </small>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
