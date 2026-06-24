import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import Section21 from "../../components/Section21/Component";
import Section5 from "../../components/Section5/Component";
import Section23 from "../../components/Section23/Component";

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us - Kayaroop</title>
        <meta
          name="description"
          content="Get in touch with Kayaroop for inquiries about our latest fashion collections, clothing products, orders, and customer support. We're here to help you with all your fashion needs."
        />
      </Helmet>
      <Nav />
      <Section21 />
      <Section5 />
      <Section23 />

      <Footer />
    </>
  );
}

export default Contact;
