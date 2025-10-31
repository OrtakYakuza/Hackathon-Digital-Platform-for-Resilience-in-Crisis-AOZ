import React from "react";
import { useParams, Link } from "react-router-dom";

function ItemCategoryPage() {
  const { name } = useParams<{ name: string }>();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/item" style={{ color: "#007bff" }}>
        ← Zurück zur Übersicht
      </Link>

      <h1 style={{ marginTop: "1rem" }}>
        Kategorie: <span style={{ color: "#007bff" }}>{name}</span>
      </h1>

      <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#555" }}>
        Hier werden später die verfügbaren Artikel für diese Kategorie angezeigt.
      </p>
    </div>
  );
}

export default ItemCategoryPage;
