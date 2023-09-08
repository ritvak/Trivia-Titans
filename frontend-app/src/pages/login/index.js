import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {auth,provider} from "./config";
import { signInWithPopup,FacebookAuthProvider ,signInWithEmailAndPassword} from 'firebase/auth';
import './login_css.css';




function LoginPage()
{
   // Initialize local state variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  
    //  sending email and password to backend and fetch responce from backend (logged in or not ) . on submit this function triggers 
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(user)
  
        if (user.emailVerified) {
          // User's email has been verified, you can proceed with further actions
                  
                  navigate('/login/varification/'+email);
          //       alert("please verify the security questions")
        } else {
          // User's email has not been verified yet
          alert("Please verify your email before proceeding.");
        }

      } catch (error) {
        // Handle sign-in errors (e.g., invalid credentials)
        alert('invalid credentials');
      }
   


    };

    const handleGoogleRegister = async () => {

      signInWithPopup(auth,provider)
      .then((result)  =>  {
 
 
       const user = result.user;
       console.log(user)
       sessionStorage.setItem('user_id',user.uid)
       console.log(sessionStorage.getItem('user_id'))
 
       // Send user information to the backend
        fetch('https://550slvpt4e.execute-api.us-east-1.amazonaws.com/google/register', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           'name':user.displayName,
           'email':user.email,
           'photo':user.photoURL,
           'user_id':user.uid,
           'phone':user.phoneNumber
  
         }),
       })
       .then(response => response.json())
       .then(data => {
         console.log(data)
         console.log(data.status)
         console.log(data.email)
         if(data.status)
         {
           navigate('/login/varification/'+data.email);
         }
         else
         {
           navigate('/sign-up/factors/'+data.email);
         }
       })
 
 
      })
  
 
   };

   const handleFacebookRegister = () => {
    const pro=new FacebookAuthProvider();
    signInWithPopup(auth, pro)
    .then((result) => {
      // The signed-in user info.
      const user = result.user;
  
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
  
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
  
      // ...
    });


};
  
    // disply the form to login 
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-group">
          <div className="social-login-buttons">
            <button className="google" onClick={handleGoogleRegister}>
            Login with Google
            </button>
            <button className="facebook" onClick={handleFacebookRegister}>
            Login with Facebook
            </button>
          </div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className="login-link">
            <br/>
            Don't have an account ?  <Link to="/sign-up">Register Now</Link>
      </div>
      <div className="login-link">
            <br/>
            Forget password ?  <Link to="/forget-password">Reset password</Link>
      </div>
        </form>
     
      </div>
    );
  };

export default LoginPage;
