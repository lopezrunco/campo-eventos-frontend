import React from "react";
import { Intro } from "../../components/Intro";
import { ScrollTop } from "../../components/ScrollTop";

export const Home = () => {
  return (
    <React.Fragment>
      <Intro />
      <ScrollTop scrollTo={"#top"} />
    </React.Fragment>
  );
};
