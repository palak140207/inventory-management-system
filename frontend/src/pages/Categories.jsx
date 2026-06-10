import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { Plus, Edit2, Trash2, X, Check, FolderOpen } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Add form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const nameInputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle URL Query Params for Quick Add Category
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "add") {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
        nameInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      setSearchParams({}, { replace: true });
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await api.post("/categories", { name, description });
      setCategories([...categories, res.data]);
      setName("");
      setDescription("");
      showToast("Category created successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create category", "error");
    }
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdate = async (id) => {
    if (!editName) return;

    try {
      const res = await api.put(`/categories/${id}`, {
        name: editName,
        description: editDescription,
      });

      setCategories(categories.map((c) => (c._id === id ? res.data : c)));
      handleCancelEdit();
      showToast("Category updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update category", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      showToast("Category deleted successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Create Category Form */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Plus size={18} className="text-indigo-400" />
            Add New Category
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                Category Name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Electronics, Clothes"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the category..."
                rows="4"
                className="w-full px-3.5 py-2.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-655 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm cursor-pointer"
            >
              Create Category
            </button>
          </form>
        </div>

        {/* Categories List registry */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 lg:col-span-2 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-indigo-400" />
            Category Registry
          </h3>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm bg-slate-955/20 border border-dashed border-slate-800 rounded-xl">
              No categories registered yet.
            </div>
          ) : (
            <div className="space-y-4">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block border border-slate-800/60 rounded-xl overflow-hidden bg-slate-955/20">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-955/50">
                      <th className="p-4 w-1/3">Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-sm">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="text-slate-300 hover:bg-slate-850/30 transition-colors">
                        {editingId === cat._id ? (
                          <>
                            {/* EDITING MODE */}
                            <td className="p-3">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-955 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-955 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                              />
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => handleUpdate(cat._id)}
                                  className="text-emerald-400 hover:bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/25 transition-all cursor-pointer"
                                  title="Save"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-slate-400 hover:bg-slate-850 p-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            {/* VIEW MODE */}
                            <td className="p-4 font-semibold text-slate-200">{cat.name}</td>
                            <td className="p-4 text-slate-450 max-w-xs truncate">
                              {cat.description || <span className="text-slate-600 italic text-xs">No description</span>}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end items-center gap-3">
                                <button
                                  onClick={() => navigate(`/products?action=add&category=${cat._id}`)}
                                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Add Product to this category"
                                >
                                  + Add Product
                                </button>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStartEdit(cat)}
                                    className="text-slate-455 hover:text-indigo-400 hover:bg-indigo-500/10 p-1.5 rounded-lg transition-all cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="text-slate-455 hover:text-rose-450 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-3 shadow-sm"
                  >
                    {editingId === cat._id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1 font-semibold">Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1 font-semibold">Description</label>
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => handleUpdate(cat._id)}
                            className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all cursor-pointer"
                          >
                            <Check size={14} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-1 text-xs text-slate-400 bg-slate-850 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-all cursor-pointer"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center gap-2">
                          <h4 className="font-bold text-slate-100 text-sm truncate flex-1">{cat.name}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/products?action=add&category=${cat._id}`)}
                              className="text-[11px] text-indigo-400 hover:text-indigo-350 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 transition-all font-semibold cursor-pointer"
                              title="Add Product"
                            >
                              + Product
                            </button>
                            <button
                              onClick={() => handleStartEdit(cat)}
                              className="p-1.5 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-450 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              className="p-1.5 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-450 hover:text-rose-455 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-slate-450 leading-relaxed">
                          {cat.description || <span className="text-slate-600 italic text-[11px]">No description provided</span>}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
