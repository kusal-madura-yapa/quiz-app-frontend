import React, { useState, useEffect } from "react";
import "../styles/RecordsPage.css";

function RecordsPage({ goHome }) {
  const [records, setRecords] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:5001/api/previous_records", {
      credentials: "include", // Session-based auth
    })
      .then((res) => res.json())
      .then((data) => {
        const records = data.history || [];
        setRecords(records);
        setStats(calculateStats(records));
      })
      .catch((err) => console.error("Error fetching records:", err));
  }, []);

  const calculateStats = (records) => {
    if (!records.length) return {};

    const totalAttempts = records.length;
    const highestScore = Math.max(...records.map((r) => r.final_score));
    const averageScore =
      records.reduce((acc, r) => acc + r.final_score, 0) / totalAttempts;

    const weakAreaCount = {};
    records.forEach((r) => {
      Object.keys(r.weak_areas || {}).forEach((area) => {
        weakAreaCount[area] = (weakAreaCount[area] || 0) + 1;
      });
    });

    let mostFrequentWeakArea = { area: "None", count: 0 };
    if (Object.keys(weakAreaCount).length > 0) {
      const sortedAreas = Object.entries(weakAreaCount).sort((a, b) => b[1] - a[1]);
      mostFrequentWeakArea = {
        area: sortedAreas[0][0],
        count: sortedAreas[0][1],
      };
    }

    return {
      totalAttempts,
      highestScore,
      averageScore,
      mostFrequentWeakArea,
    };
  };

  const toggleDetails = (quizId) => {
    setShowDetails((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  return (
    <div className="records-page">
      <div className="performance-dashboard">
        <h3>📊 Performance Summary</h3>
        <p><strong>Attempts:</strong> {stats.totalAttempts}</p>
        <p><strong>Latest Score:</strong> {stats.highestScore}</p>
        <p><strong>Avg Score:</strong> {stats.averageScore?.toFixed(2)} %</p>
      </div>

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
                <div className="record-header">
                  <h2>🎮 Attempt {record.attempt_id}</h2>
                </div>

                <p><strong>📝 Questions:</strong> {record.total_questions}</p>
                <p><strong>🎯 Score:</strong> {record.final_score}</p>

                <div>
                  📈 Knowledge Level:{" "}
                  <strong>{(record.final_knowledge_level * 100).toFixed(1)}%</strong>
                </div>
                <div className="progress-containerRC">
                  <div className="progress-barRC">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(record.final_knowledge_level * 100).toFixed(1)}%`,
                      }}
                    >
                      <span className="progress-textRC">
                        {(record.final_knowledge_level * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="weak-areas">
                  <h3>⚠️ Weak Areas</h3>
                  {record.weak_areas && Object.keys(record.weak_areas).length > 0 ? (
                    <ul>
                      {Object.entries(record.weak_areas).map(([area, count]) => (
                        <li key={area}>🔹 {area}: {count} mistake{count > 1 ? "s" : ""}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>✅ No weak areas</p>
                  )}
                </div>

                <button
                  className="toggle-button"
                  onClick={() => toggleDetails(record.quiz_id)}
                >
                  {showDetails[record.quiz_id] ? "🙈 Hide Details" : "👀 Show Details"}
                </button>

                {showDetails[record.quiz_id] && (
                  <div className="answers-section">
                    <div className="correct-answers">
                      <h3>✅ Correct Answers</h3>
                      <ul>
                        {record.correct_answers.map((q, i) => (
                          <li key={i}><strong>Q:</strong> {q}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="incorrect-answers">
                      <h3>❌ Incorrect Answers</h3>
                      <ul>
                        {record.incorrect_answers.map(({ question, correct_answer }, i) => (
                          <li key={i}>
                            <strong>Q:</strong> {question} <br />
                            <strong>✔ Correct:</strong> {correct_answer}
                          </li>
                        ))}
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
