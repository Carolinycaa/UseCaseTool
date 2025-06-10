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
    <div style={styles.pageBackground}>
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

        {loading && (
          <p style={{ textAlign: "center" }}>Carregando usuários...</p>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: 15 }}>
            {error}
          </p>
        )}

        <table style={styles.table}>
          <thead>
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
                  backgroundColor:
                    id === changingRoleUserId ? "#f9f9f9" : "#fff",
                }}
              >
                <td style={styles.td}>{username}</td>
                <td style={styles.td}>{email}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: roleColors[role],
                    }}
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
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #f7f3ff, #ffffff)",
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "3rem",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 30,
    color: "#6c3fc9",
    fontSize: "28px",
    fontWeight: "700",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    marginTop: "20px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontWeight: "600",
    borderBottom: "2px solid #e4dffa",
    backgroundColor: "#f4f1fc",
    color: "#555",
  },
  td: {
    padding: "14px 16px",
    color: "#333",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
    display: "inline-block",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  select: (disabled) => ({
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "14px",
    backgroundColor: disabled ? "#f0f0f0" : "#fff",
    transition: "border-color 0.3s",
  }),
};

const roleColors = {
  admin: "#6c3fc9",
  editor: "#28a745",
  visualizador: "#6c757d",
};
