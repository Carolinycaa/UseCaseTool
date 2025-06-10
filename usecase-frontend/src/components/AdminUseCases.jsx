import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import UseCaseHistoryModal from "../components/UseCaseHistoryModal";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminUseCases() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedUseCaseId, setSelectedUseCaseId] = useState(null);
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

  const filteredUseCases = useCases.filter(
    (uc) =>
      uc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.creator?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Gerenciar Casos de Uso</h2>

        <Link to="/admin" style={styles.backLink}>
          ← Voltar ao Painel Administrativo
        </Link>

        {role === "admin" && (
          <div style={styles.actionBar}>
            <button
              onClick={() => navigate("/use-cases/create")}
              style={styles.createBtn}
            >
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

        {error && <p style={styles.errorMsg}>{error}</p>}

        {loading ? (
          <p style={styles.info}>Carregando casos de uso...</p>
        ) : filteredUseCases.length === 0 ? (
          <p style={styles.info}>Nenhum caso de uso encontrado.</p>
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
              {filteredUseCases.map((uc) => (
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
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #f8f5fc, #fff)",
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px",
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.06)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#6c3fc9",
    fontSize: "26px",
    fontWeight: "700",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "24px",
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  },
  createBtn: {
    padding: "10px 20px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    marginBottom: "24px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  errorMsg: {
    color: "#dc3545",
    textAlign: "center",
    fontWeight: "600",
    marginBottom: "15px",
  },
  info: {
    textAlign: "center",
    color: "#777",
    fontSize: "15px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    borderRadius: "12px",
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    fontWeight: "600",
    borderBottom: "2px solid #ddd",
    backgroundColor: "#f4f2fb",
    color: "#444",
    fontSize: "14px",
  },
  tr: {
    borderBottom: "1px solid #eee",
  },
  td: {
    padding: "12px 10px",
    color: "#333",
    fontSize: "15px",
    verticalAlign: "top",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#6c3fc9",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "500",
    fontSize: "14px",
  },
  link: {
    color: "#6c3fc9",
    fontWeight: "600",
    textDecoration: "none",
  },
  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
};
