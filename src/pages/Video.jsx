import React from "react";

const Video = () => (
  <div className="container mt-4">
    <h1>🎬 Video</h1>
    <p>Watch sample videos on this page.</p>
    <video controls width="100%" className="mt-3">
      <source src="/sample.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

export default Video;
