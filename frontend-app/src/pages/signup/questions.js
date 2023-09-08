import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './questions.css';
import { useNavigate } from 'react-router-dom';
import {auth,provider} from "./config";
import { signInWithPopup,reauthenticateWithCredential,signInWithEmailAndPassword ,EmailAuthProvider,sendEmailVerification } from 'firebase/auth'

 console.log(localStorage.getItem('password'))
 console.log(localStorage.getItem('current_user'))

 

 const online = auth.currentUser;
 if (!online) {
   // No current user, handle appropriately (e.g., show error message or prompt to sign in)
   console.log("No user is signed in.");
 }
 


const FactorQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const { link_email } = useParams(); 
  const navigate = useNavigate();


  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://2ljbxzk0lb.execute-api.us-east-1.amazonaws.com/get/all_questions');
      const data = await response.json();
       setQuestions(data);
    // console.log(data);
    } catch (error) {
    //   console.log(error);
    }
  };

  const handleAnswerChange = (e, questionId) => {
    const updatedAnswers = { ...answers, [questionId]: e.target.value };
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://djtl9puhwc.execute-api.us-east-1.amazonaws.com/qnuser/useransers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, link_email })
      });
      const res = await response.json();
      if(res.status)
      {
        alert(' please verify your email then login ')
        navigate('/login');
      }
   
      // Reset the answers
      setAnswers({});
    } catch (error) {
    //   console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Questionnaire</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} className="question">
            <label htmlFor={question.id}>{question.text}</label>
            <input
              type="text"
              id={question.id}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(e, question.id)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};



export default FactorQuestions;
