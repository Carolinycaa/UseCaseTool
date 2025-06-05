import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#222" }}>
        Painel do Administrador
      </h2>
      <p style={{ textAlign: "center", marginBottom: "40px", color: "#555" }}>
        Acesse as áreas administrativas do sistema.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
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
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "#000",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#f9f9f9",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
        }}
      >
        <h3 style={{ marginBottom: "10px", color: "#007bff" }}>{title}</h3>
        <p style={{ color: "#555" }}>{description}</p>
      </div>
    </Link>
  );
}
/*O componente AdminDashboard é o painel principal para usuários com permissão de administrador. Ele fornece acesso rápido e visualmente organizado às funcionalidades administrativas da aplicação. */
