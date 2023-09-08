import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios'; 

function TeamManagement() {
  const navigate = useNavigate();
  const loggedInEmail = localStorage.getItem('email');

  const [teamName, setTeamName] = useState(localStorage.getItem('teamname'));
<<<<<<< HEAD
<<<<<<< HEAD
  const [showChatbot, setShowChatbot] = useState(false); 
=======
>>>>>>> main
=======
>>>>>>> origin/InGameExperience
  
  const handleSubmit = () => {
    fetch('https://g8hd6j2lrl.execute-api.us-east-1.amazonaws.com/adminStatus/', {
      method: 'POST',
      body: JSON.stringify({ email: loggedInEmail, team_name: teamName }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        
        navigate('/InviteUser', { state: { teamName } }); 
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit2 = () => {
    navigate('/Leaderboard');
  };

  const handleSubmit3 = () => {
    navigate('/Statistics');
  };

  const handleSubmit1 = () => {
    fetch('https://2373dwtosi.execute-api.us-east-1.amazonaws.com/returnAdminStatus/', {
      method: 'POST',
      body: JSON.stringify({ email: loggedInEmail, team_name: teamName }),
    })
      .then((response) => response.json())
      .then((data) => {
        const parsedData = JSON.parse(data.body); 
        if (parsedData.isAdmin) {
        
          navigate('/ManageTeam', { state: { teamName } }); 
        } else {
          navigate('/User',{ state: { teamName } }); 
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClick = async () => {
    try {
      const response = await axios.post('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/generate_team_name');
      window.alert('Team Name  Generated successfully!');
      const newTeamName = response.data;
<<<<<<< HEAD
<<<<<<< HEAD
=======
      localStorage.setItem('team_name',newTeamName)
>>>>>>> main
=======
      localStorage.setItem('team_name',newTeamName)
>>>>>>> origin/InGameExperience
      setTeamName(newTeamName);
      
       
        localStorage.setItem('teamname', newTeamName);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedTeamName = localStorage.getItem('teamname');
    if (storedTeamName) {
      setTeamName(storedTeamName);
    }
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
  const handleToggleChatbot = () => {
    setShowChatbot((prev) => !prev); 
  };

=======
>>>>>>> main
=======
>>>>>>> origin/InGameExperience

  return (
    <>
      <div>
        <Button onClick={handleClick}>Create Team Name</Button>
        {teamName && <p>Team Name: {teamName}</p>}
      </div>
      <div>
        <Button onClick={handleSubmit}>Invite Users</Button>   
        
      </div>
      <div>
        <Button onClick={handleSubmit1}>Manage Team</Button>
      </div>
      <div>
        <Button onClick={handleSubmit2}>Leaderboard</Button>
      </div>  
      <div>
        <Button onClick={handleSubmit3}>View Statistics</Button>
      </div>  
<<<<<<< HEAD
<<<<<<< HEAD
      <div>
        <Button onClick={handleToggleChatbot}>
          {showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
        </Button>
        {showChatbot && (
          <iframe
            style={{ border: 'none', height: '600px', width: '400px', float: 'right' }}
            src="https://widget.kommunicate.io/chat?appId=21228a6ce465d0182d2c12dd3493c654"
            allow="microphone; geolocation;"
          ></iframe>
        )}
      </div>
=======
>>>>>>> main
=======
>>>>>>> origin/InGameExperience
    </>
  );
}

export default TeamManagement;
