import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = ["Admin", "Vorsitzender", "Mitarbeiter", "Wartung"] as const;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  type Role = (typeof roles)[number];
  const [role, setRole] = useState<Role>(roles[0] as Role);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    navigate("/home");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f4f8",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem 4rem",        // Increased padding
          borderRadius: "16px",        // Slightly larger border radius
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
          width: "420px",              // Wider container (was 300px)
          maxWidth: "90vw",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", color: "#1e71b8" }}>
          Login
        </h2>

        <input
          type="text"
          placeholder="Benutzername eingeben"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",     // Larger input padding
            marginBottom: "1.2rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",     // Larger select padding
            marginBottom: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            backgroundColor: "white",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "0.9rem",
            backgroundColor: "#1e71b8",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#155a94")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1e71b8")}
        >
          Fortsetzen
        </button>
      </div>
    </div>
  );
};

export default LoginPage;