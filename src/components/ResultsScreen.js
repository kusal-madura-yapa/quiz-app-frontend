import React from 'react';

function ResultsScreen({ results, goHome }) {
  return (
    <div className="results-screen">
      <h1>Quiz Complete!</h1>
      <div className="results">
        <p><strong>Total Questions:</strong> {results.total_questions}</p>
        <p><strong>Final Score:</strong> {results.final_score}</p>
        <p><strong>Final Knowledge Level:</strong> {(results.final_knowledge_level * 100).toFixed(1)}%</p>
        
        <h3>Weak Areas:</h3>
        <ul>
          {Object.entries(results.weak_areas).map(([area, count]) => (
            <li key={area}>{area}: {count} incorrect answers</li>
          ))}
        </ul>
      </div>
      
      <button className="home-button" onClick={goHome}>Go to Home</button>
    </div>
  );
}

export default ResultsScreen;