import React from 'react';

const Question = ({
  question,
  selectedAnswer,
  onAnswerSelection,
  onAnswerSubmission,
}) => {
  return (
    <div>
      <h2>Question: {question.question}</h2>
      <ul>
        {question.options.map((option, index) => (
          <li
            key={index}
            className={selectedAnswer === option ? 'selected' : ''}
            onClick={() => onAnswerSelection(option)}
          >
            {option}
          </li>
        ))}
      </ul>
      <button onClick={onAnswerSubmission}>Submit Answer</button>
    </div>
  );
};

export default Question;
