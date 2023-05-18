import { motion } from "framer-motion";
import React from "react";

import { servicesMenu } from "../../../data/services-menu";

import { Header } from "../../../components/Header";
import { Breadcrumbs } from "../../../components/Breadcrumbs";

function PreOfferDone() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Header menuItems={servicesMenu} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Remates"} />
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
              <h3>Su preoferta a sido realizada correctamente.</h3>
              <div className="separator"></div>
              <p>
                El usuario administrador revisará su oferta y la aceptará o
                rechazará.
              </p>
              <p>
                En caso de aceptarla, será contactado por el consignatario por
                alguna de las vías de contacto facilitadas por usted.
              </p>
              <a href="/" className="button button-light me-3">
                <i className="fas fa-home"></i> Volver a inicio
              </a>
              <a href="/remates" className="button button-dark">
                <i className="fas fa-gavel"></i> Volver a remates
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

export default PreOfferDone;
