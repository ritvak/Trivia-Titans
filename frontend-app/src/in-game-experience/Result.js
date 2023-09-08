import React from 'react';

const Result = ({ isAnswerCorrect, onNextQuestion }) => {
  return (
    <div>
      {isAnswerCorrect ? (
        <p>Correct Answer!</p>
      ) : (
        <p>Wrong Answer!</p>
      )}
      <button onClick={onNextQuestion}>Next Question</button>
    </div>
  );
};

export default Result;
