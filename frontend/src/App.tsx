import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LocationsPage from "./LocationsPage";
import LocationItemsPage from "./LocationItemsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<LocationsPage />} />
        <Route path="/location/:name" element={<LocationItemsPage />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>AOZ Crisis Supply Platform</h1>
      <Link to="/location">
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          Search by Location
        </button>
      </Link>
    </div>
  );
}

export default App;
