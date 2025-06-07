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
    return (
      <p style={{ textAlign: "center", fontFamily: "Poppins" }}>
        Carregando detalhes...
      </p>
    );
  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", fontFamily: "Poppins" }}>
        Erro: {error}
      </p>
    );
  if (!useCase) return null;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{useCase.title}</h2>

      <div style={styles.detailsBox}>
        <Detail label="Descrição" value={useCase.description} />
        <Detail label="Ator" value={useCase.actor} />
        <Detail label="Pré-condições" value={useCase.preconditions} />
        <Detail label="Pós-condições" value={useCase.postconditions} />
        <Detail label="Fluxo Principal" value={useCase.main_flow} />
        <Detail label="Fluxos Alternativos" value={useCase.alternative_flows} />
        <Detail label="Exceções" value={useCase.exceptions} />
      </div>

      <div style={styles.buttonGroup}>
        <Link to="/use-cases" style={styles.backLink}>
          ← Voltar à Lista
        </Link>

        {canEdit && (
          <button
            onClick={() => navigate(`/use-cases/edit/${useCase.id}`)}
            style={styles.editBtn}
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
    <div style={styles.detailItem}>
      <strong style={styles.detailLabel}>{label}:</strong>
      <div style={styles.detailValue}>
        {value && value.trim() !== "" ? (
          value
        ) : (
          <em style={{ color: "#999" }}>Não informado</em>
        )}
      </div>
    </div>
  );
}

// 🎨 Estilos
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#6c3fc9",
    marginBottom: "28px",
    fontSize: "24px",
  },
  detailsBox: {
    lineHeight: "1.8",
    fontSize: "16px",
    color: "#333",
  },
  detailItem: {
    marginBottom: "18px",
  },
  detailLabel: {
    display: "block",
    color: "#555",
    fontSize: "15px",
    marginBottom: "4px",
  },
  detailValue: {
    paddingLeft: "8px",
  },
  buttonGroup: {
    marginTop: "30px",
    textAlign: "center",
  },
  backLink: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    marginRight: "10px",
  },
  editBtn: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
