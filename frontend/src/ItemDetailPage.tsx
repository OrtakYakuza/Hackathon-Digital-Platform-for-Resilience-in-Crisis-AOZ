import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import bedImg from "./assets/bed.jpg";

// 📍 Mapping of location codes to realistic addresses
const locationMap: Record<string, string> = {
  loc_centrum: "Zentraldepot Zürich, Lagerstrasse 33, 8004 Zürich",
  loc_west: "Lagerhaus Zürich-West, Förrlibuckstrasse 180, 8005 Zürich",
  loc_altstetten: "Verteilstelle Altstetten, Hohlstrasse 560, 8048 Zürich",
  loc_oerlikon: "Zentrum Oerlikon Depot, Schaffhauserstrasse 400, 8050 Zürich",
  loc_zuerichwest: "Lager Zürich-West End, Pfingstweidstrasse 102, 8005 Zürich",
};

type ItemDetail = {
  name: string;
  description: string;
  overall: number;
  available: number;
  reserved: number;
  per_location: Record<
    string,
    { overall: number; available: number; reserved: number }
  >;
};

function ItemDetailPage() {
  const { category, itemName } = useParams<{ category: string; itemName: string }>();
  const decodedCategory = category ? decodeURIComponent(category) : "";
  const decodedItem = itemName ? decodeURIComponent(itemName) : "";

  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderLocation, setOrderLocation] = useState("loc_centrum"); // default
  const [newTotal, setNewTotal] = useState(detail?.overall || 0);

  const navigate = useNavigate();

  const categoryMap: Record<string, string> = {
    Bettwaren: "bedding",
    Lebensmittel: "food",
    Hygiene: "hygiene",
    Kleidung: "clothing",
  };

  const imageMap: Record<string, string> = {
    Bett: bedImg,
  };

  const imageSrc =
    imageMap[decodedItem] ||
    "https://via.placeholder.com/400x250?text=" + encodeURIComponent(decodedItem);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendCategory = categoryMap[decodedCategory] || decodedCategory.toLowerCase();
        const res = await fetch(`http://127.0.0.1:8000/items/${backendCategory}/${decodedItem}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDetail(data);
      } catch (err: any) {
        setError("Fehler beim Laden der Daten.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [decodedCategory, decodedItem]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link
        to={`/items/${encodeURIComponent(decodedCategory)}`}
        style={{ color: "#007bff", textDecoration: "none" }}
      >
        ← Zurück zu {decodedCategory}
      </Link>

      <div
        style={{
          maxWidth: "1100px",
          margin: "2rem auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Image Section */}
        <div
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={imageSrc}
            alt={decodedItem}
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              borderRadius: "0.75rem",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          />
        </div>

        {/* Details Section */}
        <div
          style={{
            flex: "1 1 400px",
            minWidth: "300px",
          }}
        >
          <h1 style={{ marginTop: "0", fontSize: "2rem" }}>{decodedItem}</h1>

          {loading && <p>Lade Daten…</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {detail && (
            <div>
              <p style={{ color: "#555", fontSize: "1rem" }}>
                <b>Beschreibung:</b> {detail.description}
              </p>

              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  marginTop: "1rem",
                }}
              >
                <p style={{ margin: "0.3rem 0" }}>
                  <b>Gesamtanzahl:</b> {detail.overall}
                </p>
                <p style={{ margin: "0.3rem 0" }}>
                  <b>Verfügbar:</b> {detail.available}
                </p>
                <p style={{ margin: "0.3rem 0" }}>
                  <b>Reserviert:</b> {detail.reserved}
                </p>
              </div>

              <h3 style={{ marginTop: "1.5rem" }}>Verteilung nach Standort</h3>
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  marginTop: "0.5rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>
                      Lagerort
                    </th>
                    <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>
                      Gesamt
                    </th>
                    <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>
                      Verfügbar
                    </th>
                    <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>
                      Reserviert
                    </th>
                  </tr>
                </thead>
                <tbody>
                {Object.entries(detail.per_location).map(([loc, stats]) => (
                  <tr key={loc}>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.5rem",
                      }}
                    >
                      {locationMap[loc] || loc}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {stats.overall}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {stats.available}
                    </td>
                    <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                      {stats.reserved}
                    </td>
                  </tr>
                ))}
              </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
      {/* Buttons */}
      <div
            style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center", // centers horizontally
                gap: "1rem",
                flexWrap: "wrap",
            }}
            >
            <button
                onClick={() => setShowOrderModal(true)}
                style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#5bc0de", // light blue
                color: "white",
                border: "none",
                borderRadius: "0.35rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#31b0d5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5bc0de")}
            >
                Bestellung Anfragen für {decodedItem}
            </button>

            <button
                onClick={() => setShowUpdateModal(true)}
                style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#5bc0de", // light blue
                color: "white",
                border: "none",
                borderRadius: "0.35rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#31b0d5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5bc0de")}
            >
                Datenbank aktualisieren
            </button>
            </div>


        {/* Bestellung Anfragen Modal */}
        {showOrderModal && (
        <div
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            }}
        >
            <div
            style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                minWidth: "320px",
                maxWidth: "90%",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
            >
            <h2 style={{ marginBottom: "1rem" }}>Bestellung Anfragen: {decodedItem}</h2>

            <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Anzahl:
                <input
                type="number"
                min={1}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                />
            </label>

            <label style={{ display: "block", marginBottom: "1rem" }}>
                Ziel-Lager:
                <input
                type="text"
                placeholder="8008 Zürich ..."
                value={orderLocation}
                onChange={(e) => setOrderLocation(e.target.value)}
                style={{ width: "100%", padding: "0.4rem", marginTop: "0.2rem" }}
                />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                onClick={() => { /* POST request here */ setShowOrderModal(false); }}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#5bc0de", color: "white", border: "none", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                Senden
                </button>
                <button
                onClick={() => setShowOrderModal(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                Abbrechen
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Datenbank Aktualisieren Modal */}
        {showUpdateModal && (
        <div
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            }}
        >
            <div
            style={{
                background: "white",
                padding: "2rem",
                borderRadius: "0.5rem",
                minWidth: "300px",
                maxWidth: "90%",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                textAlign: "center",
            }}
            >
            <h2 style={{ marginBottom: "1rem" }}>Datenbank aktualisieren: {decodedItem}</h2>

            <p style={{ marginBottom: "1rem" }}>Gesamtanzahl: {newTotal}</p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                <button
                onClick={() => setNewTotal((prev) => prev + 1)}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#5bc0de", color: "white", border: "none", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                +
                </button>
                <button
                onClick={() => setNewTotal((prev) => (prev > 0 ? prev - 1 : 0))}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#5bc0de", color: "white", border: "none", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                −
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                onClick={() => { /* POST request logic here */ setShowUpdateModal(false); }}
                style={{ padding: "0.5rem 1rem", backgroundColor: "#5bc0de", color: "white", border: "none", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                Aktualisieren
                </button>
                <button
                onClick={() => setShowUpdateModal(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "0.35rem", cursor: "pointer" }}
                >
                Abbrechen
                </button>
            </div>
            </div>
        </div>
        )}



    </div>
  );
}

export default ItemDetailPage;
