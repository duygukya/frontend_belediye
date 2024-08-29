import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import icon2 from '../assets/icons/calendar.png'; 
import icon4 from '../assets/icons/landline.png'; 
import icon5 from '../assets/icons/home-page.png';
import icon6 from '../assets/icons/testing.png';
import icon8 from '../assets/icons/cloud.png';
import defaultProfilePicture from '../assets/icons/users.png';
import './Sidebar.css';

const Sidebar = () => {
  const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);
  const [birthdayPersons, setBirthdayPersons] = useState([]);
  const navigate = useNavigate();

  const fetchBirthdayPersons = async () => {
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}/user/get-birthday-persons`; // API endpoint URL
  
    try {
      const response = await fetch(ApiEndpoint);
      const data = await response.json();
  
      const today = new Date().toISOString().slice(5, 10); // Get month and day
      const persons = data.data.users.filter((person) => person.DogumTarihi.slice(5, 10) === today);

      // Set default image if profile picture is missing
      const updatedPersons = persons.map((person) => ({
        ...person,
        Resim: person.Resim ? `${import.meta.env.VITE_APP_URL}/kullanici/${person.Resim}` : defaultProfilePicture
      }));
  
      setBirthdayPersons(updatedPersons);
      setIsBirthdayDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch birthday data:', error);
      setBirthdayPersons([]);
    }
  };
  
  const closeBirthdayDialog = () => {
    setIsBirthdayDialogOpen(false);
  };

  const openWeatherDialog = () => {
    window.open(
      'https://www.mgm.gov.tr/tahmin/il-ve-ilceler.aspx?il=Samsun',
      'WeatherDialog',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <>
      <div className="sidebar">
        <button onClick={() => navigate('/')}>
          <img src={icon5} alt="Icon 5" />
          <span>Anasayfa</span>
        </button>
        <button onClick={() => navigate('/internal-numbers')}>
          <img src={icon4} alt="Icon 4" />
          <span>Dahili Numaralar</span>
        </button> 
        <button onClick={fetchBirthdayPersons}>
          <img src={icon2} alt="Icon 2" />
          <span>Doğum Günü</span>
        </button>
        <button onClick={() => navigate('/anket')}>
          <img src={icon6} alt="Icon 6" />
          <span>Anketler</span>
        </button>
        <button onClick={openWeatherDialog}>
          <img src={icon8} alt="Icon 8" />
          <span>Hava Durumu</span>
        </button>
      </div>

      <Dialog
        open={isBirthdayDialogOpen}
        onClose={closeBirthdayDialog}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          '& .MuiPaper-root': {
            backgroundColor: '#f3f0f0',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            width: '600px',
            textAlign: 'center',
            color: '#000',
          },
        }}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          Doğum Günü Olan Kişiler
          <IconButton
            aria-label="close"
            onClick={closeBirthdayDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#000',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#ff0000',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {birthdayPersons.length > 0 ? (
            <div className="birthday-person-container">
              {birthdayPersons.map((person, index) => (
                <div key={index} className="birthday-person">
                  <img 
                    src={person.Resim} 
                    alt={`${person.Adi || ''} ${person.Soyadi || ''}`} 
                    className="birthday-person-image" 
                  />
                  <p><strong>{person.Adi || ''} {person.Soyadi || ''}</strong></p>
                  <p>{person.Unvani || ''}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Bugün doğum günü olan kimse yok.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBirthdayDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 

export default Sidebar;
