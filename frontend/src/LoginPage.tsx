import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = ["Admin", "Staff-chief", "Staff-member", "Maintenance"] as const;

const LoginPage: React.FC = () => {
  // username is always a string
  const [username, setUsername] = useState<string>("");

  // role is always one of the entries in roles
  type Role = (typeof roles)[number];

  // initialize with first role, and cast so TS stops complaining
  const [role, setRole] = useState<Role>(roles[0] as Role);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    // Save login info to localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    // Redirect to location overview
    navigate("/home");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>Login</h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
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
            padding: "0.7rem",
            backgroundColor: "#1e71b8",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
