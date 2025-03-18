import React from 'react';

function ResultsScreen({ results, goHome }) {
  return (
    <div className="results-screen">
      <h1>Quiz Complete!</h1>
      <div className="results">
        <p><strong>Total Questions:</strong> {results?.total_questions || 0}</p>
        <p><strong>Final Score:</strong> {results?.final_score || 0}</p>
        <p><strong>Final Knowledge Level:</strong> {(results?.final_knowledge_level ? (results.final_knowledge_level * 100).toFixed(1) : "0.0")}%</p>
        
        <h3>Weak Areas:</h3>
        <ul>
          {results?.weak_areas && Object.keys(results.weak_areas).length > 0 ? (
            Object.entries(results.weak_areas).map(([area, count]) => (
              <li key={area}>{area}: {count} incorrect answers</li>
            ))
          ) : (
            <li>No weak areas identified</li>
          )}
        </ul>
      </div>
      
      <button className="home-button" onClick={goHome}>Go to Home</button>
    </div>
  );
}

export default ResultsScreen;