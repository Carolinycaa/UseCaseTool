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
    <div style={styles.container}>
      <h2 style={styles.heading}>Gerenciamento de Usuários</h2>

      <div style={{ marginBottom: "20px", textAlign: "left" }}>
        <button
          onClick={() => (window.location.href = "/admin")}
          style={styles.backButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a2db3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#6c3fc9")
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

      <table style={styles.table}>
        <thead style={{ backgroundColor: "#f4f2fb" }}>
          <tr>
            <th style={styles.th}>Usuário</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Papel</th>
            <th style={styles.th}>Alterar Papel</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, username, email, role }) => (
            <tr
              key={id}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: id === changingRoleUserId ? "#f9f9f9" : "#fff",
              }}
            >
              <td style={styles.td}>{username}</td>
              <td style={styles.td}>{email}</td>
              <td style={styles.td}>
                <span
                  style={{ ...styles.badge, backgroundColor: roleColors[role] }}
                >
                  {role}
                </span>
              </td>
              <td style={styles.td}>
                <select
                  value={role}
                  onChange={(e) => changeRole(id, e.target.value)}
                  disabled={changingRoleUserId === id}
                  style={styles.select(changingRoleUserId === id)}
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

const styles = {
  container: {
    maxWidth: "900px",
    margin: "50px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: 30,
    color: "#6c3fc9",
    fontSize: "24px",
  },
  backButton: {
    padding: "10px 18px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
    color: "#555",
  },
  td: {
    padding: "10px 10px",
    color: "#333",
    fontSize: "14px",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
    display: "inline-block",
  },
  select: (disabled) => ({
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "14px",
  }),
};

const roleColors = {
  admin: "#6c3fc9",
  editor: "#28a745",
  visualizador: "#6c757d",
};
