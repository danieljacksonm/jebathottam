"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Package,
  AlertTriangle,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

// Mock products data
const mockProducts = [
  { id: "1", name: "iPhone 14 Pro Display OLED", sku: "SCR-IP14P-OLED", price: 12499, stock: 15, category: "Screens", brand: "Apple", status: "active", image: null },
  { id: "2", name: "iPhone 14 Battery Original", sku: "BAT-IP14-ORG", price: 3499, stock: 20, category: "Batteries", brand: "Apple", status: "active", image: null },
  { id: "3", name: "Samsung S23 Ultra Screen", sku: "SCR-S23U", price: 18999, stock: 8, category: "Screens", brand: "Samsung", status: "active", image: null },
  { id: "4", name: "OnePlus 11 Display", sku: "SCR-OP11", price: 8999, stock: 12, category: "Screens", brand: "OnePlus", status: "active", image: null },
  { id: "5", name: "Xiaomi Redmi Note 12 Screen", sku: "SCR-RN12", price: 3499, stock: 5, category: "Screens", brand: "Xiaomi", status: "low_stock", image: null },
  { id: "6", name: "iPhone 13 Charging Port", sku: "PRT-IP13-CHG", price: 1499, stock: 0, category: "Ports", brand: "Apple", status: "out_of_stock", image: null },
  { id: "7", name: "Samsung A54 Battery", sku: "BAT-A54", price: 2499, stock: 25, category: "Batteries", brand: "Samsung", status: "active", image: null },
  { id: "8", name: "Universal Type-C Cable", sku: "CBL-TC-UNI", price: 299, stock: 100, category: "Cables", brand: "Generic", status: "active", image: null },
];

const categories = ["All", "Screens", "Batteries", "Chargers", "Cables", "Cases", "Ports", "Accessories"];
const brands = ["All", "Apple", "Samsung", "OnePlus", "Xiaomi", "Vivo", "Oppo", "Generic"];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <span className="rounded-full bg-[var(--error)]/10 px-2 py-1 text-xs font-medium text-[var(--error)]">Out of Stock</span>;
    }
    if (status === "low_stock" || stock <= 5) {
      return <span className="rounded-full bg-[var(--warning)]/10 px-2 py-1 text-xs font-medium text-[var(--warning)]">Low Stock ({stock})</span>;
    }
    return <span className="rounded-full bg-[var(--success)]/10 px-2 py-1 text-xs font-medium text-[var(--success)]">Active</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Products</h1>
          {selectedProducts.length > 0 && (
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]">
              {selectedProducts.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn("gap-2", showFilters && "bg-[var(--primary)]/10 text-[var(--primary)]")}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-[var(--primary)]/5 p-3">
          <span className="text-sm text-[var(--foreground)]">
            {selectedProducts.length} products selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              Update Stock
            </Button>
            <Button variant="outline" size="sm">
              Change Status
            </Button>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-[var(--border)]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">SKU</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[var(--foreground)]">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]/50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelectProduct(product.id)}
                      className="rounded border-[var(--border)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-secondary)]">
                        {product.image ? (
                          <img src={product.image} alt="" className="h-full w-full rounded-lg object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-[var(--foreground-muted)]" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{product.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-sm text-[var(--foreground-secondary)]">{product.stock}</td>
                  <td className="px-4 py-3">{getStatusBadge(product.status, product.stock)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] hover:text-[var(--primary)]">
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="rounded p-1.5 text-[var(--foreground-muted)] hover:bg-[var(--error)]/10 hover:text-[var(--error)]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
          <p className="text-sm text-[var(--foreground-muted)]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-[var(--border)] p-2 hover:bg-[var(--background-secondary)] disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-[var(--foreground)]">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="rounded-lg border border-[var(--border)] p-2 hover:bg-[var(--background-secondary)] disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Import Products</h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="rounded p-1 hover:bg-[var(--background-secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-[var(--border)] p-8 text-center">
                <Upload className="mx-auto mb-2 h-8 w-8 text-[var(--foreground-muted)]" />
                <p className="mb-2 text-sm text-[var(--foreground)]">
                  Drag and drop CSV file here
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  or click to browse files
                </p>
              </div>
              <div className="rounded-lg bg-[var(--background-secondary)] p-3">
                <p className="mb-2 text-sm font-medium text-[var(--foreground)]">
                  CSV Format:
                </p>
                <code className="text-xs text-[var(--foreground-muted)]">
                  name,sku,price,stock,category,brand,description
                </code>
              </div>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
