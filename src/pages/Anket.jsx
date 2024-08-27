import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header'; 
import './Anket.css'; 
import { useNavigate } from 'react-router-dom';

const Anket = () => {
  const [surveys, setSurveys] = useState([]);
  const [mainSurvey, setMainSurvey] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const [surveysResponse, mainSurveyResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_APP_API_URL}/user/get-anketler`),
          fetch(`${import.meta.env.VITE_APP_API_URL}/user/get-main-anket`)
        ]);

        if (!surveysResponse.ok || !mainSurveyResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const [surveysData, mainSurveyData] = await Promise.all([
          surveysResponse.json(),
          mainSurveyResponse.json()
        ]);

        console.log('API Responses:', { surveysData, mainSurveyData });

        if (surveysData.success) {
          setSurveys(surveysData.data.surveys);
        } else {
          console.error('Failed to fetch surveys:', surveysData.message);
        }

        if (mainSurveyData.success) {
          setMainSurvey(mainSurveyData.data.survey);
        } else {
          console.error('Failed to fetch main survey:', mainSurveyData.message);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSurveys();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="anket-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="anket-container">
          {mainSurvey && (
            <div className="main-survey-box">
              <h2 className="survey-title">{mainSurvey.title}</h2>
              <p className="survey-description">{mainSurvey.description}</p>
              <button onClick={() => navigate('/anketPage/' + mainSurvey.id)} className="survey-button">Çöz</button>
            </div>
          )}
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <div key={survey.id} className="survey-box">
                <h2 className="survey-title">{survey.title}</h2>
                <p className="survey-description">{survey.description}</p>
                <button onClick={() => navigate('/anketPage/' + survey.id)} className="survey-button">Çöz</button>
              </div>
            ))
          ) : (
            <p>No surveys available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anket;
