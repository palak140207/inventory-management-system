import { useState, useEffect } from "react";
import api from "../services/api";
import { formatINR } from "../utils/formatCurrency";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  MinusCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search & Filter parameters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  // Form fields for Add/Edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");

  // Form fields for Stock Adjustment
  const [adjustType, setAdjustType] = useState("IN"); // IN or OUT
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: {
          search,
          category: categoryFilter,
          stockStatus,
          sort,
          page,
          limit: 8,
        },
      });
      setProducts(res.data.products);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, stockStatus, sort, page]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await api.post("/products", {
        name,
        sku: sku || undefined,
        description,
        category,
        price,
        quantity: quantity || 0,
        threshold: threshold || 10,
      });
      setShowAddModal(false);
      setSuccess("Product added successfully!");
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  };

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setName(prod.name);
    setSku(prod.sku);
    setDescription(prod.description || "");
    setCategory(prod.category?._id || "");
    setPrice(prod.price);
    setQuantity(prod.quantity);
    setThreshold(prod.threshold);
    setShowEditModal(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await api.put(`/products/${selectedProduct._id}`, {
        name,
        sku,
        description,
        category,
        price,
        quantity,
        threshold,
      });
      setShowEditModal(false);
      setSuccess("Product updated successfully!");
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/products/${id}`);
      setSuccess("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleOpenStock = (prod, type) => {
    setSelectedProduct(prod);
    setAdjustType(type);
    setAdjustQty("");
    setAdjustReason(type === "IN" ? "Restock shipment" : "Sale order dispatched");
    setShowStockModal(true);
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const endpoint = adjustType === "IN" ? "/transactions/stock-in" : "/transactions/stock-out";
      await api.post(endpoint, {
        productId: selectedProduct._id,
        quantity: adjustQty,
        reason: adjustReason,
      });
      setShowStockModal(false);
      setSuccess(`Stock ${adjustType === "IN" ? "added" : "dispatched"} successfully!`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to adjust stock level");
    }
  };

  const resetForm = () => {
    setName("");
    setSku("");
    setDescription("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setThreshold("");
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alert Banners */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm glow-rose">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 p-4 rounded-xl text-sm glow-emerald">
          {success}
        </div>
      )}

      {/* Control panel header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-2xl shadow-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Filters & action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Stock Level Dropdown */}
          <select
            value={stockStatus}
            onChange={(e) => {
              setStockStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock Alerts</option>
          </select>

          {/* Sorting Dropdown */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
          >
            <option value="">Sort: Newest</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="qty_asc">Stock: Low to High</option>
            <option value="qty_desc">Stock: High to Low</option>
          </select>

          {/* Add Product trigger */}
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-xl text-slate-400">
          No products found matching filters.
        </div>
      ) : (
        <div className="space-y-6">
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-950/40">
                    <th className="p-4">Product Details</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Price</th>
                    <th className="p-4 text-right">Stock</th>
                    <th className="p-4 text-center">Quick Stock Adjust</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {products.map((prod) => {
                    const isLowStock = prod.quantity <= prod.threshold;
                    return (
                      <tr key={prod._id} className="text-slate-300 hover:bg-slate-850/30 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-slate-100">{prod.name}</p>
                          <p className="text-xs text-slate-500 max-w-xs truncate mt-0.5">
                            {prod.description || "No description"}
                          </p>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">{prod.sku}</td>
                        <td className="p-4">
                          <span className="bg-slate-800 border border-slate-700/60 text-slate-300 px-2.5 py-0.5 rounded-md text-[11px] font-semibold">
                            {prod.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="p-4 text-right font-medium text-slate-200">
                          {formatINR(prod.price)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-bold text-sm ${isLowStock ? "text-rose-400" : "text-slate-100"}`}>
                              {prod.quantity}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">min: {prod.threshold}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleOpenStock(prod, "IN")}
                              className="flex items-center gap-1.5 text-emerald-455 hover:bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                              title="Restock / Increase quantity"
                            >
                              <PlusCircle size={14} />
                              Stock In
                            </button>
                            <button
                              onClick={() => handleOpenStock(prod, "OUT")}
                              className="flex items-center gap-1.5 text-rose-455 hover:bg-rose-500/10 px-3 py-1 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                              title="Dispatch / Decrease quantity"
                            >
                              <MinusCircle size={14} />
                              Stock Out
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 p-1.5 rounded-lg border border-transparent hover:border-indigo-500/15 transition-all cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/15 transition-all cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((prod) => {
              const isLowStock = prod.quantity <= prod.threshold;
              return (
                <div
                  key={prod._id}
                  className={`bg-slate-900/60 backdrop-blur-xl border p-5 rounded-2xl space-y-4 shadow-md transition-all ${
                    isLowStock ? "border-rose-500/30 bg-rose-500/5 shadow-rose-500/5" : "border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm leading-snug">{prod.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">{prod.sku}</p>
                    </div>
                    <span className="bg-slate-800 border border-slate-700/60 text-slate-300 px-2.5 py-0.5 rounded-md text-[10px] font-semibold">
                      {prod.category?.name || "Uncategorized"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-450 line-clamp-2">
                    {prod.description || "No description"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/40 border border-slate-850 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Unit Price</span>
                      <span className="font-bold text-slate-200">{formatINR(prod.price)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Stock Level</span>
                      <span className={`font-bold ${isLowStock ? "text-rose-400" : "text-slate-200"}`}>
                        {prod.quantity}{" "}
                        <span className="text-[9px] text-slate-500 font-normal">(min: {prod.threshold})</span>
                      </span>
                    </div>
                  </div>

                  {/* Mobile action controls */}
                  <div className="flex justify-between gap-2 border-t border-slate-800/60 pt-3.5">
                    {/* Stock adjustments buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenStock(prod, "IN")}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-455 hover:bg-emerald-500/10 px-2 py-1.5 border border-emerald-500/20 rounded-lg transition-all cursor-pointer"
                        title="Stock In"
                      >
                        <PlusCircle size={13} />
                        In
                      </button>
                      <button
                        onClick={() => handleOpenStock(prod, "OUT")}
                        className="flex items-center gap-1 text-[11px] font-bold text-rose-455 hover:bg-rose-500/10 px-2 py-1.5 border border-rose-500/20 rounded-lg transition-all cursor-pointer"
                        title="Stock Out"
                      >
                        <MinusCircle size={13} />
                        Out
                      </button>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 border border-slate-800 bg-slate-950 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        className="p-1.5 border border-slate-800 bg-slate-950 text-slate-400 hover:text-rose-450 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between text-xs shadow-xl">
              <span className="text-slate-500 font-medium">
                Showing {products.length} of {total} items
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:text-slate-200 transition-all cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-slate-300 font-semibold px-2 bg-slate-950 border border-slate-850 py-1.5 px-3 rounded-lg">
                  {page} / {pages}
                </span>
                <button
                  disabled={page === pages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 disabled:opacity-30 disabled:pointer-events-none hover:text-slate-200 transition-all cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/20">
              <h3 className="font-bold text-slate-100 text-base">Add New Product</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-850 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Wireless Mouse"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">SKU (Auto-generated if empty)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="E.g. MS-WRLSS-01"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Alert Threshold</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product specification or notes..."
                    rows="3"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 resize-none transition-all"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer mt-4"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT MODAL --- */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/20">
              <h3 className="font-bold text-slate-100 text-base">Edit Product Details</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-850 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Alert Threshold</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none transition-all"
                  ></textarea>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer mt-4"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- STOCK ADJUSTMENT (IN/OUT) MODAL --- */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/20">
              <h3 className="font-bold text-slate-100 text-base">
                Stock Adjustment
              </h3>
              <button
                onClick={() => setShowStockModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-850 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              <div className="text-center pb-2">
                <h4 className="font-bold text-slate-200 text-sm">{selectedProduct?.name}</h4>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{selectedProduct?.sku}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 flex justify-between items-center text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Type</p>
                  <span className={`inline-block font-bold mt-1 ${
                    adjustType === "IN" ? "text-emerald-450" : "text-rose-455"
                  }`}>
                    Stock {adjustType === "IN" ? "Increase" : "Decrease"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Current level</p>
                  <span className="font-bold text-slate-300 block mt-1">{selectedProduct?.quantity} units</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Adjustment Quantity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="E.g. 15, 20"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Reason / Notes</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="E.g. Weekly replenishment, Customer sale"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-white font-semibold rounded-xl text-sm shadow-lg transition-all cursor-pointer mt-4 ${
                  adjustType === "IN"
                    ? "bg-emerald-600 hover:bg-emerald-505 shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-505 shadow-rose-600/20"
                }`}
              >
                Confirm Stock {adjustType === "IN" ? "IN" : "OUT"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
