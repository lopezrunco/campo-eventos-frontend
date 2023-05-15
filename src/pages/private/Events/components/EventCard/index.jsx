import "./style.scss";

function EventCard({ event }) {
  return (
    <div className="col-lg-4">
      <div className="border mb-3 p-4">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="row">
          <small>Remata: {event.company}</small>
          <small>Organiza: {event.organizer}</small>
          <small>Lugar: {event.location}</small>
          <small>Enlace vivo: {event.broadcastLink}</small>
          <small>Financiación: {event.funder}</small>
          <small>Video de los lotes: {event.videoLink}</small>
        </div>
        <a className="button button-dark">Ver lotes</a>
      </div>
    </div>
  );
}

export default EventCard;
