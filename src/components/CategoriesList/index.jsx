import { Link } from "react-router-dom";

import { blogCategories } from "../../config/blog-config";

import "./styles.scss";

export const CategoriesList = () => {
  return (
    <div className="categories-list">
      <h4>Categorías</h4>
      <div className="separator"></div>
      <div className="list">
        {blogCategories.map((cat, i) => {
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
