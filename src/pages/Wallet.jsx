import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function Wallet() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversCol = collection(db, "drivers");
      const snapshot = await getDocs(driversCol);
      setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };

    const fetchTransactions = async () => {
      const txCol = query(
        collection(db, "wallet_transactions"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(txCol);
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchDrivers();
    fetchTransactions();
  }, []);

  const adjustWallet = async (driverId, type) => {
    if (!amount || isNaN(amount)) return alert("Enter valid amount");
    const driver = drivers.find(d => d.id === driverId);
    let newBalance =
      type === "add"
        ? driver.wallet + parseFloat(amount)
        : driver.wallet - parseFloat(amount);
    if (newBalance < 0) newBalance = 0;

    await updateDoc(doc(db, "drivers", driverId), { wallet: newBalance });
    await addDoc(collection(db, "wallet_transactions"), {
      driverId,
      type,
      amount: parseFloat(amount),
      timestamp: serverTimestamp(),
    });

    setDrivers(
      drivers.map(d => (d.id === driverId ? { ...d, wallet: newBalance } : d))
    );
    setAmount("");
    setSelectedDriver(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-black">Wallet & Payments</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drivers.map(driver => (
            <div
              key={driver.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg"
            >
              <h3 className="font-bold text-black">{driver.name}</h3>
              <p className="text-black">
                Wallet Balance:{" "}
                <span className="font-semibold">Rs {driver.wallet || 0}</span>
              </p>

              <div className="mt-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="border p-2 rounded w-full mb-2 text-black"
                  value={selectedDriver === driver.id ? amount : ""}
                  onChange={e => {
                    setSelectedDriver(driver.id);
                    setAmount(e.target.value);
                  }}
                />
                <button
                  onClick={() => adjustWallet(driver.id, "add")}
                  className="bg-gray-200 text-black px-3 py-1 rounded mr-2 text-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => adjustWallet(driver.id, "deduct")}
                  className="bg-gray-200 text-black px-3 py-1 rounded text-sm"
                >
                  Deduct
                </button>
              </div>
            </div>
          ))}

          <div className="md:col-span-2 bg-white p-4 rounded shadow overflow-x-auto">
            <h3 className="text-lg font-bold mb-2 text-black">
              Wallet Transaction History
            </h3>
            <table className="min-w-full border border-gray-300 text-black">
              <thead className="bg-gray-200">
  <tr>
    <th className="p-2 border border-gray-300 text-center">Driver</th>
    <th className="p-2 border border-gray-300 text-center">Type</th>
    <th className="p-2 border border-gray-300 text-center">Amount</th>
    <th className="p-2 border border-gray-300 text-center">Commission</th> {/* NEW */}
    <th className="p-2 border border-gray-300 text-center">Timestamp</th>
  </tr>
</thead>
<tbody>
  {transactions.map(tx => (
    <tr key={tx.id} className="border-b hover:bg-gray-100 text-center">
      <td className="p-2 border border-gray-300">
        {drivers.find(d => d.id === tx.driverId)?.name || "Unknown"}
      </td>
      <td className="p-2 border border-gray-300">{tx.type}</td>
      <td className="p-2 border border-gray-300">Rs {tx.amount}</td>
      {/* <-- Yahan add karna hai */}
      <td className="p-2 border border-gray-300">
        {tx.type === "commission" ? `Rs ${tx.amount}` : "-"}
      </td>
      <td className="p-2 border border-gray-300">
        {tx.timestamp?.toDate().toLocaleString() || "N/A"}
      </td>
    </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-2 text-center">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
