import React, {JSX} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import LocationsPage from "./LocationsPage";
import LoginPage from "./LoginPage";
import LocationItemsPage from "./LocationItemsPage";
import ItemsPage from "./ItemsPage";
import ItemCategoryPage from "./ItemCategoryPage";

// simple landing/home page (optional, not protected)
const Home: React.FC = () => {
  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>AOZ Crisis Supply Platform</h1>

      <p>Digital overview of supplies, depots and availability for AOZ response teams.</p>

      <Link to="/item">
              <button
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: 500,
                  marginTop: "1rem",
                }}
              >
                Nach Artikel Suchen
              </button>
            </Link>

      <Link to="/location">
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontWeight: 500,
            marginTop: "1rem",
          }}
        >
            Nach Ort Suchen
        </button>
      </Link>
    </div>
  );
};

// wrapper that checks if user is "logged in"
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username || !role) {
    // not logged in -> go to login
    return <Navigate to="/login" replace />;
  }

  return element;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* default route: if nothing, go to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* login is always public */}
        <Route path="/login" element={<LoginPage />} />

        {/* optional landing page for demo */}
        <Route path="/home" element={<Home />} />

        {/* protected routes */}
        <Route
          path="/location"
          element={<ProtectedRoute element={<LocationsPage />} />}
        />
        <Route
          path="/location/:name"
          element={<ProtectedRoute element={<LocationItemsPage />} />}
          
        />

         <Route path="/item" element={<ItemsPage />} />

          <Route path="/items/:name" element={<ItemCategoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
