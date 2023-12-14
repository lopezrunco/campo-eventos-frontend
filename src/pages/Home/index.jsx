import { motion } from "framer-motion";
import React from "react";

import { LastPosts } from "./components/LastPosts";
import { Intro } from "../../components/Intro";
import { PostsByCategory } from "./components/PostsByCategory";

export const Home = () => {
  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Intro />
      </motion.div>
      <LastPosts />
      <PostsByCategory category="Zafras" items="2" colClass={"col-lg-6"} />
      <PostsByCategory category="Ferias" items="3" colClass={"col-lg-4"} />
      <PostsByCategory category="Pantalla" items="2" colClass={"col-lg-6"} />
      <PostsByCategory category="Equinos" items="3" colClass={"col-lg-4"} />
      <PostsByCategory category="Eventos" items="6" colClass={"col-lg-6"} />
      <PostsByCategory category="Sociales" items="6" colClass={"col-lg-4"} />
    </React.Fragment>
  );
};
