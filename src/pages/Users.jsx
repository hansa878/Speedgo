import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(u => u.id !== id));
  };

  const startEditWallet = (user) => {
    setEditingUser(user.id);
    setWalletAmount(user.wallet ? String(user.wallet) : "0");
  };

  const saveWallet = async (id) => {
    if (isNaN(walletAmount)) return alert("Enter valid number");
    await updateDoc(doc(db, "users", id), { wallet: Number(walletAmount) });
    setUsers(users.map(u => u.id === id ? { ...u, wallet: Number(walletAmount) } : u));
    setEditingUser(null);
    setWalletAmount("");
  };

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        Riders Management
      </h2>
      {loading ? <p>Loading users...</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", backgroundColor: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
            <thead style={{ backgroundColor: "#ff0101", color: "white" }}>
              <tr>
                <th style={{ padding: "8px 16px" }}>Name</th>
                <th style={{ padding: "8px 16px" }}>Email</th>
                <th style={{ padding: "8px 16px" }}>Phone</th>
                <th style={{ padding: "8px 16px" }}>Wallet</th>
                <th style={{ padding: "8px 16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user.id}
                  style={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#ffe5e5")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
                >
                  <td style={{ padding: "8px 16px" }}>{user.name}</td>
                  <td style={{ padding: "8px 16px" }}>{user.email}</td>
                  <td style={{ padding: "8px 16px" }}>{user.phone}</td>
                  <td style={{ padding: "8px 16px" }}>
                    {editingUser === user.id ? (
                      <input
                        type="number"
                        style={{ border: "1px solid #ccc", padding: "4px", borderRadius: "4px", width: "80px" }}
                        value={walletAmount}
                        onChange={e => setWalletAmount(e.target.value)}
                      />
                    ) : (
                      `Rs ${user.wallet || 0}`
                    )}
                  </td>
                  <td style={{ padding: "8px 16px" }}>
                    {editingUser === user.id ? (
                      <button
                        onClick={() => saveWallet(user.id)}
                        style={{ padding: "6px 12px", backgroundColor: "green", color: "white", borderRadius: "4px", marginRight: "8px", border: "none" }}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditWallet(user)}
                        style={{ padding: "6px 12px", backgroundColor: "#ccc", borderRadius: "4px", marginRight: "8px", border: "none" }}
                      >
                        Edit Wallet
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={{ padding: "6px 12px", backgroundColor: "#ccc", borderRadius: "4px", border: "none" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "16px", textAlign: "center" }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
