import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Logout from "./pages/Logout";
import UseCasePage from "./components/UseCasePage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./components/Usermanagement";
import AdminUseCases from "./components/AdminUseCases";
import EditUseCasePage from "./pages/EditUseCasePage";
import UseCaseDetails from "./pages/UseCaseDetails";
import WelcomePage from "./pages/WelcomePage";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/use-cases/edit/:id" element={<EditUseCasePage />} />
        <Route path="/" element={<WelcomePage />} />
        <Route
          path="/use-cases/:id"
          element={
            <PrivateRoute>
              <UseCaseDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/use-cases"
          element={
            <PrivateRoute>
              <UseCasePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/usecases"
          element={
            <AdminRoute>
              <AdminUseCases />
            </AdminRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  );
}
