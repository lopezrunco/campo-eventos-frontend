import { useNavigate } from "react-router-dom";
import React from "react";

import imgUrl from "../../../../assets/no-img.jpg";

import { getDate } from "../../../../utils/get-date";

import "./styles.scss";

function EventByUserCard({ event }) {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className="col-lg-4">
        <div
          className="my-event-card"
          onClick={() => navigate(`/consignatarios/mis-remates/${event.id}`)}
        >
          <span className="event-type-tag">{event.eventType}</span>
          {event.imageUrl ? (
            <img src={event.imageUrl} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
          <div className="content">
            <h4>{event.title}</h4>
            <p className="date">{getDate(event.eventTimestamp)}</p>
            {event.company && event.organizer && (
              <p>
                <b>Remata: </b>
                {event.company}
                <br />
                <b>Organiza: </b>
                {event.organizer}
              </p>
            )}
            {event.category && event.breeder && (
              <p>
                <b>Categoría: </b>
                {event.category}
                <br />
                <b>Cabaña: </b>
                {event.breeder}
              </p>
            )}
            <a className="button button-dark-outline me-3">
              Ver más <i className="fas fa-chevron-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventByUserCard;
