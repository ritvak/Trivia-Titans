import React, { useState } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [teamLeaderboardUrl, setTeamLeaderboardUrl] = useState(null);
  const [playerLeaderboardUrl, setPlayerLeaderboardUrl] = useState(null);


  const fetchTeamLeaderboard = async () => {
    try {
      const response = await axios.get('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/leaderboard');
      setTeamLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/67e049c6-52f4-4422-b962-00df7e4ae68d/page/Ry5XD');
    } catch (error) {
      console.error('Error fetching team leaderboard:', error);
    }
  };
  
  

  const fetchPlayerLeaderboard = async () => {
    try {
      const response = await axios.get('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/leaderboard');
      setPlayerLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/1eccabce-f474-409e-bf81-8e4ba4a482f7/page/gg6XD');
    } catch (error) {
      console.error('Error fetching player leaderboard:', error);
    }
  };

  const handleTeamLeaderboardClick = async () => {
    await fetchTeamLeaderboard();
  };

  const handlePlayerLeaderboardClick = async () => {
    await fetchPlayerLeaderboard();
  };

  return (
    <div>
      <button onClick={handleTeamLeaderboardClick}>Team Leaderboard</button>
      <button onClick={handlePlayerLeaderboardClick}>Player Leaderboard</button>
      {teamLeaderboardUrl  && (
        <div>
          <h2>Team Leaderboard</h2>
          <iframe
            width="900"
            height="1000"
            src={teamLeaderboardUrl}
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
          </div>)}
          
          { playerLeaderboardUrl && (
            <div>
          <h2>Player Leaderboard</h2>
          <iframe
            width="900"
            height="1000"
            src={playerLeaderboardUrl}
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;



