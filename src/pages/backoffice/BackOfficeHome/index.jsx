import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../../components/Breadcrumbs";

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
            <div className="row">
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Remates</h3>
                <div className="separator"></div>
                <a href="/consignatarios/crear-remate">
                  <i className="fas fa-gavel me-2"></i> Crear remate
                </a>
                <a href="/admin/remates">
                  <i className="fas fa-list me-2"></i>Listar remates
                </a>
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Artículos</h3>
                <div className="separator"></div>
                <a href="/autor/articulos/crear">
                  <i className="fas fa-file me-2"></i> Crear artículo
                </a>
                <a href="/autor/articulos/listar">
                  <i className="fas fa-list me-2"></i>Listar artículos
                </a>
                <a href="/autor/articulos/categorias/crear">
                  <i className="fas fa-folder-plus me-2"></i>Crear categoría
                </a>
                <a href="/autor/articulos/categorias/listar">
                  <i className="fas fa-list me-2"></i>Listar categorías
                </a>
                <a href="/autor/articulos/etiquetas/listar">
                  <i className="fas fa-tags me-2"></i>Listar etiquetas
                </a>
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Publicidad</h3>
                <div className="separator"></div>
                <a href="/admin/publicidad/crear">
                  <i className="fas fa-bullhorn me-2"></i> Crear publicidad
                </a>
                <a href="/admin/publicidad/listar">
                  <i className="fas fa-list me-2"></i>Listar publicidades
                </a>
                <a href="/admin/publicidad/ayuda">
                  <i className="fas fa-info-circle me-2"></i>Ayuda
                </a>
              </div>
              <div className="col-12 col-lg-3 mb-5 mb-lg-0 admin-home-card">
                <h3>Usuarios</h3>
                <div className="separator"></div>
                <a href="/admin/usuarios">
                  <i className="fas fa-users me-2"></i>Listar usuarios
                </a>
              </div>
            </div>
          </article>
        </section>
      </motion.div>
    </React.Fragment>
  );
};
