import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1>Expense Tracker</h1>
          <p>Track your spending with clear categories and simple insights.</p>
        </header>

        <nav className="card app-nav">
          <div className="nav-links">
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <NavLink to="/expenses" className="nav-link">Expenses</NavLink>
            <NavLink to="/categories" className="nav-link">Categories</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className="nav-link">Admin</NavLink>
            )}
          </div>

          <div className="nav-user-row">
            <span className="subtle-text">Signed in as {user?.name || user?.email}</span>
            <button type="button" className="secondary-button" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
