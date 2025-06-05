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
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px 25px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#222" }}>
        Registrar
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="username" style={labelStyle}>
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
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="email" style={labelStyle}>
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
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="password" style={labelStyle}>
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
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" style={labelStyle}>
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
            style={inputStyle}
          />
        </div>

        {message && (
          <p
            style={{
              color: message.toLowerCase().includes("sucesso")
                ? "green"
                : "red",
              marginBottom: "15px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: !isFormValid || loading ? "#a0a0a0" : "#007bff",
            color: "#fff",
            fontWeight: "700",
            cursor: !isFormValid || loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "#555" }}>
        Já tem uma conta?{" "}
        <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
          Faça login
        </Link>
      </p>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#555",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "20px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s",
};
