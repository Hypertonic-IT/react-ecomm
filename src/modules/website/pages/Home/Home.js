import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Section from "../../components/Section/Component";
import Section1 from "../../components/Section1/Component";
import Section2 from "../../components/Section2/Component";
import Section3 from "../../components/Section3/Component";
import Section5 from "../../components/Section5/Component";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <>
      <Helmet>
        <title>
          Hypertonic IT Solutions | Expert IT Services for Website & App
          Development
        </title>
        <meta
          name="description"
          content="Expert website and app development, server management, and custom software solutions by Hypertonic IT Solutions. Helping businesses grow with tailored IT services."
        />
        <meta
          name="keywords"
          content="IT Solutions, Web Development, Mobile Apps, Custom Software Solutions, IT Services, Hypertonic IT, Server Management"
        />
      </Helmet>
      <Nav />
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section5 />
      <Footer />
    </>
  );
}

export default Home;
