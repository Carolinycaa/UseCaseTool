import React, { useState, useEffect } from "react";
import UseCaseHistoryModal from "./UseCaseHistoryModal";
import { jwtDecode } from "jwt-decode";

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

  if (useCases.length === 0) {
    return <p>Nenhum caso de uso encontrado.</p>;
  }

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este caso de uso?")) {
      onDelete(id);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Seus Casos de Uso</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {useCases.map((uc) => (
          <li
            key={uc.id}
            style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
          >
            <strong>{uc.title}</strong>
            <p>{uc.description}</p>

            {/* Botões visíveis apenas para editor ou admin */}
            {(role === "editor" || role === "admin") && (
              <>
                <button
                  onClick={() => onEdit(uc)}
                  aria-label={`Editar caso de uso ${uc.title}`}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(uc.id)}
                  style={{ marginLeft: 10, color: "red" }}
                  aria-label={`Excluir caso de uso ${uc.title}`}
                >
                  Excluir
                </button>
              </>
            )}

            {/* Botão de histórico visível apenas para admin */}
            {role === "admin" && (
              <button
                onClick={() => setHistoryUseCaseId(uc.id)}
                style={{ marginLeft: 10 }}
                aria-label={`Ver histórico do caso de uso ${uc.title}`}
              >
                Histórico
              </button>
            )}
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
/*O componente UseCaseList é uma lista interativa de casos de uso, usada para exibir e permitir interações (editar, excluir, visualizar histórico) de acordo com o papel do usuário (editor, admin, etc.) */
