import React from 'react';
import './component.css';

const WebsiteTop1 = () => {
  return (
    <div className="container-fluid web_top1">
      <div className="row">
        <div className="col-1"></div>
        <div className="col-sm-10">
          <h3 className="Website_heading1">Why Choose Hypertonic</h3>
          <hr className="web_line1" />
          <ol>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Expertise: </span> Our team comprises seasoned professionals with extensive experience in website development. From frontend design to backend programming, we have the expertise to bring your vision to life and deliver exceptional results.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Fully Responsive: </span> With our responsive design, your website effortlessly adjusts to all screen sizes, ensuring seamless access for new clients on mobile phones, tablets, and desktop computers. No matter where they are, your audience will experience your site at its best.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Free Hosting: </span> At Hypertonic, we believe in making web hosting accessible to everyone. That's why we're excited to offer you our free hosting service, designed to provide you with a reliable platform to launch your website without any upfront costs. <a href="contact.php">T&C</a>
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Free Maintenance: </span> We're excited to offer you our free maintenance service, designed to keep your website running smoothly without any additional fees. <a href="contact.php">T&C</a>
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">24*7 Service: </span> Whether it's the middle of the night or a holiday weekend, our team is here for you 24 hours a day, 7 days a week. You can count on us to be there when you need assistance the most.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Custom Solutions: </span> We believe in tailor-made solutions that cater to the unique needs and objectives of each client. Whether you're a startup looking to establish your online presence or a large corporation seeking to revamp your existing website, we have the skills and creativity to deliver custom solutions that exceed your expectations.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Cutting-Edge Technologies: </span> We stay abreast of the latest trends and technologies in website development to ensure that our clients benefit from the most advanced solutions available. From responsive design to interactive user interfaces, we leverage cutting-edge technologies to create websites that are not just visually stunning but also highly functional and user-friendly.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Scalability and Flexibility: </span> We understand that businesses evolve over time, and so should their websites. That's why we design our websites with scalability and flexibility in mind, allowing for easy updates, additions, and modifications as your business grows and evolves.
              </p>
            </li>
          </ol>
        </div>
        <div className="col-1"></div>
      </div>
    </div>
  );
};

export default WebsiteTop1;
