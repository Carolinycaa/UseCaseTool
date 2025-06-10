import React, { useState, useEffect } from "react";
import UseCaseHistoryModal from "./UseCaseHistoryModal";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function UseCaseList({ useCases, onEdit, onDelete }) {
  const [historyUseCaseId, setHistoryUseCaseId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Token inválido:", err);
      }
    }
  }, []);

  if (!useCases || useCases.length === 0) {
    return <p style={styles.noCases}>Nenhum caso de uso encontrado.</p>;
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este caso de uso?")) {
      onDelete(id);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h3 style={styles.title}>Seus Casos de Uso</h3>
        <ul style={styles.list}>
          {useCases.map((uc) => (
            <li key={uc.id} style={styles.card}>
              <strong style={styles.cardTitle}>
                <Link to={`/use-cases/${uc.id}`} style={styles.link}>
                  {uc.title}
                </Link>
              </strong>

              <p style={styles.description}>{uc.description}</p>

              <div style={styles.actions}>
                {(role === "editor" || role === "admin") && (
                  <>
                    <button
                      onClick={() => onEdit(uc)}
                      aria-label={`Editar caso de uso ${uc.title}`}
                      style={{ ...styles.actionBtn }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(uc.id)}
                      aria-label={`Excluir caso de uso ${uc.title}`}
                      style={{ ...styles.actionBtn, color: "#dc3545" }}
                    >
                      Excluir
                    </button>
                  </>
                )}

                {role === "admin" && (
                  <button
                    onClick={() => setHistoryUseCaseId(uc.id)}
                    aria-label={`Ver histórico do caso de uso ${uc.title}`}
                    style={{ ...styles.actionBtn, color: "#17a2b8" }}
                  >
                    Histórico
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {historyUseCaseId && (
        <UseCaseHistoryModal
          useCaseId={historyUseCaseId}
          onClose={() => setHistoryUseCaseId(null)}
        />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #ece9f1, #fdfbff)",
    padding: "40px 20px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "30px 25px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "22px",
    marginBottom: "24px",
    color: "#6c3fc9",
    textAlign: "center",
  },
  noCases: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "40px",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    transition: "transform 0.2s",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "12px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#6c3fc9",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px 6px",
    marginRight: "6px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    outline: "none",
    appearance: "none",
  },
};
