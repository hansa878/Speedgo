import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Customers from "./pages/Customers";
import Rides from "./pages/Rides";
import Wallet from "./pages/Wallet";
import "./output.css";

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar open={open} setOpen={setOpen} />

        {/* Main content */}
        <div className="flex-1 min-h-screen flex flex-col transition-all duration-300 lg:ml-72">
          <Header setOpen={setOpen} />

          <main className="flex-1 p-4 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/rides" element={<Rides />} />
              <Route path="/wallet" element={<Wallet />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
