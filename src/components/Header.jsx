import React from 'react';
import './Header.css';
import logo from '../assets/icons/logo.png';
import logo2 from '../assets/icons/ataturk.png'

const Header = () => {
  return (
    <header className="header">
      <h1>ATAKUM BELEDİYESİ</h1>
      <div className="header-icon2">
        <img src={logo2} alt="Logo" className="logo-icon2" />
      </div>
      <div className="header-icon">
        <img src={logo} alt="Logo2" className="logo-icon" />
      </div>
    </header>
  );
};

export default Header;
