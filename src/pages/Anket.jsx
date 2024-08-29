import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header'; 
import './Anket.css'; 
import { useNavigate } from 'react-router-dom';
import icon1 from '../assets/icons/testing.png';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Anket = () => {
  const [surveys, setSurveys] = useState([]);
  const [mainSurvey, setMainSurvey] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate here

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

  const handleSurveyClick = (survey) => {
    setSelectedSurvey(survey);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSurvey(null);
  };

  const handleSolveSurvey = () => {
    if (selectedSurvey) {
      navigate('/anketPage/' + selectedSurvey.id);
      handleCloseDialog(); // Close the dialog after navigating
    }
  };

  return (
    <div className="anket-page">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="anket-container">
          {mainSurvey && (
            <div className="main-survey-box survey-box" onClick={() => handleSurveyClick(mainSurvey)}>
              <h2 className="survey-title">{mainSurvey.title}</h2>
              <img src={icon1} alt={mainSurvey.title} className="survey-image" />
            </div>
          )}
          {surveys.length > 0 ? (
            surveys.map((survey) => (
              <div key={survey.id} className="survey-box" onClick={() => handleSurveyClick(survey)}>
                <h2 className="survey-title">{survey.title}</h2>
                <img src={icon1} alt={survey.title} className="survey-image" />
              </div>
            ))
          ) : (
            <p>No surveys available.</p>
          )}
        </div>
      </div>

      {/* MUI Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedSurvey?.title}</DialogTitle>
        <DialogContent>
          <img src={icon1} alt={selectedSurvey?.title} className="dialog-survey-image" />
          <p>{selectedSurvey?.description}</p>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleSolveSurvey} className="dialog-button-solve" variant="outlined">Çöz</Button>
          <Button onClick={handleCloseDialog} className="dialog-button-close" variant="outlined">Kapat</Button>
         
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Anket;
