import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function NavBar() {
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setRole(decoded.role);
      } catch {
        setToken(null);
        setRole(null);
      }
    } else {
      setToken(null);
      setRole(null);
    }
  }, [location.pathname]);

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.logo}>SISTEMA DE GERENCIAMENTO DE CASOS DE USO</div>

        <div style={styles.linkContainer}>
          {!token ? (
            <>
              <Link to="/" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.link}>
                Registrar
              </Link>
              <Link to="/activate" style={styles.link}>
                Ativar Conta
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>

              {role !== "admin" && (
                <Link to="/use-cases" style={styles.link}>
                  Casos de Uso
                </Link>
              )}

              {role === "admin" && (
                <Link to="/admin" style={styles.link}>
                  Admin
                </Link>
              )}

              <Link to="/logout" style={styles.link}>
                Sair
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#ffffff",
    padding: "16px 32px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#6c3fc9",
  },
  linkContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
    transition: "color 0.2s",
  },
};
