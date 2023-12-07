import { useNavigate } from "react-router-dom";

import { getDate } from "../../../../../utils/get-date";

export const PostByUserCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className="col-12">
      <div className="my-event-card">
        <div className="row">
          <div className="col-lg-9">
            <h2>{post.title}</h2>
            <h3>Categoría: {post.category}</h3>
            <p>{post.headline}</p>
            {post.tags.map((tag, i) => {
              return <small key={i}>{tag}</small>;
            })}
            <p>Creado: {getDate(post.createdAt)}</p>
            <p>Modificado: {getDate(post.updatedAt)}</p>
            <h4>Iconos de borrar y editar</h4>
          </div>
          <div className="col-lg-3">
            <img width="100%" src={post.picture} alt={post.title} />
          </div>
        </div>
      </div>
    </div>
  );
};
