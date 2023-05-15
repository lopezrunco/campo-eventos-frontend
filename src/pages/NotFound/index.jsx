import { motion } from "framer-motion";
import React from "react";
import { NotFoundMessage } from "../../components/NotFoundMessage";
import { Header } from "../../components/Header";
import { homeMenuItems } from "../../data/home-menu";

export const NotFound = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Header menuItems={homeMenuItems} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <section>
          <NotFoundMessage />
        </section>
      </motion.div>
    </React.Fragment>
  );
};
