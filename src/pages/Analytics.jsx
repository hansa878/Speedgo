import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [driverPerf, setDriverPerf] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const ridesCol = collection(db, "rides");
      const snap = await getDocs(ridesCol);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Revenue by day (last 7 days)
      const byDay = {};
      const hours = Array(24).fill(0);
      const drivers = {};

      const now = Date.now();
      const sevenDaysAgo = now - 7*24*60*60*1000;

      docs.forEach(r => {
        const t = r.rideTime?.toDate ? r.rideTime.toDate() : (r.rideTime ? new Date(r.rideTime) : new Date());
        if (t.getTime() >= sevenDaysAgo) {
          const dayKey = t.toISOString().slice(0,10);
          const fare = typeof r.fare === "number" ? r.fare : (r.fare?.Car || 0);
          byDay[dayKey] = (byDay[dayKey] || 0) + fare;
          hours[t.getHours()] += 1;
          if (r.driverId) {
            drivers[r.driverId] = drivers[r.driverId] ? drivers[r.driverId] + 1 : 1;
          }
        }
      });

      setRevenueByDay(Object.entries(byDay).map(([d, v]) => ({ date: d, revenue: Math.round(v) })));
      setPeakHours(hours.map((c, i) => ({ hour: `${i}:00`, rides: c })));
      // Top drivers
      const driverArr = Object.entries(drivers).map(([id, rides]) => ({ driverId: id, rides }));
      setDriverPerf(driverArr.sort((a,b) => b.rides - a.rides).slice(0,10));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics & Reports</h2>
      {loading ? <p>Loading analytics...</p> : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Revenue (last 7 days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueByDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Line type="monotone" dataKey="revenue" stroke="#ff0101" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Peak Hours (rides)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakHours}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Bar dataKey="rides" fill="#ff7a7a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Top Drivers (by rides)</h3>
            <table className="min-w-full">
              <thead className="bg-red-600 text-white">
                <tr>
                  <th className="p-3">Driver ID</th>
                  <th className="p-3">Rides</th>
                </tr>
              </thead>
              <tbody>
                {driverPerf.map(d => (
                  <tr key={d.driverId} className="border-b hover:bg-red-50">
                    <td className="p-3">{d.driverId}</td>
                    <td className="p-3">{d.rides}</td>
                  </tr>
                ))}
                {driverPerf.length === 0 && <tr><td className="p-4">No data</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
