import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
// App.jsx
import LiveMap from "./LiveMap"; // path sahi karein
// agar file name LiveMap.jsx hai
// Updated LiveMap with alerts

export default function Dashboard() {
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      // Load rides
      const ridesSnap = await getDocs(collection(db, "rides"));
      const ridesData = ridesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRides(ridesData);

      // Load drivers
      const driversSnap = await getDocs(collection(db, "drivers"));
      const driversData = driversSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDrivers(driversData);

      // Load users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(usersData);

      // Calculate revenue
      const now = new Date();
      let daily = 0, weekly = 0, monthly = 0;
      ridesData.forEach(r => {
        const rideDate = r.createdAt?.toDate?.() || new Date();
        const fare = r.fare?.Car || 0;
        // Daily
        if (rideDate.toDateString() === now.toDateString()) daily += fare;
        // Weekly
        const weekDiff = (now - rideDate) / (1000 * 60 * 60 * 24);
        if (weekDiff <= 7) weekly += fare;
        // Monthly
        if (rideDate.getMonth() === now.getMonth() && rideDate.getFullYear() === now.getFullYear()) monthly += fare;
      });
      setDailyRevenue(daily);
      setWeeklyRevenue(weekly);
      setMonthlyRevenue(monthly);

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <p>Loading Dashboard...</p>;

  // Quick stats
  const totalRides = rides.length;
  const activeRides = rides.filter(r => r.status === "assigned" || r.status === "pending").length;
  const completedRides = rides.filter(r => r.status === "completed").length;
  const canceledRides = rides.filter(r => r.status === "canceled").length;
  const zeroBalanceDrivers = drivers.filter(d => (d.wallet || 0) <= 0).length;
  const pendingDrivers = drivers.filter(d => d.status === "pending").length;

  // Commission
  const commissionRate = 0.25;
  const totalRevenue = rides.reduce((sum, r) => sum + (r.fare?.Car || 0), 0);
  const totalCommission = totalRevenue * commissionRate;
  const commissionPerDriver = drivers.map(d => {
    const driverRides = rides.filter(r => r.driverId === d.id);
    const driverRevenue = driverRides.reduce((sum, r) => sum + (r.fare?.Car || 0), 0);
    return { name: d.name, commission: driverRevenue * commissionRate };
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Rides</p>
          <p className="text-2xl font-bold">{totalRides}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Active Rides</p>
          <p className="text-2xl font-bold">{activeRides}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Zero Balance Drivers</p>
          <p className="text-2xl font-bold text-red-600">{zeroBalanceDrivers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Pending Approvals</p>
          <p className="text-2xl font-bold">{pendingDrivers}</p>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Daily Revenue</p>
          <p className="text-xl font-bold">Rs {dailyRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Weekly Revenue</p>
          <p className="text-xl font-bold">Rs {weeklyRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Monthly Revenue</p>
          <p className="text-xl font-bold">Rs {monthlyRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Commission (25%)</p>
          <p className="text-2xl font-bold">Rs {totalCommission.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow overflow-y-auto max-h-48">
          <p className="text-gray-500 mb-2">Commission per Driver</p>
          {commissionPerDriver.map(d => (
            <p key={d.name} className="text-sm">{d.name}: Rs {d.commission.toFixed(2)}</p>
          ))}
        </div>
      </div>

      {/* Ride Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Completed Rides</p>
          <p className="text-xl font-bold">{completedRides}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Canceled Rides</p>
          <p className="text-xl font-bold">{canceledRides}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Registered Users</p>
          <p className="text-xl font-bold">{users.length}</p>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Live Map</h3>
        <LiveMap rides={rides} drivers={drivers} />
      </div>
    </div>
  );
}
