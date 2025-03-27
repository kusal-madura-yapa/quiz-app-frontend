import React, { useEffect, useState } from 'react';
import '../styles/VideoRecommendations.css';

function VideoRecommendations({ data, goHome }) {
  const [videoHistory, setVideoHistory] = useState(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState(new Set());

  const { weak_areas, suggested_videos, attempt_id, quiz_id } = data;

  useEffect(() => {
    fetch("http://localhost:5001/api/video_history?userid=1")
      .then(res => res.json())
      .then(historyData => {
        const history = historyData.video_history || {};
        setVideoHistory(history);

        const watchedSet = new Set();
        if (history[quiz_id]) {
          history[quiz_id].forEach(entry => {
            if (entry.watched) watchedSet.add(entry.video_id);
          });
        }
        setWatchedVideoIds(watchedSet);
      })
      .catch(err => console.error("Failed to load history:", err));
  }, [quiz_id]);

  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const markVideoWatched = async (video_id) => {
    try {
      await fetch("http://localhost:5001/api/track_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          quiz_id,
          video_id,
          watched: true,
        }),
      });
      setWatchedVideoIds(prev => new Set(prev).add(video_id));
    } catch (err) {
      console.error("Failed to track video:", err);
    }
  };

  return (
    <div className="video-recommendations">
      {/* Fixed Watch History Panel */}
      <div className="performance-dashboard">
        <h3>🕘 Watch History</h3>
        {videoHistory ? (
          Object.entries(videoHistory).map(([quizId, entries]) => (
            <div key={quizId} className="history-section">
              <h4>📘 Quiz #{quizId}</h4>
              {entries.map(entry => (
                <div key={entry.video_id} className="history-entry">
                  <p><strong>{entry.title}</strong> ({entry.weakarea})</p>
                  <p>{entry.description}</p>
                  <p className="watch-meta">
                    {entry.watched ? "✅ Watched" : "❌ Not Watched"} | {entry.clicked_at}
                  </p>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Loading history...</p>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h2>📊 Weak Areas - Attempt #{attempt_id}</h2>
        <ul className="weak-areas-list">
          {Object.entries(weak_areas).map(([topic, count]) => (
            <li key={topic}>🔹 <strong>{topic}</strong>: {count} mistake(s)</li>
          ))}
        </ul>

        <h3 className="section-subtitle">🎥 Recommended Videos</h3>
        {Object.entries(suggested_videos).map(([topic, videos]) => (
          <div key={topic} className="topic-section">
            <h4 className="topic-title">{topic}</h4>
            <div className="video-grid">
              {videos.map(video => {
                const embedUrl = getYouTubeEmbedUrl(video.url);
                const isWatched = watchedVideoIds.has(video.video_id);

                return (
                  <div key={video.video_id} className={`video-card ${isWatched ? 'watched' : ''}`}>
                    <iframe
                      src={embedUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="video-info">
                      <p className="video-title">{video.title}</p>
                      <p className="video-description">{video.description}</p>
                      <button
                        className={`watch-button ${isWatched ? 'watched' : ''}`}
                        onClick={() => markVideoWatched(video.video_id)}
                        disabled={isWatched}
                      >
                        {isWatched ? "✅ Watched" : "Mark as Watched"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="button-group full-width">
          <button className="back-button" onClick={goHome}>⬅ Back to Home</button>
        </div>
      </div>
    </div>
  );
}

export default VideoRecommendations;