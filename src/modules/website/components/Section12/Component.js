import React from 'react';
import './component.css';
const WebsiteTop1 = () => {
  return (
    <div className="container-fluid web_top1">
      <div className="row">
        <div className="col-sm-1"></div>
        <div className="col-sm-10">
          <p className="Website_heading1">Our Website Development Services Include:</p>
          <hr className="web_line1" />
          <ol>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Custom Website Design:</span>
                We specialize in creating bespoke website designs that reflect your brand identity and resonate with your target audience. Whether you prefer a minimalist aesthetic or a bold and vibrant design, we'll work closely with you to create a visually captivating website that sets you apart from the competition.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Backend Development:</span>
                Our team of backend developers possesses expertise in a wide range of programming languages and frameworks, allowing us to build robust and scalable backend systems that power your website's functionality seamlessly.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">E-commerce Solutions:</span>
                In the era of online shopping, having an e-commerce website that delivers a seamless shopping experience is essential for success. We offer end-to-end e-commerce solutions, from customizing existing platforms like Shopify and WooCommerce to developing bespoke e-commerce websites tailored to your specific requirements.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Content Management Systems (CMS):</span>
                We empower our clients with easy-to-use content management systems that allow them to update and manage their website content effortlessly. Whether you prefer WordPress, Joomla, or Drupal, we'll help you choose the right CMS for your needs and provide comprehensive training and support to ensure smooth operation.
              </p>
            </li>
            <li className="li-no">
              <p className="Website_subcontent">
                <span className="content_heading">Website Maintenance and Support:</span>
                Our commitment to client satisfaction extends beyond the initial website development phase. We offer ongoing maintenance and support services to ensure that your website remains secure, up-to-date, and optimized for peak performance at all times.
              </p>
            </li>
          </ol>
        </div>
        <div className="col-sm-1"></div>
      </div>
    </div>
  );
};

export default WebsiteTop1;
