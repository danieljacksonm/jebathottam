// Test Utilities for Sri Krishna Mobiles
// These helpers can be used for manual testing and debugging

/**
 * Generate a test order for debugging
 */
export function generateTestOrder() {
  return {
    id: `ORD-TEST-${Date.now()}`,
    customer: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "9876543210",
    },
    items: [
      { id: "1", name: "iPhone 14 Pro Display", price: 12499, quantity: 1 },
      { id: "2", name: "USB-C Cable", price: 299, quantity: 2 },
    ],
    subtotal: 13097,
    gstAmount: 2357,
    total: 15454,
    status: "pending",
    paymentMethod: "razorpay",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Simulate adding items to localStorage cart
 */
export function seedTestCart() {
  const testCart = [
    { id: "1", name: "iPhone 14 Pro Display", price: 12499, quantity: 1, image: "/test.jpg" },
    { id: "5", name: "USB-C Cable", price: 299, quantity: 3, image: "/test.jpg" },
  ];
  localStorage.setItem("cart", JSON.stringify(testCart));
  console.log("✅ Test cart seeded with", testCart.length, "items");
}

/**
 * Seed test POS bills
 */
export function seedTestBills() {
  const testBills = [
    {
      id: "SKM-250108-001",
      date: new Date().toISOString().split("T")[0],
      time: "14:30",
      customer: { name: "Rahul Sharma", phone: "9876543210" },
      items: [
        { id: "1", name: "iPhone 14 Pro Display", price: 12499, quantity: 1, discount: 0 },
      ],
      subtotal: 12499,
      gstAmount: 2250,
      total: 14749,
      payments: [{ method: "cash", amount: 14749 }],
    },
    {
      id: "SKM-250108-002",
      date: new Date().toISOString().split("T")[0],
      time: "15:45",
      customer: { name: "Priya Patel", phone: "9123456789" },
      items: [
        { id: "3", name: "Samsung S23 Screen", price: 8999, quantity: 1, discount: 500 },
        { id: "7", name: "20W Fast Charger", price: 599, quantity: 2, discount: 0 },
      ],
      subtotal: 9697,
      gstAmount: 1745,
      total: 11442,
      payments: [{ method: "upi", amount: 11442 }],
    },
  ];
  localStorage.setItem("pos_bills", JSON.stringify(testBills));
  console.log("✅ Test POS bills seeded:", testBills.length, "bills");
}

/**
 * Test notification service
 */
export async function testNotification(type: "email" | "sms") {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [type === "email" ? "email" : "phone"]: type === "email" ? "test@example.com" : "9876543210",
        template: type === "email" ? { email: "welcome" } : { sms: "otp" },
        data: { name: "Test User", otp: "123456" },
      }),
    });
    const result = await response.json();
    console.log(`✅ ${type.toUpperCase()} test result:`, result);
    return result;
  } catch (error) {
    console.error(`❌ ${type.toUpperCase()} test failed:`, error);
    throw error;
  }
}

/**
 * Clear all localStorage data
 */
export function clearAllData() {
  localStorage.removeItem("cart");
  localStorage.removeItem("pos_bills");
  localStorage.removeItem("user");
  localStorage.removeItem("recentSearches");
  console.log("✅ All localStorage data cleared");
}

/**
 * Get storage usage info
 */
export function getStorageInfo() {
  const data: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || "{}");
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  console.log("📦 localStorage contents:", data);
  return data;
}

/**
 * Simulate keyboard shortcut
 */
export function simulateKey(key: string, ctrlKey = false) {
  const event = new KeyboardEvent("keydown", {
    key,
    ctrlKey,
    bubbles: true,
  });
  document.dispatchEvent(event);
  console.log(`⌨️ Simulated key: ${ctrlKey ? "Ctrl+" : ""}${key}`);
}

/**
 * Print test invoice
 */
export function printTestInvoice() {
  const testBill = {
    id: "TEST-001",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    customer: { name: "Test Customer", phone: "9876543210" },
    items: [
      { name: "Test Product 1", quantity: 1, price: 1000 },
      { name: "Test Product 2", quantity: 2, price: 500 },
    ],
    subtotal: 2000,
    gstAmount: 360,
    total: 2360,
  };

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Test Invoice</title>
          <style>
            body { font-family: monospace; width: 80mm; margin: 0; padding: 10px; }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="center bold">SRI KRISHNA MOBILES</div>
          <div class="center">Test Invoice</div>
          <div class="center">${testBill.date} ${testBill.time}</div>
          <div>Bill: ${testBill.id}</div>
          <div class="line"></div>
          <div>${testBill.customer.name}</div>
          <div>${testBill.customer.phone}</div>
          <div class="line"></div>
          ${testBill.items
            .map(
              (item) => `
            <div class="item">
              <span>${item.name} x${item.quantity}</span>
              <span>Rs.${item.price * item.quantity}</span>
            </div>
          `
            )
            .join("")}
          <div class="line"></div>
          <div class="item">
            <span>Subtotal:</span>
            <span>Rs.${testBill.subtotal}</span>
          </div>
          <div class="item">
            <span>GST (18%):</span>
            <span>Rs.${testBill.gstAmount}</span>
          </div>
          <div class="item bold">
            <span>Total:</span>
            <span>Rs.${testBill.total}</span>
          </div>
          <div class="line"></div>
          <div class="center">Thank you!</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    console.log("🖨️ Test invoice printed");
  }
}

// Expose to window for console access
if (typeof window !== "undefined") {
  (window as any).testUtils = {
    seedTestCart,
    seedTestBills,
    testNotification,
    clearAllData,
    getStorageInfo,
    simulateKey,
    printTestInvoice,
    generateTestOrder,
  };
  console.log("🧪 Test utilities loaded. Access via window.testUtils");
}
