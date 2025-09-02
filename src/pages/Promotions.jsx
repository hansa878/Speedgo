import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function Promotions() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ code: "", discountType: "percent", discountValue: "", expiry: "", usageLimit: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromos = async () => {
      const snap = await getDocs(collection(db, "promotions"));
      setPromos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    loadPromos();
  }, []);

  const resetForm = () => setForm({ code: "", discountType: "percent", discountValue: "", expiry: "", usageLimit: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return alert("Code and discount required");

    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      expiry: form.expiry ? new Date(form.expiry) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      usedCount: 0,
      active: true,
      createdAt: serverTimestamp(),
    };

    if (editing) {
      await updateDoc(doc(db, "promotions", editing), payload);
      setPromos(promos.map(p => p.id === editing ? { ...p, ...payload } : p));
      setEditing(null);
    } else {
      const ref = await addDoc(collection(db, "promotions"), payload);
      setPromos([{ id: ref.id, ...payload }, ...promos]);
    }
    resetForm();
  };

  const handleEdit = (promo) => {
    setEditing(promo.id);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      expiry: promo.expiry ? new Date(promo.expiry.seconds * 1000).toISOString().slice(0,16) : "",
      usageLimit: promo.usageLimit || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promo?")) return;
    await deleteDoc(doc(db, "promotions", id));
    setPromos(promos.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Promotions & Promo Codes</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input placeholder="Code" className="border p-2 rounded" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
        <select className="border p-2 rounded" value={form.discountType} onChange={e => setForm({...form, discountType: e.target.value})}>
          <option value="percent">Percent (%)</option>
          <option value="fixed">Fixed (Rs)</option>
        </select>
        <input type="number" placeholder="Discount" className="border p-2 rounded" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} />
        <input type="datetime-local" className="border p-2 rounded" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} />
        <input type="number" placeholder="Usage limit" className="border p-2 rounded md:col-span-2" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} />
        <div className="md:col-span-2 flex items-center gap-4"> {/* gap increased from 3 → 4 */}
  <button
    className="text-black px-5 py-2 rounded text-sm" // px increased from 4 → 5 for more width
    style={{ backgroundColor: "#ff0101" }}
  >
    {editing ? "Update Promo" : "Create Promo"}
  </button>
  {editing && (
    <button 
      type="button" 
      onClick={() => { resetForm(); setEditing(null); }} 
      className="px-5 py-2 border rounded text-black text-sm" // px increased for consistency
    >
      Cancel
    </button>
  )}
</div>

      </form>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead style={{ backgroundColor: "#ff0101", color: "black" }}>
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3">Type</th>
              <th className="p-3">Value</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Used / Limit</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4">Loading...</td></tr>
            ) : promos.map(p => (
              <tr
                key={p.id}
                className="border-b"
                style={{ cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ffe5e5"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td className="p-3">{p.code}</td>
                <td className="p-3">{p.discountType}</td>
                <td className="p-3">{p.discountValue}</td>
                <td className="p-3">{p.expiry ? new Date(p.expiry.seconds * 1000).toLocaleString() : "No expiry"}</td>
                <td className="p-3">{p.usedCount} / {p.usageLimit || "∞"}</td>
                <td className="p-3">{p.active ? "Active" : "Disabled"}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-400 text-black rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-gray-300 text-black rounded text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && promos.length === 0 && (
              <tr><td className="p-4" colSpan={7}>No promos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
