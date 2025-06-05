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
      style={{
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
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          borderRadius: 10,
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
          aria-label="Fechar modal"
        >
          ×
        </button>

        <h2 style={{ marginBottom: 20 }}>Histórico de Alterações</h2>

        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && history.length === 0 && (
          <p>Nenhuma alteração registrada para este caso de uso.</p>
        )}

        {!loading && !error && history.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "16px",
                  marginBottom: 15,
                  backgroundColor: "#f8f8f8",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              >
                <h4 style={{ marginBottom: 5 }}>{item.title}</h4>
                <p style={{ fontSize: 14, color: "#333" }}>
                  <strong>Editado por:</strong>{" "}
                  <em>{item.editor?.username || "Desconhecido"}</em>
                  <br />
                  <small style={{ color: "#666" }}>
                    {new Date(item.edited_at).toLocaleString()}
                  </small>
                </p>
                <p style={{ marginTop: 10 }}>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
