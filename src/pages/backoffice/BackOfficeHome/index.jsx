import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

export const BackOfficeHome = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Administración"} />
      </motion.div>
      <section className="backoffice-home-page">
        <article className="container">
          <div className="row">
            <h3>Remates</h3>
            <div className="col-lg-3">
              <a href="/admin/crear-remate-vivo" className="card p-3 mb-3">
                Crear remate en vivo
              </a>
            </div>
            <div className="col-lg-3">
              <a href="/admin/remates-vivo" className="card p-3 mb-3">
                Ver remates en vivo
              </a>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};
