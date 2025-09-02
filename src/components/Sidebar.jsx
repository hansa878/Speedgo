import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Drivers", path: "/drivers" },
    { name: "Riders", path: "/users" },
    { name: "Rides", path: "/rides" },
    { name: "Wallet", path: "/wallet" },
    { name: "Notifications", path: "/notifications" },
    { name: "Promotions", path: "/promotions" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div
  style={{ backgroundColor: "#ff0101" }}
  className={`text-white h-screen p-4 ${open ? "w-64" : "w-20"} transition-all duration-300`}
>

      <div className="flex justify-between items-center mb-6">
        {open && <img src={logo} alt="Logo" className="h-10 w-auto" />}
        <button onClick={() => setOpen(!open)} className="text-white text-2xl font-bold">
          {open ? "«" : "»"}
        </button>
      </div>
      <nav className="flex flex-col gap-2">
        {menu.map((m, i) => (
          <NavLink
            key={i}
            to={m.path}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-red-700 transition-colors ${isActive ? "bg-red-800 font-bold" : ""}`
            }
          >
            {open ? m.name : m.name[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}  