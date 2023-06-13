import { motion } from "framer-motion";
import React from "react"

import { Breadcrumbs } from "../../../components/Breadcrumbs";

function ConsigneesHomePage() {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Consignatarios"} />
      </motion.div>
    <section className="container">
      <article className="row">
        <div className="col">
          <a href="/consignatarios/mis-remates" className="button button-dark">Mis remates</a>
        </div>
      </article>
    </section>
    </React.Fragment>
  )
}

export default ConsigneesHomePage