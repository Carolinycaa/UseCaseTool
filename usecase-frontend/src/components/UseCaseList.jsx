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
                    style={{ ...styles.button, backgroundColor: "#6c3fc9" }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(uc.id)}
                    aria-label={`Excluir caso de uso ${uc.title}`}
                    style={{ ...styles.button, backgroundColor: "#d9534f" }}
                  >
                    Excluir
                  </button>
                </>
              )}

              {role === "admin" && (
                <button
                  onClick={() => setHistoryUseCaseId(uc.id)}
                  aria-label={`Ver histórico do caso de uso ${uc.title}`}
                  style={{ ...styles.button, backgroundColor: "#17a2b8" }}
                >
                  Histórico
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

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
  container: {
    marginTop: "20px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  title: {
    fontSize: "20px",
    marginBottom: "16px",
    color: "#6c3fc9",
  },
  noCases: {
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "40px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
  },
  description: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
