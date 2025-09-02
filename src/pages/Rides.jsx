// src/pages/Rides.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRide, setEditingRide] = useState(null);
  const [adjustedFare, setAdjustedFare] = useState("");

  // Real-time listener for rides
  useEffect(() => {
    const ridesCol = collection(db, "rides");
    const unsubscribe = onSnapshot(ridesCol, (snapshot) => {
      setRides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Mark ride complete
  const markComplete = async (ride) => {
    await updateDoc(doc(db, "rides", ride.id), { status: "completed" });
    setRides(rides.map(r => r.id === ride.id ? { ...r, status: "completed" } : r));
  };

  // Mark ride canceled
  const markCanceled = async (ride) => {
    await updateDoc(doc(db, "rides", ride.id), { status: "canceled" });
    setRides(rides.map(r => r.id === ride.id ? { ...r, status: "canceled" } : r));
  };

  // Start adjusting fare
  const startAdjustFare = (ride) => {
    setEditingRide(ride.id);
    setAdjustedFare(ride.fare ?? 0);
  };

  // Save adjusted fare
  const saveAdjustedFare = async (ride) => {
    const newFare = parseFloat(adjustedFare.toString().trim());
    if (isNaN(newFare) || newFare < 0) return alert("Enter valid fare");

    const commission = parseFloat((newFare * 0.25).toFixed(2)); // 25% commission
    const driverEarning = parseFloat((newFare - commission).toFixed(2));

    await updateDoc(doc(db, "rides", ride.id), { fare: newFare, commission, driverEarning });
    setRides(rides.map(r => r.id === ride.id ? { ...r, fare: newFare, commission, driverEarning } : r));
    setEditingRide(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ride Management</h2>
      {loading ? (
        <p>Loading rides...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Driver</th>
                <th className="py-2 px-4">Pickup</th>
                <th className="py-2 px-4">Drop</th>
                <th className="py-2 px-4">Fare</th>
                <th className="py-2 px-4">Commission</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rides.map(ride => (
                <tr key={ride.id} className="border-b hover:bg-red-50">
                  <td className="py-2 px-4">{ride.customerName || "N/A"}</td>
                  <td className="py-2 px-4">{ride.driverName || "Not assigned"}</td>
                  <td className="py-2 px-4">{ride.pickup || "N/A"}</td>
                  <td className="py-2 px-4">{ride.drop || "N/A"}</td>
                  <td className="py-2 px-4">
                    {editingRide === ride.id ? (
                      <input
                        type="number"
                        className="border p-1 rounded w-20"
                        value={adjustedFare}
                        onChange={e => setAdjustedFare(e.target.value)}
                      />
                    ) : (
                      `Rs ${ride.fare ?? 0}`
                    )}
                  </td>
                  <td className="py-2 px-4">
                    Rs {ride.commission ?? (ride.fare ? (ride.fare * 0.25).toFixed(2) : "N/A")}
                  </td>
                  <td className="py-2 px-4">{ride.status || "N/A"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {editingRide === ride.id ? (
                      <button
                        onClick={() => saveAdjustedFare(ride)}
                        className="px-2 py-1 text-sm bg-green-200 text-black font-medium rounded hover:bg-green-300 transition"
                      >
                        Save Fare
                      </button>
                    ) : (
                      <button
                        onClick={() => startAdjustFare(ride)}
                        className="px-2 py-1 text-sm bg-yellow-200 text-black font-medium rounded hover:bg-yellow-300 transition"
                      >
                        Adjust Fare
                      </button>
                    )}

                    {ride.status !== "completed" && (
                      <button
                        onClick={() => markComplete(ride)}
                        className="px-2 py-1 text-sm bg-blue-200 text-black font-medium rounded hover:bg-blue-300 transition"
                      >
                        Complete
                      </button>
                    )}

                    {ride.status !== "canceled" && (
                      <button
                        onClick={() => markCanceled(ride)}
                        className="px-2 py-1 text-sm bg-red-200 text-black font-medium rounded hover:bg-red-300 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>

                </tr>
              ))}
              {!loading && rides.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-4 text-center">No rides found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
