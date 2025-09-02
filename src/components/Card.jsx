export default function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-5 flex flex-col justify-between">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold text-gray-700">{value}</p>
    </div>
  );
}
