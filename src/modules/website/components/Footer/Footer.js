import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css"; // Import CSS file for styling

const Footer = () => {

    const location = useLocation();
    useEffect(() => {window.scrollTo(0, 0);  }, [location]);  

    const containerStyle = {
      position: "fixed",
      bottom: "20px",
      right: "10px",
      zIndex: 6,
      left: "initial",
    };

    const date = new Date();

  return (
    <>
      <div className="container-fluid bck-clr">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <center>
              <img
                src="img/logo.webp"
                className="img-fluid logo_img"
                alt="Hypertonic Logo"
              />
            </center>
          </div>
          {/* <div className="col-1 dis"></div> */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-6">
            <h1 className="head-ingtop">Links</h1>
            <Link to="/">
              <p className="footer_tabs">Home</p>
            </Link>
            <Link to="/about">
              <p className="footer_tabs">About</p>
            </Link>
            <Link to="/contact">
              <p className="footer_tabs">Contact</p>
            </Link>
            <Link to="/portfolio">
              <p className="footer_tabs">Portfolio</p>
            </Link>
            <Link to="/privacy">
              <p className="footer_tabs">Privacy</p>
            </Link>
            <Link to="/term">
              <p className="footer_tabs">Terms & Conditions</p>
            </Link>
          </div>
          <div className="col-lg-2 col-md-6 col-sm-6 col-6 myf_top">
            <h1 className="head-ingtop">Services</h1>
            <Link to="/uiux">
              <p className="footer_tabs">UI/UX Design</p>
            </Link>
            <Link to="/website">
              <p className="footer_tabs">Website Development</p>
            </Link>
            <Link to="/app">
              <p className="footer_tabs">App Development</p>
            </Link>
            <Link to="/software">
              <p className="footer_tabs">Software Developmet</p>
            </Link>
            <Link to="/webapp">
              <p className="footer_tabs">Web App Development</p>
            </Link>
            <Link to="/saas">
              <p className="footer_tabs">Saas Platform </p>
            </Link>
            <Link to="/smm">
              <p className="footer_tabs">Social Media Management</p>
            </Link>
            <Link to="/social">
              <p className="footer_tabs">Social Media Marketing</p>
            </Link>
            <Link to="/addvertise">
              <p className="footer_tabs">Advertising and Promotions</p>
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-6 myf_top">
            <div className="footer-flx">
              {/* <div><i className="ri-global-line"></i></div> */}
              <div><i class="ri-map-pin-2-fill"></i></div>
              <div className="ftr-txt-top">
                <p className="address">Plot No. 5B, Sector - 15A, First Floor, Neelam Ajronda Chowk Metro Station, Faridabad, Haryana 121007</p>
              </div>
            </div>
            <div className="footer-flx">
              <div><i className="ri-mail-fill"></i></div>
              <div className="ftr-txt-top">
                <p className="address">info@hypertonic.co.in</p>
                <p className="address">hypertonicitsolutions@gmail.com</p>
              </div>
            </div>
            <div className="footer-flx">
              <div><i className="ri-phone-fill"></i></div>
              <div className="ftr-txt-top">
                <p className="address">+91-9650301229</p>
                <p className="address">+91-8130501014</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bck-copy-right">
        <div className="row ">
          <div className="col-sm-12">
            <p className="copy_right">
              Copyright © {date.getFullYear()} Hypertonic It Solutions. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
      <div className="fixed-bottom" style={containerStyle}>
        <a
          href="https://wa.me/9650301229"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="img/whats-app.webp"
            className="img-fluid"
            width="60"
            height="auto"
            alt="Processing"
          />
        </a>
      </div>
      <div className="fix_middle-use">
        <a href="tel:+91 9650301229">
          <div className="box1">
            <p>
              <i className="ri-phone-line icon1"></i>
            </p>
            {/* Call Us */}
          </div>
          <div className="white1"></div>
        </a>

        <a href="mailto:hypertonicitsolutions@gmail.com">
          <div className="box2">
            <p>
              <i className="ri-mail-send-fill icon1"></i>
            </p>
            {/* Mail Us */}
          </div>
          <div className="white2"></div>
        </a>
      </div>
    </>
  );
};

export default Footer;
