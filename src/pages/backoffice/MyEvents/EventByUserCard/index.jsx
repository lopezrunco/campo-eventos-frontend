import React from "react";

function EventByUserCard({ event }) {
  return (
    <React.Fragment>
      <div className="col-lg-4 event-card">
        <div className="border mb-3 p-4">
          <div className="row">
            <div className="col-12">
              <img
                src="https://images.pexels.com/photos/51311/cow-calf-cattle-stock-51311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                width="100%"
              />
              <h3>{event.title}</h3>
              <small># {event.id}</small>
              <p>
                <b>Remata: </b>
                {event.company}
              </p>
              <p>
                <b>Organiza: </b>
                {event.organizer}
              </p>

              <a
                className="button button-dark me-3"
                href={`/consignatarios/mis-eventos/${event.id}`}
              >
                <i className="fas fa-eye"></i> Ver más
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default EventByUserCard;
