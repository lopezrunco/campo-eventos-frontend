import { motion } from "framer-motion";
import React from "react";

import imgUrl from '../../../assets/hero-logo.png'

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function LiveEventCreated() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Remate en vivo creado"} />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <article className="row">
            <div className="col-lg-9">
              <h2>Exito!</h2>
              <h3>El remate en vivo ha sido creado</h3>
              <div className="separator"></div>
              <p>
                El remate ha sido creado, el mismo se emitirá a la dia y hora
                especificados en la página Vivo.
              </p>
              <a href="/" className="button button-light me-3">
                <i className="fas fa-signal"></i> Ir a Vivo
              </a>
              <a href="/admin" className="button button-dark">
                <i className="fas fa-users-cog"></i> Volver a la administración
              </a>
            </div>
            <div className="col-lg-3 d-flex justify-content-center align-items-center">
              <img src={imgUrl} alt="" />
            </div>
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
}

export default LiveEventCreated;
