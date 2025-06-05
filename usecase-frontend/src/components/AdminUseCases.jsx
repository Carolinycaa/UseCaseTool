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
          <div></div>
          <button onClick={() => setShowForm(true)} style={styles.createBtn}>
            + Novo Caso de Uso
          </button>
        </div>
      )}

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
            {useCases.map((uc) => (
              <tr key={uc.id} style={styles.tr}>
                <td style={styles.td}>
                  <Link
                    to={`/use-cases/${uc.id}`}
                    style={{
                      color: "#007bff",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
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

// 🎨 Estilos
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#007bff",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "500",
  },
  createBtn: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
    padding: "12px 8px",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#f0f8ff",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "10px 8px",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "500",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
};
