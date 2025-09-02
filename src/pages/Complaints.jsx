// src/pages/Complaints.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase"; // aapke firebase config se
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  // Firestore se complaints fetch
  useEffect(() => {
    const fetchComplaints = async () => {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      setComplaints(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchComplaints();
  }, []);

  // Complaint resolve karna
  const resolveComplaint = async (id) => {
    await updateDoc(doc(db, "complaints", id), {
      status: "resolved",
      resolvedAt: new Date(),
    });
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Complaints</h1>
      <table className="min-w-full border rounded-lg bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">User/Driver</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-3">{c.type} - {c.userId}</td>
              <td className="p-3">{c.category}</td>
              <td className="p-3">{c.message}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    c.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="p-3">
                {c.status === "pending" && (
                  <button
                    onClick={() => resolveComplaint(c.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Mark Resolved
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

