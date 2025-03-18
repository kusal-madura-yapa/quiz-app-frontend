// import React from 'react';

// function HomePage({ startQuiz, viewRecords, resetData, retakeQuiz }) {
//   return (
//     <div className="home-page">
//       <h1 className="home-title">Welcome to the Adaptive Quiz</h1>
      
//       <div className="button-group">
//         <button className="start-button" onClick={startQuiz}>Start New Quiz</button>
//         <button className="records-button" onClick={viewRecords}>View Previous Records</button>
//       </div>

//       <div className="button-group">
//         <button className="reset-button" onClick={resetData}>Reset Quiz Data</button>
//         {/* <button className="retake-quiz-button" onClick={retakeQuiz}>Retake kkkQuiz</button> This will trigger retakeQuiz */}
//       </div>
//     </div>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Fetch quiz questions from the backend
  useEffect(() => {
    fetch('http://localhost:5003/api/get_max_attempts_questions')
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions_with_fake_answers);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  // Handle the user's answer selection
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  // Submit the answer for the current question
  const handleSubmitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1); // Increment score if correct
    }

    // Store the selected answer for submission later
    setCorrectAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }));

    setIsAnswerSubmitted(true);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Finish the quiz
  const handleFinishQuiz = () => {
    // Submit all answers to the backend
    fetch('http://localhost:5003/api/submit_quiz_attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correct_answers: correctAnswers }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Quiz finished! Your score is ${score}/${questions.length}`);
        setQuizFinished(true);
      })
      .catch((error) => console.error('Error submitting quiz:', error));
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="quiz-app">
      <div className="question-screen">
        <h2>{questions[currentQuestionIndex].question}</h2>
        <div className="options">
          {questions[currentQuestionIndex].options.map((option, index) => {
            const isCorrect = option === questions[currentQuestionIndex].correct_answer;
            return (
              <button
                key={index}
                className={selectedAnswer === option ? (isCorrect ? 'correct' : 'incorrect') : ''}
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
            {selectedAnswer === questions[currentQuestionIndex].correct_answer
              ? 'Correct! 🎉'
              : `Incorrect! Correct answer: ${questions[currentQuestionIndex].correct_answer}`}
          </div>
        )}

        {isAnswerSubmitted ? (
          currentQuestionIndex < questions.length - 1 ? (
            <button onClick={handleNextQuestion}>Next Question</button>
          ) : (
            <button onClick={handleFinishQuiz}>Finish Quiz</button>
          )
        ) : (
          <button onClick={handleSubmitAnswer}>Submit Answer</button>
        )}
      </div>

      <div className="score-board">
        <span>Score: {score}</span>
      </div>
    </div>
  );
};

export default HomePage;