import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import './styles.scss'

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
          <Title title='¿Qué desea hacer?' />
          <div className="row">
            <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
              <a href="/admin/crear-remate-vivo">
              <i className="fas fa-signal me-2"></i> Crear remate en vivo
              </a>
            </div>
            <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
              <a href="/admin/remates-vivo">
              <i className="fas fa-signal me-2"></i>Ver remates en vivo
              </a>
            </div>
            <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
              <a href="/admin/usuarios">
              <i className="fas fa-users me-2"></i>Ver usuarios activos
              </a>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};
