import { motion } from "framer-motion";
import React from "react";

import {
  ALL,
  CONTENT_LEFT,
  CONTENT_RIGHT,
  DARK,
  IMG_TITLE,
} from "../../utils/blog-card-types";

import { Intro } from "../../components/Intro";
import { LastPosts } from "./components/LastPosts";
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

      <LastPosts
        bgClass="bg-light"
        containerClass="container"
        btnClass="button-dark-outline"
        items="3"
        colClass={"col-lg-4"}
        cardType={ALL}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button-dark"
        category="Zafras"
        items="2"
        colClass={"col-lg-6"}
        cardType={ALL}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-light"
        containerClass="container"
        btnClass="button button-dark-outline"
        category="Ferias"
        items="3"
        colClass={"col-12"}
        cardType={CONTENT_RIGHT}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button button-dark"
        category="Pantalla"
        items="2"
        colClass={"col-lg-6"}
        cardType={IMG_TITLE}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-light"
        containerClass="container"
        btnClass="button button-dark"
        category="Equinos"
        items="3"
        colClass={"col-lg-12"}
        cardType={CONTENT_LEFT}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-md-light"
        containerClass="container"
        btnClass="button button-light-outline"
        category="Eventos"
        items="2"
        colClass={"col-lg-12"}
        cardType={DARK}
        showTitle={true}
      />
      <PostsByCategory
        bgClass="bg-image"
        containerClass="container-fluid"
        btnClass="button button-dark"
        category="Sociales"
        items="3"
        colClass={"col-lg-4"}
        cardType={IMG_TITLE}
        showTitle={false}
        showBanner={true}
      />
    </React.Fragment>
  );
};
