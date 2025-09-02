import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Settings() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      const ref = doc(db, "settings", "appConfig");
      const snap = await getDoc(ref);
      if (snap.exists()) setConfig(snap.data());
      else {
        const defaultConfig = {
          baseFare: { Car: 300, Bike: 150, Auto: 200 },
          perKm: 20,
          cancellationFee: 50,
          minWalletToAccept: 100,
          geoFence: { enabled: false, areas: [] },
          admins: {}
        };
        await setDoc(ref, defaultConfig);
        setConfig(defaultConfig);
      }
      setLoading(false);
    };
    loadConfig();
  }, []);

  const saveConfig = async () => {
    await setDoc(doc(db, "settings", "appConfig"), config, { merge: true });
    alert("Settings saved successfully!");
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">App Settings</h2>
      <div className="bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Car Base Fare</label>
          <input type="number" className="border p-2 rounded w-full" value={config.baseFare.Car} onChange={e => setConfig({...config, baseFare: {...config.baseFare, Car: Number(e.target.value)}})} />
        </div>
        <div>
          <label>Bike Base Fare</label>
          <input type="number" className="border p-2 rounded w-full" value={config.baseFare.Bike} onChange={e => setConfig({...config, baseFare: {...config.baseFare, Bike: Number(e.target.value)}})} />
        </div>
        <div>
          <label>Per KM Charge</label>
          <input type="number" className="border p-2 rounded w-full" value={config.perKm} onChange={e => setConfig({...config, perKm: Number(e.target.value)})} />
        </div>
        <div>
          <label>Cancellation Fee</label>
          <input type="number" className="border p-2 rounded w-full" value={config.cancellationFee} onChange={e => setConfig({...config, cancellationFee: Number(e.target.value)})} />
        </div>
        <div className="md:col-span-2">
          <label>Minimum Wallet to Accept Ride</label>
          <input type="number" className="border p-2 rounded w-full" value={config.minWalletToAccept} onChange={e => setConfig({...config, minWalletToAccept: Number(e.target.value)})} />
        </div>
        <div className="md:col-span-2">
          <label>Geo-Fencing Enabled</label>
          <select className="border p-2 rounded w-full" value={config.geoFence.enabled ? "true" : "false"} onChange={e => setConfig({...config, geoFence: {...config.geoFence, enabled: e.target.value === "true"}})}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button onClick={saveConfig} className="bg-red-600 text-white px-4 py-2 rounded">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
