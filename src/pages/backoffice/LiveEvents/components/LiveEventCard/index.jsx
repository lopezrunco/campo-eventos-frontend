import React, { useState } from "react";

import { getMonth } from "../../../../../utils/get-month";

import DeleteLiveEventModal from "./components/DeleteLiveEventModal";

function LiveEventCard({ liveEvent }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <React.Fragment>
      <div className="col-12 mb-3 live-event-card">
        <div className="row">
          <div className="col-lg-3">
            <img
              src={liveEvent.coverImgName}
              alt={liveEvent.title}
              width="100%"
            />
          </div>
          <div className="col-lg-7">
            <h3>{liveEvent.title}</h3>
            <p className="event-date">
              <i className="fas fa-calendar-alt"></i>
              {`${liveEvent.day} de ${getMonth(liveEvent.month)}, ${
                liveEvent.beginHour
              } hs.`}
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
              <b>ID de transmisión (Youtube): </b>
              {liveEvent.broadcastLinkId}
            </p>
          </div>
          <div className="col-lg-2">
            <a
              href={`/admin/remates-vivo/editar/${liveEvent.id}`}
              className="button button-dark me-3"
            >
              {/* TO DO: Pagina de editar remate en vivo */}
              {/* TO DO: Pagina de editar remate normal */}
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
