import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");

    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Saindo da conta...</h2>
      <p style={styles.subtitle}>
        Você será redirecionado para a página inicial.
      </p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    background: "linear-gradient(to right, #ece9f1, #fdfbff)",
    color: "#333",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    color: "#6c3fc9",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
  },
};
