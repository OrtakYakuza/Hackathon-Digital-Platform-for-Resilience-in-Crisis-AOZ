import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import bahnofstrasse10_img from "./assets/bahnhofstrasse10.jpg";
import sihlstrasse15_img from "./assets/sihlstrasse15.jpg";
import europaalle20_img from "./assets/europaalle20.jpg";

const imageMap: Record<string, string> = {
  "AOZ Central Warehouse": bahnofstrasse10_img,
  "AOZ Food Hub": sihlstrasse15_img,
  "AOZ Bedding Center": europaalle20_img
  
};

type Location = {
  name: string;
  address: string;
  postal_code: string;
  imageUrl?: string; // optional for images
};

function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/locations");
        const data = await res.json();
        setLocations(data.locations);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/home" style={{ color: "#007bff" }}>
        ← Zurück
      </Link>
      <h1>Orte in Zürich</h1>

      {loading && <p>Loading...</p>}

      {!loading && locations.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {locations.map((loc, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                width: "200px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/location/${encodeURIComponent(loc.name)}`)}
            >
              <img
                src={imageMap[loc.name] || "https://via.placeholder.com/150"}
                alt={loc.name}
                style={{ width: "100%", borderRadius: "0.25rem" }}
              />

              <p style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{loc.name}</p>
              <p style={{ fontSize: "0.9rem" }}>{loc.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationsPage;
