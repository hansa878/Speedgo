import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", target: "all" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      const snap = await getDocs(collection(db, "notifications"));
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    loadNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return alert("Title & message required");

    const payload = { ...form, createdAt: serverTimestamp() };
    await addDoc(collection(db, "notifications"), payload);
    setNotifications([{ id: Date.now(), ...payload }, ...notifications]);
    setForm({ title: "", message: "", target: "all" });
    alert("Notification sent successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Push Notifications</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <input
          placeholder="Title"
          className="border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Message"
          className="border p-2 rounded"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={form.target}
          onChange={(e) => setForm({ ...form, target: e.target.value })}
        >
          <option value="all">All Users & Drivers</option>
          <option value="users">Users Only</option>
          <option value="drivers">Drivers Only</option>
        </select>
        <button
          className="text-black px-4 py-2 rounded md:col-span-3"
          style={{ backgroundColor: "#ff0101" }}
        >
          Send Notification
        </button>
      </form>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead style={{ backgroundColor: "#ff0101", color: "black" }}>
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Message</th>
              <th className="p-3">Target</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4">Loading...</td>
              </tr>
            ) : (
              notifications.map((n) => (
                <tr
                  key={n.id}
                  className="border-b"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe5e5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="p-3">{n.title}</td>
                  <td className="p-3">{n.message}</td>
                  <td className="p-3">{n.target}</td>
                </tr>
              ))
            )}
            {!loading && notifications.length === 0 && (
              <tr>
                <td className="p-4" colSpan={3}>
                  No notifications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
