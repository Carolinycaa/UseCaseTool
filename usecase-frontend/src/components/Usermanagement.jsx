import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingRoleUserId, setChangingRoleUserId] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar usuários");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const changeRole = async (userId, newRole) => {
    if (changingRoleUserId !== null) return;

    setChangingRoleUserId(userId);
    setError("");

    try {
      const res = await fetch(`${API_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erro ao atualizar o papel do usuário");

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setChangingRoleUserId(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "50px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30, color: "#007bff" }}>
        Gerenciamento de Usuários
      </h2>

      {/* Botão Voltar */}
      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <button
          onClick={() => (window.location.href = "/admin")}
          style={{
            padding: "10px 18px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          ← Voltar ao Painel Administrativo
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Carregando usuários...</p>}
      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: 15 }}>
          {error}
        </p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "15px",
        }}
      >
        <thead style={{ backgroundColor: "#f0f8ff" }}>
          <tr>
            <th style={thStyle}>Usuário</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Papel</th>
            <th style={thStyle}>Alterar Papel</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, username, email, role }) => (
            <tr
              key={id}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor:
                  id === changingRoleUserId ? "#f9f9f9" : "white",
              }}
            >
              <td style={tdStyle}>{username}</td>
              <td style={tdStyle}>{email}</td>
              <td style={tdStyle}>
                <span
                  style={{ ...badgeStyle, backgroundColor: roleColors[role] }}
                >
                  {role}
                </span>
              </td>
              <td style={tdStyle}>
                <select
                  value={role}
                  onChange={(e) => changeRole(id, e.target.value)}
                  disabled={changingRoleUserId === id}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor:
                      changingRoleUserId === id ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="visualizador">Visualizador</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                {changingRoleUserId === id && (
                  <span style={{ marginLeft: 10, color: "#888" }}>
                    Salvando...
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Estilos reutilizáveis
const thStyle = {
  textAlign: "left",
  padding: "12px 8px",
  fontWeight: "bold",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px 8px",
};

const badgeStyle = {
  padding: "4px 8px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#fff",
  textTransform: "capitalize",
};

const roleColors = {
  admin: "#007bff",
  editor: "#28a745",
  visualizador: "#6c757d",
};
