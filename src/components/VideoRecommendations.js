import React, { useEffect, useState } from 'react';
import '../styles/VideoRecommendations.css';

function VideoRecommendations({ data, goHome }) {
  const [videoHistory, setVideoHistory] = useState(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState(new Set());

  const { weak_areas, suggested_videos, attempt_id, quiz_id } = data;

  useEffect(() => {
    fetch("http://localhost:5001/api/video_history", {
      credentials: "include",
    })
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
        credentials: "include",
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
    <div className="video-dashboard">
      {/* Left Content */}
      <div className="video-main">
        <h2>📊 Attempt #{attempt_id} – Weak Areas</h2>
        <ul className="weak-areas">
          {Object.entries(weak_areas).map(([topic, count]) => (
            <li key={topic}>🔹 <strong>{topic}</strong>: {count} mistake(s)</li>
          ))}
        </ul>

        <h3>🎥 Recommended Videos</h3>
        {Object.entries(suggested_videos).map(([topic, videos]) => (
          <div key={topic} className="video-topic">
            <h4>{topic}</h4>
            <div className="video-list">
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
                    <div className="video-meta">
                      <p className="video-title">{video.title}</p>
                      <p className="video-description">{video.description}</p>
                      <button
                        className={`btn ${isWatched ? 'btn-disabled' : 'btn-primary'}`}
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
        <button className="btn danger back-btn" onClick={goHome}>⬅ Back to Home</button>
      </div>

      {/* Right Sidebar */}
      <div className="video-sidebar">
        <h3>🕘 Watch History</h3>
        {videoHistory ? (
          Object.entries(videoHistory).map(([quizId, entries]) => (
            <div key={quizId} className="history-group">
              <h4>Quiz #{quizId}</h4>
              {entries.map(entry => (
                <div key={entry.video_id} className="history-card">
                  <p><strong>{entry.title}</strong> <span className="tag">({entry.weakarea})</span></p>
                  <p>{entry.description}</p>
                  <small>{entry.watched ? "✅ Watched" : "❌ Not Watched"} | {entry.clicked_at}</small>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Loading watch history...</p>
        )}
      </div>
    </div>
  );
}

export default VideoRecommendations;
