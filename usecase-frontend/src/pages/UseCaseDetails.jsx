import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL;

export default function UseCaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ role: "", id: null });

  useEffect(() => {
    const fetchUseCase = async () => {
      try {
        const res = await fetch(`${API_URL}/use-cases/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar detalhes do caso de uso.");

        const data = await res.json();
        setUseCase(data);

        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUser({ role: decoded.role, id: decoded.id });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUseCase();
  }, [id]);

  const canEdit =
    user.role === "admin" ||
    (user.role === "editor" && user.id === useCase?.created_by);

  if (loading)
    return <p style={{ textAlign: "center" }}>Carregando detalhes...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>Erro: {error}</p>;
  if (!useCase) return null;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{ color: "#007bff", marginBottom: "30px", textAlign: "center" }}
      >
        {useCase.title}
      </h2>

      <Detail label="Descrição" value={useCase.description} />
      <Detail label="Ator" value={useCase.actor} />
      <Detail label="Pré-condições" value={useCase.preconditions} />
      <Detail label="Pós-condições" value={useCase.postconditions} />
      <Detail label="Fluxo Principal" value={useCase.main_flow} />
      <Detail label="Fluxos Alternativos" value={useCase.alternative_flows} />
      <Detail label="Exceções" value={useCase.exceptions} />

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <Link
          to="/use-cases"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          ← Voltar à Lista
        </Link>

        {canEdit && (
          <button
            onClick={() => navigate(`/use-cases/edit/${useCase.id}`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Editar Caso de Uso
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <strong style={{ fontSize: "15px", color: "#333" }}>{label}:</strong>
      <div
        style={{
          marginTop: "6px",
          padding: "10px",
          backgroundColor: "#f9f9f9",
          borderRadius: "6px",
          border: "1px solid #eee",
          whiteSpace: "pre-wrap",
          color: "#444",
        }}
      >
        {value?.trim() ? (
          value
        ) : (
          <em style={{ color: "#aaa" }}>Não informado</em>
        )}
      </div>
    </div>
  );
}
