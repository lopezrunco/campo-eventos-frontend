import "./styles.scss";

function ActualLiveEventData({ liveEvent }) {
  return (
    <div className="live-event-data-container">
      <p>
        Título:
        <i> {liveEvent.title}</i>
      </p>
      <p>
        Día:
        <i> {liveEvent.day}</i>
      </p>
      <p>
        Mes:
        <i> {liveEvent.month}</i>
      </p>
      <p>
        Hora de inicio:
        <i> {liveEvent.beginHour}</i>
      </p>
      <p>
        Hora de finalización:
        <i> {liveEvent.endHour}</i>
      </p>
      <p>
        Lugar:
        <i> {liveEvent.location}</i>
      </p>
      <p>
        Organización:
        <i> {liveEvent.organizer}</i>
      </p>
      <p>
        Link de la transmisión (YouTube):
        <i> {liveEvent.broadcastLinkId}</i>
      </p>
    </div>
  );
}

export default ActualLiveEventData;
