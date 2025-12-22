import React from "react";
import { Link } from "react-router-dom";

const linkStyle = {
  display: "block",
  padding: "8px 12px",
  textDecoration: "none",
  color: "#000",
  fontSize: "16px",
  transition: "background 0.3s",
};

const hoverStyle = {
  backgroundColor: "#f1f1f1",
  borderRadius: "5px",
};

const LeftSidebar = () => {
  const links = [
    { path: "/", label: "🏠 Home" },
    { path: "/profile", label: "👤 Profile" },
    { path: "/login", label: "🔑 Login" },
    { path: "/signup", label: "📝 Signup" },
    { path: "/catalog", label: "📚 Catalog" },
    { path: "/search", label: "🔍 Search" },
    { path: "/comparison", label: "📊 Comparison" },
    { path: "/comparison-table", label: "📈 Comparison Table" },
    { path: "/forms", label: "📝 Forms" },
    { path: "/data-table", label: "📋 Data Tables" },
    { path: "/infographics", label: "📊 Infographics" },
    { path: "/audio", label: "🔊 Audio" },
    { path: "/video", label: "🎞 Video" },
    { path: "/animation", label: "🎬 Animation" },
    { path: "/drag-drop", label: "🧲 Drag and Drop" },
    { path: "/editor", label: "💻 Online Editor" },
    { path: "/cart", label: "🛒 Shopping Cart" },
    { path: "/calendar", label: "📅 Calendar" },
    { path: "/dashboard", label: "📊 Dashboard" },
    { path: "/analytics", label: "📈 Analytics" },
    { path: "/security", label: "🔒 Security" },
    { path: "/about", label: "ℹ️ About" },
    { path: "/contact", label: "📞 Contact" },
    { path: "/help", label: "❓ Help" },
  ];

  return (
    <div
      style={{
        width: "320px",
        height: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "16px",
        borderRight: "1px solid #dee2e6",
        overflowY: "auto",
      }}
    >
      {links.map((link, index) => (
        <HoverLink key={index} to={link.path} label={link.label} />
      ))}
    </div>
  );
};

// 🔁 Hoverable Link Component with inline hover effect
const HoverLink = ({ to, label }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link
      to={to}
      style={{
        ...linkStyle,
        ...(hovered ? hoverStyle : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  );
};

export default LeftSidebar;
