import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";

// Shell Layout Wrapper
const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      default:
        return "Inventory Management";
    }
  };

  return (
    <div className="flex bg-slate-955 min-h-screen text-slate-100 font-sans overflow-hidden">
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
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
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
  );
}

export default App;
