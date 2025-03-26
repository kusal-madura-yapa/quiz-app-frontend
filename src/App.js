import React, { useState } from 'react';
import HomePage from './components/HomePage';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import RecordsPage from './components/RecordsPage';
import ReviewScreen from './components/ReviewScreen';
import './styles.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0.5);
  const [quizResults, setQuizResults] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [reviewAnswers, setReviewAnswers] = useState([]);
  const [reviewResult, setReviewResult] = useState(null);

  const startQuiz = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/start_quiz', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1 })
      });
      const data = await response.json();
      if (response.ok) {
        setQuizStarted(true);
        setScreen('quiz');
        fetchNextQuestion();
      } else {
        console.error('Error starting quiz:', data.error);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const fetchNextQuestion = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/next_question', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.message === "Quiz completed!") {
        const resultsResponse = await fetch('http://localhost:5001/api/quiz_results', {
          credentials: 'include',
        });
        const resultsData = await resultsResponse.json();
        setQuizResults(resultsData);
        setScreen('results');
      } else if (data.question) {
        setCurrentQuestion(data);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setQuestionIndex((prevIndex) => prevIndex + 1);
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const handleAnswer = async (answer) => {
    if (!isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      setSelectedAnswer(answer);

      try {
        const response = await fetch('http://localhost:5001/api/submit_answer', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer }),
        });
        const result = await response.json();

        if (result.correct) {
          setScore(prev => prev + currentQuestion.difficulty);
          setKnowledgeLevel(prev => Math.min(1.0, prev + 0.1));
        } else {
          setScore(prev => prev - currentQuestion.difficulty * 0.5);
          setKnowledgeLevel(prev => Math.max(0.0, prev - 0.1));
        }

        setScore(result.score);
        setTimeout(fetchNextQuestion, 2000);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  };

  const resetData = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/reset_data', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      alert(data.message);
      setScreen('home');
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  const fetchReviewQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/get_quiz_questions_re');
      const data = await response.json();
      if (response.ok) {
        setReviewQuestions(data.questions_with_fake_answers);
        setReviewAnswers([]);  // Reset any previous answers
        setScreen('review');
      } else {
        console.error('Error fetching review questions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching review questions:', error);
    }
  };

  const submitReviewAnswers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/submit_quiz_re', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          answers: reviewAnswers
        })
      });
      const result = await response.json();
      setReviewResult(result);
      setScreen('records'); // ✅ GO TO RECORDS PAGE
    } catch (error) {
      console.error('Error submitting review answers:', error);
    }
  };

  const handleReviewAnswer = (question, userAnswer) => {
    const updatedAnswers = [...reviewAnswers];
    const index = updatedAnswers.findIndex(ans => ans.question === question);
    if (index !== -1) {
      updatedAnswers[index].user_answer = userAnswer;
    } else {
      updatedAnswers.push({ question, user_answer: userAnswer });
    }
    setReviewAnswers(updatedAnswers);
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomePage
          startQuiz={startQuiz}
          viewRecords={() => setScreen('records')}
          resetData={resetData}
          reviewQuestions={fetchReviewQuestions}
        />
      )}
      {screen === 'quiz' && quizStarted && currentQuestion && (
        <QuestionScreen
          currentQuestion={currentQuestion}
          isAnswerSubmitted={isAnswerSubmitted}
          selectedAnswer={selectedAnswer}
          handleAnswer={handleAnswer}
          score={score}
          knowledgeLevel={knowledgeLevel}
          questionIndex={questionIndex - 1}
          totalQuestions={10}
          correctStreak={0}
        />
      )}
      {screen === 'review' && (
        <ReviewScreen
          questions={reviewQuestions}
          selectedAnswers={reviewAnswers}
          handleAnswer={handleReviewAnswer}
          submitAnswers={submitReviewAnswers}
          goHome={() => setScreen('home')}
        />
      )}
      {screen === 'results' && (
        <ResultsScreen
          results={quizResults}
          goHome={() => setScreen('home')}
        />
      )}
      {screen === 'records' && (
        <RecordsPage goHome={() => setScreen('home')} />
      )}
    </div>
  );
}

export default App;
