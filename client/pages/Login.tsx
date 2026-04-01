import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      if (!formData.email || !formData.password) {
        setStatus("error");
        setMessage("Please fill in all fields.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }

      // Call login API
      console.log("📤 Sending login request:", { email: formData.email });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", response.headers);

      // Get response text first
      const responseText = await response.text();
      console.log("📥 Response text:", responseText);

      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("❌ Response was:", responseText);
        setStatus("error");
        setMessage("Server error. Please try again.");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(data?.message || "Login failed. Please try again.");
        return;
      }

      console.log("✅ Login successful:", data);

      // Store auth token and user info
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setStatus("success");
      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e] flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 right-0 w-full h-full opacity-20"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5b5fff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#5b5fff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M 100 200 Q 300 100 500 200 T 900 200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
          <path d="M 50 300 Q 250 200 450 300 T 850 300" stroke="url(#lineGradient)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-500/30 rounded-2xl p-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Login
          </h1>

          {/* Status Messages */}
          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/50 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/50 rounded-lg mb-6">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-6">
            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-700 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your Password"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-gray-700 transition-all"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {status === "loading" ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-950 text-gray-400">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            className="w-full bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm mt-8">
            Don't you have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
