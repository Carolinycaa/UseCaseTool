import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar usuários");

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Deseja mudar o papel deste usuário para ${newRole}?`))
      return;

    try {
      const response = await fetch(`${API_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao atualizar o papel do usuário");
      }

      setSuccess("Papel atualizado com sucesso.");
      setTimeout(() => setSuccess(""), 3000);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Gerenciar Usuários</h2>

        {loading && <p style={styles.info}>Carregando usuários...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p data-testid="success-msg" style={styles.success}>
            {success}
          </p>
        )}

        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Nome</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Papel</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.role}</td>
                <td style={styles.td}>
                  {["admin", "editor", "visualizador"]
                    .filter((r) => r !== u.role)
                    .map((roleOption) => (
                      <button
                        key={roleOption}
                        onClick={() => handleUpdateUserRole(u.id, roleOption)}
                        style={styles.roleButton}
                      >
                        Tornar {roleOption}
                      </button>
                    ))}
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
  wrapper: {
    backgroundColor: "#f6f1fc",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  },
  heading: {
    fontSize: "24px",
    color: "#6c3fc9",
    marginBottom: "24px",
    textAlign: "center",
  },
  info: {
    color: "#555",
    textAlign: "center",
  },
  error: {
    color: "#dc3545",
    textAlign: "center",
    fontWeight: "600",
  },
  success: {
    color: "#28a745",
    textAlign: "center",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
  },
  thead: {
    backgroundColor: "#f4f2fb",
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    fontWeight: "bold",
    color: "#555",
    borderBottom: "2px solid #ddd",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "12px 10px",
    color: "#333",
    verticalAlign: "top",
  },
  roleButton: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    padding: "6px 12px",
    margin: "4px 4px 0 0",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
