import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Painel do Administrador</h2>
      <p style={styles.subtitle}>Acesse as áreas administrativas do sistema.</p>

      <div style={styles.grid}>
        <AdminCard
          title="Gerenciar Usuários"
          description="Visualize, edite e altere permissões dos usuários."
          to="/admin/users"
        />
        <AdminCard
          title="Gerenciar Casos de Uso"
          description="Crie, edite e organize seus casos de uso."
          to="/admin/usecases"
        />
      </div>
    </div>
  );
}

function AdminCard({ title, description, to }) {
  return (
    <Link to={to} style={styles.link}>
      <div
        style={styles.card}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.12)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 0, 0, 0.08)";
        }}
      >
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardDescription}>{description}</p>
      </div>
    </Link>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #5f72bd, #9b23ea)",
    padding: "60px 30px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    color: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "32px",
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "50px",
    fontSize: "16px",
    color: "#e0dce7",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "28px",
    borderRadius: "18px",
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    height: "100%",
  },
  cardTitle: {
    marginBottom: "12px",
    fontSize: "20px",
    color: "#6c3fc9",
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: "15px",
    color: "#555",
  },
};
