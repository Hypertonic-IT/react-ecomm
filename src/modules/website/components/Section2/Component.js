import React from 'react';
import './component.css';

const AppDevelopment = () => {
  return (
    <div className="container-fluid about_top">
      <div className="row">
        <div className="col-lg-1"></div>
        <div className="col-lg-10">
          <p className="about_heading">Our Services</p>
          <hr className="heading_line"></hr>
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/uiux.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div className='my_section'>
                 <p className="ui_uxtext">UI/UX Design</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Create engaging, user-friendly interfaces that enhance user experience and drive satisfaction. Expert in intuitive design and seamless navigation.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/webdevlopment.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Web Development</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Professional web development services providing responsive design, e-commerce solutions, SEO optimization, and custom applications to elevate your online presence.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/mobileapp.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Mobile App Development</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Expert mobile development services to create innovative, user-friendly apps for iOS and Android, enhancing your digital presence and engagement.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/webapp.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Web App Development</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Creating robust, scalable web applications to enhance user experience, streamline operations, and drive business growth seamlessly.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/software-development.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Software Development</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Innovative software development solutions, delivering robust, scalable, and customized applications to meet your unique business needs efficiently.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/saas.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Saas Platform Development</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Empower your business with our cutting-edge SaaS platform development services. Scalable, secure, and tailored solutions for unparalleled efficiency.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/social-media.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Social Media Management</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Strategically managing and curating online content to enhance brand visibility, engage audiences, and drive growth across various social media platforms.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/maketing.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Social Media Marketing</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Leveraging social platforms to promote brands, drive engagement, and increase sales through targeted content, advertising, and audience interaction.</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
              <div className="card_service">
                <div className="card_flex">

                <div className="img_border">
                  <img src="img/paid-ads.webp"className="img-fluid icon_img" alt="Hypertonic IT Solutions"></img>
                </div>
                <div>
                 <p className="ui_uxtext">Advertising and Promotions</p>
                </div>
                </div>
                <div>
                  <p className="info_text">Crafting and executing targeted campaigns to increase brand awareness, drive sales, and enhance customer engagement across various channels.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-1"></div>
      </div>
           
    </div>
  );
};

export default AppDevelopment;