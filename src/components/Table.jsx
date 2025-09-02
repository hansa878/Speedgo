import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-2xl">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              {Object.values(row).map((val, j) => (
                <td key={j} className="px-4 py-2">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
