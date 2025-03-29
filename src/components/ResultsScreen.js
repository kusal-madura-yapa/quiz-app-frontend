import React from "react";
import "../styles/ResultsScreen.css"; // Make sure to import this CSS

function ResultsScreen({ results, goHome }) {
  const score = results?.final_score || 0;
  const knowledge = results?.final_knowledge_level
    ? (results.final_knowledge_level * 100).toFixed(1)
    : "0.0";

  const weakAreas = results?.weak_areas || results?.weakareas_summary || [];

  return (
    <div className="results-screen">
      <h1 className="results-title">🎉 Quiz Complete!</h1>

      <div className="results-box">
        <p><strong>Total Questions:</strong> {results?.total_questions || 0}</p>
        <p><strong>Final Score:</strong> {score}</p>
        <p><strong>Knowledge Level:</strong> {knowledge}%</p>

        <h3>🧠 Weak Areas</h3>
        <ul className="weak-list">
          {weakAreas && Object.keys(weakAreas).length > 0 ? (
            Object.entries(weakAreas).map(([area, count], index) => (
              <li key={index}>
                <span className="weak-area">{area}</span>: {count} incorrect
              </li>
            ))
          ) : Array.isArray(weakAreas) && weakAreas.length > 0 ? (
            weakAreas.map(([area, count], index) => (
              <li key={index}>
                <span className="weak-area">{area}</span>: {count} incorrect
              </li>
            ))
          ) : (
            <li>No weak areas identified 🎯</li>
          )}
        </ul>
      </div>

      <button className="home-button" onClick={goHome}>
        🏠 Back to Home
      </button>
    </div>
  );
}

export default ResultsScreen;
