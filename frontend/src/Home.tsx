import React, { useState } from "react";
import { Link } from "react-router-dom";

type Item = {
  name: string;
  category?: string;
  stock?: number;
};

function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/items");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>AOZ Crisis Supply Platform</h1>
      <p>Frontend is running in TypeScript ✅</p>

      {/* Items Button */}
      <button
        onClick={handleGetItems}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
          marginRight: "1rem",
        }}
      >
        {loading ? "Loading..." : "Get Items"}
      </button>

      {/* Navigate to Locations Page */}
      <Link to="/location">
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          Search by Location
        </button>
      </Link>

      {/* Items List */}
      <ul style={{ marginTop: "1rem" }}>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} ({item.category || "unknown"}) — qty: {item.stock ?? "-"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
