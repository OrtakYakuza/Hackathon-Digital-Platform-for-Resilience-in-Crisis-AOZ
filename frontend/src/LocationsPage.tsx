import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import warenhaus_img from "./assets/bahnhofstrasse10.jpg";
import foodhub_img from "./assets/sihlstrasse15.jpg";
import medizinverwaltung_img from "./assets/europaalle20.jpg";
import bettenzentrum_img from "./assets/bunkre.jpg";
import geb_img from "./assets/kkkk.jpg";

// Map backend name (DB) → image
const imageMap: Record<string, string> = {
  "AOZ Central Warehouse": warenhaus_img,         // → Zentrales Warenhaus
  "AOZ Food Hub": foodhub_img,                    // → Verpflegungszentrum
  "AOZ Bedding Center": bettenzentrum_img,        // → Bettenzentrum
  "AOZ Hygiene Depot": medizinverwaltung_img,     // → Medizinverwaltung
  "AOZ Outlet Zürich West": geb_img,
};

// Map backend name → new display name
const displayNameMap: Record<string, string> = {
  "AOZ Central Warehouse": "Zentrales Warenhaus",
  "AOZ Food Hub": "Verpflegungszentrum",
  "AOZ Bedding Center": "Bettenzentrum",
  "AOZ Hygiene Depot": "Medizinverwaltung",
  "AOZ Outlet Zürich West": "AOZ Zürich West",
};

type Location = {
  name: string;
  address: string;
  postal_code: string;
};

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/locations");
        const data = await res.json();
        setLocations(data.locations || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#eef4fa",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link
          to="/home"
          style={{
            color: "#1e3a8a",
            fontSize: "0.9rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: "1rem", lineHeight: 1 }}>←</span>
          <span>Zurück</span>
        </Link>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1.4rem",
            lineHeight: 1.3,
            fontWeight: 600,
            color: "#1e3a8a",
          }}
        >
          AOZ Standorte in Zürich
        </h1>
        <div
          style={{
            color: "#4b5563",
            fontSize: "0.9rem",
            marginTop: "0.4rem",
            maxWidth: "600px",
            lineHeight: 1.4,
          }}
        >
          Übersicht über alle Lager-, Hygiene- und Versorgungsstandorte in Zürich.
        </div>
      </div>

      {/* Loading or empty */}
      {loading && (
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>Lade…</div>
      )}
      {!loading && locations.length === 0 && (
        <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          Keine Standorte gefunden.
        </div>
      )}

      {/* Locations grid */}
      {!loading && locations.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            maxWidth: "1400px",
          }}
        >
          {locations.map((loc, idx) => (
            <button
              key={idx}
              onClick={() =>
                navigate(`/location/${encodeURIComponent(loc.name)}`)
              }
              style={{
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                border: "1px solid #d4dbea",
                boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 16px 32px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "160px",
                  backgroundColor: "#cbd5e1",
                  overflow: "hidden",
                }}
              >
                <img
                  src={imageMap[loc.name] || "https://via.placeholder.com/400x200"}
                  alt={loc.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "1rem 1rem 1.25rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    color: "#1e3a8a",
                    marginBottom: "0.4rem",
                  }}
                >
                  {displayNameMap[loc.name] || loc.name}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    lineHeight: 1.4,
                    color: "#4b5563",
                  }}
                >
                  {loc.address}
                  {loc.postal_code ? `, ${loc.postal_code} Zürich` : ""}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "#1e3a8a",
                    backgroundColor: "#eef2ff",
                    border: "1px solid #c7d2fe",
                    borderRadius: "6px",
                    textAlign: "center",
                    padding: "0.4rem 0.6rem",
                    marginTop: "1rem",
                    lineHeight: 1.3,
                  }}
                >
                  Standort öffnen →
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
