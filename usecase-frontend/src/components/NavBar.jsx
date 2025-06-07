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
                Use Cases
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
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: "#ffffff",
    padding: "12px 24px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  },
  linkContainer: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "#6c3fc9",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "color 0.2s",
  },
};
