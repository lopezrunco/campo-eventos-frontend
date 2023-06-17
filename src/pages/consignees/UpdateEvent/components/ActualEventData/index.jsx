function ActualEventData({ event }) {
  return (
    <div className="existing-data">
      <h3>Datos actuales:</h3>
      <p>
        <b>Título:</b> {event.title}
      </p>
      <p>
        <b>Descripción:</b> {event.description}
      </p>
      <p>
        <b>Rematador:</b> {event.company}
      </p>
      <p>
        <b>Organizador:</b> {event.organizer}
      </p>
      <p>
        <b>Financiación:</b> {event.funder}
      </p>
      <p>
        <b>Lugar:</b> {event.location}
      </p>
      <p>
        <b>Link transmisión:</b> {event.broadcastLink}
      </p>
    </div>
  );
}

export default ActualEventData;
