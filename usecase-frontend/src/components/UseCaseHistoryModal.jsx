import React, { useEffect, useState } from "react";

export default function UseCaseHistoryModal({ useCaseId, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_URL}/use-cases/${useCaseId}/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar histórico");

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [API_URL, useCaseId]);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      onClick={handleBackdropClick}
      style={styles.backdrop}
    >
      <div style={styles.modal}>
        <button
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Fechar modal"
        >
          ×
        </button>

        <h2 style={styles.title}>Histórico de Alterações</h2>

        {loading && <p style={styles.loading}>Carregando...</p>}
        {error && <p style={styles.error}>Erro: {error}</p>}

        {!loading && !error && history.length === 0 && (
          <p style={styles.noRecords}>
            Nenhuma alteração registrada para este caso de uso.
          </p>
        )}

        {!loading && !error && history.length > 0 && (
          <ul style={styles.list}>
            {history.map((item) => (
              <li key={item.id} style={styles.card}>
                <h4 style={styles.cardTitle}>{item.title}</h4>
                <p style={styles.meta}>
                  <strong>Editado por:</strong>{" "}
                  {item.editor?.username || "Desconhecido"} <br />
                  <small style={styles.date}>
                    {new Date(item.edited_at).toLocaleString()}
                  </small>
                </p>
                <div style={styles.details}>
                  {item.description && (
                    <p>
                      <strong>Descrição:</strong> {item.description}
                    </p>
                  )}
                  {item.actor && (
                    <p>
                      <strong>Ator:</strong> {item.actor}
                    </p>
                  )}
                  {item.preconditions && (
                    <p>
                      <strong>Pré-condições:</strong> {item.preconditions}
                    </p>
                  )}
                  {item.postconditions && (
                    <p>
                      <strong>Pós-condições:</strong> {item.postconditions}
                    </p>
                  )}
                  {item.main_flow && (
                    <p>
                      <strong>Fluxo principal:</strong> {item.main_flow}
                    </p>
                  )}
                  {item.alternative_flows && (
                    <p>
                      <strong>Fluxos alternativos:</strong>{" "}
                      {item.alternative_flows}
                    </p>
                  )}
                  {item.exceptions && (
                    <p>
                      <strong>Exceções:</strong> {item.exceptions}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  modal: {
    background: "#ffffff",
    padding: "32px 24px",
    maxWidth: "900px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "transparent",
    border: "none",
    fontSize: 26,
    fontWeight: "bold",
    color: "#6c3fc9",
    cursor: "pointer",
  },
  title: {
    fontSize: "22px",
    marginBottom: "24px",
    color: "#6c3fc9",
  },
  loading: {
    textAlign: "center",
    color: "#555",
  },
  error: {
    textAlign: "center",
    color: "#d9534f",
    fontWeight: "600",
  },
  noRecords: {
    textAlign: "center",
    color: "#555",
    fontSize: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  cardTitle: {
    marginBottom: "10px",
    color: "#6c3fc9",
    fontSize: "18px",
  },
  meta: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "10px",
  },
  date: {
    color: "#666",
    fontSize: "12px",
  },
  details: {
    fontSize: "14px",
    color: "#444",
  },
};
