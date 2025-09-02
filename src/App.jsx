import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Drivers from "./pages/Drivers";
import Rides from "./pages/Rides";
import Wallet from "./pages/Wallet";
import Promotions from "./pages/Promotions";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import LiveMap from "./pages/LiveMap"; 
import ErrorBoundary from "./components/ErrorBoundary";
import './output.css';

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Main Admin Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="rides" element={<Rides />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="promotions" element={<Promotions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="livemap" element={<LiveMap />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
