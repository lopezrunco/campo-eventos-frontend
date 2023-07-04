import { motion } from "framer-motion";
import React from "react";

import imgUrl from '../../../assets/success.gif'

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function UserUpdated() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Datos actualizados"} />
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
              <h3>Sus datos de usuario han sido actualizados</h3>
              <div className="separator"></div>
              <p>Ahora podrá hacer preofertas en la plataforma.</p>
              <a
                href="/remates"
                className="button button-light me-3"
              >
                <i className="fas fa-gavel"></i> Volver a remates
              </a>
              <a
                href={'/'}
                className="button button-dark"
              >
                <i className="fas fa-home"></i> Volver a Inicio
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

export default UserUpdated;
