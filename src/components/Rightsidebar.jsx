import React from "react";
import logo1 from "../assets/logo1.png";
import faviconImage from "../assets/favicon_new.png";

const images = [logo1, faviconImage];

const Rightsidebar = () => {
  return (
    <aside
      style={{
        width: "330px",
        height: "100vh",
        position: "relative",
        background: "linear-gradient(to bottom, #ffffff, #333333)",
        overflow: "hidden",
        borderLeft: "1px solid #ccc",
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `-${i * 200}px`, // staggered starting point
            animation: `floatDownLoop 5s linear infinite`,
            animationDelay: `${i * 2}s`,
          }}
        >
          <img
            src={src}
            alt={`img-${i}`}
            style={{
              width: "180px",
              margin: "20px",
              borderRadius: "10px",
              border: "2px solid rgba(255,255,255,0.3)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      ))}

      <style>
        {`
          @keyframes floatDownLoop {
            0%   { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(110vh); opacity: 0.3; }
          }
        `}
      </style>
    </aside>
  );
};

export default Rightsidebar;
