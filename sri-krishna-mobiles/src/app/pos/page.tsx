"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  User,
  Calculator,
  Printer,
  RotateCcw,
  ArrowRightLeft,
  Package,
  History,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Keyboard,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { shareBillOnWhatsApp } from "@/lib/whatsapp";

interface PosProduct {
  id: string;
  name: string;
  price: number;
  wholesalePrice?: number | null;
  stock: number;
  category: string;
  sku: string;
  barcode?: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

interface Payment {
  method: "cash" | "upi" | "card" | "credit";
  amount: number;
}

interface Bill {
  id: string;
  date: string;
  time: string;
  customer: { name: string; phone?: string };
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  payments: Payment[];
}

const generateBillId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 999).toString().padStart(3, "0");
  return `SKM-${dateStr}-${random}`;
};

function getUnitPrice(product: PosProduct, saleType: "retail" | "wholesale") {
  if (saleType === "wholesale" && product.wholesalePrice != null) {
    return product.wholesalePrice;
  }
  return product.price;
}

export default function POSPage() {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [saleType, setSaleType] = useState<"retail" | "wholesale">("retail");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/pos/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setCart((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return item;
        return { ...item, price: getUnitPrice(product, saleType) };
      })
    );
  }, [saleType, products]);

  // Categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      (activeCategory ? p.category === activeCategory : true) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode || "").includes(searchQuery))
  );

  // Cart calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity - item.discount,
    0
  );
  const gstAmount = Math.round(subtotal * 0.18);
  const total = subtotal + gstAmount;
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = total - paidAmount;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 - Help
      if (e.key === "F1") {
        e.preventDefault();
        setShowHelp(true);
      }
      // F2 - Focus search
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // F3 - New customer
      if (e.key === "F3") {
        e.preventDefault();
        setCustomer({ name: "", phone: "" });
      }
      // F4 - Add cash payment
      if (e.key === "F4") {
        e.preventDefault();
        addPayment("cash", balance > 0 ? balance : 0);
      }
      // F5 - Print/Save
      if (e.key === "F5") {
        e.preventDefault();
        if (cart.length > 0 && balance <= 0) {
          saveBill();
        }
      }
      // F6 - Clear cart
      if (e.key === "F6") {
        e.preventDefault();
        clearCart();
      }
      // Escape - Close modals
      if (e.key === "Escape") {
        setShowBillPreview(false);
        setShowHelp(false);
      }
      // Ctrl+K - Quick keys help
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowHelp(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [balance, cart.length]);

  const addToCart = (product: PosProduct) => {
    const price = getUnitPrice(product, saleType);
    const existing = cart.find((item) => item.id === product.id);
    const currentQty = existing?.quantity || 0;
    if (currentQty + 1 > product.stock) {
      alert(`Only ${product.stock} in stock for ${product.name}`);
      return;
    }
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, price }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { id: product.id, name: product.name, price, quantity: 1, discount: 0 },
      ]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart.map((item) => {
        const product = products.find((p) => p.id === id);
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (product && newQty > product.stock) {
          alert(`Only ${product.stock} in stock`);
          return item;
        }
        return { ...item, quantity: newQty };
      }).filter((item) => item.quantity > 0)
    );
  };

  const updateDiscount = (id: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, discount: Math.max(0, discount) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setPayments([]);
    setCustomer({ name: "", phone: "" });
  };

  const addPayment = (method: Payment["method"], amount: number) => {
    if (amount <= 0) return;
    setPayments([...payments, { method, amount }]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const saveBill = async () => {
    if (!customer.phone.trim()) {
      setSaveError("Customer phone is required (for bill record and WhatsApp).");
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      const hasCredit = payments.some((p) => p.method === "credit");
      const res = await fetch("/api/pos/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: saleType,
          customer,
          items: cart.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
            discount: item.discount,
            unitPrice: item.price,
          })),
          payments,
          isCreditSale: hasCredit,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save bill");

      const bill: Bill = {
        id: data.bill.id,
        date: data.bill.date,
        time: data.bill.time,
        customer: data.bill.customer,
        items: data.bill.items,
        subtotal: data.bill.subtotal,
        gstAmount: data.bill.gstAmount,
        total: data.bill.total,
        payments: data.bill.payments,
      };

      setCurrentBill(bill);
      setShowBillPreview(true);
      clearCart();
      await loadProducts();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save bill");
    } finally {
      setSaving(false);
    }
  };

  const printBill = () => {
    window.print();
  };

  const shareBill = () => {
    if (currentBill) {
      shareBillOnWhatsApp(currentBill);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">POS Billing</h1>
              <p className="text-sm text-[var(--foreground-muted)]">Sri Krishna Mobiles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg border border-[var(--border)] p-1">
              <button
                onClick={() => setSaleType("retail")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  saleType === "retail" ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)]"
                )}
              >
                Retail
              </button>
              <button
                onClick={() => setSaleType("wholesale")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  saleType === "wholesale" ? "bg-[var(--primary)] text-white" : "text-[var(--foreground)]"
                )}
              >
                Wholesale
              </button>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-secondary)] hover:bg-[var(--border)]"
              title="Keyboard Shortcuts (F1)"
            >
              <Keyboard className="h-5 w-5 text-[var(--foreground)]" />
            </button>
            <Link
              href="/pos/returns"
              className="flex h-10 items-center gap-2 rounded-lg bg-[var(--background-secondary)] px-3 hover:bg-[var(--border)]"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="hidden sm:inline">Returns</span>
            </Link>
            <Link
              href="/pos/summary"
              className="flex h-10 items-center gap-2 rounded-lg bg-[var(--background-secondary)] px-3 hover:bg-[var(--border)]"
            >
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">Summary</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <Input
                  ref={searchRef}
                  placeholder="Search products (F2)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
            </Card>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  !activeCategory
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--border)]"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    activeCategory === cat
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--background-secondary)] text-[var(--foreground)] hover:bg-[var(--border)]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {loadingProducts ? (
                <p className="col-span-full text-center text-[var(--foreground-muted)] py-8">
                  Loading products...
                </p>
              ) : filteredProducts.length === 0 ? (
                <p className="col-span-full text-center text-[var(--foreground-muted)] py-8">
                  No products in stock. Add products in Admin Dashboard with stock quantity.
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-all hover:border-[var(--primary)] hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{product.name}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{product.category}</p>
                      </div>
                      <span className="rounded-full bg-[var(--primary)]/10 px-2 py-1 text-sm font-medium text-[var(--primary)]">
                        {formatCurrency(getUnitPrice(product, saleType))}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">Stock: {product.stock}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-4">
            {/* Customer Info */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-[var(--primary)]" />
                <h3 className="font-semibold text-[var(--foreground)]">Customer</h3>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Customer name (F3 to clear)"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
                <Input
                  placeholder="Phone number"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
            </Card>

            {/* Cart Items */}
            <Card className="border-[var(--border)] bg-[var(--card)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-[var(--foreground)]">
                  Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-[var(--error)] hover:underline"
                  >
                    Clear (F6)
                  </button>
                )}
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="py-8 text-center text-[var(--foreground-muted)]">
                    Cart is empty
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-[var(--background-secondary)]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded bg-[var(--background-secondary)]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <span className="text-sm text-[var(--foreground-muted)]">
                            x {formatCurrency(item.price)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-[var(--foreground-muted)]">Disc:</span>
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateDiscount(item.id, parseInt(e.target.value) || 0)}
                            className="h-6 w-20 text-xs"
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[var(--foreground)]">
                          {formatCurrency(item.price * item.quantity - item.discount)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="mt-1 text-[var(--error)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Payments */}
            {cart.length > 0 && (
              <Card className="border-[var(--border)] bg-[var(--card)] p-4">
                <h3 className="mb-3 font-semibold text-[var(--foreground)]">Payments (F4 for cash)</h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addPayment("cash", balance > 0 ? balance : 0)}
                    className="flex-1 gap-1 min-w-[80px]"
                  >
                    <Banknote className="h-4 w-4" />
                    Cash
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addPayment("upi", balance > 0 ? balance : 0)}
                    className="flex-1 gap-1 min-w-[80px]"
                  >
                    <Smartphone className="h-4 w-4" />
                    UPI
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addPayment("card", balance > 0 ? balance : 0)}
                    className="flex-1 gap-1 min-w-[80px]"
                  >
                    <CreditCard className="h-4 w-4" />
                    Card
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addPayment("credit", balance > 0 ? balance : 0)}
                    className="flex-1 gap-1 min-w-[80px]"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    Credit
                  </Button>
                </div>

                {payments.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {payments.map((payment, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded bg-[var(--background-secondary)] px-3 py-2 text-sm"
                      >
                        <span className="capitalize text-[var(--foreground)]">{payment.method}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--foreground)]">
                            {formatCurrency(payment.amount)}
                          </span>
                          <button onClick={() => removePayment(i)} className="text-[var(--error)]">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Totals */}
            {cart.length > 0 && (
              <Card className="border-[var(--border)] bg-[var(--card)] p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Subtotal</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">GST (18%)</span>
                    <span className="text-[var(--foreground)]">{formatCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-[var(--foreground)]">Total</span>
                    <span className="text-[var(--primary)]">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">Paid</span>
                    <span className="text-[var(--success)]">{formatCurrency(paidAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border)] pt-2">
                    <span className={balance > 0 ? "text-[var(--warning)]" : "text-[var(--foreground)]"}>
                      {balance > 0 ? "Balance Due" : "Change"}
                    </span>
                    <span className={balance > 0 ? "text-[var(--warning)]" : "text-[var(--success)]"}>
                      {formatCurrency(Math.abs(balance))}
                    </span>
                  </div>
                </div>

                {saveError && (
                  <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">{saveError}</p>
                )}

                <Button
                  onClick={saveBill}
                  disabled={balance > 0 || saving || !customer.phone.trim()}
                  className="mt-4 w-full gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : balance > 0
                      ? `Add ₹${balance} more`
                      : !customer.phone.trim()
                        ? "Enter customer phone"
                        : "Complete Sale (F5)"}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Bill Preview Modal */}
      {showBillPreview && currentBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-[var(--foreground)]">SRI KRISHNA MOBILES</h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                {currentBill.date} {currentBill.time}
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">Bill: {currentBill.id}</p>
            </div>

            <div className="mb-4 space-y-1 border-b border-dashed border-[var(--border)] pb-4 text-sm">
              <p className="text-[var(--foreground)]">{currentBill.customer.name || "Walk-in Customer"}</p>
              {currentBill.customer.phone && (
                <p className="text-[var(--foreground-muted)]">{currentBill.customer.phone}</p>
              )}
            </div>

            <div className="mb-4 space-y-2 border-b border-dashed border-[var(--border)] pb-4">
              {currentBill.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="text-[var(--foreground)]">{item.name}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {item.quantity} x {formatCurrency(item.price - item.discount / item.quantity)}
                    </p>
                  </div>
                  <p className="text-[var(--foreground)]">
                    {formatCurrency(item.price * item.quantity - item.discount)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-4 space-y-1 border-b border-dashed border-[var(--border)] pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">Subtotal</span>
                <span className="text-[var(--foreground)]">{formatCurrency(currentBill.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--foreground-muted)]">GST (18%)</span>
                <span className="text-[var(--foreground)]">{formatCurrency(currentBill.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span className="text-[var(--foreground)]">Total</span>
                <span className="text-[var(--primary)]">{formatCurrency(currentBill.total)}</span>
              </div>
            </div>

            <div className="mb-4 space-y-1 text-sm">
              <p className="font-medium text-[var(--foreground)]">Payment:</p>
              {currentBill.payments.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span className="capitalize text-[var(--foreground-muted)]">{p.method}</span>
                  <span className="text-[var(--foreground)]">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>

            <p className="mb-4 text-center text-xs text-[var(--foreground-muted)]">
              Thank you for shopping with us!
            </p>

            <div className="flex gap-2">
              <Button onClick={printBill} variant="outline" className="flex-1 gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              {currentBill.customer.phone && (
                <Button onClick={shareBill} variant="outline" className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              )}
              <Button
                onClick={() => {
                  setShowBillPreview(false);
                  clearCart();
                }}
                className="flex-1"
              >
                New Bill
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--foreground)]">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded p-1 hover:bg-[var(--background-secondary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3">
              {[
                { key: "F1", desc: "Show this help" },
                { key: "F2", desc: "Focus search box" },
                { key: "F3", desc: "Clear customer info" },
                { key: "F4", desc: "Add cash payment" },
                { key: "F5", desc: "Complete sale / Save bill" },
                { key: "F6", desc: "Clear cart" },
                { key: "Ctrl + K", desc: "Quick keys help" },
                { key: "Esc", desc: "Close modals" },
              ].map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between rounded-lg bg-[var(--background-secondary)] px-4 py-2"
                >
                  <kbd className="rounded bg-[var(--card)] px-2 py-1 font-mono text-sm font-bold">
                    {shortcut.key}
                  </kbd>
                  <span className="text-[var(--foreground)]">{shortcut.desc}</span>
                </div>
              ))}
            </div>

            <Button onClick={() => setShowHelp(false)} className="mt-4 w-full">
              Got it!
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
