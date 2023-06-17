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
        <b>Link transmisión:</b> {liveEvent.broadcastLinkId}
      </p>
    </div>
  );
}

export default ActualLiveEventData;
