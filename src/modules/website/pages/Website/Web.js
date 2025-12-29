import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import Section9 from '../../components/Section9/Component';
import Section10 from '../../components/Section10/Component';
import Section11 from '../../components/Section11/Component';
import Section12 from '../../components/Section12/Component';

const Web = () => {
  return (
    <>
      <Nav />
      <Section9 />
      <Section10 />
      <Section11 />
      <Section12 />

      <Footer />
      </>
  );
}

export default Web;
