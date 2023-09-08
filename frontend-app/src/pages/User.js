

import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
=======
import { useLocation, Link } from 'react-router-dom';
>>>>>>> main
=======
import { useLocation, Link } from 'react-router-dom';
>>>>>>> origin/InGameExperience

function UserList() {
  const [users, setUsers] = useState([]);
  const location = useLocation(); 
  const loggedInEmail = localStorage.getItem('email');
  const team_name = location.state?.teamName; 

  const fetchUsers = async () => {
    try {
      const response = await axios.post('https://xatcvrqbwk.execute-api.us-east-1.amazonaws.com/teamManagement/', {
        team_name: team_name,
      });
      const usersData = JSON.parse(response.data.body);
      setUsers(usersData);
    } catch (error) {
      console.log(error);
    }
  };

  const leaveTeam = async () => {
    try {
      const response = await axios.delete('https://5eupiy3dy0.execute-api.us-east-1.amazonaws.com/leaveTeam/', {
        data: { email: loggedInEmail,team_name:team_name },
      });
      console.log(response.data); 
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>User List</h1>
      <button onClick={fetchUsers}>Fetch User List</button>
      <button onClick={leaveTeam}>Leave the Team</button>
      {users.length > 0 ? (
        users.map((user, index) => (
          <div key={index}>
            <p>Team ID: {user.team_name}</p>
            <p>Recipient Email: {user.email}</p>
            <p>Invitation Status: {user.invitation_status}</p>
            
            <hr />
          </div>
        ))
      ) : (
        <p></p>
      )}
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> origin/InGameExperience

     <div className="card">
        {/* Wrap the card with a Link to navigate to the Lobby */}
        <Link to="/Lobby" className="card-content">
          <h3>Go to Lobby</h3>
          {/* Add any additional content or styles for the card */}
        </Link>
      </div>
<<<<<<< HEAD
>>>>>>> main
=======
>>>>>>> origin/InGameExperience
    </div>
  );
}

export default UserList;

