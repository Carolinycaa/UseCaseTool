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
    return <p>Nenhum caso de uso encontrado.</p>;
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este caso de uso?")) {
      onDelete(id);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ marginBottom: 10 }}>Seus Casos de Uso</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {useCases.map((uc) => (
          <li
            key={uc.id}
            style={{
              borderBottom: "1px solid #ddd",
              padding: "12px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>
              <Link
                to={`/use-cases/${uc.id}`}
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                {uc.title}
              </Link>
            </strong>

            <p style={{ margin: "6px 0" }}>{uc.description}</p>

            <div style={{ marginTop: 8 }}>
              {(role === "editor" || role === "admin") && (
                <>
                  <button
                    onClick={() => onEdit(uc)}
                    aria-label={`Editar caso de uso ${uc.title}`}
                    style={{
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginRight: 6,
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(uc.id)}
                    aria-label={`Excluir caso de uso ${uc.title}`}
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginRight: 6,
                    }}
                  >
                    Excluir
                  </button>
                </>
              )}

              {role === "admin" && (
                <button
                  onClick={() => setHistoryUseCaseId(uc.id)}
                  aria-label={`Ver histórico do caso de uso ${uc.title}`}
                  style={{
                    background: "#17a2b8",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
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
