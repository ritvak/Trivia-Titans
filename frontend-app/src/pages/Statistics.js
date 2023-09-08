


import React, { useState } from 'react';
import axios from 'axios';

function TeamName1() {
  const [teamName, setTeamName] = useState('');
  const [inputTeamName, setInputTeamName] = useState('');

  const handleClick = async () => {
    try {
      const response = await axios.post('https://zc61h9osw7.execute-api.us-east-1.amazonaws.com/dev/', { team_name: inputTeamName });
      setTeamName(response.data.body); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setInputTeamName(event.target.value);
  };

  return (
    <div>
      <h1>Team Statistics</h1>
      <input type="text" value={inputTeamName} onChange={handleInputChange} placeholder="Enter Team Name" />
      <button onClick={handleClick}>Fetch Team Statistics</button>
      {teamName && <p>{teamName}</p>}
    </div>
  );
}

export default TeamName1;
