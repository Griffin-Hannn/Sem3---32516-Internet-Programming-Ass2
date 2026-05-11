import { useEffect, useState } from "react";

import { deactivateUser, getUsers, updateUser } from "../api/users";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAllUsers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getUsers(0, 200);
      setUsers(data);
    } catch (error) {
      setErrorMessage(error.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleRoleChange = async (targetUser, role) => {
    setErrorMessage("");
    setLoading(true);

    try {
      await updateUser(targetUser.id, { role });
      await fetchAllUsers();
    } catch (error) {
      setErrorMessage(error.message || "Error updating role");
    } finally {
      setLoading(false);
    }
  };

  const handleActiveToggle = async (targetUser, isActive) => {
    setErrorMessage("");
    setLoading(true);

    try {
      await updateUser(targetUser.id, { is_active: isActive });
      await fetchAllUsers();
    } catch (error) {
      setErrorMessage(error.message || "Error updating user status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (targetUser) => {
    if (!window.confirm(`Deactivate ${targetUser.email}?`)) return;

    setErrorMessage("");
    setLoading(true);

    try {
      await deactivateUser(targetUser.id);
      await fetchAllUsers();
    } catch (error) {
      setErrorMessage(error.message || "Error deactivating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Admin User Management</h2>
      <p className="subtle-text">Only admins can access and use this page.</p>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {loading && <p className="status-message">Loading users...</p>}

      {!loading && users.length === 0 && (
        <p className="status-message">No users found.</p>
      )}

      {!loading && users.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = currentUser?.id === user.id;
                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user, event.target.value)}
                        disabled={loading || isSelf}
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>{user.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="button-row">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => handleActiveToggle(user, !user.is_active)}
                          disabled={loading || isSelf}
                        >
                          {user.is_active ? "Set Inactive" : "Set Active"}
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDeactivate(user)}
                          disabled={loading || isSelf || !user.is_active}
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
