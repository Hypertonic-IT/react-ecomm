import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './component.css'; // Import CSS file for styling

const CarouselSection = () => {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    counters.forEach((counter) => {
      counter.innerText = "0";
  
      const updateCounter = () => {
        const target = Number(counter.getAttribute("data-target"));
        const c = Number(counter.innerText);
        const increment = target / 500;
  
        if (c < target) {
          counter.innerText = `${Math.ceil(c + increment)}`;
          setTimeout(updateCounter, 1);
        } else {
          counter.innerText = target;
        }
      };
  
      updateCounter();
    });
  }, []);

  return (
    
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10 background-clr">
              <div className="row">
                <div className="col-sm-12">
                <h5 className="crousel_text_headung1">What We Actually Do</h5>
                <hr className="heading_line1"></hr>
                </div>
              </div>
              <div className="row top-rw">
                <div className="col-lg-6">
                  <img src="img/mewe.png" className="img-fluid" alt="Startup Image" />
                </div>
                
                <div className="col-lg-6">
                <div className="siderrr">
                  
                  <div id="demo" className="carousel slide" data-bs-ride="carousel">
                    {/* Indicators */}
                    <ul className="carousel-indicators">
                      <li data-bs-target="#demo" data-bs-slide-to="0" className="active"></li>
                      <li data-bs-target="#demo" data-bs-slide-to="1"></li>
                      <li data-bs-target="#demo" data-bs-slide-to="2"></li>
                      <li data-bs-target="#demo" data-bs-slide-to="3"></li>
                      <li data-bs-target="#demo" data-bs-slide-to="4"></li>
                    </ul>
                    
                    {/* The slideshow */}
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <p className="about_Website">Website Development Services</p>
                        <p className="about_Website_sub">At Hypertonic It Solutions, we recognize that a well-designed, functional website is essential for establishing a strong online presence. As digital platforms become increasingly vital, having a professionally crafted website is now a necessity for businesses of all sizes and industries.</p>
                        <Link to="/web"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      <div className="carousel-item">
                        <p className="about_Website">App Development Services</p>
                        <p className="about_Website_sub">At Hypertonic It Solutions, we craft high-quality, innovative mobile apps for Android and iOS. Our experienced team is dedicated to bringing your app ideas to life, delivering user-friendly results that align with your business goals and exceed expectations.</p>
                        <Link to="/app"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      <div className="carousel-item">
                        <p className="about_Website">Software Development Services</p>
                        <p className="about_Website_sub">At Hypertonic It Solutions, we provide tailored software development solutions for businesses across industries. Our skilled developers deliver high-quality, custom software that empowers clients to streamline operations, enhance productivity, and achieve their business goals.</p>
                        <Link to="/software"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      <div className="carousel-item">
                        <p className="about_Website">Social Media Management</p>
                        <p className="about_Website_sub">Effective social media management is essential for maintaining a strong online presence. It ensures consistent engagement with your audience, helps build a loyal community, and keeps your brand relevant in a rapidly evolving digital landscape. It also allows you to adapt quickly to trends and audience needs.</p>
                        <Link to="/smm"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      <div className="carousel-item">
                        <p className="about_Website">Social Media Social Media</p>
                        <p className="about_Website_sub">Social media marketing is an incredibly powerful tool for expanding your reach and attracting new audiences. By leveraging targeted ads and well-planned strategic campaigns, you can generate high-quality leads, enhance brand visibility, and achieve a measurable return on investment (ROI) that drives business success.</p>
                        <Link to="/social"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      <div className="carousel-item">
                        <p className="about_Website">Advertising and Promotions</p>
                        <p className="about_Website_sub">Advertising and promotions are essential for increasing brand visibility and attracting potential customers. They enable your business to stand out in a crowded market, boost brand recognition, and effectively drive traffic to your website or physical location, ultimately supporting long-term growth and success.</p>
                        <Link to="/addvertise"><button className="btn btn_aboutRead_more">Read More</button></Link>
                      </div>
                      
                    </div>
                    
                    {/* Left and right controls */}
                    <a className="carousel-control-prev" href="#demo" role="button" data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </a>
                    <a className="carousel-control-next" href="#demo" role="button" data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </a>
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

export default CarouselSection;
