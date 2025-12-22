import React from "react";

const Audio = () => (
  <div className="container mt-4">
    <h1>🔊 Audio</h1>
    <p>Listen to audio clips or music files below.</p>
    <audio controls className="mt-3">
      <source src="/sample.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
);

export default Audio;
