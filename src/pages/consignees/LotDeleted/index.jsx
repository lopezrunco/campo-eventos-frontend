import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function LotDeleted() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Lote eliminado"} />
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
              <h3>El lote ha sido eliminado</h3>
              <div className="separator"></div>
              <p>
                El lote ha sido eliminado con éxito, para crear un nuevo lote,
                click en Mis remates.
              </p>

              <a href="/" className="button button-light me-3">
                <i className="fas fa-home"></i> Volver a inicio
              </a>
              <a
                href="/consignatarios/mis-eventos"
                className="button button-dark me-3"
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

export default LotDeleted;