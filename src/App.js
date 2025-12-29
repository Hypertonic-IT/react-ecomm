import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Home from "./modules/website/pages/Home/Home";
import About from "./modules/website/pages/About/About";
import Website from "./modules/website/pages/Website/Web";
import Appdevelopment from "./modules/website/pages/Appdevelopment/Appdevelopment";
import Webapp from "./modules/website/pages/Webapp/Webapp";
import Saas from "./modules/website/pages/Saas/Saas";
import Uiux from "./modules/website/pages/Uiux/Uiux";
import Smm from "./modules/website/pages/Smm/Smm";
import Social from "./modules/website/pages/Social/Social";
import Addvertise from "./modules/website/pages/Addvertise/Addvertise";
import Software from "./modules/website/pages/Software/Software";
import Portfolio from "./modules/website/pages/Portfolio/Portfolio";
import Contact from "./modules/website/pages/Contact/Contact";
import Term from "./modules/website/pages/Term/Term";
import Privacy from "./modules/website/pages/Privacy/Privacy";
import NotFound from "./modules/website/pages/NotFound/NotFound";

import "./App.css";
import "./fonts/taile.ttf";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/website" element={<Website />} />
        <Route path="/app" element={<Appdevelopment />} />
        <Route path="/software" element={<Software />} />
        <Route path="/webapp" element={<Webapp />} />
        <Route path="/saas" element={<Saas />} />
        <Route path="/uiux" element={<Uiux />} />
        <Route path="/smm" element={<Smm />} />
        <Route path="/social" element={<Social />} />
        <Route path="/addvertise" element={<Addvertise />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/term" element={<Term />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
