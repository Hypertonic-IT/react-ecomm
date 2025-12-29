import React from 'react';
import { Link } from 'react-router-dom';
import './component.css';
const VideoComponent = () => {
  return (
    <div className="container-fluid Portfolio-top">
      <div className="row">
        <div class="col-lg-1"></div>
        <div class="col-lg-10">
          <div className="portfolio-flex">
            <div>
              <p className="about_heading"> Portfolio</p>
              <hr className="heading_line"></hr>

            </div>
            <div>
              <Link to="/portfolio">
                <p className="about_heading1">View All</p>
              </Link>

            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="portfolio_card">

                <img src="img/bejoho.webp" className="img-fluid port_img" alt="Hypertonic IT Solutions"></img>
                <div class="overlay">
                  <a href="https://bejoho.com" target="_blank" rel="noopener noreferrer"><div class="text">bejoho.com</div></a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="portfolio_card">

                <img src="img/pezose.webp" className="img-fluid port_img"alt="Hypertonic IT Solutions"></img>
                <div class="overlay">
                  <a href="https://pezos.in/" target="_blank" rel="noopener noreferrer">
                    <div class="text">pezos.in</div>
                  </a>
                </div>

              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="portfolio_card">

                <img src="img/yugo.webp" className="img-fluid port_img" alt="Hypertonic IT Solutions"></img>
                <div class="overlay">
                  <a href="https://theyugo.in" target="_blank" rel="noopener noreferrer">
                    <div class="text">theyugo.in</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-6">
              <div className="portfolio_card">

                <img src="img/kdp1.webp" className="img-fluid port_img" alt="Hypertonic IT Solutions"></img>
                <div class="overlay">
                  <a href="https://kdp-architects.ai/" target="_blank" rel="noopener noreferrer">
                    <div class="text">kdp-architects.ai</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-1"></div>

      </div>
    </div>
  );
};

export default VideoComponent;

