import React, { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/users`, {
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
    (async () => {
      await fetchUsers();
    })();
  }, []);

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Confirmar mudança de role para ${newRole}?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar usuário");

      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Lista de Usuários</h2>
      {loading && <p>Carregando usuários...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "admin" && (
                  <button onClick={() => handleUpdateUserRole(u.id, "admin")}>
                    Tornar Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/*Esse componente AdminUsersPage é a interface administrativa para gerenciar os usuários do sistema. Ele se conecta diretamente às rotas protegidas do backend e permite que um administrador visualize todos os usuários e altere o papel (role) de um usuário para "admin". */
