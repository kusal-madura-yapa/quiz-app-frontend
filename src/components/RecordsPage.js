import React, { useState, useEffect } from 'react';
import '../styles/RecordsPage.css';

function RecordsPage({ goHome }) {
  const [records, setRecords] = useState([]);
  const [showDetails, setShowDetails] = useState({}); // Track visibility for each record

  useEffect(() => {
    // Fetch previous quiz records from the backend
    fetch('http://localhost:5001/api/previous_records?userid=1', { credentials: 'include' })  // Replace 1 with dynamic user ID
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Records:", data); // Debugging
        setRecords(data.history || []);
      })
      .catch(error => console.error('Error fetching records:', error));
  }, []);

  // Toggle visibility for a specific record
  const toggleDetails = (quizId) => {
    setShowDetails(prev => ({
      ...prev,
      [quizId]: !prev[quizId] // Toggle the state
    }));
  };

  return (
    <div className="records-page">
      <h1 className="title">📜 Previous Quiz Records</h1>
      {records.length === 0 ? (
        <p className="no-records">No previous records found.</p>
      ) : (
        <div className="records-container">
          {records.map((record, index) => (
            <div className="record-card" key={record.quiz_id}>
              <h2>📌 Attempt {index + 1}</h2>
              <p><strong>📝 Total Questions:</strong> {record.total_questions}</p>
              <p><strong>🎯 Final Score:</strong> {record.final_score}</p>
              <p><strong>📊 Knowledge Level:</strong> {(record.final_knowledge_level * 100).toFixed(1)}%</p>

              <div className="weak-areas">
                <h3>⚠️ Weak Areas</h3>
                {record.weak_areas && Object.keys(record.weak_areas).length > 0 ? (
                  <ul>
                    {Object.entries(record.weak_areas).map(([area, count]) => (
                      <li key={area}>🔹 {area}: {count} mistakes</li>
                    ))}
                  </ul>
                ) : (
                  <p>✅ No weak areas</p>
                )}
              </div>

              {/* Toggle Button */}
              <button 
                className="toggle-button" 
                onClick={() => toggleDetails(record.quiz_id)}
              >
                {showDetails[record.quiz_id] ? "🙈 Hide Questions" : "👀 Show Questions"}
              </button>

              {/* Hidden Details (Correct and Incorrect Answers) */}
              {showDetails[record.quiz_id] && (
                <div className="answers-section">
                  <div className="correct-answers">
                    <h3>✅ Correct Answers</h3>
                    {record.correct_answers && record.correct_answers.length > 0 ? (
                      <ul>
                        {record.correct_answers.map((question, i) => (
                          <li key={i}><strong>Q:</strong> {question}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No correct answers</p>
                    )}
                  </div>

                  <div className="incorrect-answers">
                    <h3>❌ Incorrect Answers</h3>
                    {record.incorrect_answers && record.incorrect_answers.length > 0 ? (
                      <ul>
                        {record.incorrect_answers.map(({ question, correct_answer }, i) => (
                          <li key={i}>
                            <strong>Q:</strong> {question} <br />
                            <strong>✔ Correct Answer:</strong> {correct_answer}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No incorrect answers</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button className="home-button" onClick={goHome}>🏠 Back to Home</button>
    </div>
  );
}

export default RecordsPage;