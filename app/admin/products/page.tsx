"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, X, Package } from "lucide-react";
import { apiService } from "@/lib/apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BaseModal from "@/components/modals/BaseModal";
import Loader from "@/components/Loader";
import Header from "@/components/Header";

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
      title: "Total Categories",
      value: categories.length,
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Active Products",
      value: products.filter((p) => p.isActive).length,
      icon: <Package className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Products and categories"
          subtitle="Overview of products and categories."
          // onRefresh={fetchDashboardData}
          stats={stats}
        />

        {/* Tabs */}
        <div className="bg-accent rounded-xl shadow-sm border border-border mb-6 p-1 inline-flex">
          <Button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-muted text-secondary shadow-sm"
                : "text-accent bg-accent hover:text-primary"
            }`}
          >
            Categories
          </Button>
          <Button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "products"
                ? "bg-muted text-secondary shadow-sm"
                : "text-primary bg-accent hover:text-primary"
            }`}
          >
            Products
          </Button>
        </div>

        {/* Tab Content */}
        <div className="rounded-xl shadow-sm border border-border p-6">
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
        <h2 className="text-2xl font-bold text-primary">Categories</h2>
        <Button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-muted transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted">
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
              className="group bg-muted border border-border rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <h3 className="font-bold text-lg text-primary mb-2">
                  {cat.name}
                </h3>
                <div className="space-y-1 text-sm text-secondary">
                  <p>Created: {new Date(cat.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(cat.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => openModal("view", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  onClick={() => openModal("edit", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => openModal("delete", cat)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <BaseModal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={closeModal}
        title={modalState.type === "add" ? "Add New Category" : "Edit Category"}
      >
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              value={formData.name}
              label="Category Name"
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter category name"
              disabled={saving}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formData.name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : modalState.type === "add"
                ? "Create"
                : "Update"}
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* View Modal */}
      <BaseModal
        isOpen={modalState.type === "view"}
        onClose={closeModal}
        title="Category Details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Name
            </label>
            <p className="text-lg font-semibold text-primary">
              {modalState.data?.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Created At
            </label>
            <p className="text-primary">
              {new Date(modalState.data?.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Updated At
            </label>
            <p className="text-primary">
              {new Date(modalState.data?.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </BaseModal>

      {/* Delete Modal */}
      <BaseModal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-primary">
            Are you sure you want to delete{" "}
            <strong>{modalState.data?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </BaseModal>
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
        <h2 className="text-2xl font-bold text-primary">Products</h2>
        <button
          onClick={() => openModal("add")}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-secondary">
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
              className="group bg-muted border border-border rounded-xl p-5 hover:shadow-lg hover:border-green-300 transition-all"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary">
                    {product.name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-primary"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-secondary mb-2">
                  {product.category?.name || "Uncategorized"}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ₦{product.price.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => openModal("view", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  onClick={() => openModal("edit", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => openModal("delete", product)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <BaseModal
        isOpen={modalState.type === "add" || modalState.type === "edit"}
        onClose={closeModal}
        title={modalState.type === "add" ? "Add New Product" : "Edit Product"}
      >
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              label="Product Name"
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
            <Input
              label=" Price (₦)"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Enter price"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={saving}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              value={formData.description}
              field="textarea"
              label="Description"
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
              className="text-sm font-medium text-primary"
            >
              Active Product
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
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
            </Button>
          </div>
        </div>
      </BaseModal>

      {/* View Modal */}
      <BaseModal
        isOpen={modalState.type === "view"}
        onClose={closeModal}
        title="Product Details"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Name
            </label>
            <p className="text-lg font-semibold text-primary">
              {modalState.data?.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Price
            </label>
            <p className="text-2xl font-bold text-green-600">
              ₦{modalState.data?.price.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Category
            </label>
            <p className="text-primary">
              {modalState.data?.category?.name || "Uncategorized"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Description
            </label>
            <p className="text-primary">
              {modalState.data?.description || "No description"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Status
            </label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                modalState.data?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-primary"
              }`}
            >
              {modalState.data?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Created At
              </label>
              <p className="text-primary text-sm">
                {new Date(modalState.data?.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Updated At
              </label>
              <p className="text-primary text-sm">
                {new Date(modalState.data?.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Delete Modal */}
      <BaseModal
        isOpen={modalState.type === "delete"}
        onClose={closeModal}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-primary">
            Are you sure you want to delete{" "}
            <strong>{modalState.data?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={closeModal}
              disabled={saving}
              className="flex-1 px-4 py-3 border border-gray-300 text-primary rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
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
      </BaseModal>
    </div>
  );
};
