import React from 'react';
import '../styles/HomePage.css'; // Link to the CSS file

function HomePage({ startQuiz, viewRecords, resetData, reviewQuestions, viewRecommendations, viewLeaderboard }) {
  return (
    <div className="home-page">
      <h1 className="home-title">🎯 Welcome to the Adaptive Quiz</h1>
      <p className="home-subtitle">Your personalized learning assistant</p>

      <div className="button-group">
        <button className="btn primary" onClick={startQuiz}>🚀 Start New Quiz</button>
        <button className="btn" onClick={viewRecords}>📜 View Quiz History</button>
        <button className="btn" onClick={viewRecommendations}>📺 View Recommendations</button>
        <button className="btn" onClick={reviewQuestions}>🔁 Retake Weak Questions</button>
        <button className="btn" onClick={viewLeaderboard}>🏆 Leaderboard</button>
        <button className="btn danger" onClick={resetData}>🧹 Reset Quiz Data</button>
      </div>
    </div>
  );
}

export default HomePage;
