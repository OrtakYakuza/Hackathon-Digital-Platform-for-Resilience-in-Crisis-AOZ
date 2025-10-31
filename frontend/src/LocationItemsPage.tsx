import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

type Item = {
  name: string;
  category?: string;
  stock?: number;
};

function LocationItemsPage() {
  const { name } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/items?location=${name}`);
        const data = await res.json();
        setItems(data.items);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [name]);

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <Link to="/location" style={{ color: "#007bff" }}>
        ← Back to Locations
      </Link>
      <h2>{decodeURIComponent(name || "")}</h2>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <ul>
          {items.map((item, i) => (
            <li key={i}>
              {item.name} ({item.category || "unknown"}) — qty: {item.stock ?? "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationItemsPage;
