import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useLocation,useParams } from 'react-router-dom';
import './state_css.css';


/* 
  [1] 17711 silver badge1212 bronze badges and GermanGerman&nbsp;55733 silver badges55 bronze badges, “Post form data from react handle submit function to Python Api?,” Stack Overflow,
      https://stackoverflow.com/questions/55738364/post-form-data-from-react-handle-submit-function-to-python-api (accessed Jun. 30, 2023). 

  [2] O. Elijah, “How to send data from react to flask,” DEV Community,
      https://dev.to/ondiek/sending-data-from-react-to-flask-apm (accessed Jun. 30, 2023). 

*/

const StatePage = () => 
{
    // Initialize local state variables
    const [userList, setUserList] = useState([]);
    const [myInfo, setMyInfo] = useState(null);
    const navigate = useNavigate();
    const { user_email } = useParams();
  
    useEffect(() => {
      // this function is fetching data of all online users
      const fetchData = async () => {
        try {
          const response = await fetch('https://state-faesnz2rca-uc.a.run.app/state');
       
           const data = await response.json();
           console.log(data);
           setUserList(data);
        } catch (error) {
          console.log('Error fetching user info:', error);
        }
      };
  
      // fetching info of logged in user
      const fetchMyInfo = async () => {
        try {   
            const response = await axios.get('https://state-faesnz2rca-uc.a.run.app/myinfo?user_email='+user_email);
            setMyInfo(response.data);
          } catch (error) {
            console.error(error);
          }
      };

     
      // setting interfal , so that those functions can run in every half second , it till keep updating the online users 
      const interval = setInterval(() => {
        fetchData();
        fetchMyInfo();
      }, 500);
  
      return () => {
        clearInterval(interval);
      };


    }, []);


    // sending backend email to update the user status to offline 
    const handleLogout = async () => {
        try {
            const response = await axios.post('https://state-faesnz2rca-uc.a.run.app/logout', {
               "user_email":user_email
            });
   
            // if state update is successful then redirect to login page
            if (response.data.success) {
                navigate('/login');
                console.log("logout succesfull") 
            }
            else{
                console.log("logout failed")
            }
      
          } catch (error) {
            console.error(error);
          }
      };  
  
    return (
      <div className="user-info">
        <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
        <h1>User Information</h1>
        {myInfo && (
          <div className="user-details">
            <p>
              <strong>Name:</strong> {myInfo.name}
            </p>
            <p>
              <strong>email:</strong> {myInfo.email}
            </p>
            <p>
              <strong>Location:</strong> {myInfo.location}
            </p>
         
          </div>
        )}
        <h1>Online User</h1>
        {userList.length > 0 ? (
          userList.map((user) => (
            <div key={user.id} className="user-details">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <div className="online-indicator" />
            </div>
          ))
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    );
  };

export default StatePage;
