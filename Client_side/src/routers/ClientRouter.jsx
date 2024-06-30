// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SystemPage from "../pages/SystemPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ForgottenPasswordPage from "../pages/ForgottenPasswordPage";
import ChangePasswordWithoutOldPage from "../pages/ChangePasswordWithoutOldPage";
import UnsafeLoginPage from "../pages/unsafePages/UnsafeLoginPage";
import UnsafeRegisterPage from "../pages/unsafePages/UnsafeRegisterPage";
import UnsafeSystemPage from "../pages/unsafePages/UnsafeSystemPage";

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
        <Route path="/unsafeLogin" element={<UnsafeLoginPage />} />
        <Route path="/unsafeRegister" element={<UnsafeRegisterPage />} />
        <Route path="/unsafeSystem" element={<UnsafeSystemPage />} />
      </Routes>
    </Router>
  );
}

export default ClientRouter;
