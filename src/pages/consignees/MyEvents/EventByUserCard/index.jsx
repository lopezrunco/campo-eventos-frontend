import React from "react";

import imgUrl from "../../../../assets/no-img.jpg";

import "./styles.scss";

function EventByUserCard({ event }) {
  return (
    <React.Fragment>
      <div className="col-lg-4">
        <div className="my-event-card">
          {event.imageUrl ? (
            <img src={event.imageUrl} width="100%" />
          ) : (
            <img src={imgUrl} width="100%" />
          )}
          <div className="content">
            <h4>{event.title}</h4>
            <p>
              <b>Remata: </b>
              {event.company}
              <br />
              <b>Organiza: </b>
              {event.organizer}
            </p>
            <a
              className="button button-dark-outline me-3"
              href={`/consignatarios/mis-remates/${event.id}`}
            >
              Ver más <i className="fas fa-chevron-right ms-2"></i>
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventByUserCard;
