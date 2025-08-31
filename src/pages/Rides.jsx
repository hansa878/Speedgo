// src/pages/Rides.jsx
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

function fareToNumber(fare, type) {
  if (!fare) return 0;
  if (typeof fare === "number") return fare;
  // Flutter app stored a map like {Car: 320, Bike: 180, Auto: 240}
  return fare[type] ?? 0;
}

export default function Rides({ onMenu }) {
  const [rows, setRows] = useState([]);
  const [qText, setQText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "rides"), orderBy("rideTime", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = qText.toLowerCase();
    return rows.filter(
      (r) =>
        (r.pickup || "").toLowerCase().includes(t) ||
        (r.drop || "").toLowerCase().includes(t) ||
        (r.status || "").toLowerCase().includes(t) ||
        (r.rideType || "").toLowerCase().includes(t)
    );
  }, [rows, qText]);

  const markCompleted = async (id) => {
    await updateDoc(doc(db, "rides", id), { status: "completed" });
  };

  const cancelRide = async (id) => {
    await updateDoc(doc(db, "rides", id), { status: "cancelled" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-3 flex gap-2">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search rides by pickup/drop/status…"
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          />
        </div>

        <div className="overflow-auto rounded-2xl border bg-white">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Time</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Pickup</th>
                <th className="p-3">Drop</th>
                <th className="p-3">Type</th>
                <th className="p-3">Fare (PKR)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const time = r.rideTime?.toDate
                  ? r.rideTime.toDate().toLocaleString()
                  : "-";
                const fare = fareToNumber(r.fare, r.rideType || "Car");
                return (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 whitespace-nowrap">{time}</td>
                    <td className="p-3">{r.customerName || r.customerId || "-"}</td>
                    <td className="p-3">{r.pickup || "-"}</td>
                    <td className="p-3">{r.drop || "-"}</td>
                    <td className="p-3">{r.rideType || "-"}</td>
                    <td className="p-3">{fare}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          r.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : r.status === "cancelled"
                            ? "bg-gray-100 text-gray-600"
                            : r.status === "assigned"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => markCompleted(r.id)}
                        className="rounded-xl border px-3 py-1 hover:bg-gray-50"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => cancelRide(r.id)}
                        className="rounded-xl border px-3 py-1 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500">
                    No rides found.
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
