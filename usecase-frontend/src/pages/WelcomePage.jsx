import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function WelcomePage() {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <h1 style={styles.heroText}>Seja bem-vindo!</h1>
        <p style={styles.heroSubtext}>
          Entre para acessar suas funcionalidades.
        </p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Sistema de Casos de Uso</h2>
        <p style={styles.subtitle}>Por favor, faça login para continuar.</p>
        <Link to="/login">
          <button
            style={styles.button}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            Fazer Login
          </button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4rem",
    background: "linear-gradient(135deg, #8e44ad, #3498db)",
    color: "#fff",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    gap: "2rem",
    flexWrap: "wrap",
  },
  leftSide: {
    flex: 1,
    padding: "2rem",
    minWidth: "300px",
  },
  heroText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  heroSubtext: {
    fontSize: "1.25rem",
    opacity: 0.9,
  },
  card: {
    flex: "0 0 400px",
    backgroundColor: "#ffffff",
    padding: "3rem 2rem",
    borderRadius: "20px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2)",
    color: "#333",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  title: {
    fontSize: "2rem",
    color: "#6c3fc9",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "2rem",
  },
  button: {
    backgroundColor: "#6c3fc9",
    color: "#fff",
    border: "none",
    padding: "0.9rem 2rem",
    borderRadius: "10px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  buttonHover: {
    backgroundColor: "#4e2aa1",
  },
};
