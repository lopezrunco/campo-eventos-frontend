import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function EventCreated() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Remate creado"} />
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
              <h3>El remate ha sido creado</h3>
              <div className="separator"></div>
              <p>
                El remate ha sido creado, para agregar lotes, vaya al remate y
                click en Crear nuevo lote.
              </p>

              <a href="/" className="button button-light me-3">
                <i className="fas fa-home"></i> Volver a inicio
              </a>
              <a
                href="/consignatarios/mis-remates"
                className="button button-dark"
              >
                <i className="fas fa-gavel"></i> Volver a mis remates
              </a>
            </div>
            <div className="col-lg-3 d-flex justify-content-center align-items-center">
              <img src="./src/assets/success.gif" alt="" />
            </div>
          </article>
        </motion.div>
      </section>
    </React.Fragment>
  );
}

export default EventCreated;
