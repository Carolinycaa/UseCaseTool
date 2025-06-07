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
      setTimeout(() => setSuccess(""), 3000); // ✅ Dá tempo do teste detectar
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Gerenciar Usuários</h2>

      {loading && <p>Carregando usuários...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
        <p data-testid="success-msg" style={{ color: "green" }}>
          {success}
        </p>
      )}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>Nome</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Papel</th>
            <th style={thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                {["admin", "editor", "visualizador"]
                  .filter((r) => r !== u.role)
                  .map((roleOption) => (
                    <button
                      key={roleOption}
                      onClick={() => handleUpdateUserRole(u.id, roleOption)}
                      style={{ marginRight: 8 }}
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
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};
