import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Get the token returned by your backend
      const token =
        response.data.token ||
        response.data.data?.token ||
        response.data.response?.token;

      if (!token) {
        throw new Error(
          "Login succeeded, but no token was returned. Check your backend response."
        );
      }

      // Save the JWT for protected admin API requests
      localStorage.setItem("adminToken", token);

      // Open the admin dashboard
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <button
        className="login-back"
        onClick={() => navigate("/")}
        type="button"
      >
        ← Choose profile
      </button>

      <section className="login-panel">
        <div className="login-brand">
          ALSON<span>.</span>
        </div>

        <p className="login-eyebrow">YOUR SPACE AWAITS</p>

        <h1>
          Welcome <span>back.</span>
        </h1>

        <p className="login-intro">
          Sign in to continue to your account.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p role="alert" style={{ color: "#e5484d" }}>
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <span> ↗</span>}
          </button>
        </form>

        <p className="login-note">
          Secure account access · Admin portal
        </p>
      </section>
    </main>
  );
}