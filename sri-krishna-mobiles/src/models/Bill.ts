/**
 * Bill/POS Invoice Model - For Walk-in/Offline Sales
 * Supports retail POS billing with GST, split payments, and credit
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBillItem {
  productId: string; // Prisma product id
  name: string;
  sku: string;
  barcode?: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  discountPercent: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface IBillPayment {
  method: "cash" | "card" | "upi" | "wallet" | "credit";
  amount: number;
  transactionId?: string;
  notes?: string;
}

export interface IBillCustomer {
  name: string;
  phone: string;
  email?: string;
  isCreditCustomer: boolean;
  customerId?: mongoose.Types.ObjectId; // Link to User if registered
}

export interface IBill extends Document {
  // Bill Identification
  billNumber: string;
  type: "retail" | "wholesale" | "return" | "exchange";
  
  // Customer Info
  customer: IBillCustomer;
  
  // Items
  items: IBillItem[];
  
  // Financial Summary
  subtotal: number;
  totalDiscount: number;
  totalTaxAmount: number; // Total GST
  cgstTotal: number;
  sgstTotal: number;
  roundOff: number;
  total: number; // Final payable amount
  
  // Payments (supports split payment)
  payments: IBillPayment[];
  
  // Credit Sale
  isCreditSale: boolean;
  creditDueDate?: Date;
  creditPaidAmount: number;
  creditRemainingAmount: number;
  
  // Linked to online order (if converted)
  linkedOrderId?: mongoose.Types.ObjectId;
  originalBillId?: mongoose.Types.ObjectId; // For returns/exchanges
  
  // GST Info
  gstin?: string; // Customer GSTIN for B2B
  shopGstin: string;
  hsnSummary: Map<string, { taxableValue: number; cgst: number; sgst: number }>;
  
  // Notes
  notes?: string;
  terms?: string;
  
  // Metadata
  printed: boolean;
  printedAt?: Date;
  printCount: number;
  
  // Cashier Info
  cashierId: mongoose.Types.ObjectId;
  cashierName: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const BillItemSchema = new Schema<IBillItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  barcode: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  taxRate: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  total: { type: Number, required: true },
});

const BillPaymentSchema = new Schema<IBillPayment>({
  method: {
    type: String,
    enum: ["cash", "card", "upi", "wallet", "credit"],
    required: true,
  },
  amount: { type: Number, required: true },
  transactionId: String,
  notes: String,
});

const BillCustomerSchema = new Schema<IBillCustomer>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  isCreditCustomer: { type: Boolean, default: false },
  customerId: { type: Schema.Types.ObjectId, ref: "User" },
});

const BillSchema = new Schema<IBill>(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["retail", "wholesale", "return", "exchange"],
      default: "retail",
    },
    
    customer: BillCustomerSchema,
    items: [BillItemSchema],
    
    subtotal: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    totalTaxAmount: { type: Number, required: true },
    cgstTotal: { type: Number, required: true },
    sgstTotal: { type: Number, required: true },
    roundOff: { type: Number, default: 0 },
    total: { type: Number, required: true },
    
    payments: [BillPaymentSchema],
    
    isCreditSale: { type: Boolean, default: false },
    creditDueDate: Date,
    creditPaidAmount: { type: Number, default: 0 },
    creditRemainingAmount: { type: Number, default: 0 },
    
    linkedOrderId: { type: Schema.Types.ObjectId, ref: "Order" },
    originalBillId: { type: Schema.Types.ObjectId, ref: "Bill" },
    
    gstin: String,
    shopGstin: { type: String, required: true },
    hsnSummary: {
      type: Map,
      of: {
        taxableValue: Number,
        cgst: Number,
        sgst: Number,
      },
    },
    
    notes: String,
    terms: String,
    
    printed: { type: Boolean, default: false },
    printedAt: Date,
    printCount: { type: Number, default: 0 },
    
    cashierId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cashierName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Auto-generate bill number
BillSchema.pre<IBill>("save", async function () {
  if (!this.billNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Count bills today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await (mongoose.models.Bill as Model<IBill>).countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    
    const sequential = (count + 1).toString().padStart(4, "0");
    this.billNumber = `BILL${year}${month}${day}${sequential}`;
  }
  
  // Update credit remaining
  if (this.isCreditSale) {
    this.creditRemainingAmount = this.total - this.creditPaidAmount;
  }
});

// Indexes
BillSchema.index({ billNumber: 1 });
BillSchema.index({ "customer.phone": 1 });
BillSchema.index({ isCreditSale: 1, creditRemainingAmount: 1 });
BillSchema.index({ cashierId: 1, createdAt: -1 });
BillSchema.index({ createdAt: -1 });

// Static: Get daily summary
BillSchema.statics.getDailySummary = async function (date: Date) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        type: { $in: ["retail", "wholesale"] },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        totalBills: { $sum: 1 },
        cashSales: {
          $sum: {
            $cond: [
              { $eq: ["$isCreditSale", false] },
              "$total",
              0,
            ],
          },
        },
        creditSales: {
          $sum: {
            $cond: [
              { $eq: ["$isCreditSale", true] },
              "$total",
              0,
            ],
          },
        },
        creditCollected: { $sum: "$creditPaidAmount" },
      },
    },
  ]);
  
  return result[0] || {
    totalSales: 0,
    totalBills: 0,
    cashSales: 0,
    creditSales: 0,
    creditCollected: 0,
  };
};

export const Bill: Model<IBill> =
  mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);

export default Bill;
