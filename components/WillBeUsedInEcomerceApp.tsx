"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X } from "lucide-react";
import { apiService } from "@/lib/apiService";

interface CategoryType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Features {
  _id: string;
  name: string;
}

interface ProductType {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: CategoryType;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  isActive: boolean;
  features: Features[];
}

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Loader Component
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"categories" | "products">(
    "categories"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await apiService.get("/products/categories/");
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiService.get("/products");
      if (res.success) {
        setProducts(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    Promise.all([fetchCategories(), fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const stats = [
    {
      label: "Total Categories",
      value: categories.length,
      color: "bg-blue-500",
    },
    { label: "Total Products", value: products.length, color: "bg-green-500" },
    {
      label: "Active Products",
      value: products.filter((p) => p.isActive).length,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your products and categories</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-1 inline-flex">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "products"
                ? "bg-blue-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Products
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {activeTab === "categories" ? (
            <CategoriesTab
              categories={categories}
              setCategories={setCategories}
              refreshCategories={fetchCategories}
            />
          ) : (
            <ProductsTab
              products={products}
              setProducts={setProducts}
              categories={categories}
              refreshProducts={fetchProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* Categories Tab */
const CategoriesTab = ({
  categories,
  setCategories,
  refreshCategories,
}: any) => {
  const [modalState, setModalState] = useState<{
    type: null | "add" | "edit" | "view" | "delete";
    data?: any;
  }>({ type: null });
  const [formData, setFormData] = useState({ name: "" });
  const [saving, setSaving] = useState(false);

  const openModal = (type: any, data?: any) => {
    setModalState({ type, data });
    if (data) {
      setFormData({ name: data.name });
    } else {
      setFormData({ name: "" });
    }
  };

  const closeModal = () => {
    setModalState({ type: null });
    setFormData({ name: "" });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (modalState.type === "add") {
        // Add API call here
        const res = await fetch("/api/products/categories/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name }),
        });
        const data = await res.json();
        if (data.success) {
          await refreshCategories();
        }
      } else if (modalState.type === "edit") {
        // Edit API call here
        const res = await fetch(
          `/api/products/categories/${modalState.data._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name }),
          }
        );
        const data = await res.json();
        if (data.success) {
          await refreshCategories();
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      // Delete API call here
      const res = await fetch(
        `/api/products/categories/${modalState.data._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        await refreshCategories();
      }
      closeModal();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No categories found</p>
          <p className="text-sm">
            Click "Add Category" to create your first category
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: CategoryType) => (
            <div
              key={cat._id}
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {cat.name}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Created: {new Date(cat.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(cat.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("view", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => openModal("edit", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => openModal("delete", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={closeModal}
        title={modalState.type === "add" ? "Add New Category" : "Edit Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
              disabled={saving}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !formData.name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : modalState.type === "add"
                ? "Create"
                : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modalState.type === "view"}
        onClose={closeModal}
        title="Category Details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {modalState.data?.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Created At
            </label>
            <p className="text-gray-900">
              {new Date(modalState.data?.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Updated At
            </label>
            <p className="text-gray-900">
              {new Date(modalState.data?.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{modalState.data?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

/* Products Tab */
const ProductsTab = ({
  products,
  setProducts,
  categories,
  refreshProducts,
}: any) => {
  const [modalState, setModalState] = useState<{
    type: null | "add" | "edit" | "view" | "delete";
    data?: any;
  }>({ type: null });
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const openModal = (type: any, data?: any) => {
    setModalState({ type, data });
    if (data) {
      setFormData({
        name: data.name,
        price: data.price.toString(),
        description: data.description || "",
        category: data.category._id,
        isActive: data.isActive,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        isActive: true,
      });
    }
  };

  const closeModal = () => {
    setModalState({ type: null });
    setFormData({
      name: "",
      price: "",
      description: "",
      category: "",
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        isActive: formData.isActive,
      };

      if (modalState.type === "add") {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          await refreshProducts();
        }
      } else if (modalState.type === "edit") {
        const res = await fetch(`/api/products/${modalState.data._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          await refreshProducts();
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${modalState.data._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await refreshProducts();
      }
      closeModal();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm">
            Click "Add Product" to create your first product
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: ProductType) => (
            <div
              key={product._id}
              className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-green-300 transition-all"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {product.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {product.category?.name || "Uncategorized"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal("view", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => openModal("edit", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => openModal("delete", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={closeModal}
        title={modalState.type === "add" ? "Add New Product" : "Edit Product"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter product name"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₦)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter price"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="">Select a category</option>
              {categories.map((cat: CategoryType) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter product description"
              rows={3}
              disabled={saving}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-green-500 rounded focus:ring-2 focus:ring-green-500"
              disabled={saving}
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active Product
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                saving ||
                !formData.name.trim() ||
                !formData.price ||
                !formData.category
              }
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : modalState.type === "add"
                ? "Create"
                : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modalState.type === "view"}
        onClose={closeModal}
        title="Product Details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {modalState.data?.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price
            </label>
            <p className="text-2xl font-bold text-green-600">
              ₦{modalState.data?.price.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <p className="text-gray-900">
              {modalState.data?.category?.name || "Uncategorized"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <p className="text-gray-900">
              {modalState.data?.description || "No description"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                modalState.data?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {modalState.data?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Created At
              </label>
              <p className="text-gray-900 text-sm">
                {new Date(modalState.data?.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Updated At
              </label>
              <p className="text-gray-900 text-sm">
                {new Date(modalState.data?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{modalState.data?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
