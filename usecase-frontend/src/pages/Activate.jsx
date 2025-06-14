import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Activate() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: initialEmail,
    code: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/auth/activate`, formData);
      setMessage(response.data.message || "Conta ativada com sucesso.");
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        "Erro ao ativar a conta.";
      setMessage(msg);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Ativar Conta</h2>

        <form onSubmit={handleSubmit} aria-label="Formulário de ativação">
          <label htmlFor="email" style={styles.label}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Seu e-mail"
            style={styles.input}
            aria-required="true"
            aria-label="Email"
          />

          <label htmlFor="code" style={styles.label}>
            Código de Ativação
          </label>
          <input
            id="code"
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="Digite o código recebido"
            style={styles.input}
            aria-required="true"
            aria-label="Código de Ativação"
          />

          {message && (
            <p
              role="alert"
              style={{
                color: success ? "green" : "#d9534f",
                marginBottom: "15px",
                fontWeight: "600",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#c19fd9" : "#9b59b6",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            aria-busy={loading}
          >
            {loading ? "Ativando..." : "Ativar Conta"}
          </button>
        </form>

        <p style={styles.footerText}>
          Já ativou sua conta?{" "}
          <Link to="/login" style={styles.link}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #ffdde1, #f7bb97)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "3rem 2.5rem",
    borderRadius: "20px",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
    maxWidth: "420px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#9b59b6",
    fontSize: "28px",
    fontWeight: "700",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    transition: "background-color 0.3s, transform 0.2s",
  },
  footerText: {
    marginTop: "25px",
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#9b59b6",
    textDecoration: "none",
    fontWeight: "600",
  },
};
