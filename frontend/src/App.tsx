import React, { JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import LocationsPage from "./LocationsPage";
import LoginPage from "./LoginPage";
import LocationItemsPage from "./LocationItemsPage";
import ItemsPage from "./ItemsPage";
//import BenutzerverwaltungPage from "./BenutzerverwaltungPage"; // <-- Add this import

// --- ICONS ---
const SearchIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={style}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const MapPinIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={style}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// --- Settings Icon ---
const SettingsIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: 18, height: 18 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// --- Home Page ---
const Home: React.FC = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        padding: "2rem 1rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1e293b",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#3b82f6",
          fontSize: "0.9375rem",
          fontWeight: 600,
          cursor: "pointer",
          padding: "0.5rem 0",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
      >

      </button>

      {/* Title */}
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: 800,
          color: "#1e293b",
          margin: "0 0 0.5rem",
          lineHeight: 1.2,
        }}
      >
        Übersicht Material und Standorte
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "1rem",
          color: "#64748b",
          margin: "0 0 3rem",
          maxWidth: "640px",
          lineHeight: 1.6,
        }}
      >
        Für AOZ-Teams im Einsatz und in der Logistik.
      </p>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Card 1: Artikel */}
        <Link to="/item" style={{ textDecoration: "none" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              height: "100%",
              border: "1px solid rgba(59, 130, 246, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(59, 130, 246, 0.15)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.1)";
            }}
          >
            <div
              style={{
                height: "180px",
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchIcon style={{ width: 48, height: 48, color: "#ffffff" }} />
            </div>
            <div style={{ padding: "1.5rem 1.5rem 1.75rem" }}>
              <h3
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Nach Artikel suchen
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                Finden Sie verfügbare Artikel nach Kategorie oder Bezeichnung.
              </p>
            </div>
          </div>
        </Link>

        {/* Card 2: Ort */}
        <Link to="/location" style={{ textDecoration: "none" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              height: "100%",
              border: "1px solid rgba(16, 185, 129, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(16, 185, 129, 0.15)";
              e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.1)";
            }}
          >
            <div
              style={{
                height: "180px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPinIcon style={{ width: 48, height: 48, color: "#ffffff" }} />
            </div>
            <div style={{ padding: "1.5rem 1.5rem 1.75rem" }}>
              <h3
                style={{
                  margin: "0 0 0.75rem",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Nach Ort suchen
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.95rem",
                  color: "#64748b",
                  lineHeight: 1.6,
                }}
              >
                Zeigen Sie verfügbare Artikel an einem bestimmten Standort an.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer with Benutzerverwaltung Button */}
      <div
        style={{
          marginTop: "4rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "#94a3b8",
          paddingTop: "2rem",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >


        {/* User Badge */}
        {username && role && (
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#3b82f6",
            }}
          >
            {role} · {username}
          </div>
        )}



        {/* Benutzerverwaltung Button */}
        <Link
          to="/benutzerverwaltung"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.5rem",
            color: "#283a94",
            fontSize: "1rem",
            fontWeight: 500,
            textDecoration: "none",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            backgroundColor: "rgba(100, 116, 139, 0.05)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.1)";
            e.currentTarget.style.color = "#475569";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(100, 116, 139, 0.05)";
            e.currentTarget.style.color = "#64748b";
          }}


        >
          <SettingsIcon />
          Benutzerverwaltung
        </Link>

          <div style={{ marginBottom: "0.5rem" }}>Krisenstab internes System</div>
        <div style={{ fontSize: "0.7rem" }}>
          Zugriff nur für berechtigte Mitarbeitende
        </div>
      </div>


    </div>
  );
};

// --- Protected Route ---
const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  return username && role ? element : <Navigate to="/login" replace />;
};

// --- App ---
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/location"
          element={<ProtectedRoute element={<LocationsPage />} />}
        />
        <Route
          path="/location/:name"
          element={<ProtectedRoute element={<LocationItemsPage />} />}
        />
        <Route
          path="/item"
          element={<ProtectedRoute element={<ItemsPage />} />}
        />
        {/* NEW ROUTE */}
        <Route
          path="/benutzerverwaltung"
         // element={<ProtectedRoute element={<BenutzerverwaltungPage />} />}
        />
      </Routes>
    </Router>
  );
};

export default App;