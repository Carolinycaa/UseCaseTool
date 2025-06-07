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
          title="Gerenciar Use Cases"
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
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.12)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
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
    maxWidth: "900px",
    margin: "60px auto",
    padding: "30px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "26px",
    color: "#6c3fc9",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "16px",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
    height: "100%",
  },
  cardTitle: {
    marginBottom: "12px",
    fontSize: "18px",
    color: "#6c3fc9",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#555",
  },
};
