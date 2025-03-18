import React, { useState, useEffect } from 'react';
import '../styles/RecordsPage.css';

function RecordsPage({ goHome }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/previous_records', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Records:", data); // Debugging
        setRecords(data.history || []);
      })
      .catch(error => console.error('Error fetching records:', error));
  }, []);

  return (
    <div className="records-page">
      <h1 className="title">📜 Previous Quiz Records</h1>
      {records.length === 0 ? (
        <p className="no-records">No previous records found.</p>
      ) : (
        <div className="records-container">
          {records.map((record, index) => (
            <div className="record-card" key={index}>
              <h2>📌 Attempt {index + 1}</h2>
              <p><strong>📝 Total Questions:</strong> {record.total_questions}</p>
              <p><strong>🎯 Final Score:</strong> {record.final_score}</p>
              <p><strong>📊 Knowledge Level:</strong> {(record.final_knowledge_level * 100).toFixed(1)}%</p>

              <div className="weak-areas">
                <h3>⚠️ Weak Areas</h3>
                {Object.entries(record.weak_areas).length > 0 ? (
                  <ul>
                    {Object.entries(record.weak_areas).map(([area, count]) => (
                      <li key={area}>🔹 {area}: {count} mistakes</li>
                    ))}
                  </ul>
                ) : (
                  <p>✅ No weak areas</p>
                )}
              </div>

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
            </div>
          ))}
        </div>
      )}
      <button className="home-button" onClick={goHome}>🏠 Back to Home</button>
    </div>
  );
}

export default RecordsPage;