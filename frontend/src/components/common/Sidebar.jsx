import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Tags,
  History,
  LogOut,
  Boxes,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/products", label: "Products", icon: <Package size={20} /> },
    { to: "/categories", label: "Categories", icon: <Tags size={20} /> },
    { to: "/transactions", label: "Stock Logs", icon: <History size={20} /> },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64 w-64"}`}
      >
        <div className="flex flex-col overflow-y-auto flex-1 no-scrollbar">
          {/* Brand Header */}
          <div className={`flex items-center justify-between px-5 py-5 border-b border-slate-800/80 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600/90 text-white p-2 rounded-xl shadow-lg shadow-indigo-600/20 flex-shrink-0">
                <Boxes size={22} />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-bold tracking-wider text-slate-100 animate-fade-in truncate">
                  StockGuard
                </span>
              )}
            </div>
            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* User Profile Info */}
          {user && (
            <div className={`px-5 py-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center gap-3 ${isCollapsed ? "lg:justify-center lg:py-4" : ""}`}>
              <div className="bg-slate-800 p-2 rounded-full border border-slate-700 text-indigo-400 flex-shrink-0">
                <User size={18} />
              </div>
              {!isCollapsed && (
                <div className="text-left overflow-hidden animate-fade-in">
                  <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-5 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="animate-fade-in truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed desktop sidebar */}
                {isCollapsed && (
                  <span className="absolute left-full ml-4 px-2 py-1 rounded bg-slate-950 text-slate-200 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-800">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout at bottom */}
        <div className={`p-3.5 border-t border-slate-800/80 ${isCollapsed ? "lg:flex lg:justify-center" : ""}`}>
          <button
            onClick={logout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors duration-200 group relative cursor-pointer ${
              isCollapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
            
            {/* Tooltip for collapsed desktop sidebar */}
            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2 py-1 rounded bg-slate-950 text-rose-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-slate-800">
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
