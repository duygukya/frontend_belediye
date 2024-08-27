import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import InternalNumbers from './pages/InternalNumbers';
import Anket from './pages/Anket';
import AnketPage from './pages/AnketPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/internal-numbers" element={<InternalNumbers />} />
        <Route path="/anket" element={<Anket />} />
        <Route path="/anketPage/:id" element={<AnketPage />} />


       
      </Routes>
    </Router>
  );
}

export default App;
