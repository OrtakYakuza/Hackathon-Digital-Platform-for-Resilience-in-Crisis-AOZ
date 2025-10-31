import React, { useState, useEffect, CSSProperties } from "react";
import {Link} from "react-router-dom";

// User type (matches backend fields)
type User = {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  status: "Aktiv" | "Deaktiviert";
  role: "Admin" | "Vorsitzender" | "Mitarbeiter" | "Wartung";
  comments: string;
};

const roles = ["Admin", "Vorsitzender", "Mitarbeiter", "Wartung"];
const statuses = ["Aktiv", "Deaktiviert"];

const API_URL = "http://localhost:8000/users"; // adjust if backend runs elsewhere

const initialUsers: User[] = [];

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  // Fetch from backend if available
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.warn("Backend nicht erreichbar, nutze initialUsers"));
  }, []);

  const handleChange = (id: number | string, field: keyof User, value: any) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleSave = (user: User) => {
    fetch(`${API_URL}/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then(res => res.json())
      .then(data => {
        setUsers(prev => prev.map(u => u.id === data.id ? data : u));
        alert(`Änderungen gespeichert für ${data.firstName} ${data.lastName}`);
      })
      .catch(err => console.error("Fehler beim Speichern:", err));
  };

  // Inline styles
  const containerStyle: CSSProperties = { padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", minHeight: "100vh" };
  const tableContainerStyle: CSSProperties = { overflowX: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: "10px", backgroundColor: "#ffffff" };
  const tableStyle: CSSProperties = { width: "100%", borderCollapse: "collapse" };
  const thStyle: CSSProperties = { padding: "12px", textAlign: "left", backgroundColor: "#2c3e50", color: "white", fontWeight: 600 };
  const tdStyle: CSSProperties = { padding: "10px", borderBottom: "1px solid #e0e0e0" };
  const rowStyle = (index: number): CSSProperties => ({ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9" });
  const inputStyle: CSSProperties = { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%", fontSize: "14px" };
  const selectStyle: CSSProperties = { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", width: "100%" };
  const buttonStyle: CSSProperties = { padding: "6px 12px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 };
  const buttonHoverStyle: CSSProperties = { backgroundColor: "#2980b9" };
  const buttonCellStyle: CSSProperties = { ...tdStyle, textAlign: "center" };
  const headerStyle: CSSProperties = { fontSize: "26px", fontWeight: "bold", marginBottom: "20px", color: "#2c3e50" };

  return (
    <div style={containerStyle}>
      <Link to="/home" style={{ color: "#007bff" }}>
        ← Zurück
      </Link>
      <h2 style={headerStyle}>Benutzerverwaltung</h2>
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Vorname</th>
              <th style={thStyle}>Nachname</th>
              <th style={thStyle}>E-Mail</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Rolle</th>
              <th style={thStyle}>Kommentare</th>
              <th style={thStyle}>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} style={rowStyle(index)}>
                <td style={tdStyle}>{user.firstName}</td>
                <td style={tdStyle}>{user.lastName}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <select
                    value={user.status}
                    onChange={e => handleChange(user.id, "status", e.target.value as User["status"])}
                    style={{ ...selectStyle, color: user.status === "Aktiv" ? "#27ae60" : "#c0392b", fontWeight: 600 }}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={tdStyle}>
                  <select
                    value={user.role}
                    onChange={e => handleChange(user.id, "role", e.target.value as User["role"])}
                    style={selectStyle}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={user.comments}
                    onChange={e => handleChange(user.id, "comments", e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td style={buttonCellStyle}>
                  <button
                    style={buttonStyle}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor!)}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor!)}
                    onClick={() => handleSave(user)}
                  >
                    Speichern
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
