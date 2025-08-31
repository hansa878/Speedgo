import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Drivers from "./pages/Drivers.jsx";
import Customers from "./pages/Customers.jsx";
import Rides from "./pages/Rides.jsx";
import Wallet from "./pages/Wallet.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./output.css";



function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rides" element={<Rides />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
