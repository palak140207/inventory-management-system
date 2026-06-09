import { useState, useEffect } from "react";
import api from "../services/api";
import { formatINR } from "../utils/formatCurrency";
import {
  Boxes,
  Tags,
  AlertTriangle,
  IndianRupee,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
      setError("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl animate-fade-in glow-rose text-sm">
        {error}
      </div>
    );
  }

  const { summary, lowStockAlerts, recentTransactions, categoryDistribution } =
    stats || {};

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="text-indigo-400" size={22} />
            Quick Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of your store inventory, stock values, and recent operations.
          </p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-950 px-3.5 py-2 border border-slate-800/80 rounded-xl w-fit">
          <Clock size={14} className="text-indigo-400" />
          Last synced: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Overview stats cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Valuation */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/60 hover:shadow-indigo-500/5 hover:shadow-md transition-all duration-300 group">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Stock Valuation</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 tracking-tight group-hover:text-indigo-300 transition-colors">
              {formatINR(summary?.totalValuation)}
            </p>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl text-indigo-400 shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <IndianRupee size={22} />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/60 hover:shadow-emerald-500/5 hover:shadow-md transition-all duration-300 group">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Products</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 tracking-tight group-hover:text-emerald-300 transition-colors">
              {summary?.totalProducts}
            </p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-400 shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <Boxes size={22} />
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700/60 hover:shadow-amber-500/5 hover:shadow-md transition-all duration-300 group">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Categories</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-100 mt-2 tracking-tight group-hover:text-amber-300 transition-colors">
              {summary?.totalCategories}
            </p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-amber-400 shadow-lg group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            <Tags size={22} />
          </div>
        </div>

        {/* Low Stock alerts */}
        <div className={`bg-slate-900/60 backdrop-blur-xl border p-5 rounded-2xl flex items-center justify-between transition-all duration-300 group ${
          summary?.lowStockCount > 0
            ? "border-rose-500/30 bg-rose-500/5 shadow-lg shadow-rose-500/5"
            : "border-slate-800/80 hover:border-slate-700/60"
        }`}>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Low Stock alerts</p>
            <p className={`text-xl sm:text-2xl font-bold mt-2 tracking-tight transition-colors ${
              summary?.lowStockCount > 0 ? "text-rose-450 group-hover:text-rose-400" : "text-slate-100"
            }`}>
              {summary?.lowStockCount}
            </p>
          </div>
          <div className={`p-3.5 rounded-xl border transition-all duration-300 ${
            summary?.lowStockCount > 0
              ? "bg-rose-500/20 border-rose-500/35 text-rose-400 group-hover:bg-rose-600 group-hover:text-white"
              : "bg-slate-850 border-slate-800 text-slate-400 group-hover:bg-slate-800"
          }`}>
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Main Grid: Widgets and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low stock alerts panel */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-450" />
              Low Stock Warnings
            </h3>

            {lowStockAlerts?.length === 0 ? (
              <div className="text-slate-400 text-sm py-12 text-center bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                No low stock items found. All levels healthy!
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800/60 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/40">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU Code</th>
                      <th className="p-3 text-right">In Stock</th>
                      <th className="p-3 text-right font-medium">Alert Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {lowStockAlerts?.map((prod) => (
                      <tr key={prod._id} className="text-slate-300 hover:bg-slate-850/30 transition-colors">
                        <td className="p-3 font-semibold text-slate-200">{prod.name}</td>
                        <td className="p-3 font-mono text-slate-500">{prod.sku}</td>
                        <td className="p-3 text-right font-bold text-rose-400">
                          {prod.quantity}
                        </td>
                        <td className="p-3 text-right text-slate-500">{prod.threshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Distribution overview chart simulation */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-indigo-400" />
            Value Distribution by Category
          </h3>
          {categoryDistribution?.length === 0 ? (
            <div className="text-slate-400 text-sm py-12 flex-1 flex items-center justify-center bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
              No categories registered yet.
            </div>
          ) : (
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-1">
              {categoryDistribution?.map((cat) => {
                const totalValueSum = categoryDistribution.reduce((acc, c) => acc + c.totalValue, 0) || 1;
                const percentage = Math.round((cat.totalValue / totalValueSum) * 100);

                return (
                  <div key={cat._id} className="space-y-1 bg-slate-950/25 border border-slate-850 p-3 rounded-xl hover:border-slate-800/60 transition-colors">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{cat.name}</span>
                      <span className="text-slate-400 font-bold">
                        {formatINR(cat.totalValue)} ({percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                      <span>{cat.count} product{cat.count > 1 ? "s" : ""}</span>
                      <span>{percentage}% total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-4">Recent Stock Movements</h3>
        {recentTransactions?.length === 0 ? (
          <div className="text-slate-400 text-sm py-12 text-center bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
            No stock movements logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-800/60 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-slate-950/40">
                  <th className="p-3.5">Product Name</th>
                  <th className="p-3.5">Operation Type</th>
                  <th className="p-3.5 text-right">Qty adjusted</th>
                  <th className="p-3.5">Operated By</th>
                  <th className="p-3.5">Reason Note</th>
                  <th className="p-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {recentTransactions?.map((txn) => (
                  <tr key={txn._id} className="text-slate-300 hover:bg-slate-850/30 transition-colors">
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200">
                        {txn.product?.name || "Deleted Product"}
                      </span>
                      {txn.product?.sku && (
                        <span className="text-[10px] font-mono text-slate-500 ml-2">({txn.product.sku})</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        txn.type === "IN"
                          ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                      }`}>
                        {txn.type === "IN" ? (
                          <ArrowUpRight size={12} />
                        ) : (
                          <ArrowDownRight size={12} />
                        )}
                        Stock {txn.type === "IN" ? "IN" : "OUT"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-bold text-slate-200">{txn.quantity}</td>
                    <td className="p-3.5 text-slate-400 font-medium">{txn.user?.name}</td>
                    <td className="p-3.5 text-slate-450 italic text-[11px] max-w-[200px] truncate">{txn.reason}</td>
                    <td className="p-3.5 text-right text-slate-500">
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
