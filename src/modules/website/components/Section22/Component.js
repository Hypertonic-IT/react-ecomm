import React from 'react';
import './component.css';
const ContactDetails = () => {
  return (
    <div className="container top_contact">
      <div className="row">
        <div className="col-sm-5">
          <p className="contact-details">// CONTACT DETAILS</p>
          <h2 className="contact_detail1">Contact Us</h2>
          <p className="contact_titel">Ready to take your digital presence to the next level?
            Contact us today to discuss your project requirements and
            learn how we can help you achieve your goals.</p>

          <div className="row contact_card">
            <div className="col-sm-1 col-1"><i className="ri-global-line"></i></div>
            <div className="col-1"></div>
            <div className="col-sm-10 col-9">
              <p className="contact_headIn_g">Our Address:</p>
              <p className="contact_address">Plot No. 5B, Sector - 15A, First Floor, Neelam Ajronda Chowk Metro Station, Faridabad, Haryana 121007</p>
            </div>
          </div>
          <div className="row contact_card">
            <div className="col-sm-1 col-1"><i className="ri-mail-fill"></i></div>
            <div className="col-1"></div>
            <div className="col-sm-10 col-9">
              <p className="contact_headIn_g">Our Mailbox:</p>
              <p className="contact_address">info@hypertonic.co.in</p>
              <p className="contact_address">hypertonicitsolutions@gmail.com</p>
            </div>
          </div>
          <div className="row contact_card">
            <div className="col-sm-1 col-1"><i className="ri-phone-fill"></i></div>
            <div className="col-1"></div>
            <div className="col-sm-10 col-9">
              <p className="contact_headIn_g">Our Phone:</p>
              <p className="contact_address">+91-8130501014</p>
              <p className="contact_address"> +91-8448532785</p>
            </div>
          </div>
        </div>
        <div className="col-1"></div>
        <div className="col-sm-6">
          <div className="form_card">
            <h3 className="redy_get">Ready to Get Started?</h3>
            <input type="Name" className="contact_form_field" id="name" placeholder="Your Name *" />
            <input type="Email" className="contact_form_field" id="email" placeholder="Your Email *" />
            <input type="Phonenumber" className="contact_form_field" id="number" placeholder="Your Phone No *" />
            <textarea cols="40" rows="7" className="contact_form_textarea" aria-invalid="false" placeholder="Message..." name="your-message"></textarea>
            <button type="submit" className="octf-btn octf-btn-light has-spinner">Send Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
