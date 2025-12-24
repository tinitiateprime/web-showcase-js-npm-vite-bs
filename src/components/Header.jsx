import React from "react";
import favicon_new from "../assets/favicon_new.png";

const Header = () => {
  return (
    <header
      className="text-white py-3"
      style={{
        background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
        transition: "background 1s ease-in-out",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap">
        {/* Left: Logo */}
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <img
            src={favicon_new}
            alt="Logo"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "8px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* Center: Icons + Labels */}
        <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center flex-grow-1">
          <IconWithLabel iconClass="bi-filetype-js" label="js" color="#f7df1e" />
          <IconWithLabel iconClass="bi-box-seam" label="npm" color="#cb0000" />
          <IconWithLabel iconClass="bi-lightning" label="vite" color="#646cff" />
          <IconWithLabel iconClass="bi-bootstrap-fill" label="bs" color="#7952b3" />
        </div>

        {/* Right: Empty spacer to balance */}
        <div style={{ width: "50px" }} />
      </div>
    </header>
  );
};

const IconWithLabel = ({ iconClass, label, color }) => {
  return (
    <div
      className="d-flex align-items-center gap-2"
      style={{
        transition: "transform 0.3s ease, color 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.15)";
        e.currentTarget.style.color = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.color = "#fff";
      }}
    >
      <i className={`bi ${iconClass}`} style={{ fontSize: 24, lineHeight: 1 }} />
      <span>{label}</span>
    </div>
  );
};

export default Header;
