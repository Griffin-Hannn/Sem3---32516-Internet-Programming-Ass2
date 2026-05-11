import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container narrow-container">
        <section className="card">
          <h2>Register</h2>
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
            <p className="subtle-text">Already have an account? <Link to="/login">Login</Link></p>
          </form>
        </section>
      </div>
    </div>
  );
}
