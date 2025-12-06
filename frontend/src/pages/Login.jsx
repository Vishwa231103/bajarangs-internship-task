import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      login(res.data.token, res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button onClick={() => navigate(-1)} className="text-indigo-600 mb-4">
          ← Back
        </button>

        <h1 className="auth-title">TaskFlow</h1>
        <p className="auth-subtitle">Welcome back! Please log in.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="auth-input"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <button className="auth-btn">Login Securely</button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          New here?{" "}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
