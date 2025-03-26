import React, { useState, useEffect } from 'react';
import "../styles/ReviewScreen.css";

function ReviewScreen({ questions, selectedAnswers, handleAnswer, submitAnswers, goHome }) {
  const [showSubmit, setShowSubmit] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const answeredCount = selectedAnswers.filter(ans =>
      questions.find(q => q.question === ans.question)
    ).length;
    setProgress(Math.round((answeredCount / questions.length) * 100));
    setShowSubmit(answeredCount === questions.length);
  }, [selectedAnswers, questions]);

  const onSelect = (questionText, answer) => {
    handleAnswer(questionText, answer);
  };

  return (
    <div className="review-screen">
      <h2 className="section-title">🎯 Retake Frequently Missed Questions</h2>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-text">{progress}% Complete</span>
      </div>

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
                  {userSelected === option && " ✔️"}
                </button>
              ))}
            </div>
            <p className="weak-area">📚 <em>Category: {q.weakarea}</em></p>
            <hr />
          </div>
        );
      })}

      <div className="review-actions">
        <button onClick={goHome} className="back-button">🏠 Home</button>
        {showSubmit && (
          <button onClick={submitAnswers} className="submit-button">🚀 Submit Answers</button>
        )}
      </div>

      {showSubmit && <p className="motivation-text">🌟 Great job! You’re ready to go! 🌟</p>}
    </div>
  );
}

export default ReviewScreen;
