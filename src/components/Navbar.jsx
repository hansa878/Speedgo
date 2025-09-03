import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // login state clear
    navigate("/login"); // login page par bhej do
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <h1
        className="text-lg font-semibold tracking-wide"
        style={{ color: "#ff0101" }}
      >
        SpeedGo Admin Panel
      </h1>

      {/* 🔴 Logout Button with #ff0101 text */}
      <button
        onClick={handleLogout}
        className="bg-white border border-[#ff0101] text-[#ff0101] px-4 py-2 rounded-lg hover:bg-[#ff0101] hover:text-white transition"
      >
        Logout
      </button>
    </div>
  );
}


