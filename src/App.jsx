// File: src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORTANT: add .jsx extensions to avoid Netlify/Linux resolution issues
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";

import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import Catalog from "./pages/Catalog.jsx";
import Search from "./pages/Search.jsx";

function NotFound() {
  return <div style={{ padding: 24 }}>Page not found</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/catalog" element={<Catalog />} />
      <Route path="/search" element={<Search />} />

      {/* optional redirect */}
      <Route path="/home" element={<Navigate to="/" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
