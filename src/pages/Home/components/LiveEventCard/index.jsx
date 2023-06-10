import { motion } from "framer-motion";
import React from "react";

import { getMonth } from "../../../../utils/get-month";

import './styles.scss'

function LiveEventCard({ liveEvent }) {
  return (
    <React.Fragment>
      <div className="item col-lg-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="content">
            <div className="thumb">
              <img
                src={`${liveEvent.coverImgName}`}
                alt={liveEvent.title}
                width="100%"
              />
            </div>
            <div className="description">
              <h3>{liveEvent.title}</h3>
              <small>Lugar: {liveEvent.location}</small>
              <small>Organiza: {liveEvent.organizer}</small>
              <p className="date">{`${liveEvent.day} de ${getMonth(
                liveEvent.month
              )}, ${liveEvent.beginHour} hrs.`}</p>
              <a className="button button-dark-outline" href={`/remates-vivo/${liveEvent.id}`}>Ver más</a>
            </div>
          </div>
        </motion.div>
      </div>
    </React.Fragment>
  );
}

export default LiveEventCard;
