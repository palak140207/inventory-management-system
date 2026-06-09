import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogIn, Mail, Lock, Boxes } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-650/10 blur-3xl pointer-events-none animate-pulse duration-3000"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 rounded-2xl shadow-2xl relative animate-slide-up">
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white mb-3.5 shadow-lg shadow-indigo-600/30 flex items-center justify-center">
            <Boxes size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">Welcome Back</h2>
          <p className="text-slate-450 text-xs sm:text-sm mt-1">Sign in to your StockGuard account</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2 glow-rose">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center items-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 text-sm mt-8 cursor-pointer"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-slate-400 text-xs sm:text-sm mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
