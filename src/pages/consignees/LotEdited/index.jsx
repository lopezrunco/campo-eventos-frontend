import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React from "react";

import imgUrl from '../../../assets/success.gif'

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function LotEdited() {
  const { id } = useParams();

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Lote editado"} />
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
              <h3>El lote ha sido editado</h3>
              <div className="separator"></div>
              <p>
                El lote ha sido editado con éxito, para seguir editando o
                agregar más lotes, vuelva a Mis remates.
              </p>
              <a href={`/`} className="button button-dark me-3">
                <i className="fas fa-gavel"></i> Volver a inicio
              </a>
              <a
                href="/consignatarios/mis-remates"
                className="button button-light me-3"
              >
                <i className="fas fa-gavel"></i> Volver a mis remates
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

export default LotEdited;
