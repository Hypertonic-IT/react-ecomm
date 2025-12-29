import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section24 from "../../components/Section24/Component";

const Software = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Hypertonic IT Solutions</title>
        <meta
          name="description"
          content="Read the Terms and Conditions of Hypertonic IT Solutions. Understand our policies for website usage, services, and privacy."
        />
        <meta
          name="keywords"
          content="Terms and Conditions, Website Usage, Policies, Hypertonic IT Solutions"
        />
      </Helmet>
      <Nav />
      <Section24 />
      <Footer />
    </>
  );
};

export default Software;
