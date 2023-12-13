import React from "react";
import { useNavigate } from "react-router-dom";

import imgUrl from "../../../../../assets/no-img.jpg";
import { getDate } from "../../../../../utils/get-date";

import "./styles.scss";

export const Card = ({ post, colClass }) => {
  const navigate = useNavigate();

  return (
    <div className={colClass}>
      <div className="post-card" onClick={() => navigate(`/posts/${post.id}`)}>
        <div className="img-wrapper">
          {post.picture ? (
            <img src={post.picture} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
        </div>
        <div className="content">
          <h3>{post.title}</h3>
          <small>
            {post.category && (
              <span>
                <i className="far fa-folder-open"></i> {post.category}
              </span>
            )}
            {post.createdAt && (
              <span>
                <i className="fas fa-calendar-alt"></i>{" "}
                {getDate(post.createdAt)}
              </span>
            )}
          </small>
          <p>{post.headline}</p>
          <a className="button button-dark-outline">
            Leer artículo <i className="fas fa-chevron-right ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
