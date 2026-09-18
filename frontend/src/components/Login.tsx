import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { KeyRound, Mail, Building2, User, Building } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  // Login State
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");

  // Signup State
  const [name, setName] = useState("");
  const [isOrg, setIsOrg] = useState(false);
  const [orgName, setOrgName] = useState("");

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);

  const routeUser = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role || "USER";

      if (role === "ADMIN" || role === "MANAGER") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (e) {
      navigate("/");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      routeUser(token);
    } catch (err: any) {
      setError("Invalid credentials or user not found.");
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const payload = {
        name,
        email,
        password,
        orgName: isOrg ? orgName : null,
      };
      await api.post("/auth/register", payload);
      setMsg("Registration successful! Please sign in.");
      setIsLogin(true);
    } catch (err: any) {
      setError(err.response?.data || "Registration failed.");
    }
  };

  return (
    
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Enclave
              </span>
            </div>
            <button onClick={() => navigate("/")} className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
               Back to Home
            </button>
          </div>
        </div>
      </nav>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div
          className="flex justify-center mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Building2 size={48} className="text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
              setMsg("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${isLogin ? "bg-white dark:bg-gray-800 shadow text-blue-600" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
              setMsg("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition ${!isLogin ? "bg-white dark:bg-gray-800 shadow text-blue-600" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}
        {msg && (
          <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            {msg}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl p-3.5 transition shadow-lg shadow-blue-500/30 mt-2"
            >
              Access Account
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrg}
                  onChange={(e) => setIsOrg(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                I want to register a new Organization
              </label>
            </div>

            {isOrg && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Name
                </label>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required={isOrg}
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Acme Properties"
                    className="pl-10 w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl p-3.5 transition shadow-lg shadow-blue-500/30 mt-4"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}
