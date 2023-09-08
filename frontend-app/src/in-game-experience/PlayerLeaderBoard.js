import React, { useState } from 'react';
import axios from 'axios';

 

const PlayerLeaderBoard = () => {
const [playerLeaderboardUrl, setPlayerLeaderboardUrl] = useState(null);
  const fetchPlayerLeaderboard = async () => {

    try {

      const response = await axios.get('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/leaderboard');

      setPlayerLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/02d5837f-9915-47ca-8de3-b3567fa83a63/page/G3wYD');

    } catch (error) {

      console.error('Error fetching player leaderboard:', error);

    }

  };
  const handlePlayerLeaderboardClick = async () => {

    await fetchPlayerLeaderboard();

  };

 

  return (

    <div>

      <button onClick={handlePlayerLeaderboardClick}>Player Leaderboard</button>

    

      

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
export default PlayerLeaderBoard;