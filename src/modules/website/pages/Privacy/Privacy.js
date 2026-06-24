import React from "react";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section25 from "../../components/Section25/Component";

const Software = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Kayaroop</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Kayaroop to understand how we collect, use, and protect your personal information when you browse our website, shop for products, or use our services."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Data Protection, Customer Privacy, Online Shopping Privacy, Kayaroop"
        />
      </Helmet>
      <Nav />
      <Section25 />
      <Footer />
    </>
  );
};

export default Software;
