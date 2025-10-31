import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BuildingImg from "./assets/bahnhofstrasse10.jpg";
import AccessPlanImg from "./assets/bildcentralLageplan.png";

// Types
type StockEntry = {
  name: string;
  available: number;
  reserved: number;
  total: number;
};

type CategoryStock = {
  [categoryName: string]: StockEntry[];
};

type ApiResponse = {
  location: string;
  categories: CategoryStock;
};

// helper: map display name -> internal location code in DB
const locationCodeMap: Record<string, string> = {
  "AOZ Central Warehouse": "loc_centrum",
  "AOZ Food Hub": "loc_west",
  "AOZ Bedding Center": "loc_altstetten",
  "AOZ Hygiene Depot": "loc_oerlikon",
  "AOZ Outlet Zürich West": "loc_zuerichwest",
};

// static metadata you’ll edit for each place
const locationMeta: Record<
  string,
  {
    address: string;
    info: string;
    zugang: string;
    wartung: string;
    kontakt: string;
    buildingImg: string; // placeholder URL or /public/ path
    accessImg: string; // placeholder URL or /public/ path
  }
> = {
  "AOZ Central Warehouse": {
    address: "Bahnhofstrasse 10, 8001 Zürich",
    info:
      "Zentrales Lager für Bettwaren und Grundausstattung. Priorität: Erstaufnahme.",
    zugang:
      "Zugang über Hintereingang (Rampe). Badge erforderlich. Nach 20:00 nur via Bereitschaftsdienst.",
    wartung:
      "Tägliche Sichtkontrolle Brandschutz. Wöchentliche Bestandsprüfung Bettwaren.",
    kontakt:
      "Ansprechperson: Einsatzleitung Logistik, Tel. +41 44 000 00 00.",
    buildingImg: BuildingImg,
    accessImg: AccessPlanImg,
  },
  "AOZ Food Hub": {
    address: "Sihlstrasse 15, 8005 Zürich",
    info:
      "Primär Verpflegung und Hygieneartikel. Direkte Ausgabe an Standorte möglich.",
    zugang:
      "Laderampe EG. Fahrzeugzufahrt via Innenhof. Keine Privatfahrzeuge.",
    wartung:
      "Kühlräume täglich prüfen. Ablaufdaten kontrollieren.",
    kontakt:
      "Koordination Verpflegung, Tel. +41 44 000 00 01.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },
  "AOZ Bedding Center": {
    address: "Europaallee 20, 8004 Zürich",
    info:
      "Lager für Decken, Kissen, Schlafsäcke. Wird als Overflow genutzt.",
    zugang:
      "Seiteneingang Nordseite. Schlüssel beim Sicherheitsdienst.",
    wartung:
      "Feuerlöscher / Evakuationsplan monatlich prüfen.",
    kontakt:
      "Lagerteam Bettwaren, Tel. +41 44 000 00 02.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },
  "AOZ Hygiene Depot": {
    address: "Werdstrasse 35, 8002 Zürich",
    info:
      "Hygiene, Seife, Shampoo, Zahnbürsten. Packstation für Neuankünfte.",
    zugang:
      "Erdgeschoss, Seitentür links. Bitte nicht Haupteingang benutzen.",
    wartung:
      "Lager trocken halten, Temperatur 18–22 °C.",
    kontakt:
      "Depot Hygiene, Tel. +41 44 000 00 03.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },
  "AOZ Outlet Zürich West": {
    address: "Pfingstweidstrasse 100, 8005 Zürich",
    info:
      "Ausgabe / Rotation von Material an laufende Unterkünfte.",
    zugang:
      "Direkter Zugang via Lieferantenzufahrt West. Ausweis zeigen.",
    wartung:
      "Paletten sauber stapeln. Wegflächen freihalten.",
    kontakt:
      "AOZ Zürich West Logistik, Tel. +41 44 000 00 04.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },
};

function LocationItemsPage() {
  const { name } = useParams(); // URL part, e.g. "AOZ Central Warehouse"
  const displayName = decodeURIComponent(name || "");

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const codeForBackend = locationCodeMap[displayName];

  useEffect(() => {
    const fetchStock = async () => {
      if (!codeForBackend) return;
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/items/by_location?location=${codeForBackend}`
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching location stock:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [codeForBackend]);

  const meta = locationMeta[displayName];

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem",
        backgroundColor: "#eef4fa",
        minHeight: "100vh",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/location" style={{ color: "#1e3a8a", fontSize: "0.9rem" }}>
          ← Zurück zur Übersicht
        </Link>
      </div>

      {/* Page title */}
      <h1
        style={{
          margin: 0,
          fontSize: "1.4rem",
          lineHeight: 1.3,
          fontWeight: 600,
          color: "#1e3a8a",
        }}
      >
        {displayName}
      </h1>

      <div
        style={{
          color: "#374151",
          fontSize: "0.9rem",
          marginTop: "0.25rem",
        }}
      >
        {meta?.address || "Adresse unbekannt"}
      </div>

      {/* Top info section: left = images, right = text blocks */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* Left side: images */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "6px",
            border: "1px solid #d4dbea",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            padding: "1rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1e3a8a" }}>
            Gebäude
          </div>
          <div
            style={{
              width: "100%",
              height: "160px",
              backgroundColor: "#cbd5e1",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "0.5rem",
              border: "1px solid #94a3b8",
            }}
          >
            {/* building photo placeholder */}
            <img
              src={meta?.buildingImg || "/placeholder_building.jpg"}
              alt={`${displayName} Gebäude`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#1e3a8a",
              marginTop: "1rem",
            }}
          >
            Zugang / Lageplan
          </div>
          <div
            style={{
              width: "100%",
              height: "140px",
              backgroundColor: "#e2e8f0",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "0.5rem",
              border: "1px solid #94a3b8",
            }}
          >
            {/* access plan placeholder */}
            <img
              src={meta?.accessImg || "/placeholder_accessplan.jpg"}
              alt={`${displayName} Zugang`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Right side: info blocks */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "6px",
            border: "1px solid #d4dbea",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            padding: "1rem 1.25rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "1rem",
            rowGap: "1rem",
            fontSize: "0.8rem",
            color: "#111827",
            lineHeight: 1.4,
          }}
        >
          {/* Informationen */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#1e3a8a",
                marginBottom: "0.4rem",
              }}
            >
              Informationen
            </div>
            <div>{meta?.info || "–"}</div>
          </div>

          {/* Zugang */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#1e3a8a",
                marginBottom: "0.4rem",
              }}
            >
              Zugang
            </div>
            <div>{meta?.zugang || "–"}</div>
          </div>

          {/* Wartung */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#1e3a8a",
                marginBottom: "0.4rem",
              }}
            >
              Wartung
            </div>
            <div>{meta?.wartung || "–"}</div>
          </div>

          {/* Kontakt */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#1e3a8a",
                marginBottom: "0.4rem",
              }}
            >
              Kontakt
            </div>
            <div>{meta?.kontakt || "–"}</div>
          </div>
        </div>
      </div>

      {/* Stock / Inventory section */}
      <div style={{ marginTop: "2rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#1e3a8a",
            marginBottom: "0.75rem",
          }}
        >
          Lagerbestand
        </h2>

        {loading && <div style={{ fontSize: "0.8rem" }}>Lade Bestände…</div>}

        {!loading && data && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(data.categories).map(
              ([categoryName, entries]) => (
                <div
                  key={categoryName}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    border: "1px solid #d4dbea",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    padding: "1rem 1rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#1e3a8a",
                      marginBottom: "0.5rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {categoryName === "bedding"
                      ? "Bettwaren"
                      : categoryName}
                  </div>

                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.8rem",
                      lineHeight: 1.4,
                      color: "#111827",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f8fafc",
                          borderBottom: "1px solid #e5e7eb",
                          textAlign: "left",
                          color: "#374151",
                        }}
                      >
                        <th
                          style={{
                            padding: "0.5rem",
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Artikel
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Verfügbar
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Reserviert
                        </th>
                        <th
                          style={{
                            padding: "0.5rem",
                            fontWeight: 600,
                          }}
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <td
                            style={{
                              padding: "0.5rem",
                              borderRight: "1px solid #e5e7eb",
                              fontWeight: 500,
                            }}
                          >
                            {entry.name}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem",
                              borderRight: "1px solid #e5e7eb",
                              color: "#065f46",
                              fontWeight: 500,
                            }}
                          >
                            {entry.available}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem",
                              borderRight: "1px solid #e5e7eb",
                              color: "#92400e",
                              fontWeight: 500,
                            }}
                          >
                            {entry.reserved}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem",
                              fontWeight: 600,
                              color: "#111827",
                            }}
                          >
                            {entry.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {!loading && !data && (
          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Keine Daten gefunden für diesen Standort.
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationItemsPage;
