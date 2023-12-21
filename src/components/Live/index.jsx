import { Title } from "../Title";
import { getDate } from "../../utils/get-date";

let currentDate = new Date().toJSON();

export const Live = ({ events }) => {
  return (
    <div className="broadcast-section">
      <div className="container">
        <div className="row">
          {events.map((event, i) => {
            let setEventDuration = event.duration ? event.duration : 12;
            let finishDate = new Date(
              new Date(event.startBroadcastTimestamp).setHours(
                new Date(event.startBroadcastTimestamp).getHours() +
                  setEventDuration
              )
            ).toJSON();

            return event.startBroadcastTimestamp < currentDate &&
              finishDate > currentDate ? (
              <div key={i} className="col-12 items-container">
                {i === 0 ? <Title title="En vivo" /> : null}
                <div className="item">
                  <iframe
                    src={`https://www.youtube.com/embed/${event.broadcastLinkId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  <div className="event-description">
                    <h2>{event.title}</h2>
                    <span className="event-date">
                      <i className="fas fa-calendar-alt"></i>{" "}
                      {getDate(event.startBroadcastTimestamp)}
                    </span>
                    {event.location && (
                      <span>
                        <b>Lugar: </b>
                        {event.location}
                      </span>
                    )}
                    {event.organizer && (
                      <span>
                        <b>Organiza: </b>
                        {event.organizer}
                      </span>
                    )}
                    <a
                      className="button button-light-outline"
                      href={`/remates/${event.id}`}
                    >
                      <i className="fas fa-play"></i> Ver más
                    </a>
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};
