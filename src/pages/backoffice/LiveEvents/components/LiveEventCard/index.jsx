import { getMonth } from "../../../../../utils/get-month";

function LiveEventCard({ liveEvent }) {
  return (
    <div className="col-12 live-event-card">
      <div className="row">
        <div className="col-lg-3">
          <img
            src={liveEvent.coverImgName}
            alt={liveEvent.title}
            width="100%"
          />
        </div>
        <div className="col-lg-7">
          <h3>{liveEvent.title}</h3>
          <p className="event-date">
            <i className="fas fa-calendar-alt"></i>
            {`${liveEvent.day} de ${getMonth(liveEvent.month)}, ${
              liveEvent.beginHour
            } hs.`}
          </p>
          <p>
            <b>Lugar: </b>
            {liveEvent.location}
          </p>
          <p>
            <b>Organiza: </b>
            {liveEvent.organizer}
          </p>
          <p>
            <b>ID de transmisión (Youtube): </b>
            {liveEvent.broadcastLinkId}
          </p>
        </div>
        <div className="col-lg-2">
          <a
            href={`/admin/remates-vivo/editar/${liveEvent.id}`}
            className="button button-dark"
          >
            <i className="fas fa-edit"></i> Editar
          </a>
          <a href="" className="button button-dark">
            <i className="fas fa-trash"></i> Eliminar
          </a>
        </div>
      </div>
    </div>
  );
}

export default LiveEventCard;
