import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function PreOfferEdited() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Preoferta editada"} />
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
              <h3>La preoferta a sido editada.</h3>
              <div className="separator"></div>
              <p>
                El usuario que realizó la preoferta será notificado con un
                mensaje especificando si la misma fue aceptada o rechazada.
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

export default PreOfferEdited;
