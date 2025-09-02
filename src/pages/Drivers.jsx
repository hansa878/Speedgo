import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDriver, setEditingDriver] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversCol = collection(db, "drivers");
      const snapshot = await getDocs(driversCol);
      setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  const deleteDriver = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    await deleteDoc(doc(db, "drivers", id));
    setDrivers(drivers.filter(d => d.id !== id));
  };

  const startEditWallet = (driver) => {
    setEditingDriver(driver.id);
    setWalletAmount(driver.wallet || 0);
  };

  const saveWallet = async (id) => {
    if (isNaN(walletAmount)) return alert("Enter valid number");
    await updateDoc(doc(db, "drivers", id), { wallet: Number(walletAmount) });
    setDrivers(drivers.map(d => d.id === id ? { ...d, wallet: Number(walletAmount) } : d));
    setEditingDriver(null);
    setWalletAmount("");
  };

  const toggleStatus = async (driver) => {
    const newStatus = driver.status === "Active" ? "Inactive" : "Active";
    await updateDoc(doc(db, "drivers", driver.id), { status: newStatus });
    setDrivers(drivers.map(d => d.id === driver.id ? { ...d, status: newStatus } : d));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Drivers Management</h2>
      {loading ? <p>Loading drivers...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead style={{ backgroundColor: "#ff0101", color: "white" }}>
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Contact</th>
                <th className="py-2 px-4">Vehicle</th>
                <th className="py-2 px-4">Wallet</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id} className="border-b hover:bg-red-50">
                  <td className="py-2 px-4">{driver.name}</td>
                  <td className="py-2 px-4">{driver.phone}</td>
                  <td className="py-2 px-4">{driver.vehicle || "N/A"}</td>
                  <td className="py-2 px-4">
                    {editingDriver === driver.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-20"
                        value={walletAmount}
                        onChange={e => setWalletAmount(e.target.value)}
                      />
                    ) : (
                      `Rs ${driver.wallet || 0}`
                    )}
                    {driver.wallet === 0 && <span style={{ color: "#ff0101", fontWeight: "bold", marginLeft: "8px" }}>⚠ Zero</span>}
                  </td>
                  <td className="py-2 px-4">{driver.status || "Pending"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {editingDriver === driver.id ? (
                      <button
                        onClick={() => saveWallet(driver.id)}
                        className="w-28 py-2 border rounded font-semibold hover:bg-green-50 text-center"
                        style={{ color: "green" }}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditWallet(driver)}
                        className="w-28 py-2 border rounded font-semibold hover:bg-blue-50 text-center"
                        style={{ color: "blue" }}
                      >
                        Edit Wallet
                      </button>
                    )}

                    <button
                      onClick={() => toggleStatus(driver)}
                      className="w-28 py-2 border rounded font-semibold hover:bg-blue-50 text-center"
                      style={{ color: "blue" }}
                    >
                      {driver.status === "Active" ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteDriver(driver.id)}
                      className="w-28 py-2 border rounded font-semibold hover:bg-red-50 text-center"
                      style={{ color: "#ff0101" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && drivers.length === 0 && (
                <tr><td colSpan="6" className="p-4">No drivers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
