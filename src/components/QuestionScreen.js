import React, { useEffect, useState } from 'react';
import '../styles/QuestionScreen.css';

function QuestionScreen({
  currentQuestion,
  isAnswerSubmitted,
  selectedAnswer,
  handleAnswer,
  score,
  knowledgeLevel,
  questionIndex,
  totalQuestions = 10,
  correctStreak = 0,
}) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [gracePeriodTriggered, setGracePeriodTriggered] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isAnswerSubmitted) return;

    if (timeLeft === 0 && !gracePeriodTriggered) {
      setGracePeriodTriggered(true);
      setTimeout(() => handleAnswer(null), 1000); // Grace period
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isAnswerSubmitted, gracePeriodTriggered, handleAnswer]);

  useEffect(() => {
    setTimeLeft(15);
    setGracePeriodTriggered(false);
  }, [currentQuestion]);

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  const getFeedbackMessage = () => {
    if (selectedAnswer === currentQuestion.correct_answer) {
      return correctStreak >= 3
        ? `🔥 Correct! Streak: ${correctStreak} 🔥`
        : '✅ Correct!';
    } else if (selectedAnswer === null) {
      return `⏰ Time's up! Correct answer: ${currentQuestion.correct_answer}`;
    } else {
      return `❌ Incorrect! Correct answer: ${currentQuestion.correct_answer}`;
    }
  };

  return (
    <div className="question-screen">
      {/* Level Dots */}
      <div className="level-bar-container">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`level-step ${i <= questionIndex ? 'filled' : ''}`}
          />
        ))}
      </div>

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Score, Level, Timer */}
      <div className="score-board">
        <span className="score">🏆 Score: {Math.round(score)}</span>
        <span className="knowledge-level">📚 Model Focus: {knowledgeLevel.toFixed(2)}</span>
        <span className={`timer ${timeLeft <= 5 ? 'urgent' : ''}`}>⏳ Time Left: {timeLeft}s</span>
      </div>

      {!isAnswerSubmitted && timeLeft === 0 && (
        <div className="time-warning">⏰ Time’s up! Submitting answer...</div>
      )}

      {/* Question Text */}
      <h2 className="question-text">{currentQuestion.question}</h2>

      {/* Options */}
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

      {/* Feedback */}
      {isAnswerSubmitted && (
        <div className="feedback animated-feedback">{getFeedbackMessage()}</div>
      )}
    </div>
  );
}

export default QuestionScreen;
