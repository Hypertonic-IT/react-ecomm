import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section6 from "../../components/Section6/Component";
import Section7 from "../../components/Section7/Component";
import Section8 from "../../components/Section8/Component";

function About() {
  return (
    <>
      <Helmet>
        <title>About Us - Hypertonic IT Solutions</title>
        <meta
          name="description"
          content="Learn more about Hypertonic IT Solutions, a leading provider of expert IT services including website development, app development, and custom software solutions."
        />
      </Helmet>
      <Nav />
      <Section6 />
      <Section7 />
      <Section8 />
      <Footer />
    </>
  );
}

export default About;
