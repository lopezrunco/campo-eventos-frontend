import { motion } from "framer-motion";
import React from "react";

import { Breadcrumbs } from "../../components/Breadcrumbs";
import { ServicesGrid } from "./components/ServicesGrid";
import { ScrollTop } from "../../components/ScrollTop";

export const Servicios = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Servicios"} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4 }}
        viewport={{ once: true }}
      >
        <ServicesGrid />
      </motion.div>
      <ScrollTop scrollTo={"#top"} />
    </React.Fragment>
  );
};
