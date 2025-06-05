import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrorMsg(err.response.data.errors[0].msg);
      } else {
        setErrorMsg("Erro de conexão. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "35px 30px",
        borderRadius: "12px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
        backgroundColor: "#ffffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#222" }}>
        Entrar na Conta
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="password" style={labelStyle}>
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {errorMsg && (
          <p
            style={{
              color: "red",
              marginBottom: "15px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: loading ? "#a0a0a0" : "#007bff",
            color: "#fff",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "#555" }}>
        Não tem uma conta?{" "}
        <Link
          to="/register"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Registre-se
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
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.3s",
  boxSizing: "border-box",
};
