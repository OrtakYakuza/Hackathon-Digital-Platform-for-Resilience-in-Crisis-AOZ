import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// images
import BuildingImg from "./assets/bahnhofstrasse10.jpg";
import AccessPlanImg from "./assets/bildcentralLageplan.png";
import BuildingImg2 from "./assets/sihlstrasse15.jpg";
import AccessPlanImg2 from "./assets/15lage.png";

// ---------- Types ----------
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

// ---------- Name normalisation ----------
// Whatever is in the URL (left side) -> what we call it internally (right side)
const nameAlias: Record<string, string> = {
  // old → new
  "AOZ Central Warehouse": "Zentrales Warenhaus",
  "AOZ Food Hub": "Verpflegungszentrum",
  "AOZ Bedding Center": "Bettenzentrum",
  "AOZ Hygiene Depot": "Medizinverwaltung",
  "AOZ Outlet Zürich West": "AOZ Zürich West",

  // already-new → new (idempotent)
  "Zentrales Warenhaus": "Zentrales Warenhaus",
  "Verpflegungszentrum": "Verpflegungszentrum",
  "Bettenzentrum": "Bettenzentrum",
  "Medizinverwaltung": "Medizinverwaltung",
  "AOZ Zürich West": "AOZ Zürich West",
};

// canonical name -> backend code
const locationCodeMap: Record<string, string> = {
  "Zentrales Warenhaus": "loc_centrum",
  "Verpflegungszentrum": "loc_west",
  "Bettenzentrum": "loc_altstetten",
  "Medizinverwaltung": "loc_oerlikon",
  "AOZ Zürich West": "loc_zuerichwest",
};

// canonical name -> metadata for UI
const locationMeta: Record<
  string,
  {
    address: string;
    info: string;
    zugang: string;
    wartung: string;
    kontakt: string;
    buildingImg: string;
    accessImg: string;
  }
> = {
  "Zentrales Warenhaus": {
    address: "Bahnhofstrasse 10, 8001 Zürich",
    info:
      "Das zentrale Warenhaus dient als Hauptumschlagplatz für die materielle Grundversorgung. Hier werden Betten, Schlafsäcke, Decken und weitere Basisausstattung eingelagert, sortiert und für Einsätze oder Neuaufnahmen vorbereitet. Der Standort wird in der akuten Krisenlage als erste Verteilstelle genutzt und versorgt andere Lager sowie temporäre Unterkünfte in der Stadt.",
    zugang:
      "Zutritt erfolgt über den rückseitigen Warenzugang. Der Bereich ist nur für autorisierte AOZ-Mitarbeitende und Einsatzlogistik freigegeben. Nach 20:00 Uhr ist der Zugang geschlossen; in dringenden Fällen erfolgt Zutritt ausschliesslich über den Bereitschaftsdienst. Besucher oder Privatpersonen haben keinen freien Zugang.",
    wartung:
      "Die Bestände werden regelmässig gezählt und auf Vollständigkeit geprüft. Insbesondere Betten, Feldbetten und Schlafsäcke werden auf Gebrauchszustand kontrolliert. Kleinere Reparaturen (z. B. verbogene Rahmen, defekte Verschlüsse) erfolgen vor Ort. Brandschutz und Fluchtwege werden wöchentlich geprüft und dokumentiert.",
    kontakt:
      "Leitung Logistik / Warenhauskoordination. Telefonische Erreichbarkeit über Einsatzkoordination unter Tel. +41 76 549 89 32. Vor Ort werktags besetzt von 07:30 bis 18:00 Uhr.",
    buildingImg: BuildingImg,
    accessImg: AccessPlanImg,
  },

  "Verpflegungszentrum": {
    address: "Sihlstrasse 15, 8005 Zürich",
    info:
      "Das Verpflegungszentrum ist das Drehkreuz für Lebensmittel, Getränke und Hygieneartikel. Von hier aus werden täglich essentielle Güter an Unterkünfte und Einsatzorte ausgeliefert. Der Standort ist auf schnelle Versorgung und spontane Krisenausgabe ausgelegt und unterstützt andere Lager bei Engpässen.",
    zugang:
      "Die Anlieferung erfolgt über die Laderampe im Erdgeschoss. Zufahrt zum Hof nur für Einsatz- und Lieferfahrzeuge. Kein Zugang für Privatfahrzeuge. Für Personal ist der reguläre Zutritt tagsüber über den Seiteneingang geregelt.",
    wartung:
      "Die Kühlräume und Lagerräume werden täglich auf Sauberkeit, Temperaturstabilität und Funktion geprüft. Ablaufdaten der Bestände werden im Tagesrhythmus kontrolliert, um jederzeit hygienisch einwandfreie Versorgung zu sichern.",
    kontakt:
      "Koordination Verpflegung AOZ. Tel. +41 44 000 00 01.",
    buildingImg: BuildingImg2,
    accessImg: AccessPlanImg2,
  },

  "Bettenzentrum": {
    address: "Europaallee 20, 8004 Zürich",
    info:
      "Das Bettenzentrum dient als Pufferlager für Schlafplätze und Grundausstattung wie Decken, Kissen und Schlafsäcke. Es wird vor allem dann genutzt, wenn kurzfristig zusätzliche Kapazitäten für Neuaufnahmen aufgebaut werden müssen.",
    zugang:
      "Zugang über den Seiteneingang auf der Nordseite. Schlüssel / Badge-Ausgabe erfolgt über den Sicherheitsdienst gegen Unterschrift.",
    wartung:
      "Brandschutzmittel, Notbeleuchtung und Evakuationspläne werden regelmässig geprüft. Das Material (Betten, Schlafsäcke etc.) wird visuell kontrolliert und bei Bedarf sofort ersetzt oder repariert.",
    kontakt:
      "Lagerteam Bettwaren. Tel. +41 44 000 00 02.",
    buildingImg: BuildingImg2,
    accessImg: AccessPlanImg2,
  },

  "Medizinverwaltung": {
    address: "Werdstrasse 35, 8002 Zürich",
    info:
      "Drehscheibe für Hygiene- und medizinisch relevante Grundartikel wie Seife, Shampoo, Zahnbürsten und Erstversorgungssets. Von hier aus werden Erstpakete für Neuankommende konfektioniert.",
    zugang:
      "Der Zugang ist ebenerdig über die linke Seitentür möglich. Der Haupteingang ist dem Normalbetrieb vorbehalten und soll nicht genutzt werden.",
    wartung:
      "Lagerbereiche müssen trocken und sauber gehalten werden. Zieltemperatur 18–22 °C, um hygienische Qualität der Bestände sicherzustellen.",
    kontakt:
      "Depot Hygiene. Tel. +41 44 000 00 03.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },

  "AOZ Zürich West": {
    address: "Pfingstweidstrasse 100, 8005 Zürich",
    info:
      "AOZ Zürich West dient als Verteilstelle und Rotationspunkt: Ausrüstung aus Unterkünften wird ersetzt, sortiert und weitergegeben. Dieser Standort stützt die laufende Versorgung in bereits aktiven Unterkünften.",
    zugang:
      "Zufahrt via westliche Lieferantenzufahrt. Ausweis ist obligatorisch. Der Bereich muss für Einsatzfahrzeuge frei bleiben.",
    wartung:
      "Paletten sauber stapeln, Laufwege freihalten. Brandschutz- und Rettungswege dürfen nicht zugestellt werden.",
    kontakt:
      "AOZ Zürich West Logistik. Tel. +41 44 000 00 04.",
    buildingImg: "/placeholder_building.jpg",
    accessImg: "/placeholder_accessplan.jpg",
  },
};

// shared styles
const cardBorder = "1px solid #d4dbea";
const cardShadow = "0 8px 20px rgba(0,0,0,0.05)";
const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#1e3a8a",
  marginBottom: "0.5rem",
};

function LocationItemsPage() {
  const { name } = useParams();

  // raw from URL (encoded in the route)
  const rawName = decodeURIComponent(name || "");

  // normalize to canonical name
  const canonicalName = nameAlias[rawName] || rawName;

  // look up backend code + metadata based on canonical name
  const codeForBackend = locationCodeMap[canonicalName];
  const meta = locationMeta[canonicalName];

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch inventory for this location code
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

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem",
        backgroundColor: "#eef4fa",
        minHeight: "100vh",
        color: "#1f2937",
      }}
    >
      {/* Back link */}
      <div style={{ marginBottom: "1rem" }}>
        <Link
          to="/location"
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
          Zurück zur Übersicht
        </Link>
      </div>

      {/* Header */}
      <h1
        style={{
          margin: 0,
          fontSize: "1.4rem",
          lineHeight: 1.3,
          fontWeight: 600,
          color: "#1e3a8a",
        }}
      >
        {canonicalName}
      </h1>

      <div
        style={{
          color: "#374151",
          fontSize: "0.9rem",
          marginTop: "0.25rem",
        }}
      >
        {meta ? meta.address : "Adresse unbekannt"}
      </div>

      {/* TOP ROW: LEFT CARD (images) + RIGHT CARD (info) */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: "2rem",
          alignItems: "flex-start",
          marginTop: "1.5rem",
        }}
      >
        {/* LEFT CARD */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: cardBorder,
            boxShadow: cardShadow,
            padding: "1rem 1rem 1.25rem",
            width: "360px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Gebäude */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={labelStyle}>Gebäude</div>
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#cbd5e1",
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid #94a3b8",
              }}
            >
              <img
                src={meta ? meta.buildingImg : "/placeholder_building.jpg"}
                alt={`${canonicalName} Gebäude`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Zugang / Lageplan */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={labelStyle}>Zugang / Lageplan</div>
            <div
              style={{
                width: "100%",
                height: "260px",
                backgroundColor: "#e2e8f0",
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid #94a3b8",
              }}
            >
              <img
                src={meta ? meta.accessImg : "/placeholder_accessplan.jpg"}
                alt={`${canonicalName} Zugang`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: cardBorder,
            boxShadow: cardShadow,
            padding: "1.25rem 1.5rem",
            flexGrow: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "2rem",
            rowGap: "2rem",
            fontSize: "0.9rem",
            lineHeight: 1.5,
            color: "#1f2937",
          }}
        >
          <div>
            <div style={labelStyle}>Informationen</div>
            <div>{meta ? meta.info : "–"}</div>
          </div>

          <div>
            <div style={labelStyle}>Zugang</div>
            <div>{meta ? meta.zugang : "–"}</div>
          </div>

          <div>
            <div style={labelStyle}>Wartung</div>
            <div>{meta ? meta.wartung : "–"}</div>
          </div>

          <div>
            <div style={labelStyle}>Kontakt</div>
            <div>{meta ? meta.kontakt : "–"}</div>
          </div>
        </div>
      </div>

      {/* INVENTORY */}
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

        {loading && (
          <div style={{ fontSize: "0.8rem", color: "#4b5563" }}>
            Lade Bestände…
          </div>
        )}

        {!loading && data && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {Object.entries(data.categories).map(
              ([categoryName, entries]) => (
                <div
                  key={categoryName}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    border: cardBorder,
                    boxShadow: cardShadow,
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
