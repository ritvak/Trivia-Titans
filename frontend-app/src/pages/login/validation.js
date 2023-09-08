import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './validation.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {auth,provider} from "./config";

const FactorLoginAnswer = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const { link_email } = useParams(); 
  const navigate = useNavigate();


  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://litrbj35ld.execute-api.us-east-1.amazonaws.com/getOne/one_question');
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

      const keysArray = Object.keys(answers);
      const firstKey = keysArray[0];
     
      const response = await axios.get(
        "https://et1j41hfbb.execute-api.us-east-1.amazonaws.com/test/qna",
        { 
          params: {
            link_email: link_email,
            answer: answers[firstKey],
            question_id:firstKey

          },
        }
      );

      if(response.data.status)
      {
        alert(' you are logged in successfully')

        localStorage.setItem('user_id',response.data.user_id);
        localStorage.setItem('email',response.data.email);

        const login = await axios.get(
          "https://8i0lrv06v9.execute-api.us-east-1.amazonaws.com/users/logs",
          { 
            params: {
              user_id: localStorage.getItem("user_id"),
              email: localStorage.getItem("email"),
              activity:"login"
  
            },
          }
        );

        if(localStorage.getItem("user_id")==="A5H9LYr1gqcccUYt2ZUYKhzFB2X2")
         {
          navigate('/QuestionList/');
         }
         else
         {
          navigate('/profile/'+localStorage.getItem("user_id"));

          //navigate('/profile/'+response.data.user_id);
         }

      
      }
      else{
        alert('please provide the correct answer')
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }

    

  };

  return (
    <div className="container">
      <h1>Varification</h1>
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



export default FactorLoginAnswer;

