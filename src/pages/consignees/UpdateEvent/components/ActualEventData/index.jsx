function ActualEventData({ event }) {
  return (
    <div className="existing-data">
      <h3 className="mb-3">Datos actuales:</h3>
      <p>
        <b>Título:</b> {event.title} <br />
        <b>Descripción:</b> {event.description} <br />
        <b>Rematador:</b> {event.company} <br />
        <b>Organizador:</b> {event.organizer} <br />
        <b>Financiación:</b> {event.funder} <br />
        <b>Lugar:</b> {event.location} <br />
        <b>ID enlace transmisión:</b>{" "}
        {event.broadcastLink === null ||
        event.broadcastLink === undefined ||
        event.broadcastLink === ""
          ? "No existe"
          : event.broadcastLink}
      </p>
    </div>
  );
}

export default ActualEventData;
