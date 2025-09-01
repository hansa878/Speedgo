import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import logo from "../assets/logo.png"; // your logo path

const navItem = (to, label, icon) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium 
      ${isActive ? "bg-red-100 text-red-600" : "text-gray-700 hover:bg-gray-100"}`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function Sidebar({ open, setOpen }) {
  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024 && open) setOpen(false);
    };
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [open, setOpen]);

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 lg:hidden transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-xl border-r
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="SpeedGo Logo" 
              className="h-10 w-10 object-cover rounded-xl" 
            />
            <span className="font-bold text-gray-700 text-lg">SpeedGo Admin</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            ✖
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItem("/", "Dashboard", "📊")}
          {navItem("/drivers", "Drivers", "🚗")}
          {navItem("/customers", "Customers", "👤")}
          {navItem("/rides", "Rides", "🧭")}
          {navItem("/wallet", "Wallet", "💳")}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="text-xs text-gray-500">v1.0 • React + Tailwind + Firebase</div>
        </div>
      </aside>
    </>
  );
}
