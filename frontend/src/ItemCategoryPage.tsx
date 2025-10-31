import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import bedImg from "./assets/bed.jpg";
import blanketImg from "./assets/blanket.jpg";
import pillowImg from "./assets/pillow.jpg";
import sleepingBagImg from "./assets/sleeping_bag.jpg";

type Summary = {
  [key: string]: number;
};

// mapping German category names to backend endpoints
const categoryConfig: Record<string, { endpoint: string }> = {
  Bettwaren: { endpoint: "/items/bedding" },
  Lebensmittel: { endpoint: "/items/food" },
  // add more mappings later (Hygiene, Kleidung, etc.)
};

// 🖼️ Local image map (add more here later)
const imageMap: Record<string, string> = {
  Bett: bedImg,
  Decke: blanketImg,
  Kissen: pillowImg,
  Schlafsack: sleepingBagImg
};

function ItemCategoryPage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : "";
  const [summary, setSummary] = useState<Summary>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      if (!decodedName) return;
      const cfg = categoryConfig[decodedName];
      const endpoint = cfg ? cfg.endpoint : `/items/${decodedName.toLowerCase()}`;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000${endpoint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let found: Summary = {};
        const summaryKey = Object.keys(data).find((k) => k.endsWith("_summary"));
        if (summaryKey && typeof data[summaryKey] === "object") {
          found = data[summaryKey];
        } else if (typeof data === "object" && !Array.isArray(data)) {
          const allNumbers = Object.values(data).every((v) => typeof v === "number");
          if (allNumbers) {
            found = data as Summary;
          } else if (data.bedding_summary) {
            found = data.bedding_summary;
          } else if (data.food_summary) {
            found = data.food_summary;
          }
        }

        setSummary(found);
      } catch (err: any) {
        console.error("Fetch error", err);
        setError("Fehler beim Laden der Daten.");
        setSummary({});
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [decodedName]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/item" style={{ color: "#007bff" }}>
        ← Zurück zur Übersicht
      </Link>

      <h1 style={{ marginTop: "1rem" }}>
        Kategorie: <span style={{ color: "#007bff" }}>{decodedName}</span>
      </h1>

      <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#555" }}>
        Übersicht (Gesamtanzahl pro Artikel)
      </p>

      {loading && <p>Lade Daten…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && Object.keys(summary).length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginTop: "1.5rem",
            justifyContent: "center",
          }}
        >
          {Object.entries(summary).map(([itemName, count]) => {
            const imageSrc =
              imageMap[itemName] ||
              `https://via.placeholder.com/220x140?text=${encodeURIComponent(itemName)}`;

            return (
              <div
                key={itemName}
                onClick={() =>
                  navigate(`/items/${encodeURIComponent(decodedName)}/${encodeURIComponent(itemName)}`)
                }
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  width: "220px",
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                }}
              >
                <img
                  src={imageSrc}
                  alt={itemName}
                  style={{
                    width: "100%",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "0.25rem",
                  }}
                />
                <h3 style={{ marginTop: "0.5rem" }}>{itemName}</h3>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  Gesamtanzahl: <strong>{count}</strong>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && Object.keys(summary).length === 0 && (
        <p>Keine Zusammenfassung für diese Kategorie gefunden.</p>
      )}
    </div>
  );
}

export default ItemCategoryPage;
