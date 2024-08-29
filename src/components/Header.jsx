import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Header.css';
import logo from '../assets/icons/logo.png';
import logo2 from '../assets/icons/ataturk.png';

const Header = () => {
  return (
    <header className="header">
      <h1>ATAKUM BELEDİYESİ</h1>
      <div className="header-icon2">
        <img src={logo2} alt="Atatürk Logo" className="logo-icon2" />
      </div>
      <Link to="/" className="header-icon"> {/* Wrap the logo with Link */}
        <img src={logo} alt="Main Logo" className="logo-icon" />
      </Link>
    </header>
  );
};

export default Header;
