import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Menu, Plus, Lock, Settings, LogOut } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

const Navbar = ({ title, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Left side: Hamburger Toggle (mobile) & Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Quick Add Product Button */}
        <button
          onClick={() => navigate("/products?action=add")}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          title="Quick Add Product"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* User profile dropdown */}
        <div className="relative border-l border-slate-800/80 pl-4 sm:pl-6" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
          >
            <div className="bg-slate-850 group-hover:bg-slate-800 p-2 rounded-xl border border-slate-800 group-hover:border-slate-700 text-indigo-400 group-hover:text-indigo-350 transition-colors">
              <User size={18} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-200 leading-tight group-hover:text-slate-100 transition-colors">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300 transition-colors">
                {user?.email}
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl animate-slide-up z-50">
              <div className="px-3 py-2 border-b border-slate-800/60 mb-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer"
              >
                <User size={15} className="text-slate-450" />
                My Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setPasswordModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer"
              >
                <Lock size={15} className="text-slate-450" />
                Change Password
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer"
              >
                <Settings size={15} className="text-slate-450" />
                Settings
              </button>
              <div className="h-px bg-slate-800/60 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-350 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
