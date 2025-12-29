import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section25 from "../../components/Section25/Component";

const Software = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Hypertonic IT Solutions</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Hypertonic IT Solutions to understand how we collect, use, and protect your data when you use our website and services."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Data Protection, Privacy, Hypertonic IT Solutions"
        />
      </Helmet>
      <Nav />
      <Section25 />
      <Footer />
    </>
  );
};

export default Software;
