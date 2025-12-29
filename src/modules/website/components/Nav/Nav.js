import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css'; // Import CSS file for styling

const Navbar = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 991);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDropdownHover = (e) => {
    if (isDesktop) {
      const dropdownMenu = e.currentTarget.querySelector('.sm-menu');
      dropdownMenu.style.display = 'block';
    }
  };

  const handleDropdownLeave = (e) => {
    if (isDesktop) {
      const dropdownMenu = e.currentTarget.querySelector('.sm-menu');
      dropdownMenu.style.display = 'none';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="img/logo.webp" className="img-fluid logo_navbar" alt="Hyper Logo" />
          {/* <span class="ml-3 font-weight-bold">BRAND</apan> */}
        </Link>
        <div
          className="navbar-toggler navbar-toggler-right border-0"
          type="button"
          data-toggle="collapse"
          data-target="#navbar4"
        >
          <span className="navbar-toggler-icon"></span>
        </div>

        <div className="collapse navbar-collapse hidenn" id="navbar4">
          <ul className="navbar-nav mr-auto pl-lg-4">
            <li className="nav-item px-lg-2 active">
              <Link className="nav-link" to="/">
                <span className="d-inline-block d-lg-none icon-width">
                  <i className="fas fa-home"></i>
                </span>
                Home
              </Link>
            </li>
            <li className="nav-item px-lg-2">
              <Link className="nav-link" to="/about">
                <span className="d-inline-block d-lg-none icon-width">
                  <i className="fas fa-user-friends"></i>
                </span>
                About
              </Link>
            </li>
            <li
              className="nav-item px-lg-2 dropdown d-menu"
              onMouseEnter={handleDropdownHover}
              onMouseLeave={handleDropdownLeave}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdown01"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-inline-block d-lg-none icon-width">
                  <i className="fas fa-code"></i>
                </span>
                Services
                <svg
                  id="arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className='drpp'
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <div className="dropdown-menu shadow-sm sm-menu" aria-labelledby="dropdown01">
              <Link className="dropdown-item" to="/uiux">
                UI/UX Design
                </Link>
                <Link className="dropdown-item" to="/website">
                  Website Development
                </Link>
                <Link className="dropdown-item" to="/app">
                  App Development
                </Link>
                <Link className="dropdown-item" to="/software">
                  Software Development
                </Link>
                <Link className="dropdown-item" to="/webapp">
                  WebApp Development
                </Link>
                <Link className="dropdown-item" to="/saas">
                  SaaS Platform Development
                </Link>
                <Link className="dropdown-item" to="/smm">
                Social Media Management
                </Link>
                <Link className="dropdown-item" to="/social">
                Social Media Marketing
                </Link>
                <Link className="dropdown-item" to="/addvertise">
                Advertising and Promotions
                </Link>
              </div>
            </li>
            <li className="nav-item px-lg-2">
              <Link className="nav-link" to="/portfolio">
                <span className="d-inline-block d-lg-none icon-width">
                  <i className="fas fa-folder-open"></i>
                  {/* <i class="fa-regular fa-folder"></i> */}
                </span>
                Portfolio
              </Link>
            </li>
            
            <li className="nav-item px-lg-2">
              <Link className="nav-link" to="/contact">
                <span className="d-inline-block d-lg-none icon-width">
                  <i className="fas fa-phone-alt"></i>
                  {/* <i class=""></i> */}
                </span>
                Contact
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto mt-3 mt-lg-0 pl-lg-4">
            {/* <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fab fa-twitter"></i>
                <span className="d-lg-none ml-3">Twitter</span>
              </a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link" href="https://www.facebook.com/profile.php?id=61557174693878" target="_blank">
                <i className="fab fa-facebook icon-width" ></i>
                <span className="d-lg-none ml-3 ">Facebook</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.instagram.com/hypertonicitsolutions/" target="_blank">
                <i className="fab fa-instagram icon-width"></i>
                <span className="d-lg-none ml-3">Instagram</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://www.linkedin.com/company/90642582/admin/feed/posts/" target="_blank">
                <i className="fab fa-linkedin icon-width"></i>
                <span className="d-lg-none ml-3">Linkedin</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
