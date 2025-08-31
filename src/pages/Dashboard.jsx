// src/pages/Dashboard.jsx
import Card from "../components/Card";
import { db } from "../firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

function Dashboard() {
  const [counts, setCounts] = useState({ drivers: 0, customers: 0, rides: 0, completed: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const driversSnap = await getCountFromServer(collection(db, "drivers"));
        const customersSnap = await getCountFromServer(collection(db, "users"));
        const ridesSnap = await getCountFromServer(collection(db, "rides"));
        const completedSnap = await getCountFromServer(
          query(collection(db, "rides"), where("status", "==", "completed"))
        );

        setCounts({
          drivers: driversSnap.data().count || 0,
          customers: customersSnap.data().count || 0,
          rides: ridesSnap.data().count || 0,
          completed: completedSnap.data().count || 0,
        });
      } catch (err) {
        console.error("❌ Error in Dashboard:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Drivers" value={counts.drivers} />
        <Card label="Total Customers" value={counts.customers} />
        <Card label="Total Rides" value={counts.rides} />
        <Card label="Completed Rides" value={counts.completed} />
      </div>
    </div>
  );
}

export default Dashboard;
