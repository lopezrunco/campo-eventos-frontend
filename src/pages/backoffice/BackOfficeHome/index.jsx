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
            <div className="col">
              <h2>administracion</h2>
            </div>
          </div>
        </article>
      </section>
    </React.Fragment>
  );
};
