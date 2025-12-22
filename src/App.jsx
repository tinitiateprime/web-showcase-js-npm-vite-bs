// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Leftsidebar from "./components/Leftsidebar";
import Rightsidebar from "./components/Rightsidebar";
import Footer from "./components/Footer";

// pages...
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Catalog from "./pages/Catalog";
import Search from "./pages/Search";
import Comparison from "./pages/Comparison";
import ComparisonTable from "./pages/ComparisonTable";
import Forms from "./pages/Forms";
import DataTable from "./pages/DataTable";
import Infographics from "./pages/Infographics";
import Audio from "./pages/Audio";
import Video from "./pages/Video";
import Animation from "./pages/Animation";
import DragDrop from "./pages/DragDrop";
import Editor from "./pages/Editor";
import ShoppingCart from "./pages/ShoppingCart";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";

const App = () => {
  const LEFT  = 180; // ← change this to 160/150 if you want slimmer
  const RIGHT = 280;

  const shell = {
    display: "grid",
    gridTemplateColumns: `${LEFT}px minmax(0, 1fr) ${RIGHT}px`,
    gap: 16,
    alignItems: "start",
    flex: 1,
  };

  const stickyLeft  = { position: "sticky", top: 0, alignSelf: "start", width: LEFT,  overflow: "hidden" };
  const stickyRight = { position: "sticky", top: 0, alignSelf: "start", width: RIGHT };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />

        <div style={shell}>
          <div style={stickyLeft}>
            <Leftsidebar />
          </div>

          <main style={{ minWidth: 0, padding: 16 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/search" element={<Search />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/comparison-table" element={<ComparisonTable />} />
              <Route path="/forms" element={<Forms />} />
              <Route path="/data-table" element={<DataTable />} />
              <Route path="/infographics" element={<Infographics />} />
              <Route path="/audio" element={<Audio />} />
              <Route path="/video" element={<Video />} />
              <Route path="/animation" element={<Animation />} />
              <Route path="/drag-drop" element={<DragDrop />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/shoppingcart" element={<ShoppingCart />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/security" element={<Security />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>

          <div style={stickyRight}>
            <Rightsidebar />
          </div>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
