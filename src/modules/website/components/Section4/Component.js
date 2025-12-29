import React, { useEffect, useState } from 'react';
import './component.css';

const PortfolioSection = () => {
  const [filter, setFilter] = useState('*');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const portfolio = document.querySelector('.portfolio-gallery');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    const handleFilter = () => {
      const filteredItems = [];
      portfolioItems.forEach((item) => {
        if (filter === '*' || item.dataset.filter === filter) {
          filteredItems.push(item);
          item.style.cssText = 'transform: translate3d(0, 0, 0); opacity: 1;';
        } else {
          item.style.cssText = 'transform: scale(0.1); opacity: 0;';
        }
      });
      positionItems(filteredItems);
    };

    const countRowsItems = () => {
      if (windowWidth <= 768) return 1;
      if (windowWidth <= 992) return 2;
      return 3;
    };

    const positionItems = (items) => {
      const parentWidth = portfolio.offsetWidth;
      let rowItems = countRowsItems();
      let y = 0;
      let x = 0;
      items.forEach((item, i) => {
        item.style.cssText = `transform: translate3d(${(x * (parentWidth / rowItems))}px, ${y * 220}px, 0); opacity: 1;`;
        x++;
        if (x % rowItems === 0) {
          y++;
          x = 0;
        }
      });
      portfolio.style.height = `${Math.ceil(items.length / rowItems) * 220}px`;
    };

    handleFilter();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      handleFilter();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filter, windowWidth]);

  return (
    <section className="portfolio section-portfolio">
      <ul className="portfolio-cats">
        <li onClick={() => setFilter('*')}>All</li>
        <li onClick={() => setFilter('E-commerce')}>E-commerce</li>
        <li onClick={() => setFilter('static')}>Static (Informational)</li>
        <li onClick={() => setFilter('dynamic')}>Dynamic</li>
      </ul>
      <div className="portfolio-gallery">
        <div className="portfolio-item" data-filter="E-commerce">
        <div className="portfolio_card">

<img src="img/pezos.png" className="img-fluid"></img>
<div class="overlay">
  <a href="https://pezos.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">pezos.in</div>
  </a>
</div>

</div>
        </div>
        <div className="portfolio-item" data-filter="E-commerce">
          <div className="portfolio_card">
          <img src="img/yugo.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://theyugo.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">theyugo.in</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="E-commerce">
          <div className="portfolio_card">
          <img src="img/furnestry.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.thefurnestry.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">thefurnestry.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="E-commerce">
          <div className="portfolio_card">
          <img src="img/stamp.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://stamppro.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">stamppro.in</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="E-commerce">
          <div className="portfolio_card">
          <img src="img/toys.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://agrawaltoys.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">agrawaltoys.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="E-commerce">
        <div className="portfolio_card">
          <img src="img/astaria.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.astria.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">astria.in</div>
    </a>
          </div>
        </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/bejoho.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://bejoho.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">bejoho.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/law-firm.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://jotwaniandkumarchambers.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">jotwaniandkumarchambers.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/scm.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.scmconnexions.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">scmconnexions.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/linkerdesk.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.linkerdesk.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">linkerdesk.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/scalecpa.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.scalecpa.ca/" target="_blank" rel="noopener noreferrer">
    <div class="text">scalecpa.ca</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="statigc">
          <div className="portfolio_card">
          <img src="img/legalladder.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://legalladder.co/" target="_blank" rel="noopener noreferrer">
    <div class="text">legalladder.co</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/volga.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://volgacuprum.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">volgacuprum.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/stop-hiv.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://stophiv2024.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">stophiv2024.com</div>
    </a>
          </div>
        </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/Fleeco-tech.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://fleecotech.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">fleecotech.com</div>
    </a>
          </div>
        </div>
        </div>
        <div className="portfolio-item" data-filter="static">
          <div className="portfolio_card">
          <img src="img/airfilco.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://airfilco.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">airfilco.in</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/party.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.partyhelpdesk.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">partyhelpdesk.com</div>
    </a>
          </div>
        </div>
        </div>
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/pharma.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://www.getmed.co.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">getmed.co.in</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/yoga.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://healinsutras.com/" target="_blank" rel="noopener noreferrer">
    <div class="text">healinsutras.com</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/kdp.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://kdp-architects.ai/" target="_blank" rel="noopener noreferrer">
    <div class="text">kdp-architects.ai</div>
    </a>
          </div>          </div>
        </div>
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/wav-studio.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://wavstudio.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">wavstudio.in</div>
    </a>
          </div>          </div>
        </div> 
        <div className="portfolio-item" data-filter="dynamic">
          <div className="portfolio_card">
          <img src="img/property.png"className="img-fluid"></img>
<div class="overlay">
<a href="https://heartlandrealty.co.in/" target="_blank" rel="noopener noreferrer">
    <div class="text">heartlandrealty.co.in</div>
    </a>
          </div>          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
