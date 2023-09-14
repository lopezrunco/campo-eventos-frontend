import { useNavigate } from "react-router-dom";
import React from "react";

import imgUrl from "../../../../assets/no-img.jpg";

import { getDate } from "../../../../utils/get-date";

import "./styles.scss";

function EventByUserCard({ event }) {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className="col-12">
        <div className="my-event-card">
          <div className="row">
            <div className="col-lg-9">          
              <div className="content">
                <h2>{event.title}</h2>
                <p className="date">{getDate(event.startBroadcastTimestamp)}</p>
                {event.description && <p><b>Descripción: </b>{event.description}</p>}
                {event.company && <p><b>Remata: </b>{event.company} </p>}
                {event.organizer && <p><b>Organiza: </b>{event.organizer} </p>}
                {event.breeder && <p><b>Cabaña: </b>{event.breeder} </p>}
                {event.category && <p><b>Categoría: </b>{event.category}</p>}
                <a 
                  className="button view-more me-3 mb-0" 
                  onClick={() => navigate(`/consignatarios/mis-remates/${event.id}`)}
                >
                  <i className="fas fa-chevron-right me-2"></i> Ver más / Editar
                </a>
                {event.broadcastLinkId && (
                  <a
                    className="button view-more"
                    href={`https://www.youtube.com/watch/${event.broadcastLinkId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fas fa-play me-2"></i> Enlace transmisión
                  </a>
                )}
              </div>
            </div>
            <div className="col-lg-3">
              {event.eventType && <span className="event-type-tag">{event.eventType}</span>}
              {event.coverImgName ? (
                <img src={event.coverImgName} width="100%" />
              ) : (
                <img src={imgUrl} width="100%" />
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventByUserCard;
