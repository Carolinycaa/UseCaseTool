import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UseCaseForm from "./UseCaseForm";
import UseCaseHistoryModal from "./UseCaseHistoryModal";
import { Link } from "react-router-dom";

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

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
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

      if (!response.ok) {
        throw new Error("Erro ao carregar dados completos do caso de uso.");
      }

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
    <div
      style={{
        padding: "30px",
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#6c3fc9", marginBottom: "20px" }}>Casos de Uso</h2>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "20px",
          width: "100%",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "15px",
        }}
      />

      {(role === "admin" || role === "editor") && (
        <button
          onClick={() => {
            setSelectedUseCase(null);
            setShowForm(true);
          }}
          style={{
            backgroundColor: "#6c3fc9",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Novo Caso de Uso
        </button>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Carregando casos de uso...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={styles.th}>Título</th>
                <th style={styles.th}>Descrição</th>
                <th style={styles.th}>Criado por</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {filteredUseCases.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ padding: "16px", textAlign: "center" }}
                  >
                    Nenhum caso de uso encontrado.
                  </td>
                </tr>
              ) : (
                filteredUseCases.map((uc) => (
                  <tr key={uc.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={styles.td}>
                      <Link to={`/use-cases/${uc.id}`} style={styles.link}>
                        {uc.title}
                      </Link>
                    </td>
                    <td style={styles.td}>{uc.description?.slice(0, 60)}...</td>
                    <td style={styles.td}>
                      {uc.creator?.username || "Desconhecido"}
                    </td>
                    <td style={styles.td}>
                      {(role === "admin" ||
                        (role === "editor" &&
                          uc.created_by ===
                            jwtDecode(localStorage.getItem("token")).id)) && (
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
                        </>
                      )}
                      {role === "admin" && (
                        <button
                          onClick={() => {
                            setSelectedHistoryId(uc.id);
                            setShowHistoryModal(true);
                          }}
                          style={styles.btnInfo}
                        >
                          Ver Histórico
                        </button>
                      )}
                    </td>
                  </tr>
                ))
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
  );
}

const styles = {
  th: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#555",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    verticalAlign: "top",
    color: "#333",
    fontSize: "14px",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "500",
  },
  btnPrimary: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
  },
  btnDanger: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
  },
  btnInfo: {
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
