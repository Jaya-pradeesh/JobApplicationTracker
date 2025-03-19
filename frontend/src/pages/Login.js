import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // ✅ Ensure correct import
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login({ email, password })).unwrap();
      toast.success("Login successful!");

      // ✅ Decode JWT Token to get role
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // ✅ Debugging
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken["role"];
        const userEmail = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/sub"] || decodedToken["sub"];

        console.log("Extracted Role:", userRole); // ✅ Debugging
        localStorage.setItem("email", userEmail)
        console.log("extracted email :  ", userEmail)
        // ✅ Redirect based on role
        if (userRole === "Company") {
          navigate("/company-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
