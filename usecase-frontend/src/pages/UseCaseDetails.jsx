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

const styles = {
  container: {
    maxWidth: "960px",
    margin: "60px auto",
    padding: "3rem 2.5rem",
    background: "linear-gradient(to right, #f6f1fc, #fdfbff)",
    borderRadius: "24px",
    boxShadow: "0 12px 28px rgba(108, 63, 201, 0.08)",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#6c3fc9",
    marginBottom: "2.5rem",
    fontSize: "32px",
    fontWeight: "700",
  },
  detailsBox: {
    lineHeight: "1.8",
    fontSize: "16px",
    color: "#333",
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  detailItem: {
    marginBottom: "24px",
    borderBottom: "1px solid #eee",
    paddingBottom: "16px",
  },
  detailLabel: {
    display: "block",
    color: "#6c3fc9",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  detailValue: {
    paddingLeft: "6px",
    color: "#444",
    fontSize: "15px",
  },
  buttonGroup: {
    marginTop: "50px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  backLink: {
    display: "inline-block",
    padding: "12px 26px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    transition: "background 0.3s",
  },
  editBtn: {
    padding: "12px 26px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
