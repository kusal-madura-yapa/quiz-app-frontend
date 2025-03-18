import React from 'react';

function QuestionScreen({ currentQuestion, isAnswerSubmitted, selectedAnswer, handleAnswer, score, knowledgeLevel }) {
  return (
    <div className="question-screen">
      <div className="score-board">
        <span className="score">Score: {score !== undefined ? Math.round(score) : 0}</span>
        <span className="knowledge-level">Knowledge Level: {(knowledgeLevel * 100).toFixed(1)}%</span>
      </div>
      
      <h2 className="question-text">{currentQuestion.question}</h2>
      
      <div className="options">
        {currentQuestion.options.map((option, index) => {
          let className = 'option';
          if (isAnswerSubmitted) {
            if (option === currentQuestion.correct_answer) {
              className += ' correct';
            } else if (option === selectedAnswer) {
              className += ' incorrect';
            }
          }
          
          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={isAnswerSubmitted}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswerSubmitted && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correct_answer 
            ? 'Correct! 🎉' 
            : `Incorrect! Correct answer: ${currentQuestion.correct_answer}`}
        </div>
      )}
    </div>
  );
}

export default QuestionScreen;