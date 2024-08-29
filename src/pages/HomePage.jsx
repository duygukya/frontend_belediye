import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar'; 
import backgroundImage from '../assets/images/belediye.jpg'; 
import './HomePage.css';
import duyuru from '../assets/icons/duyuru.png';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { CSSTransition } from 'react-transition-group';
import './HomePageAnimations.css'; 
import ataturkImage from '../assets/images/m.png'

const HomePage = () => { 
  const [announcements, setAnnouncements] = useState([]);
  const [mainAnnouncement, setMainAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isMainAnnouncementDialogOpen, setIsMainAnnouncementDialogOpen] = useState(false);
  const [isSurveyDialogOpen, setIsSurveyDialogOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [hasMainAnnouncementBeenClosed, setHasMainAnnouncementBeenClosed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchMainAnnouncement = () => {
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}`;
    
    fetch(ApiEndpoint + '/user/get-main-duyuru', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.duyuru) {
          setMainAnnouncement(data.data.duyuru);
          setSelectedAnnouncement(data.data.duyuru);
          setIsMainAnnouncementDialogOpen(true);
        } else {
          console.error('Main announcement data is missing');
        }
      })
      .catch((error) => console.error('Error fetching main announcement:', error));
  };

  const fetchSurvey = () => {
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}`;
    
    fetch(ApiEndpoint + '/user/get-main-anket', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.anket) {
          setSurveyUrl('/anket'); 
          setSurveyTitle(data.data.anket.title); 
          if (isInitialLoad) {
            setIsSurveyDialogOpen(true);
          }
        } else {
          console.error('Survey data is missing');
        }
      })
      .catch((error) => console.error('Error fetching survey:', error));
  };

  useEffect(() => {
    fetchMainAnnouncement();
    
    const ApiEndpoint = `${import.meta.env.VITE_APP_API_URL}`;
      
    fetch(ApiEndpoint + '/user/get-duyuru', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const allAnnouncements = data.data.duyurular;
        setAnnouncements(allAnnouncements.filter(announcement => announcement.isMain === 0 || announcement.isMain === 1));
      })
      .catch((error) => console.error('Error fetching announcements:', error));
  }, []);

  useEffect(() => {
    if (!isMainAnnouncementDialogOpen && hasMainAnnouncementBeenClosed) {
      fetchSurvey();
      setIsInitialLoad(false);
    }
  }, [isMainAnnouncementDialogOpen, hasMainAnnouncementBeenClosed]);

  const openDialog = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsMainAnnouncementDialogOpen(true);
  };

  const closeMainAnnouncementDialog = () => {
    setIsMainAnnouncementDialogOpen(false);
    setHasMainAnnouncementBeenClosed(true);
  };

  const closeSurveyDialog = () => {
    setIsSurveyDialogOpen(false);
    setSurveyTitle('');
    setSurveyUrl('');
  };

  const Endpoint = `${import.meta.env.VITE_APP_URL }`;

  const getImageUrl = (filename) => filename ? `${Endpoint}/duyuru/${filename}` : duyuru;

  return (
    <div className="home-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <Sidebar />
      <div className="content">
        <div className="announcement-col">
          {mainAnnouncement && !hasMainAnnouncementBeenClosed && (
            <Card 
              className="announcement-box" 
              onClick={() => openDialog(mainAnnouncement)}
              style={{ marginBottom: '20px', cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="140"
                image={getImageUrl(mainAnnouncement.duyuruResimler[0]?.resim)}
                alt={mainAnnouncement.title}
              />
              <CardContent>
                <Typography 
                  variant="h6" 
                  component="div" 
                  className="announcement-title"
                >
                  {mainAnnouncement.title}
                </Typography>
              </CardContent>
            </Card>
          )}
          {announcements.map((announcement) => (
            <Card 
              className="announcement-box" 
              key={announcement.id}
              onClick={() => openDialog(announcement)}
              style={{ marginBottom: '20px', cursor: 'pointer' }}
            >
              <CardMedia
                component="img"
                height="140"
                image={getImageUrl(announcement.duyuruResimler[0]?.resim)}
                alt={announcement.title}
              />
              <CardContent>
                <Typography 
                  variant="h6" 
                  component="div" 
                  className="announcement-title"
                >
                  {announcement.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Announcement Dialog */}
      <CSSTransition
        in={isMainAnnouncementDialogOpen}
        timeout={300}
        classNames="dialog"
        unmountOnExit
      >
        <Dialog 
          open={isMainAnnouncementDialogOpen} 
          onClose={closeMainAnnouncementDialog}
          BackdropProps={{
            onClick: closeMainAnnouncementDialog,
          }}
        >
         <DialogTitle className="dialog-title">{selectedAnnouncement?.title}</DialogTitle>
         <DialogContent className="dialog-content-text">
           <img 
             src={getImageUrl(selectedAnnouncement?.duyuruResimler[0]?.resim)} 
             alt={selectedAnnouncement?.title} 
             style={{ width: '100%', height: 'auto' }}
           />
           <Typography variant="body1" className="dialog-content-text">
             {selectedAnnouncement?.content}
           </Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={closeMainAnnouncementDialog} color="primary">
             Kapat
           </Button>
         </DialogActions>
        </Dialog>
      </CSSTransition>

      {/* Survey Dialog */}
      <CSSTransition
        in={isSurveyDialogOpen && !isInitialLoad}
        timeout={300}
        classNames="dialog"
        unmountOnExit
      >
        <Dialog 
          open={isSurveyDialogOpen && !isInitialLoad} 
          onClose={closeSurveyDialog}
          BackdropProps={{
            onClick: closeSurveyDialog,
          }}
        >
          <DialogTitle className="dialog-title">Çözmeniz Gereken Anketler Var:</DialogTitle>
          <DialogContent>
            <Typography variant="h6" className="survey-title">{surveyTitle}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => window.location.href = surveyUrl} color="primary">
              Çöz
            </Button>
            <Button onClick={closeSurveyDialog} color="secondary">
              Kapat
            </Button>
          </DialogActions>
        </Dialog>
      </CSSTransition>

      {/* Atatürk Image */}
      <div className="ataturk-container">
        <img src={ataturkImage} alt="Atatürk" className="ataturk-image" />
        <div className="ataturk-quote">
          "Kendiniz için değil, bağlı bulunduğunuz ulus için elbirliği ile çalışınız. Çalışmaların en yükseği budur."
        </div>
      </div>
    </div>
  );
};

export default HomePage;
