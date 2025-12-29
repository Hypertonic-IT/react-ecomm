import React from 'react';
import './component.css';
import { Link } from 'react-router-dom';

const AppDevelopment = () => {
  return (
    <div className="container-fluid about_top">
      <div className="row">
        <div className="col-lg-1"></div>
        <div className="col-lg-10">
          <h2 className="about_heading">About Us</h2>
          <hr className="heading_line"></hr>
          <div className="row padd__inng">
            <div class="col-md-6">
              <p className="we_comme">Welcome to Hypertonic IT Solution Pvt Ltd!</p>
              <p className="main_abouttitle">At Hypertonic, we are dedicated to transforming your ideas into innovative digital solutions.
                With a keen focus on software development, app development, and website development, we leverage
                our diverse expertise to deliver high-quality services tailored to your specific needs.</p>
              <p className="main_abouttitle">Our team comprises skilled professionals proficient in the latest technologies and best practices. We believe in the power of collaboration and work closely with our clients to ensure their visions are realized with precision and creativity.
              </p>
              <Link to="/about"><button className="readaboutbtn">Read More</button></Link>
            </div>
            <div class="col-md-6">
              <img src="img/about.webp" className="img-fluid about_immg" alt='Processing'></img>
            </div>
          </div>
        </div>
        <div className="col-lg-1"></div>
      </div>

    </div>
  );
};

export default AppDevelopment;