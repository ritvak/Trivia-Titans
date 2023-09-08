import React,  { useState, useEffect } from 'react';
import './registration.css';
// import image from './image.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {auth,provider} from "./config";
import { signInWithPopup,FacebookAuthProvider,sendEmailVerification ,createUserWithEmailAndPassword ,sendPasswordResetEmail} from 'firebase/auth'




const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [value,setValue] = useState('')
  

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    // Prepare the registration data object
    const registrationData = {
      name: name,
      email: email,
      password: password
    };
    localStorage.setItem('password',registrationData.password);

      createUserWithEmailAndPassword(auth,registrationData.email,registrationData.password)
      .then((userCredential) => {
        // User creation successful
      const user = userCredential.user;
      sendEmailVerification(auth.currentUser)
      .then(() => {
        // Verification email sent successfully
        alert("Email verification link sent . please further proceed for queation varification");
      })
      .catch((error) => {
        // Handle email sending errors
        console.error("Error sending email verification link:", error);
      });


        registrationData.user_id= user.uid
        localStorage.setItem('current_user',user);
          // Send the registration data to the backend
          fetch('https://epp3jjmm25.execute-api.us-east-1.amazonaws.com/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
          })
            .then(response => {
              if (response.ok) {

                fetch(' https://xg57hhhxjd.execute-api.us-east-1.amazonaws.com/dev/usergameregister', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    user_id: user.uid,
                    username:registrationData.name
                  })
                })
                .then(response => response.json())
                .then(data => {
                  // Handle the response data if needed
                  console.log(data);
                })
                .catch(error => {
                  console.error('Error storing game registration details:', error);
                });


                alert(' Next step : 2 Factor varification');
                navigate('/sign-up/factors/'+email);
                // Reset the form fields
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              } else {
                alert('Registration failed');
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });

             


      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error creating user:", errorMessage);
      });

  
  };

 
  const handleGoogleRegister = async () => {

     signInWithPopup(auth,provider)
     .then((result)  =>  {


      const user = result.user;
      console.log(user)

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

  return (
    <div className="registration-page">
      {/* <div className="image-container">
        <img src={image} alt="Registration" />
      </div> */}
      <div className="registration-form">
        <div className="social-login-buttons">
          <button className="google" onClick={handleGoogleRegister}>
            Register with Google
          </button>
          <button className="facebook" onClick={handleFacebookRegister}>
            Register with Facebook
          </button>
        </div>
        <h2>Registration</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="submit-button">
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
