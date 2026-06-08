import { useState, useEffect } from "react";
import api from "../services/api";
import { Search, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transaction logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    // Search matching product name or SKU
    const productName = txn.product?.name || "";
    const productSku = txn.product?.sku || "";
    const matchesSearch =
      productName.toLowerCase().includes(search.toLowerCase()) ||
      productSku.toLowerCase().includes(search.toLowerCase());

    // Type filter matching
    const matchesType = typeFilter === "" ? true : txn.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Control panel header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">All Transactions</option>
            <option value="IN">Stock In (Additions)</option>
            <option value="OUT">Stock Out (Dispatches)</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="p-2 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-slate-400 text-sm py-16 text-center">No transaction logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-900/50">
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Operation Type</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4">Operated By</th>
                  <th className="p-4">Reason / Notes</th>
                  <th className="p-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="text-slate-300 hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-slate-100">
                        {txn.product?.name || <span className="text-slate-500 italic">Deleted Product</span>}
                      </p>
                      {txn.product?.sku && (
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{txn.product.sku}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        txn.type === "IN"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {txn.type === "IN" ? (
                          <>
                            <ArrowUpRight size={14} />
                            Stock In
                          </>
                        ) : (
                          <>
                            <ArrowDownRight size={14} />
                            Stock Out
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-200">{txn.quantity}</td>
                    <td className="p-4">
                      <p className="font-medium text-slate-300">{txn.user?.name || "Unknown Staff"}</p>
                      <p className="text-xs text-slate-500">{txn.user?.email}</p>
                    </td>
                    <td className="p-4 text-slate-400 italic text-xs max-w-xs truncate">
                      {txn.reason || "-"}
                    </td>
                    <td className="p-4 text-right text-slate-500 text-xs font-medium">
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

export default Transactions;
