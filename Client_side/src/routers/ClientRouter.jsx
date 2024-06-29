// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SystemPage from "../pages/SystemPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ForgottenPasswordPage from "../pages/ForgottenPasswordPage";
import ChangePasswordWithoutOldPage from "../pages/ChangePasswordWithoutOldPage";

function ClientRouter() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SystemPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/changepassword" element={<ChangePasswordPage />} />
        <Route path="/forgottenpassword" element={<ForgottenPasswordPage />} />
        <Route
          path="/resetpassword"
          element={<ChangePasswordWithoutOldPage />}
        />
      </Routes>
    </Router>
  );
}

export default ClientRouter;
