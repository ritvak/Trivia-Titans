import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './reset_password.css';
import { useNavigate } from 'react-router-dom';

import {auth,provider,app} from "./config";
import {sendPasswordResetEmail,fetchSignInMethodsForEmail,setUserExists} from 'firebase/auth'

const ResetPassword = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if(signInMethods.length > 0)
      {
        sendPasswordResetEmail(auth, email)
              .then(() => {
                // Password reset email sent successfull
                alert("Password reset email sent.")
                navigate('/login')
              })
              .catch((error) => {
                // Handle password reset email sending errors
                console.error("Error sending password reset email:", error);
                alert("Error sending password reset email:", error)
              });
      }
      else
      {
        alert('The email not registered')
      }
   
    } catch (error) {
      console.error("Error checking user by email:", error);
    }

  };

  return (
    <div className="container">
      <h1>Reset Password </h1>
      <form onSubmit={handleSubmit}>
      
            <label htmlFor="pass_email_id"> Enter your Email </label>
            <input
              type="text"
              id="pass_email_id"
              value={email}
              onChange={handleEmailChange}
              required
            />
        
       
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};



export default ResetPassword;
