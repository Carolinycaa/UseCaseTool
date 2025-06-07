import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import UseCaseHistoryModal from "../components/UseCaseHistoryModal";
import UseCaseForm from "./UseCaseForm";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const role = token ? jwtDecode(token).role : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const response = await fetch(`${API_URL}/usecases`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao buscar casos de uso");

        const data = await response.json();
        setUseCases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUseCases();
  }, [token]);

  const handleEdit = (id) => navigate(`/use-cases/edit/${id}`);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch(`${API_URL}/use-cases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar caso de uso");
      }

      const result = await res.json();
      setUseCases((prev) => [result.useCase, ...prev]);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este caso?")) return;

    try {
      const res = await fetch(`${API_URL}/use-cases/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao excluir caso de uso");

      setUseCases((prev) => prev.filter((uc) => uc.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewHistory = (id) => {
    setSelectedUseCaseId(id);
    setShowHistoryModal(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Gerenciar Casos de Uso</h2>

      <Link to="/admin" style={styles.backLink}>
        ← Voltar ao Painel Administrativo
      </Link>

      {role === "admin" && !showForm && (
        <div style={styles.actionBar}>
          <button onClick={() => setShowForm(true)} style={styles.createBtn}>
            + Novo Caso de Uso
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar por título ou autor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {showForm && (
        <UseCaseForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
          readOnly={formLoading}
        />
      )}
      {formError && <p style={styles.errorMsg}>{formError}</p>}

      {loading ? (
        <p style={{ textAlign: "center" }}>Carregando casos de uso...</p>
      ) : useCases.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nenhum caso de uso encontrado.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Descrição</th>
              <th style={styles.th}>Criado Por</th>
              <th style={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {useCases
              .filter(
                (uc) =>
                  uc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  uc.creator?.username
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .map((uc) => (
                <tr key={uc.id} style={styles.tr}>
                  <td style={styles.td}>
                    <Link to={`/use-cases/${uc.id}`} style={styles.link}>
                      {uc.title}
                    </Link>
                  </td>
                  <td style={styles.td}>{uc.description}</td>
                  <td style={styles.td}>{uc.creator?.username || "N/A"}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(uc.id)}
                      style={styles.actionBtn}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(uc.id)}
                      style={{ ...styles.actionBtn, color: "#dc3545" }}
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => handleViewHistory(uc.id)}
                      style={{ ...styles.actionBtn, color: "#17a2b8" }}
                    >
                      Histórico
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {showHistoryModal && selectedUseCaseId && (
        <UseCaseHistoryModal
          useCaseId={selectedUseCaseId}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedUseCaseId(null);
          }}
        />
      )}
    </div>
  );
}

// 🎨 Estilos harmonizados
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#6c3fc9",
    fontSize: "24px",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "500",
  },
  createBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  errorMsg: {
    color: "red",
    textAlign: "center",
    marginBottom: "15px",
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
    backgroundColor: "#f4f2fb",
    color: "#555",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "12px 10px",
    color: "#333",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#6c3fc9",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "500",
  },
  link: {
    color: "#6c3fc9",
    fontWeight: "bold",
    textDecoration: "none",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
};
