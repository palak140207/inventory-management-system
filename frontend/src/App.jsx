import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/common/Toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import { Plus } from "lucide-react";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Shell Layout Wrapper
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef(null);

  // Get Page Title from Pathname
  const getPageTitle = (path) => {
    switch (path) {
      case "/":
        return "Operational Dashboard";
      case "/products":
        return "Product Inventory";
      case "/categories":
        return "Category Registry";
      case "/transactions":
        return "Transaction Audit Logs";
      case "/profile":
        return "My Profile";
      case "/settings":
        return "Settings";
      default:
        return "Inventory Management";
    }
  };

  // Close FAB on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setFabOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard Shortcuts (Gmail/Github-style sequences)
  useEffect(() => {
    let lastKey = "";
    let timeoutId = null;

    const handleKeyDown = (e) => {
      // Ignore shortcuts if user is typing in inputs or editable elements
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.tagName === "SELECT" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }

      clearTimeout(timeoutId);
      const key = e.key.toLowerCase();

      if (lastKey === "g") {
        if (key === "d") {
          navigate("/");
          e.preventDefault();
        } else if (key === "p") {
          navigate("/products");
          e.preventDefault();
        } else if (key === "c") {
          navigate("/categories");
          e.preventDefault();
        } else if (key === "t") {
          navigate("/transactions");
          e.preventDefault();
        }
        lastKey = "";
      } else if (lastKey === "a") {
        if (key === "p") {
          navigate("/products?action=add");
          e.preventDefault();
        } else if (key === "c") {
          navigate("/categories?action=add");
          e.preventDefault();
        }
        lastKey = "";
      } else {
        if (key === "g" || key === "a") {
          lastKey = key;
          timeoutId = setTimeout(() => {
            lastKey = "";
          }, 1000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="flex bg-slate-955 min-h-screen text-slate-100 font-sans overflow-hidden relative">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar
          title={getPageTitle(location.pathname)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto bg-slate-950/40">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      <div className="md:hidden" ref={fabRef}>
        {fabOpen && (
          <div className="fixed bottom-20 right-6 z-[99] flex flex-col gap-2.5 animate-slide-up">
            <button
              onClick={() => {
                setFabOpen(false);
                navigate("/products?action=add");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl text-xs font-semibold shadow-2xl active:bg-slate-800 cursor-pointer"
            >
              <span>📦 Add Product</span>
            </button>
            <button
              onClick={() => {
                setFabOpen(false);
                navigate("/categories?action=add");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl text-xs font-semibold shadow-2xl active:bg-slate-800 cursor-pointer"
            >
              <span>📁 Add Category</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full shadow-2xl z-[99] cursor-pointer transition-all duration-200 ${
            fabOpen ? "rotate-45 bg-slate-800 border border-slate-700" : ""
          }`}
          title="Quick Actions"
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<DashboardLayout />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
