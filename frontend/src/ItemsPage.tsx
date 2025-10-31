import React from "react";
import { useNavigate, Link} from "react-router-dom";

// 🖼️ Import images from local assets folder (same level as this file)
import foodImg from "./assets/food.jpg";
import hygieneImg from "./assets/hygiene.jpg";
import beddingImg from "./assets/bedding.jpg";
import clothingImg from "./assets/clothing.jpg";
import childrenImg from "./assets/family.jpg";
import medicalImg from "./assets/medical.jpg";
import toolsImg from "./assets/other.jpg";

type Category = {
  name: string;
  image: string;
  description: string;
};

const categories: Category[] = [
  {
    name: "Lebensmittel",
    image: foodImg,
    description:
      "Haltbare Lebensmittel wie Reis, Konserven, Nudeln und Grundnahrungsmittel.",
  },
  {
    name: "Hygiene",
    image: hygieneImg,
    description:
      "Seife, Zahnpasta, Damenhygieneartikel und Reinigungsmittel.",
  },
  {
    name: "Bettwaren",
    image: beddingImg,
    description: "Decken, Matratzen, Schlafsäcke und Kissen.",
  },
  {
    name: "Kleidung",
    image: clothingImg,
    description: "Jacken, Hosen, Schuhe und Winterkleidung.",
  },
  {
    name: "Kinder & Familie",
    image: childrenImg,
    description: "Babynahrung, Windeln, Spielzeug und Familienartikel.",
  },
  {
    name: "Medizin & Erste Hilfe",
    image: medicalImg,
    description: "Verbandsmaterial, Desinfektionsmittel und Schmerzmittel.",
  },
  {
    name: "Werkzeuge & Ausrüstung",
    image: toolsImg,
    description: "Taschenlampen, Batterien, Zelte und sonstige Hilfsmittel.",
  },
];

function ItemsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/home" style={{ color: "#007bff" }}>
        ← Zurück
      </Link>
      <h1>Artikelkategorien</h1>
      <p>Wählen Sie eine Kategorie aus, um verfügbare Artikel anzuzeigen.</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          marginTop: "1.5rem",
        }}
      >
        {categories.map((cat, index) => (
          <div
            key={index}
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
            onClick={() => navigate(`/items/${encodeURIComponent(cat.name)}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 2px 6px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "0.25rem",
              }}
            />
            <h3 style={{ marginTop: "0.5rem" }}>{cat.name}</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {cat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;
