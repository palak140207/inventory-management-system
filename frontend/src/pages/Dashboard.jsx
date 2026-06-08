import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Boxes,
  Tags,
  AlertTriangle,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
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
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  const { summary, lowStockAlerts, recentTransactions, categoryDistribution } =
    stats || {};

  return (
    <div className="space-y-8">
      {/* Overview stats cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Valuation */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Stock Value</p>
            <p className="text-2xl font-bold text-slate-100 mt-2">
              ${summary?.totalValuation?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-slate-100 mt-2">
              {summary?.totalProducts}
            </p>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
            <Boxes size={24} />
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Categories</p>
            <p className="text-2xl font-bold text-slate-100 mt-2">
              {summary?.totalCategories}
            </p>
          </div>
          <div className="bg-amber-500/10 p-3 rounded-lg text-amber-400">
            <Tags size={24} />
          </div>
        </div>

        {/* Low Stock alerts */}
        <div className={`bg-slate-900 border p-6 rounded-xl flex items-center justify-between transition-all ${
          summary?.lowStockCount > 0 ? "border-rose-500/30 bg-rose-500/5" : "border-slate-800"
        }`}>
          <div>
            <p className="text-sm text-slate-400 font-medium">Low Stock Alerts</p>
            <p className={`text-2xl font-bold mt-2 ${
              summary?.lowStockCount > 0 ? "text-rose-400" : "text-slate-100"
            }`}>
              {summary?.lowStockCount}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            summary?.lowStockCount > 0 ? "bg-rose-500/20 text-rose-400" : "bg-slate-800 text-slate-400"
          }`}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Widgets and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low stock alerts panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-rose-400" />
              Low Stock Warnings
            </h3>

            {lowStockAlerts?.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No low stock items found. All levels healthy!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">SKU</th>
                      <th className="pb-3 text-right">In Stock</th>
                      <th className="pb-3 text-right">Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {lowStockAlerts?.map((prod) => (
                      <tr key={prod._id} className="text-slate-300">
                        <td className="py-3 font-medium text-slate-200">{prod.name}</td>
                        <td className="py-3 font-mono text-slate-400">{prod.sku}</td>
                        <td className="py-3 text-right font-semibold text-rose-400">
                          {prod.quantity}
                        </td>
                        <td className="py-3 text-right text-slate-500">{prod.threshold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Distribution overview chart simulation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Layers size={20} className="text-indigo-400" />
            Stock Value by Category
          </h3>
          {categoryDistribution?.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No data available.</p>
          ) : (
            <div className="space-y-5">
              {categoryDistribution?.map((cat) => {
                const totalValueSum = categoryDistribution.reduce((acc, c) => acc + c.totalValue, 0) || 1;
                const percentage = Math.round((cat.totalValue / totalValueSum) * 100);

                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-300">{cat.name}</span>
                      <span className="text-slate-400 font-semibold">
                        ${cat.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({percentage}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-850 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-slate-500 text-right">
                      {cat.count} product(s)
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Recent Stock Movements</h3>
        {recentTransactions?.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">No stock movements logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Quantity</th>
                  <th className="pb-3">Operated By</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {recentTransactions?.map((txn) => (
                  <tr key={txn._id} className="text-slate-300">
                    <td className="py-3.5">
                      <span className="font-semibold text-slate-200">
                        {txn.product?.name || "Deleted Product"}
                      </span>
                      {txn.product?.sku && (
                        <span className="text-xs font-mono text-slate-500 ml-2">({txn.product.sku})</span>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${
                        txn.type === "IN"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}>
                        {txn.type === "IN" ? (
                          <ArrowUpRight size={14} />
                        ) : (
                          <ArrowDownRight size={14} />
                        )}
                        Stock {txn.type}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-200">{txn.quantity}</td>
                    <td className="py-3.5 text-slate-400">{txn.user?.name}</td>
                    <td className="py-3.5 text-slate-400 italic text-xs">{txn.reason}</td>
                    <td className="py-3.5 text-right text-slate-500 text-xs">
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
