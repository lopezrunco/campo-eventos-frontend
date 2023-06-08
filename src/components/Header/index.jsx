import React, { useState, useContext } from "react";
import { AuthContext } from "../../App";
import "./styles.scss";

export const Header = () => {
  const { state: authState } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  const handleMenuClick = (e) => {
    setIsOpen(!isOpen);
    setActiveLink(e.target.hash);
  };

  return (
    <header className="header" id="inicio">
      <h1 className="main-logo">Campo Eventos</h1>
      <img className="logo" src="../src/assets/logo.png" alt="Campo Eventos" />
      <i
        className="fas fa-bars header-toggle"
        id="nav-toggle"
        onClick={handleMenuClick}
      ></i>

      <nav className={`navigation-bar ${isOpen ? "show" : ""}`} id="nav-menu">
        <div className="nav-content bd-grid">
          <i
            className="fas fa-times nav-close"
            id="nav-close"
            onClick={handleMenuClick}
          ></i>
          <div className="nav-menu">
            <ul className="nav-list">

              {/* Public menu */}
              <li className={`navigation-bar-item ${activeLink === '/' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='/' className="nav-link-item" title='En vivo'>En vivo</a>
              </li>

              <li className={`navigation-bar-item ${activeLink === '/cartelera' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='/cartelera' className="nav-link-item" title='Cartelera'>Cartelera</a>
              </li>

              <li className={`navigation-bar-item ${activeLink === '/servicios' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                <a href='/servicios' className="nav-link-item" title='Servicios'>Servicios</a>
              </li>

              {/* Basic users */}
              {authState.user && ( 
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/remates' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/remates" className="nav-link-item" title="Remates">Remates</a>
                  </li>
                    <li className={`navigation-bar-item ${activeLink === '/mis-preofertas' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/mis-preofertas" className="nav-link-item" title="Mis preofertas">Mis preofertas</a>
                  </li>
                </React.Fragment>
              )}

              {/* Consignatarios users */}
              {
                ['CONS'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/consignatarios' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/consignatarios" className="nav-link-item" title="Consignatarios">Consignatarios</a>
                  </li>
                </React.Fragment>
              }

              {/* Administrator users */}
              {
                ['ADMIN'].find(role => role === authState.role) &&
                <React.Fragment>
                  <li className={`navigation-bar-item ${activeLink === '/admin' ? "active-navigation" : ""}`} id="navigation-bar-item" onClick={handleMenuClick} >
                    <a href="/admin" className="nav-link-item" title="Administracion">Administracion</a>
                  </li>
                </React.Fragment>
              }

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
