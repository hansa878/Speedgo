// src/components/Card.jsx
export default function Card({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
    </div>
  );
}
