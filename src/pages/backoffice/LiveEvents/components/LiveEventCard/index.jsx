import React, { useState } from "react";

import { getMonth } from "../../../../../utils/get-month";

import imgUrl from "../../../../../assets/no-img.jpg";

import DeleteLiveEventModal from "./components/DeleteLiveEventModal";
import { getDate } from "../../../../../utils/get-date";

function LiveEventCard({ liveEvent }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <React.Fragment>
      <div className="col-12 mb-3 live-event-card">
        <div className="row">
          <div className="col-lg-3 mb-3">
            {liveEvent.coverImgName ? (
              <img src={liveEvent.coverImgName} width="100%" />
            ) : (
              <img src={imgUrl} width="100%" />
            )}
          </div>
          <div className="col-lg-6">
            <h3>{liveEvent.title}</h3>
            <p className="event-date">
              <i className="fas fa-calendar-alt me-2"></i>
              {getDate(liveEvent.startBroadcastTimestamp)}
            </p>
            <p>
              <b>Lugar: </b>
              {liveEvent.location}
            </p>
            <p>
              <b>Organiza: </b>
              {liveEvent.organizer}
            </p>
            <p>
              <b>ID transmisión: </b>
              {liveEvent.broadcastLinkId === null ||
              liveEvent.broadcastLinkId === undefined ||
              liveEvent.broadcastLinkId === "" ? (
                "No existe"
              ) : (
                <a
                  href={`https://www.youtube.com/watch/${liveEvent.broadcastLinkId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {liveEvent.broadcastLinkId}
                </a>
              )}
            </p>
          </div>
          <div className="col-lg-3">
            <a
              className="button button-dark"
              href={`/admin/remates-vivo/${liveEvent.id}/upload`}
            >
              <i className="fas fa-camera"></i> Cambiar imagen
            </a>
            <a
              href={`/admin/remates-vivo/editar/${liveEvent.id}`}
              className="button button-dark"
            >
              <i className="fas fa-edit"></i> Editar
            </a>
            <a className="button button-dark" onClick={handleDeleteModal}>
              <i className="fas fa-trash"></i> Eliminar
            </a>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <DeleteLiveEventModal
          liveEventId={liveEvent.id}
          closeFunction={handleDeleteModal}
        />
      )}
    </React.Fragment>
  );
}

export default LiveEventCard;
