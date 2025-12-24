// File: src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Catalog from "./pages/Catalog";
import Search from "./pages/Search";

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

      <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
    </Routes>
  );
}
