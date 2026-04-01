import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navigation() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for auth token
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    // Listen for login/logout events
    const handleStorageChange = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div className="w-full max-w-6xl bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-md rounded-full border border-blue-500/30 px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-sm">
            DZ
          </div>
          <span className="hidden sm:inline font-bold text-white text-lg">
            DzakCloud
          </span>
        </Link>

        {/* Menu Items */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Contact
          </Link>
          <Link
            to="/services"
            className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Services
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600/30 hover:bg-red-600/40 border border-red-500/50 text-red-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-blue-300 transition-colors text-sm font-medium"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
