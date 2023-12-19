import { Link } from "react-router-dom";

import "./styles.scss";

export const CategoriesList = () => {
  const categories = [
    "Zafras",
    "Ferias",
    "Pantalla",
    "Equinos",
    "Eventos",
    "Sociales",
    "Otros",
  ];

  return (
    <div className="categories-list">
      <h4>Categorías</h4>
      <div className="separator"></div>
      <div className="list">
        {categories.map((cat, i) => {
          return (
            <Link key={i} to={`/articulos/categoria/${cat}`}>
              <small>
              <i className="fas fa-chevron-right"></i> {cat}
              </small>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
