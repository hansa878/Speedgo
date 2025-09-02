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
    setWalletAmount(user.wallet || 0);
  };

  const saveWallet = async (id) => {
    if (isNaN(walletAmount)) return alert("Enter valid number");
    await updateDoc(doc(db, "users", id), { wallet: Number(walletAmount) });
    setUsers(users.map(u => u.id === id ? { ...u, wallet: Number(walletAmount) } : u));
    setEditingUser(null);
    setWalletAmount("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Riders Management</h2>
      {loading ? <p>Loading users...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Wallet</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-red-50">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phone}</td>
                  <td className="py-2 px-4">
                    {editingUser === user.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-20"
                        value={walletAmount}
                        onChange={e => setWalletAmount(e.target.value)}
                      />
                    ) : (
                      `Rs ${user.wallet || 0}`
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUser === user.id ? (
                      <button
                        onClick={() => saveWallet(user.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditWallet(user)}
                        className="px-3 py-1 bg-yellow-400 rounded mr-2"
                      >
                        Edit Wallet
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 bg-gray-300 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan="5" className="p-4">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
