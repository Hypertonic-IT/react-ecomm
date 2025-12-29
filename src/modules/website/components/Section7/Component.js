import React from 'react';
import './component.css'; // Import CSS file for styling

const TopAbout = () => {
  return (
    <div className="container-fluid top_about">
      <div className="row">
        <div className="col-sm-1"></div>
        <div className="col-sm-10">
          <div className="row my_reveers">
            <div className="col-lg-6">
              <h2 className="about_title_heading">Your Partner for Software Innovation</h2>
              <p className="about_titel">Hypertonic It Solutions is the partner of choice for many of the world’s leading enterprises, SMEs, and technology challengers. We help businesses elevate their value through custom software development, product design, QA, and consultancy services.</p>
              <p className="about_titel">What sets us apart is our unwavering commitment to excellence. We adhere to strict timelines and maintain meticulous project management to ensure timely delivery without compromising on quality. Our success is reflected in the satisfaction of our clients, who consistently commend us for our reliability, professionalism, and outstanding results.</p>
            <p className="about_titel">Thank you for choosing Hypertonic IT Solution Pvt Ltd, where your success is our mission.</p>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <div className="col-sm-6 col-6">
                  <img src="img/2.png" className="img-fluid clarity_img" alt="Clarity Image" />
                </div>
                <div className="col-sm-6 col-6">
                  <img src="img/3.png" className="img-fluid silhoiuette_img" alt="Silhouette Image" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 col-6">
                  <img src="img/4.png" className="img-fluid stand_img" alt="Stand Image" />
                </div>
                <div className="col-sm-6 col-6">
                  <img src="img/5.png" className="img-fluid join_img" alt="Join Image" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
};

export default TopAbout;
