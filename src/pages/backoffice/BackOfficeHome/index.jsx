import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { Title } from "../../../components/Title";

import "./styles.scss";

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        viewport={{ once: true }}
      >
        <section className="backoffice-home-page">
          <article className="container">
            <Title title="¿Qué desea hacer?" />
            <div className="row">
              <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
                <a href="/consignatarios/crear-remate">
                  <i className="fas fa-plus me-2"></i> Crear remate
                </a>
              </div>
              <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
                <a href="/admin/remates">
                  <i className="fas fa-list me-2"></i>Lista de remates
                </a>
              </div>
              <div className="col-12 col-lg-4 offset-lg-4 admin-home-card">
                <a href="/admin/usuarios">
                  <i className="fas fa-users me-2"></i>Usuarios activos
                </a>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
