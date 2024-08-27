import React from 'react';
import ReactDOM from 'react-dom/client'; // 'react-dom' yerine 'react-dom/client' kullanıyoruz
import App from './App';
import './index.css'; // Global stiller burada olabilir

// React 18'de createRoot kullanarak root oluşturuyoruz
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
