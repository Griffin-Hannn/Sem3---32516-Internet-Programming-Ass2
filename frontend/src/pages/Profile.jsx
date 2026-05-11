import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="card">
      <h2>Profile</h2>
      <div className="profile-grid">
        <p><strong>Name:</strong> {user?.name || "-"}</p>
        <p><strong>Email:</strong> {user?.email || "-"}</p>
        <p><strong>Role:</strong> {user?.role || "-"}</p>
        <p><strong>Status:</strong> {user?.is_active ? "Active" : "Inactive"}</p>
      </div>
      <p className="subtle-text">Profile update features can be added when backend user-self update endpoints are introduced.</p>
    </section>
  );
}
