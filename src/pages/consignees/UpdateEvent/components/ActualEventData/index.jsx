import "./styles.scss";

function ActualEventData({ event }) {
  return (
    <div className="event-data-container">
      <p>
        Título:
        <i> {event.title}</i>
      </p>
      <p>
        Descripción:
        <i> {event.description}</i>
      </p>
      <p>
        Rematador:
        <i> {event.company}</i>
      </p>
      <p>
        Organizador:
        <i> {event.organizer}</i>
      </p>
      <p>
        Financiación:
        <i> {event.funder}</i>
      </p>
      <p>
        Lugar:
        <i> {event.location}</i>
      </p>
      <p>
        Link de la transmisión (YouTube):
        <i> {event.broadcastLink}</i>
      </p>
    </div>
  );
}

export default ActualEventData;
