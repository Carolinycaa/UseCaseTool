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
    <div style={styles.container}>
      <h2 style={styles.title}>👋 Bem-vindo, {userInfo.username}!</h2>

      <p style={styles.roleText}>
        Sua função no sistema é:{" "}
        <strong style={styles.roleHighlight}>{userInfo.role}</strong>.
      </p>

      {userInfo.role === "admin" && (
        <div style={{ marginTop: "30px" }}>
          <Link
            to="/admin"
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#5a2ebc")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#6c3fc9")
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

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
    backgroundColor: "#ffffff",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    textAlign: "center",
  },
  title: {
    color: "#6c3fc9",
    marginBottom: "12px",
    fontSize: "24px",
  },
  roleText: {
    fontSize: "16px",
    color: "#555",
  },
  roleHighlight: {
    color: "#333",
    fontWeight: "600",
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    padding: "12px 20px",
    backgroundColor: "#6c3fc9",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
};
