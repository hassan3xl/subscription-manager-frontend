"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/apiService";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  description?: string;
  category: Category | string;
}

const SubscribePage = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: "paystack",
    startDate: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiService.get("/products/categories/");
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch Products for selected category
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        const res = await apiService.get(
          `/products?category=${selectedCategory}`
        );
        if (res.success) {
          setProducts(res.data || []);
        } else {
          console.error("API returned error:", res.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Please select a product.");

    const payload = {
      productId: selectedProduct._id,
      frequency: selectedProduct.frequency || "monthly",
      startDate: formData.startDate,
      isRecurring: false,
    };

    setLoading(true);
    try {
      const response = await apiService.post(
        "/subscriptions/initialize-payment",
        payload
      );

      if (response.success && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error(response.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Error initializing payment:", error);
      alert(error.message || "Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Choose a Category and Product
      </h2>

      {/* Category Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Category
        </label>
        <select
          className="w-full border border-border bg-muted rounded-lg p-3"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProduct(null); // reset
          }}
        >
          <option value="">-- Select a category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Cards */}
      {selectedCategory && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className={`p-5 border border-border rounded-xl cursor-pointer transition hover:shadow-md ${
                  selectedProduct?._id === product._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-border bg-card"
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.description}
                  </p>
                )}
                <div className="text-sm text-muted-foreground mt-3">
                  {product.currency || "NGN"} {product.price.toLocaleString()} /{" "}
                  {product.frequency || "monthly"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              No products found for this category.
            </p>
          )}
        </div>
      )}

      {/* Subscription Form */}
      {selectedProduct && (
        <form
          onSubmit={handleSubmit}
          className="bg-secondary border border-border rounded-2xl shadow-sm p-6 space-y-4"
        >
          <h3 className="text-xl font-medium">
            Subscribe to {selectedProduct.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              field="input"
              value={selectedProduct.name}
              onChange={(e) => e}
              readOnly
            />
            <Input
              label="Price"
              field="input"
              value={`${
                selectedProduct.currency || "NGN"
              } ${selectedProduct.price.toLocaleString()}`}
              readOnly
              onChange={(e) => e}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Frequency"
              value={selectedProduct.frequency || "monthly"}
              readOnly
              onChange={(e) => e}
            />
            <Input
              label="Category"
              value={
                typeof selectedProduct.category === "object"
                  ? selectedProduct.category.name
                  : selectedCategory
              }
              readOnly
              onChange={(e) => e}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Payment Method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              field="select"
              options={[
                { value: "paystack", label: "Paystack" },
                { value: "card", label: "Card" },
                { value: "bank", label: "Bank Transfer" },
              ]}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Redirecting to Payment..." : "Proceed to Payment"}
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will be redirected to Paystack to
              complete your payment securely. After payment, you’ll be returned
              to this app.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubscribePage;
