import { getMonth } from "../../../utils/get-month";

import FetchImage from "../../../components/FetchImage";

import "./styles.scss";

function Card({ liveEvent }) {
  return (
    <section className="live-event-card">
      <article className="container">
        <div className="row">
          <div className="col-md-5 mb-3 mb-lg-0 event-image-iframe">
            {liveEvent.broadcastLinkId ? (
              <iframe
                src={`https://www.youtube.com/embed/${liveEvent.broadcastLinkId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (liveEvent.coverImgName) ? (
              <FetchImage name={liveEvent.coverImgName} />
            ) : (
              <img src="../../src/assets/no-img.jpg" width="100%" />
            )}
          </div>
          <div className="col-md-7 event-description">
            <h2>{liveEvent.title}</h2>
            <span className="event-date">
              <i className="fas fa-calendar-alt"></i>{" "}
              {`${liveEvent.day} de ${getMonth(liveEvent.month)}, ${
                liveEvent.beginHour
              } hs.`}
            </span>
            <span>
              <b>Lugar: </b>
              {liveEvent.location}
            </span>
            <span>
              <b>Organiza: </b>
              {liveEvent.organizer}
            </span>
            {liveEvent.broadcastLinkId && (
              <>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `https://www.youtube.com/watch/${liveEvent.broadcastLinkId}`
                    )
                  }
                  className="button button-dark me-2"
                >
                  <i className="far fa-copy"></i>Copiar link
                </button>
                <a
                  href={`https://wa.me/?text=https://www.youtube.com/watch/${liveEvent.broadcastLinkId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-dark mt-0"
                >
                  <i className="fab fa-whatsapp"></i>Compartir
                </a>
              </>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

export default Card;
