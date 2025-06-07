import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.username.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    confirmPassword.trim() &&
    formData.password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      const response = await axios.post(`${API_URL}/auth/register`, formData);

      setMessage(
        response.data.message ||
          "Registro realizado com sucesso! Verifique seu e-mail."
      );

      if (response.status === 201) {
        setFormData({ username: "", email: "", password: "" });
        setConfirmPassword("");
        navigate("/activate", { state: { email: formData.email } });
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors?.length) {
        setMessage(err.response.data.errors[0].msg);
      } else {
        setMessage("Erro ao registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registrar</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="username" style={styles.label}>
              Nome de usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Digite seu nome de usuário"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="email" style={styles.label}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {message && (
            <p
              style={{
                color: message.toLowerCase().includes("sucesso")
                  ? "green"
                  : "#d9534f",
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
            disabled={!isFormValid || loading}
            style={{
              ...styles.button,
              backgroundColor: !isFormValid || loading ? "#b9a5df" : "#6c3fc9",
              cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <p style={styles.footerText}>
          Já tem uma conta?{" "}
          <Link to="/" style={styles.link}>
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
    background: "linear-gradient(to right, #ece9f1, #fdfbff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    maxWidth: "420px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#6c3fc9",
    fontSize: "24px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    transition: "border-color 0.3s",
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
    transition: "background-color 0.3s",
  },
  footerText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "600",
  },
};
