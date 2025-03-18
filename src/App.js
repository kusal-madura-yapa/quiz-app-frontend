import React, { useState } from 'react';
import HomePage from './components/HomePage';
import StartScreen from './components/StartScreen';
import QuestionScreen from './components/QuestionScreen';
import ResultsScreen from './components/ResultsScreen';
import RecordsPage from './components/RecordsPage';
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

  const startQuiz = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/start_quiz', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.message) {
        setQuizStarted(true);
        setScreen('quiz');
        fetchNextQuestion();
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
        const resultsResponse = await fetch('http://localhost:5001/api/quiz_results', { credentials: 'include' });
        const resultsData = await resultsResponse.json();
        setQuizResults(resultsData);
        setScreen('results');
      } else if (data.question) {
        setCurrentQuestion(data);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
      }
    } catch (error) {
      console.error('Error fetching next question:', error);
    }
  };

  const deleteAllRecords = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/delete_all_records', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      alert(data.message);
      setScreen('home');
    } catch (error) {
      console.error('Error deleting records:', error);
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

  const resetModel = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/reset_model', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      alert(data.message);
      setScreen('home');
    } catch (error) {
      console.error('Error resetting model:', error);
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

        setTimeout(fetchNextQuestion, 2000);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomePage
          startQuiz={startQuiz}
          viewRecords={() => setScreen('records')}
          resetData={resetData}
          resetModel={resetModel}
          deleteAllRecords={deleteAllRecords}
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
        />
      )}
      {screen === 'results' && <ResultsScreen results={quizResults} goHome={() => setScreen('home')} />}
      {screen === 'records' && <RecordsPage goHome={() => setScreen('home')} />}
    </div>
  );
}

export default App;