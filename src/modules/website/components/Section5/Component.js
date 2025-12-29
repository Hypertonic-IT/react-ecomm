import React, { useState } from "react";
import "./component.css";
import { url } from "../../../../lib/lib";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "email") setEmail(value);
    if (id === "number") setPhone(value);
    if (id === "message") setMessage(value);
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert("Name is required.");
      return false;
    }
    if (!email.trim()) {
      alert("Email is required.");
      return false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      alert("Invalid email address.");
      return false;
    }
    if (!phone.trim()) {
      alert("Phone number is required.");
      return false;
    } else if (!/^(\+?\d{1,4}[\s-]?)?(\d{10})$/.test(phone)) {
      alert(
        "Phone number must be 10 digits and can include country code like +91."
      );
      return false;
    }
    if (!message.trim()) {
      alert("Message is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formData = {
      name,
      email,
      phone,
      message,
    };

    // Send POST request to backend API
    try {
      // const response = await fetch('http://localhost:5000/submit', {
      const response = await fetch(url + "/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        alert("Error sending message.");
      }
    } catch (error) {
      alert("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid top_contact">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-10">
            <div className="row">
              <div className="col-sm-12">
                <p className="about_heading">Contact Us</p>
                <hr className="heading_line"></hr>
              </div>
            </div>
            <div className="row form_top">
              <div className="col-lg-5">
                <p className="contact_titel">
                  Ready to take your digital presence to the next level? Contact
                  us today to discuss your project requirements and learn how we
                  can help you achieve your goals.
                </p>
                <div className="row contact_card">
                  <div className="col-sm-1 col-1">
                    <i className="ri-global-line"></i>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-sm-10 col-9">
                    <p className="contact_headIn_g">Our Address:</p>
                    <p className="contact_address">
                      Plot No. 5B, Sector - 15A, First Floor, Neelam Ajronda
                      Chowk Metro Station, Faridabad, Haryana 121007
                    </p>
                  </div>
                </div>
                <div className="row contact_card">
                  <div className="col-sm-1 col-1">
                    <i className="ri-mail-fill"></i>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-sm-10 col-9">
                    <p className="contact_headIn_g">Our Mailbox:</p>
                    <p className="contact_address">info@hypertonic.co.in</p>
                    <p className="contact_address">
                      hypertonicitsolutions@gmail.com
                    </p>
                  </div>
                </div>
                <div className="row contact_card">
                  <div className="col-sm-1 col-1">
                    <i className="ri-phone-fill"></i>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-sm-10 col-9">
                    <p className="contact_headIn_g">Our Phone:</p>
                    <p className="contact_address">+91-8130501014</p>
                    <p className="contact_address">+91-8448532785</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-1"></div>
              <div className="col-lg-6 side_padd">
                <div className="form_card">
                  <h3 className="redy_get">Ready to Get Started?</h3>
                  <input
                    type="Name"
                    className="contact_form_field"
                    id="name"
                    value={name}
                    onChange={handleInputChange}
                    placeholder="Your Name *"
                  />
                  <input
                    type="Email"
                    className="contact_form_field"
                    id="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Your Email *"
                  />
                  <input
                    type="Phonenumber"
                    className="contact_form_field"
                    id="number"
                    value={phone}
                    onChange={handleInputChange}
                    placeholder="Your Phone No *"
                  />
                  <textarea
                    cols="40"
                    rows="7"
                    className="contact_form_textarea"
                    aria-invalid="false"
                    placeholder="Message..."
                    id="message"
                    value={message}
                    onChange={handleInputChange}
                    name="your-message"
                  ></textarea>
                  <button
                    onClick={handleSubmit}
                    className={`octf-btn octf-btn-light has-spinner btn ${
                      loading ? "btn-loading" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
    </>
  );
};

export default Contact;
