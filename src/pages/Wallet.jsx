// src/pages/Wallet.jsx
import Header from "../components/Header";
import Card from "../components/Card";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

function getFare(r) {
  const type = r.rideType || "Car";
  if (!r.fare) return 0;
  if (typeof r.fare === "number") return r.fare || 0;
  return r.fare[type] ?? 0;
}

export default function Wallet({ onMenu }) {
  const [completed, setCompleted] = useState([]);
  const [range, setRange] = useState("all");

  useEffect(() => {
    const q =
      range === "today"
        ? query(collection(db, "rides"), where("status", "==", "completed"))
        : query(collection(db, "rides"), where("status", "==", "completed"));

    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCompleted(items);
    });
    return () => unsub();
  }, [range]);

  const total = useMemo(() => {
    return completed.reduce((acc, r) => acc + getFare(r), 0);
  }, [completed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Wallet" onMenu={onMenu} />
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card label="Completed Rides" value={completed.length} />
        <Card label="Total Revenue (PKR)" value={total} />
        <div className="rounded-2xl bg-white border p-4">
          <div className="text-sm text-gray-500 mb-2">Filter</div>
          <div className="flex gap-2">
            <button
              onClick={() => setRange("all")}
              className={`px-3 py-2 rounded-xl border ${range === "all" ? "bg-red-50 border-red-200 text-red-600" : "hover:bg-gray-50"}`}
            >
              All time
            </button>
            <button
              onClick={() => setRange("today")}
              className={`px-3 py-2 rounded-xl border ${range === "today" ? "bg-red-50 border-red-200 text-red-600" : "hover:bg-gray-50"}`}
            >
              Today
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-auto rounded-2xl border bg-white">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Ride</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Type</th>
                <th className="p-3">Fare</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.pickup} → {r.drop}</td>
                  <td className="p-3">{r.customerName || r.customerId || "-"}</td>
                  <td className="p-3">{r.rideType || "-"}</td>
                  <td className="p-3">{getFare(r)}</td>
                  <td className="p-3">
                    {r.rideTime?.toDate ? r.rideTime.toDate().toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
              {completed.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No completed rides yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
