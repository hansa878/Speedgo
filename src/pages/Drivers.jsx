// src/pages/Drivers.jsx
import Header from "../components/Header";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Drivers({ onMenu }) {
  const [rows, setRows] = useState([]);
  const [qText, setQText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "drivers"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setRows(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = qText.toLowerCase();
    return rows.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(t) ||
        (r.phone || "").toLowerCase().includes(t) ||
        (r.email || "").toLowerCase().includes(t) ||
        (r.vehicleType || "").toLowerCase().includes(t)
    );
  }, [rows, qText]);

  const toggleAvailability = async (id, current) => {
    await updateDoc(doc(db, "drivers", id), { isAvailable: !current });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Drivers" onMenu={onMenu} />
      <div className="p-4">
        <div className="mb-3 flex gap-2">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search drivers by name/email/phone/vehicle…"
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          />
        </div>

        <div className="overflow-auto rounded-2xl border bg-white">
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Reg</th>
                <th className="p-3">Available</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const reg = r?.vehicleInfo?.registration || "-";
                return (
                  <tr key={r.id} className="border-t">
                    <td className="p-3">{r.name || "-"}</td>
                    <td className="p-3">{r.phone || "-"}</td>
                    <td className="p-3">{r.email || "-"}</td>
                    <td className="p-3">{r.vehicleType || "-"}</td>
                    <td className="p-3">{reg}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          r.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {r.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleAvailability(r.id, r.isAvailable)}
                        className="rounded-xl border px-3 py-1 hover:bg-gray-50"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No drivers found.
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
