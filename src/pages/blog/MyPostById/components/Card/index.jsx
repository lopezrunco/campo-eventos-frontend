import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDate } from "../../../../../utils/get-date";

import imgUrl from "../../../../../assets/no-img.jpg";

import { DeletePostModal } from "./components/DeletePostModal";

function Card({ myPost }) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(true);
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-3 mb-5">
          {myPost.category && (
            <span className="post-category-tag">{myPost.category}</span>
          )}
          {myPost.picture ? (
            <img src={myPost.picture} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
          <a
            className="rounded-icon primary over-top"
            href={`/autor/articulos/mis-articulos/${myPost.id}/upload`}
          >
            <i className="fas fa-camera"></i>
          </a>
        </div>
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-0">{myPost.title}</h4>
              <p className="date mt-2">
                <i className="fas fa-calendar me-2"></i>{" "}
                {getDate(myPost.createdAt)}
              </p>
            </div>
            <div className="options-buttons">
              <a
                className="rounded-icon primary"
                href={`/consignatarios/mis-remates/editar/${myPost.id}`}
              >
                <i className="fas fa-pen"></i>
              </a>
              <a className="rounded-icon danger" onClick={handleDeleteModal}>
                <i className="fas fa-trash"></i>
              </a>
            </div>
          </div>
          <div>
            <p>
              <b>{myPost.headline}</b>
            </p>
            <div dangerouslySetInnerHTML={{ __html: myPost.content }} />
            <hr className="my-4" />
            <div className="tags">
              Etiquetas:
              {myPost.tags.map((tag, i) => {
                return (
                  <span className="tag gray" key={i}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeletePostModal postId={myPost.id} closeFunction={handleDeleteModal} />
      )}
    </React.Fragment>
  );
}

export default Card;
