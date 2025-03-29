import React, { useEffect, useState } from 'react';
import '../styles/Leaderboard.css';
const Leaderboard = ({ goHome }) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch('http://localhost:5001/api/leaderboard', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            setLeaderboard(data.leaderboard);
          } else {
            console.error('Failed to fetch leaderboard:', data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error:', err);
          setLoading(false);
        });
    }, []);
  
    return (
      <div className="leaderboard-container">
        <h1 className="leaderboard-title">📊 Quiz Leaderboard</h1>
  
        {loading ? (
          <p className="loading">Loading leaderboard...</p>
        ) : leaderboard.length === 0 ? (
          <p className="empty">No users or quiz attempts found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>User ID</th>
                  <th>Quiz ID</th>
                  <th>Attempt</th>
                  <th>Score</th>
                  <th>Knowledge</th>
                  <th>Weak Areas</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={`${entry.user_id}-${entry.quiz_id || 'null'}`}>
                    <td>{index + 1}</td>
                    <td>{entry.user_name || '—'}</td>
                    <td>{entry.user_id}</td>
                    <td>{entry.quiz_id ?? '—'}</td>
                    <td>{entry.attempt_id ?? '—'}</td>
                    <td>{entry.score ?? '—'}</td>
                    <td>
                      {entry.knowledge_level != null
                        ? `${(entry.knowledge_level * 100).toFixed(0)}%`
                        : '—'}
                    </td>
                    <td>
                      {entry.weakareas
                        ? Object.entries(JSON.parse(entry.weakareas))
                            .map(([area, count]) => `${area} (${count})`)
                            .join(', ')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
        <button className="home-button" onClick={goHome}>
          🏠 Back to Home
        </button>
      </div>
    );
  };
  
  export default Leaderboard;