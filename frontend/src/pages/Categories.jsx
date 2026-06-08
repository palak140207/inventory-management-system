import { useState, useEffect } from "react";
import api from "../services/api";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      setError("");
      setSuccess("");
      const res = await api.post("/categories", { name, description });
      setCategories([...categories, res.data]);
      setName("");
      setDescription("");
      setSuccess("Category created successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
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
      setError("");
      setSuccess("");
      const res = await api.put(`/categories/${id}`, {
        name: editName,
        description: editDescription,
      });

      setCategories(categories.map((c) => (c._id === id ? res.data : c)));
      handleCancelEdit();
      setSuccess("Category updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setError("");
      setSuccess("");
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      setSuccess("Category deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Banners */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Category Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-400" />
            Add New Category
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Electronics, Clothes"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the category..."
                rows="3"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 text-sm cursor-pointer"
            >
              Create Category
            </button>
          </form>
        </div>

        {/* Categories List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Category Registry</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No categories registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                    <th className="pb-3 w-1/3">Name</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="text-slate-300">
                      {editingId === cat._id ? (
                        <>
                          {/* EDITING MODE */}
                          <td className="py-3 pr-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none"
                            />
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(cat._id)}
                                className="text-emerald-400 hover:bg-emerald-500/10 p-1.5 rounded transition-colors"
                                title="Save"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-slate-400 hover:bg-slate-850 p-1.5 rounded transition-colors"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* VIEW MODE */}
                          <td className="py-4 font-semibold text-slate-200">{cat.name}</td>
                          <td className="py-4 text-slate-400 max-w-xs truncate">
                            {cat.description || <span className="text-slate-600 italic">No description</span>}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleStartEdit(cat)}
                                className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 p-1.5 rounded transition-all"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(cat._id)}
                                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
