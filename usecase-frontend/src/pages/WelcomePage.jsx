import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bem-vindo ao Sistema de Casos de Uso</h2>
        <p style={styles.subtitle}>Por favor, faça login para continuar.</p>
        <Link to="/login">
          <button style={styles.button}>Fazer Login</button>
        </Link>
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
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    color: "#6c3fc9",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};
