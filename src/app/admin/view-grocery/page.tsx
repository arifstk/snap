// app/admin/view-grocery/page.tsx

'use client';
import axios from "axios";
import { ArrowLeft, PencilIcon, Search, X, Trash2, Camera, Check, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react';
import { IGrocery } from "@/models/grocery.model";

interface ICategory {
  _id: string;
  name: string;
  image?: string;
}

const UNITS = ["Kg", "g", "ml", "Ltr", "Pcs", "pack"] as const;

const ViewGrocery = () => {
  const [groceries, setGroceries] = useState<IGrocery[]>([]);
  const [filtered, setFiltered] = useState<IGrocery[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // fetch groceries
  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const res = await axios.get('/api/admin/get-groceries');
        setGroceries(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error('Failed to load groceries', error);
      }
    };
    fetchGroceries();
  }, []);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<ICategory[]>('/api/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };
    fetchCategories();
  }, []);

  // search filter
  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      groceries.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [query, groceries]);

  // reset modal state when editing changes
  useEffect(() => {
    if (editing) setImagePreview(editing.image);
    setConfirmDelete(false);
    setSaveSuccess(false);
  }, [editing]);

  const item = editing!;

  // ✅ Declared ONCE — right here
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setEditing({ ...item, image: base64 }); // ← sync new image into item too
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/admin/update-grocery/${item._id}`, item);
      setGroceries(prev => prev.map(g =>
        String(g._id) === String(item._id) ? item : g
      ));
      setSaveSuccess(true);
      setTimeout(() => { setEditing(null); setSaveSuccess(false); }, 1000);
    } catch (error) {
      console.error('Failed to save', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/delete-grocery/${item._id}`);
      setGroceries(prev => prev.filter(g =>
        String(g._id) !== String(item._id)
      ));
      setEditing(null);
    } catch (error) {
      console.error('Failed to delete', error);
    } finally {
      setDeleting(false);
    }
  };

  // Search
  const filteredGroceries = groceries
  .filter((item) => selectedCategory === 'All' || item.category === selectedCategory)
  .filter((item) => item.name.toLowerCase().includes(query.toLowerCase())); // 👈 search filter added

  
  return (
    <div className='pt-4 w-[90%] mx-auto pb-20 mt-20'>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4 pt-5">
        <Link href="/"
          className='flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:bg-green-50 hover:shadow-md transition-all'>
          <ArrowLeft className='w-5 h-5' />
          <span>Back</span>
        </Link>
        {/* ✅ Title + badge */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-700">🏪 Manage Groceries</h1>
        </div>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          {filtered.length === groceries.length
            ? `${groceries.length} ${groceries.length === 1 ? 'item' : 'items'} total`
            : `${filtered.length} of ${groceries.length} items`}
        </span>
        {/* <div className="hidden sm:block w-35" /> */}
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          placeholder="Search by name or category..."
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* Grocery List — ✅ uses paginated, not filtered */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-16 text-lg">No groceries found.</p>
        )}
        {paginated.map((g, i) => (
          <motion.div
            key={String(g._id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
          >
            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between w-full">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg truncate">{g.name}</h3>
                <p className="text-gray-500 text-sm capitalize">{g.category}</p>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-green-700 font-bold text-lg">
                  ৳ {g.price} <span className="text-gray-400 text-sm font-medium">/ {g.unit}</span>
                </p>
                <button
                  onClick={() => setEditing(g)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <PencilIcon size={15} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 font-semibold text-sm shadow-sm hover:bg-green-100 hover:border-green-300 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ArrowLeft size={15} /> Prev
          </button>
          <span className="bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2 rounded-md shadow-md">
            {currentPage} of {totalPages} {totalPages === 1 ? 'page' : 'pages'}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 font-semibold text-sm shadow-sm hover:bg-green-100 hover:border-green-300 hover:text-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Next <ArrowRight size={15} />
          </button>
        </motion.div>
      )}

      {/* Edit Drawer */}
      <AnimatePresence>
        {editing && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-green-600 to-emerald-500">
                <div>
                  <p className="text-green-100 text-xs font-medium uppercase tracking-widest mb-0.5">Admin Panel</p>
                  <h2 className="text-xl font-bold text-white">Edit Grocery</h2>
                </div>
                <button
                  onClick={() => setEditing(null)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                {/* Image Upload / Edit Image */}
                <div className="relative group">
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50">
                    {imagePreview
                      ? <img src={imagePreview} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                    }
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 cursor-pointer"
                    >
                      <div className="bg-white/90 rounded-full p-3">
                        <Camera size={22} className="text-green-700" />
                      </div>
                      <p className="text-white text-sm font-semibold">Change Photo</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <p className="text-xs text-gray-400 text-center mt-2">Hover over image to change</p>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => setEditing({ ...item, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Enter product name"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                  <select
                    value={item.category}
                    onChange={(e) => setEditing({ ...item, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={String(cat._id)} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price + Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (৳)</label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => setEditing({ ...item, price: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-gray-50 focus:bg-white transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {UNITS.map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setEditing({ ...item, unit: u })}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer
                            ${item.unit === u
                              ? 'bg-green-600 text-white border-green-600 shadow-sm'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
                            }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delete Zone */}
                <div className={`rounded-2xl border-2 p-4 transition-all ${confirmDelete ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                  <AnimatePresence mode="wait">
                    {confirmDelete ? (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle size={18} />
                          <p className="font-semibold text-sm">This cannot be undone. Sure?</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 hover:shadow-sm transition-all cursor-pointer disabled:opacity-60"
                          >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="delete-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold text-sm hover:text-red-700 transition-all cursor-pointer py-1"
                      >
                        <Trash2 size={16} />
                        Delete this grocery
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 rounded-xl py-3 font-bold hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || saveSuccess}
                  className={`flex-1 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70
                    ${saveSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-linear-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-200'
                    }`}
                >
                  {saveSuccess ? <><Check size={18} /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ViewGrocery;

