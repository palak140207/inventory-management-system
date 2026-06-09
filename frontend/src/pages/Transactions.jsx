import { useState, useEffect } from "react";
import api from "../services/api";
import { Search, ArrowUpRight, ArrowDownRight, RefreshCw, History, User, Clock } from "lucide-react";

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
    <div className="space-y-6 animate-fade-in">
      {/* Alert Banner */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-450 p-4 rounded-xl text-sm glow-rose">
          {error}
        </div>
      )}

      {/* Control panel header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by product name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">All Transactions</option>
            <option value="IN">Stock In (Additions)</option>
            <option value="OUT">Stock Out (Dispatches)</option>
          </select>

          <button
            onClick={fetchTransactions}
            className="p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Logs registry container */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl text-slate-400">
          No transaction logs found.
        </div>
      ) : (
        <div className="space-y-4">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-955/55">
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Operation Type</th>
                    <th className="p-4 text-right">Quantity</th>
                    <th className="p-4">Operated By</th>
                    <th className="p-4">Reason / Notes</th>
                    <th className="p-4 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn._id} className="text-slate-300 hover:bg-slate-850/30 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-slate-100">
                          {txn.product?.name || <span className="text-slate-500 italic">Deleted Product</span>}
                        </p>
                        {txn.product?.sku && (
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">{txn.product.sku}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                          txn.type === "IN"
                            ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                        }`}>
                          {txn.type === "IN" ? (
                            <>
                              <ArrowUpRight size={13} />
                              Stock In
                            </>
                          ) : (
                            <>
                              <ArrowDownRight size={13} />
                              Stock Out
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-100">{txn.quantity}</td>
                      <td className="p-4">
                        <p className="font-medium text-slate-300">{txn.user?.name || "Unknown User"}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{txn.user?.email}</p>
                      </td>
                      <td className="p-4 text-slate-400 italic text-xs max-w-xs truncate">
                        {txn.reason || "-"}
                      </td>
                      <td className="p-4 text-right text-slate-500 text-xs font-semibold">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredTransactions.map((txn) => (
              <div
                key={txn._id}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl space-y-3 shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm leading-snug">
                      {txn.product?.name || <span className="text-slate-550 italic">Deleted Product</span>}
                    </h4>
                    {txn.product?.sku && (
                      <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{txn.product.sku}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    txn.type === "IN"
                      ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-455 border border-rose-500/20"
                  }`}>
                    {txn.type === "IN" ? (
                      <>
                        <ArrowUpRight size={12} />
                        In
                      </>
                    ) : (
                      <>
                        <ArrowDownRight size={12} />
                        Out
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 border border-slate-850 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold">Quantity</span>
                    <span className="font-bold text-slate-200">{txn.quantity} units</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-semibold">Operated By</span>
                    <span className="text-slate-200 font-medium">{txn.user?.name || "Unknown"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500 flex-shrink-0">Reason:</span>
                  <p className="italic text-[11px] truncate flex-1">{txn.reason || "-"}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 border-t border-slate-800/60 pt-2.5">
                  <Clock size={12} />
                  <span>{new Date(txn.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
