import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section24 from "../../components/Section24/Component";

const Software = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions - Kayaroop IT Solutions</title>
        <meta
          name="description"
          content="Read the Terms and Conditions of Kayaroop IT Solutions. Understand our policies for website usage, services, and privacy."
        />
        <meta
          name="keywords"
          content="Terms and Conditions, Website Usage, Policies, Kayaroop IT Solutions"
        />
      </Helmet>
      <Nav />
      <Section24 />
      <Footer />
    </>
  );
};

export default Software;
