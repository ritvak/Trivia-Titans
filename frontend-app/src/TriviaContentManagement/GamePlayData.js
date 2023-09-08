import React, { useState } from 'react';
import axios from 'axios';

 

const GamePlayData = () => {
const [playerLeaderboardUrl, setPlayerLeaderboardUrl] = useState(null);
  const fetchPlayerLeaderboard = async () => {

    try {

      const response = await axios.get('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/leaderboard');

<<<<<<< HEAD
      setPlayerLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/f528046f-ab77-417b-af30-0a081addce24/page/eh2YD');
=======
      setPlayerLeaderboardUrl('https://lookerstudio.google.com/embed/reporting/02d5837f-9915-47ca-8de3-b3567fa83a63/page/G3wYD');
>>>>>>> origin/InGameExperience

    } catch (error) {

      console.error('Error fetching player leaderboard:', error);
    }

  };
  const handlePlayerLeaderboardClick = async () => {

    await fetchPlayerLeaderboard();

  };

 

  return (

    <div>

      <button onClick={handlePlayerLeaderboardClick}>Game Play Data and User Engagement</button>

    

      

          { playerLeaderboardUrl && (

            <div>

          <h2>Game Play Data and User Engagement</h2>

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
export default GamePlayData ;