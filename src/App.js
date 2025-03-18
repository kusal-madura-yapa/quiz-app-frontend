import React, { useState } from 'react';
import HomePage from './components/HomePage';
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
  const [maxAttemptsQuestions, setMaxAttemptsQuestions] = useState([]);  // Store questions with max attempts

  const startQuiz = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/start_quiz', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1 }) // Replace 1 with the actual user ID
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
  
        // Update the score from the response (if available)
        setScore(result.score); // This updates the score based on the backend response
  
        setTimeout(fetchNextQuestion, 2000);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
  };

  const retakeQuiz = async () => {
    // Fetch questions with the maximum attempts
    try {
      const response = await fetch('http://localhost:5003/api/get_max_attempts_questions', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      
      if (response.ok) {
        setMaxAttemptsQuestions(data.questions_with_fake_answers);  // Store the questions with fake answers
        setScreen('quiz');  // Go to quiz screen with fetched questions
        setQuizStarted(true);
      } else {
        console.error('Error fetching max attempts questions:', data.error);
      }
    } catch (error) {
      console.error('Error retaking quiz:', error);
    }
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomePage
          startQuiz={startQuiz}
          viewRecords={() => setScreen('records')}
          resetData={resetData}  // ✅ Keep only resetData
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