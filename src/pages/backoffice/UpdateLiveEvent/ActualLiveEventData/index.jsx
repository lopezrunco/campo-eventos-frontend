function ActualLiveEventData({ liveEvent }) {
  return (
    <div className="existing-data">
      <h3 className="mb-3">Datos actuales:</h3>
      <p>
        <b>Título:</b> {liveEvent.title} <br />
        <b>Día:</b> {liveEvent.day} <br />
        <b>Mes:</b> {liveEvent.month} <br />
        <b>Hora inicio:</b> {liveEvent.beginHour} <br />
        <b>Hora cierre:</b> {liveEvent.endHour} <br />
        <b>Lugar:</b> {liveEvent.location} <br />
        <b>Organización:</b> {liveEvent.organizer} <br />
        <b>Enlace transmisión: </b>
        {liveEvent.broadcastLinkId === null ||
        liveEvent.broadcastLinkId === undefined ||
        liveEvent.broadcastLinkId === "" ? (
          "No existe"
        ) : (
          <a
            href={`https://www.youtube.com/watch/${liveEvent.broadcastLinkId}`}
            target="_blank"
            rel="noreferrer"
          >
            {`https://www.youtube.com/watch/${liveEvent.broadcastLinkId}`}
          </a>
        )}
      </p>
    </div>
  );
}

export default ActualLiveEventData;
