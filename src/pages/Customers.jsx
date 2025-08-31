// src/pages/Customers.jsx
import Header from "../components/Header";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Customers({ onMenu }) {
  const [rows, setRows] = useState([]);
  const [qText, setQText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("fullName", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = qText.toLowerCase();
    return rows.filter(
      (r) =>
        (r.fullName || "").toLowerCase().includes(t) ||
        (r.phone || "").toLowerCase().includes(t) ||
        (r.email || "").toLowerCase().includes(t)
    );
  }, [rows, qText]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="mb-3">
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            placeholder="Search customers by name/email/phone…"
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          />
        </div>

        <div className="overflow-auto rounded-2xl border bg-white">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.fullName || "-"}</td>
                  <td className="p-3">{r.phone || "-"}</td>
                  <td className="p-3">{r.email || "-"}</td>
                  <td className="p-3">{r.role || "customer"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No customers found.
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
