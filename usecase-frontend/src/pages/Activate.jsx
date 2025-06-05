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

      // Pequeno delay para usuário ver a mensagem antes de redirecionar
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
        Ativar Conta
      </h2>

      <form onSubmit={handleSubmit} aria-label="Formulário de ativação">
        <label htmlFor="email" style={labelStyle}>
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
          style={inputStyle}
          aria-required="true"
          aria-label="Email"
        />

        <label htmlFor="code" style={labelStyle}>
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
          style={inputStyle}
          aria-required="true"
          aria-label="Código de Ativação"
        />

        {message && (
          <p
            role="alert"
            style={{
              color: success ? "green" : "red",
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
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#a0a0a0" : "#007bff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          aria-busy={loading}
        >
          {loading ? "Ativando..." : "Ativar Conta"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "#555" }}>
        Já ativou sua conta?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
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

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "#fff",
  fontWeight: "700",
  fontSize: "16px",
  transition: "background-color 0.3s",
};
/*O componente Activate é responsável por ativar a conta de um usuário recém-registrado, usando o código de ativação enviado por e-mail. Ele integra diretamente com o endpoint /auth/activate do backend e possui uma experiência de usuário bem cuidada, com validação, feedback e redirecionamento. */
