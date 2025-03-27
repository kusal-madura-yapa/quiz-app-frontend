import React from 'react';

function VideoRecommendations({ data, goHome }) {
  if (!data) return <p>No data found.</p>;

  const { weak_areas, suggested_videos, attempt_id } = data;

  // Extract YouTube video ID from full URL
  const getYouTubeEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="results">
      <h2>📊 Weak Areas from Latest Attempt (#{attempt_id})</h2>
      <ul>
        {Object.entries(weak_areas).map(([topic, count]) => (
          <li key={topic}>
            <strong>{topic}</strong>: {count} mistakes
          </li>
        ))}
      </ul>

      <h3>🎥 Recommended Videos</h3>
      {Object.entries(suggested_videos).map(([topic, videos]) => (
        <div key={topic}>
          <h4>{topic}</h4>
          <div className="video-grid">
            {videos.map(video => {
              const embedUrl = getYouTubeEmbedUrl(video.url);
              return (
                <div key={video.video_id} className="video-box">
                  <iframe
                    width="320"
                    height="180"
                    src={embedUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <p><strong>{video.title}</strong></p>
                  <p>{video.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={goHome}>Back to Home</button>
    </div>
  );
}

export default VideoRecommendations;
