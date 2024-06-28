// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SystemPage from "../pages/SystemPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

function ClientRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SystemPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default ClientRouter;
