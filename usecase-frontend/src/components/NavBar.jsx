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
    <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
      {!token ? (
        <>
          <Link to="/" style={{ marginRight: 10 }}>
            Login
          </Link>
          <Link to="/register" style={{ marginRight: 10 }}>
            Registrar
          </Link>
          <Link to="/activate">Ativar Conta</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard" style={{ marginRight: 10 }}>
            Dashboard
          </Link>

          {/* Mostrar "Use Cases" somente para editores e visualizadores */}
          {role !== "admin" && (
            <Link to="/use-cases" style={{ marginRight: 10 }}>
              Use Cases
            </Link>
          )}

          {/* Painel Admin */}
          {role === "admin" && (
            <Link to="/admin" style={{ marginRight: 10 }}>
              Admin
            </Link>
          )}

          <Link to="/logout">Sair</Link>
        </>
      )}
    </nav>
  );
}
/*Esse componente NavBar define a barra de navegação principal do seu frontend, exibindo links diferentes dependendo se o usuário está logado e qual é o seu papel (role). */
