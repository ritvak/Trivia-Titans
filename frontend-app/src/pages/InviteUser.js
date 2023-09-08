import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


function InvitationUser() {
  const [userDetails, setUserDetails] = useState([]);
  const location = useLocation(); 
  
  const team_name = location.state?.teamName; 
  

  const handleClick = async () => {
    try {
<<<<<<< HEAD
<<<<<<< HEAD
      const response = await axios.get('https://2cd7on1lxl.execute-api.us-east-1.amazonaws.com/default/fetchUser');
=======
      const response = await axios.get('https://4ptabaxpo3.execute-api.us-east-1.amazonaws.com/user/all');
>>>>>>> main
=======
      const response = await axios.get('https://4ptabaxpo3.execute-api.us-east-1.amazonaws.com/user/all');
>>>>>>> origin/InGameExperience
      const data = response.data.map(user => ({
        name: user.name,
        email: user.email
      }));
      setUserDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInviteClick = async (email) => {
    try {
      const response = await axios.post('https://3e3e4qqohh.execute-api.us-east-1.amazonaws.com/invitation/', {
       email: email,
       team_name:team_name
       
      });
      console.log(response.data);
      window.alert('Invitation sent successfully!');
    } catch (error) {
      console.log(error);
    }
  };

 

  return (
    <div>
      <h1>Invite Users</h1>
      <button onClick={handleClick}>Invite Users</button>
      {userDetails.length > 0 ? (
        userDetails.map((user, index) => (
          <div key={index}>
            
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => handleInviteClick(user.email)}>Invite Now</button>
          </div>
        ))
      ) : (
        <p></p>
      )}


    </div>
    
  );
}

export default InvitationUser;
