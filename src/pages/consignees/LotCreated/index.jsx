import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import React from "react";

import imgUrl from '../../../assets/success.gif'

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function LotCreated() {
  const { id } = useParams();

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Lote creado"} />
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
              <h3>El lote ha sido creado</h3>
              <div className="separator"></div>
              <p>
                El lote ha sido creado, para agregar más lotes, vuelva al
                remate.
              </p>

              <a
                href="/consignatarios/mis-remates"
                className="button button-light me-3"
              >
                <i className="fas fa-gavel"></i> Volver a mis remates
              </a>
              <a
                href={`/consignatarios/mis-remates/${id}`}
                className="button button-dark"
              >
                <i className="fas fa-gavel"></i> Volver a remate
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

export default LotCreated;
