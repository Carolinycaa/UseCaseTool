import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UseCaseForm from "./UseCaseForm";
import UseCaseHistoryModal from "./UseCaseHistoryModal";
import { Link, useNavigate } from "react-router-dom";

export default function UseCasePage() {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setUserId(decoded.id);
    }

    fetchUseCases();
  }, []);

  const fetchUseCases = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/usecases`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar casos de uso");

      const data = await response.json();
      setUseCases(data);
    } catch (err) {
      setError(err.message);
      setUseCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadUseCase = async (id) => {
    try {
      const response = await fetch(`${API_URL}/use-cases/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok)
        throw new Error("Erro ao carregar dados completos do caso de uso.");

      const fullData = await response.json();
      setSelectedUseCase(fullData);
      setShowForm(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (useCaseData) => {
    const method = useCaseData.id ? "PUT" : "POST";
    const url = useCaseData.id
      ? `${API_URL}/use-cases/${useCaseData.id}`
      : `${API_URL}/use-cases`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(useCaseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar caso de uso");
      }

      setShowForm(false);
      setSelectedUseCase(null);
      await fetchUseCases();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este caso de uso?"))
      return;

    try {
      const response = await fetch(`${API_URL}/use-cases/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir caso de uso");

      await fetchUseCases();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUseCases = useCases.filter((uc) =>
    uc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Casos de Uso</h2>

        <input
          type="text"
          placeholder="Buscar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {(role === "admin" || role === "editor") && (
          <button
            onClick={() => navigate("/use-cases/create")}
            style={styles.newButton}
          >
            + Novo Caso de Uso
          </button>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {loading ? (
          <p>Carregando casos de uso...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Título</th>
                  <th style={styles.th}>Descrição</th>
                  <th style={styles.th}>Criado por</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUseCases.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.noResults}>
                      Nenhum caso de uso encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUseCases.map((uc) => {
                    const isOwner = uc.created_by?.id === userId;
                    const canEdit =
                      role === "admin" || (role === "editor" && isOwner);

                    return (
                      <tr
                        key={uc.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={styles.td}>
                          <Link to={`/use-cases/${uc.id}`} style={styles.link}>
                            {uc.title}
                          </Link>
                        </td>
                        <td style={styles.td}>
                          {uc.description?.slice(0, 60)}...
                        </td>
                        <td style={styles.td}>
                          {uc.creator?.username || "Desconhecido"}
                        </td>
                        <td style={styles.td}>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleLoadUseCase(uc.id)}
                                style={styles.btnPrimary}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(uc.id)}
                                style={styles.btnDanger}
                              >
                                Excluir
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedHistoryId(uc.id);
                                  setShowHistoryModal(true);
                                }}
                                style={styles.btnInfo}
                              >
                                Ver Histórico
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {showForm && (
          <UseCaseForm
            useCase={selectedUseCase}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setSelectedUseCase(null);
            }}
          />
        )}

        {showHistoryModal && (
          <UseCaseHistoryModal
            useCaseId={selectedHistoryId}
            onClose={() => {
              setShowHistoryModal(false);
              setSelectedHistoryId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #f3e8ff, #fdfbff)",
    padding: "2rem",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "3rem 2.5rem",
    borderRadius: "28px",
    boxShadow: "0 15px 40px rgba(108, 63, 201, 0.1)",
  },
  heading: {
    color: "#6c3fc9",
    fontSize: "30px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "30px",
  },
  searchInput: {
    marginBottom: "24px",
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #bbb",
    fontSize: "16px",
    background: "#faf8ff",
  },
  newButton: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    padding: "12px 22px",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "24px",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "700",
    color: "#555",
    backgroundColor: "#eae2fa",
    fontSize: "14px",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "14px",
    verticalAlign: "top",
    color: "#333",
    fontSize: "15px",
    backgroundColor: "#fff",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "600",
  },
  btnPrimary: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    fontSize: "14px",
  },
  btnDanger: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    fontSize: "14px",
  },
  btnInfo: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  noResults: {
    padding: "24px",
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
    background: "#fcf8ff",
    borderRadius: "10px",
  },
};
