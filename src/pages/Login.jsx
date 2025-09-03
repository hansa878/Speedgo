import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      localStorage.setItem("isLoggedIn", "true"); // Save login state
      navigate("/"); // Go to dashboard
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Admin Panel Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-8">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-5 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-5 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-5 rounded-xl font-semibold hover:bg-blue-700 transition text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
