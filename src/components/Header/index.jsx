import { useState, useContext } from "react";
import { AuthContext } from "../../App";
import "./styles.scss";

export const Header = ({ menuItems }) => {
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
              {menuItems.map((el, idx) => {
                return (
                  <li
                    className={`navigation-bar-item ${
                      activeLink === el.link ? "active-navigation" : ""
                    }`}
                    id="navigation-bar-item"
                    key={idx}
                    onClick={handleMenuClick}
                  >
                    <a
                      href={el.link}
                      className="nav-link-item"
                      title={el.title}
                    >
                      {el.text}
                    </a>
                  </li>
                );
              })}
              {authState.user && ( 
              <li
                className={`navigation-bar-item`}
                id="navigation-bar-item"
                onClick={handleMenuClick}
              >
                <a href="/remates" className="nav-link-item" title="Remates">
                  Remates
                </a>
              </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
