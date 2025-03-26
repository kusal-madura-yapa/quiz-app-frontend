import React, { useState } from 'react';
import "../styles/ReviewScreen.css";

function ReviewScreen({ questions, selectedAnswers, handleAnswer, submitAnswers, goHome }) {
  const [showSubmit, setShowSubmit] = useState(false);

  const onSelect = (questionText, answer) => {
    handleAnswer(questionText, answer);

    const allAnswered = questions.every(q =>
      selectedAnswers.some(ans => ans.question === q.question)
    );
    setShowSubmit(allAnswered);
  };

  return (
    <div className="review-screen">
      <h2 className="section-title">Retake Frequently Missed Questions</h2>

      {questions.map((q, index) => {
        const userSelected = selectedAnswers.find(ans => ans.question === q.question)?.user_answer;

        return (
          <div key={index} className="question-block">
            <p className="question-text"><strong>Q{index + 1}:</strong> {q.question}</p>
            <div className="options-group">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  className={`option-button ${userSelected === option ? 'selected' : ''}`}
                  onClick={() => onSelect(q.question, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="weak-area"><em>Category: {q.weakarea}</em></p>
            <hr />
          </div>
        );
      })}

      <div className="review-actions">
        <button onClick={goHome} className="back-button">Back to Home</button>
        {showSubmit && (
          <button onClick={submitAnswers} className="submit-button">Submit Answers</button>
        )}
      </div>
    </div>
  );
}

export default ReviewScreen;
