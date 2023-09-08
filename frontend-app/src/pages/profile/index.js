import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios using 'npm install axios' if you haven't already
import './profile.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from "./config";
import { Card, Button } from 'react-bootstrap';


const EditPersonalInfo = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Add the 'phone' field
    user_id: '',
    // Add more fields as needed
  });

  localStorage.setItem('user_email', formData.email)
  const [userStats, setUserStats] = useState(null);
  const [userStatsList, setUserStatsList] = useState([]);
  const [position, setSetPosition] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false); 
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchData();
    fetchUserStats();
  }, []);


  const fetchUserStats = async () => {
    try {

      // const response = await axios.get(
      //   `https://jzz1rkmlyl.execute-api.us-east-1.amazonaws.com/dev/userprogress`,
      //   {
      //     params: {
      //       user_id: "LjjfO1zzNTW8iPXTyNkrtSmFggn2",
      //     },
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      // setUserStats(response.data)

      console.log('user_stat')


    } catch (error) {
      // console.error("Error fetching user stats:", error);
      // setUserStats(null);
    }
  };

  const fetchData = async () => {

    try {

      const response = await axios.get(
        "https://a3uvpysekh.execute-api.us-east-1.amazonaws.com/fetch_user/user",
        {
          params: {
            id: id
          }
        }
      );

      if (response.status == 200) {
        setFormData(response.data)
      }
      else {
        setFormData(null)
      }

      //-------------------------------------------------
      const data = {
        'user_id': localStorage.getItem('user_id')
      }
      const queryString = new URLSearchParams(data).toString();
      const responses = await axios.get(`https://s7evh6lsv6.execute-api.us-east-1.amazonaws.com/dev/getuserprogress?${queryString}`)
      console.log(responses.data)
      setUserStats(responses.data)

      console.log('here')
      console.log(responses)

      const alluser = await axios.get(
        "https://p04h45uevj.execute-api.us-east-1.amazonaws.com/dev/getallusers");

      setUserStatsList(alluser.data)
      const position = userStatsList.findIndex((position) => position.user_id === localStorage.getItem("user_id"));
      setSetPosition(position)
      //  console.log('alluser')
      // console.log(alluser)
    } catch (error) {
      //   console.log(error);
    }

  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://7h7enpo6u6.execute-api.us-east-1.amazonaws.com/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert("information updated successfully")
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      alert("logout successfully")

      const login = await axios.get(
        "https://8i0lrv06v9.execute-api.us-east-1.amazonaws.com/users/logs",
        {
          params: {
            user_id: localStorage.getItem("user_id"),
            email: localStorage.getItem("email"),
            activity: "logout"

          },
        }
      );
      navigate('/login');
      // User has been logged out
    } catch (error) {
      // Handle any errors that occurred during the sign-out process
      console.error("Error logging out:", error);
    }
  }
  const handleToggleChatbot = () => {
    setShowChatbot((prev) => !prev); 
  };

  return (
    <div className="edit-personal-info">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Edit Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} readOnly />
          <input type="hidden" name="id" value={formData.id} readOnly />
        </label>
        {/* Add more input fields for other personal information */}
        <label>
          Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <button type="submit">Update information</button>
      </form>

      <h2>User Stat</h2>
      <div className="table-container">
        {userStats ? (
          <table className="table">
            <thead>
              <tr>
                <th>Total Game played</th>
                <th>wins</th>
                <th>win Ratio</th>
                <th>losses</th>
                <th>lose ration</th>
                <th>Total points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userStats.games_played}</td>
                <td>{userStats.wins}</td>
                <td>{userStats.win_loss_ratio}</td>
                <td>{userStats.losses}</td>
                <td>{userStats.loss_ratio}</td>
                <td>{userStats.total_points}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading user stats...</p>
        )}
      </div>
      <h2>You position is : {position+1} </h2>
      {userStatsList.length > 0 ? (
        <div className="table-container">
          <h2>All User Stat </h2>
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Total Game played</th>
                <th>wins</th>
                <th>win Ratio</th>
                <th>losses</th>
                <th>lose ratio</th>
                <th>Total points</th>
              </tr>
            </thead>
            <tbody>
              {userStatsList.map((userStats_all) => (
                <tr key={userStats_all.user_id} >
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.username}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.games_played}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.wins}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.win_loss_ratio}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.losses}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.loss_ratio}</td>
                  <td style={{ border: userStats_all.user_id === localStorage.getItem("user_id") ? "2px solid blue" : "none" }}>{userStats_all.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading user stats...</p>
      )}

<div className="cards-container">
        {/* Card 1: Team Management */}
        <Card onClick={() => navigate('/TeamManagement')}>
          <Card.Body>
            <Card.Title>Team Management</Card.Title>
            {/* Add any additional content or styles for the card */}
          </Card.Body>
        </Card>

        {/* Card 2: Team LeaderBoard */}
        <Card onClick={() => navigate('/LeaderBoard')}>
          <Card.Body>
            <Card.Title>Team LeaderBoard</Card.Title>
            {/* Add any additional content or styles for the card */}
          </Card.Body>
        </Card>

        {/* Card 3: User LeaderBoard */}
        <Card onClick={() => navigate('/PlayerLeaderBoard')}>
          <Card.Body>
            <Card.Title>Player LeaderBoard</Card.Title>
            {/* Add any additional content or styles for the card */}
          </Card.Body>
        </Card>
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
      </div>

    </div>
  );
};

export default EditPersonalInfo;
