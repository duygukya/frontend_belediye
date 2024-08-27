import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import TextField from '@mui/material/TextField'; 
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar';
import './AnketPage.css'; 

const AnketPage = () => {
  const loc = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [anket, setAnket] = useState();
  const [answers, setAnswers] = useState([]);

  const getAnket = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/get-anket/${loc.pathname.split('/')[2]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setAnket(data.data.survey);
      } else {
        console.error('Failed to fetch survey:', data.message);
      }
    } catch (error) {
      console.error('Error fetching survey:', error);
    }
  };

  useEffect(() => {
    getAnket();
    
  }, []);

  const handleChange = (questionID, choiceID, type) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const existingAnswerIndex = updatedAnswers.findIndex((a) => a.questionID === questionID);

      if (type === 'radio') {
        if (existingAnswerIndex > -1) {
          updatedAnswers[existingAnswerIndex] = { questionID, choice: choiceID };
        } else {
          updatedAnswers.push({ questionID, choice: choiceID });
        }
      } else if (type === 'checkbox') {
        if (existingAnswerIndex > -1) {
          const currentChoices = updatedAnswers[existingAnswerIndex].choices || [];
          if (currentChoices.includes(choiceID)) {
            updatedAnswers[existingAnswerIndex].choices = currentChoices.filter(id => id !== choiceID);
          } else {
            updatedAnswers[existingAnswerIndex].choices = [...currentChoices, choiceID];
          }
        } else {
          updatedAnswers.push({ questionID, choices: [choiceID] });
        }
      }
      return updatedAnswers;
    });
  };

  const handleTextChange = (questionID, text) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const existingAnswerIndex = updatedAnswers.findIndex((a) => a.questionID === questionID);

      if (existingAnswerIndex > -1) {
        updatedAnswers[existingAnswerIndex] = { questionID, text };
      } else {
        updatedAnswers.push({ questionID, text });
      }
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    const surveyID = loc.pathname.split('/')[2];
    const user = "192.168.1.26"; 

    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/reply-anket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surveyID, user, answer: answers }),
    });

    const data = await response.json();
    if (data.success) {
      console.log('Survey responses submitted successfully');
      navigate('/anket'); 
    } else {
      console.error('Failed to submit survey responses:', data.message);
    }
  };

  return (
    <div>
      <Header /> 
      <div className="d-flex flex-row">
        <Sidebar /> 
        <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: 'calc(100vh - 70px)', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
          <div className="p-4" style={{ maxWidth: '800px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop: '90px' }}>
            <h3 className="text-center">{anket?.title}</h3>
            {anket?.Questions?.map((eachQuestion, index) => (
              <div key={eachQuestion.id} className="mt-5">
                <div
                  className="p-2 d-inline justify-content-start align-items-start"
                  style={{ borderRadius: '10px', backgroundColor: '#2A2A5B', color: 'white', fontWeight: 'bold' }}
                >
                  {index + 1}
                </div>
                <div className="d-inline-block">
                  <div className="d-flex flex-column mx-2">
                    <div className="fw-bold">{eachQuestion.question_text}</div>
                    <div>
                      {eachQuestion.question_type === 'text_input' && (
                        <TextField
                          onChange={(e) => handleTextChange(eachQuestion.id, e.target.value)}
                        />
                      )}
                      {eachQuestion.question_type === 'multiple_choice' &&
                        eachQuestion.Choices.map((choice) => (
                          <div key={choice.id} className="d-flex">
                            <input
                              name={`question-${eachQuestion.id}`} 
                              value={choice.id}
                              type="radio"
                              onChange={() => handleChange(eachQuestion.id, choice.id, 'radio')}
                            />
                            <span>{choice.choice_text}</span>
                          </div>
                        ))}
                      {eachQuestion.question_type === 'multiple_selection' &&
                        eachQuestion.Choices.map((choice) => (
                          <div key={choice.id} className="d-flex">
                            <input
                              type="checkbox"
                              onChange={() => handleChange(eachQuestion.id, choice.id, 'checkbox')}
                            />
                            <span>{choice.choice_text}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="submit-container">
              <button onClick={handleSubmit} className="submit-button">Kaydet</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnketPage;
