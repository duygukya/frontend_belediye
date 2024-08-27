import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WeatherWidget.css'; // You can style your widget with a CSS file

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const API_KEY = '7bc3e6e4b984405095f67d2c33f32ee1'; // Replace with your Weatherbit API Key
  const CITY_NAME = 'Samsun'; // City name

  useEffect(() => {
    axios.get(`https://api.weatherbit.io/v2.0/current?city=${CITY_NAME}&key=${API_KEY}&units=M`)
      .then(response => {
        setWeather(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, [API_KEY]);

  if (!weather) return <div>Loading weather data...</div>;

  return (
    <div className="weather-widget">
      <h3>{weather.city_name} Hava Durumu</h3>
      <p>Sıcaklık: {weather.data[0].temp}°C</p>
      <p>Durum: {weather.data[0].weather.description}</p>
      <p>Rüzgar: {weather.data[0].wind_spd} m/s</p>
    </div>
  );
};

export default WeatherWidget;
