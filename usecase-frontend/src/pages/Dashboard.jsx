import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ username: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({ username: decoded.username, role: decoded.role });
      } catch (error) {
        console.error("Token inválido:", error);
        setUserInfo({ username: "Usuário", role: "desconhecido" });
      }
    }
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: "10px" }}>
        👋 Bem-vindo, {userInfo.username}!
      </h2>

      <p style={{ fontSize: "16px", color: "#555" }}>
        Sua função no sistema é:{" "}
        <strong style={{ color: "#333" }}>{userInfo.role}</strong>.
      </p>

      {userInfo.role === "admin" && (
        <div style={{ marginTop: "30px" }}>
          <Link
            to="/admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "600",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
          >
            <FaUserShield style={{ marginRight: "10px" }} />
            Acessar Painel Administrativo
          </Link>
        </div>
      )}
    </div>
  );
}
