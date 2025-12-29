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
        <title>Contact Us - Hypertonic IT Solutions</title>
        <meta name="description" content="Get in touch with Hypertonic IT Solutions for expert IT services, including website development, app development, and custom software solutions." />
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
