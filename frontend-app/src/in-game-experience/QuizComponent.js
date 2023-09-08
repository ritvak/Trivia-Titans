import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './QuizComponent.css';
import MessagingApp from './MessagingApp.js';
import { useLocation, Link } from 'react-router-dom';


const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [quizFinished, setQuizFinished] = useState(false);
  const [timer, setTimer] = useState(20);
  const [totalScore, setTotalScore] = useState(0);
  const [userPoints, setUserPoints] = useState(0);

  const team_name=sessionStorage.getItem('team_name');
  const user_id = localStorage.getItem('user_id');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryKey = queryParams.get('categoryKey');
  const categoryValue= queryParams.get('categoryValue');
  const [currentScore, setCurrentScore] = useState(0);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState('');
  const [questionCorrectAnswer, setQuestionCorrectAnswer] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      var response=''
      try {
        if(categoryKey=='difficulty'){
          const data={
            'difficulty': categoryValue
            }
        const queryString = new URLSearchParams(data).toString();
        response = await axios.get(`https://0y5iijbgm8.execute-api.us-east-1.amazonaws.com/dev/quiz?${queryString}`);
      console.log('difficulty')
    }
    if(categoryKey=='category'){
      const data={
        'category': categoryValue
        }
    const queryString = new URLSearchParams(data).toString();
    response = await axios.get(`https://ejv3vr842a.execute-api.us-east-1.amazonaws.com/dev/categoryquiz?${queryString}`);
  console.log('category')
}

        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timerId = null;
    if (timer > 0 && !quizFinished) {
      timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      handleQuestionTimeout();
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timer, quizFinished]);

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
  };

  const handleAnswerSubmission = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    // Call the lambda function to validate the answer
    try {
      const response = await axios.post('https://tl6igqixe4.execute-api.us-east-1.amazonaws.com/dev/validate', {
        question: currentQuestion.question,
        selectedOption: selectedOption,
      });
      console.log(response);

      if (response.data === true) {
        setAnswerStatus('Correct');
        // Increment the total score by 2 if the answer is correct
        setTotalScore((prevScore) => prevScore + 2);
        // Increment the user's points by 2 if the answer is correct
        setUserPoints((prevPoints) => prevPoints + 2);
      } else{
        setAnswerStatus('Incorrect');
        // Increment the total score by 0.5 if the answer is incorrect
        setTotalScore((prevScore) => prevScore + 0.5);
        // Increment the user's points by 0.5 if the answer is incorrect
        setUserPoints((prevPoints) => prevPoints + 0.5);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setAnswerStatus('Error');
    }

    // Move to the next question or finish the quiz if all questions are done
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const handleQuestionTimeout = () => {
    if (selectedOption === '') {
      setAnswerStatus('Question not answered');
      setShowCorrectAnswer(true);
      setQuestionCorrectAnswer(currentQuestion.correctAnswer);
    }
    else {
      setShowCorrectAnswer(false); // Hide the correct answer if an option was selected
    }
    setTimeout(() => {
      moveToNextQuestion();
    }, 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuizFinished(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption('');
      setAnswerStatus('');
      setTimer(20);
      setShowCorrectAnswer(false);
    }
  };

  useEffect(() => {
    setCurrentScore(totalScore);
  }, [totalScore]);

  useEffect(() => {
    // Check if the quiz is finished and the total score is more than 3
    if (quizFinished && totalScore > 3) {
      // Make an API call to update "Wins" for the team
      try {
        axios.post('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/update_games', {
          team_name: team_name,
          updateType: 'Wins',
        });
      } catch (error) {
        console.error('Error updating Wins:', error);
      }
      try {
        axios.post('https://dmi354kvr7.execute-api.us-east-1.amazonaws.com/dev/updateuserprogress', {
          user_id: user_id, // Replace 'user_id_here' with the actual user_id of the user
          wins: 1,
          losses: 0,
          total_points: userPoints,
        });
      } catch (error) {
        console.error('Error updating Wins:', error);
      }
      try {
        // Replace 'delete-lambda-url' with the actual URL of your delete Lambda function
        axios.post('https://sifo6apqw1.execute-api.us-east-1.amazonaws.com/dev/deletequestions');
        console.log('Database cleared successfully.');
      } catch (error) {
        console.error('Error clearing the database:', error);
      }
    } else if (quizFinished) {
      // Make an API call to update "Losses" for the team
      console.log("quiz finished")
      try {
        axios.post('https://veec54a9e9.execute-api.us-east-1.amazonaws.com/dev/update_games', {
          team_name: team_name,
          updateType: 'Losses',
        });
      } catch (error) {
        console.error('Error updating Losses:', error);
      }
      try {
        axios.post('https://dmi354kvr7.execute-api.us-east-1.amazonaws.com/dev/updateuserprogress', {
          user_id: user_id, // Replace 'user_id_here' with the actual user_id of the user
          wins: 0,
          losses: 1,
          total_points: userPoints,
        });
      } catch (error) {
        console.error('Error updating Losses:', error);
      }
      try {
        // Replace 'delete-lambda-url' with the actual URL of your delete Lambda function
        axios.post('https://sifo6apqw1.execute-api.us-east-1.amazonaws.com/dev/deletequestions');
        console.log('Database cleared successfully.');
      } catch (error) {
        console.error('Error clearing the database:', error);
      }
    }
  }, [quizFinished, totalScore, userPoints]);

  if (quizFinished) {
    const isWin = totalScore > 3;
    return <Container className="mt-4">
    <h2>Quiz Finished!</h2>
    <p>Total Score: {totalScore}</p>
    {isWin ? <p>Congratulations! Your team won!</p> : <p>Unfortunately, your team lost.</p>}
    <div className="card">
        {/* Wrap the card with a Link to navigate to the Lobby */}
        <Link to="/Lobby" className="card-content">
          <h3>Go to Lobby</h3>
          {/* Add any additional content or styles for the card */}
        </Link>
    </div>
  </Container>
  }

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

    return (
      <Container className="mt-4">
      <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '18px' }}>
        Score: {currentScore}
      </div>
        <Row>
          <Col>
            <h2>Question: {currentQuestion.question}</h2>
            <p>Timer: {timer} seconds</p>
            <Form>
              {currentQuestion.options.map((option, index) => (
                <Form.Check
                  key={index}
                  type="radio"
                  label={option}
                  name="selectedOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionSelection(option)}
                />
              ))}
            </Form>
            {answerStatus && (
          <div>
            <p>{answerStatus}!</p>
            {answerStatus === 'Question not answered' && (
              <p>Correct Answer: {questionCorrectAnswer}</p>
            )}
          </div>
        )}
        <div className="quiz-submit-container">
          <Button onClick={handleAnswerSubmission} disabled={!selectedOption}>
            Submit Answer
          </Button>
        </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <MessagingApp />
          </Col>
        </Row>
      </Container>
      
    );
  };

  export default QuizComponent;  