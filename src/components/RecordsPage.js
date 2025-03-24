import React, { useState, useEffect } from "react";
import "../styles/RecordsPage.css";

function RecordsPage({ goHome }) {
  const [records, setRecords] = useState([]);
  const [showDetails, setShowDetails] = useState({});

  useEffect(() => {
    fetch("http://localhost:5001/api/previous_records?userid=1", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRecords(data.history || []))
      .catch((err) => console.error("Error fetching records:", err));
  }, []);

  const toggleDetails = (quizId) => {
    setShowDetails((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  const renderBadge = (record) => {
    if (record.final_score === record.total_questions * 3)
      return <span className="badge gold">🏆 Perfect Score</span>;
    if (record.total_questions >= 10)
      return <span className="badge silver">🔥 Quiz Master</span>;
    if (Object.keys(record.weak_areas).length === 0)
      return <span className="badge green">💡 Flawless</span>;
    return null;
  };

  return (
    <div className="records-page">
      <h1 className="title">📜 Your Quiz Journey</h1>
      {records.length === 0 ? (
        <p className="no-records">No previous records found.</p>
      ) : (
        <div className="records-container">
          {records.map((record, index) => {
            const prev = records[index + 1];
            const isImproved = prev && record.final_score > prev.final_score;

            return (
              <div
                className={`record-card ${isImproved ? "improved" : ""}`}
                key={record.quiz_id}
              >
                <h2>
                  🎮 Attempt {record.attempt_id} {renderBadge(record)}
                </h2>

                <p>
                  <strong>📝 Total Questions:</strong> {record.total_questions}
                </p>
                <p>
                  <strong>🎯 Final Score:</strong> {record.final_score}
                </p>

                {/* Knowledge Progress */}
                <div>
                  📊 Knowledge Level:{" "}
                  <strong>
                    {(record.final_knowledge_level * 100).toFixed(1)}%
                  </strong>
                </div>
                <div className="progress-containerRC">
                  <div className="progress-barRC">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(record.final_knowledge_level * 100).toFixed(
                          1
                        )}%`,
                      }}
                    >
                      <span className="progress-textRC">
                        {(record.final_knowledge_level * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Weak Areas */}
                <div className="weak-areas">
                  <h3>⚠️ Weak Areas</h3>
                  {record.weak_areas &&
                  Object.keys(record.weak_areas).length > 0 ? (
                    <ul>
                      {Object.entries(record.weak_areas).map(
                        ([area, count]) => (
                          <li key={area}>
                            🔹 {area}: {count} mistakes
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>✅ No weak areas</p>
                  )}
                </div>

                <button
                  className="toggle-button"
                  onClick={() => toggleDetails(record.quiz_id)}
                >
                  {showDetails[record.quiz_id]
                    ? "🙈 Hide Questions"
                    : "👀 Show Questions"}
                </button>

                {showDetails[record.quiz_id] && (
                  <div className="answers-section">
                    <div className="correct-answers">
                      <h3>✅ Correct Answers</h3>
                      <ul>
                        {record.correct_answers.map((q, i) => (
                          <li key={i}>
                            <strong>Q:</strong> {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="incorrect-answers">
                      <h3>❌ Incorrect Answers</h3>
                      <ul>
                        {record.incorrect_answers.map(
                          ({ question, correct_answer }, i) => (
                            <li key={i}>
                              <strong>Q:</strong> {question} <br />
                              <strong>✔ Correct:</strong> {correct_answer}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <button className="home-button" onClick={goHome}>
        🏠 Back to Home
      </button>
    </div>
  );
}

export default RecordsPage;
