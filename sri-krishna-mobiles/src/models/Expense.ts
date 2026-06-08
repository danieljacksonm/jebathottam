/**
 * Expense Model - Shop Expense Tracking
 * Track daily expenses like rent, salary, utilities, etc.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  expenseNumber: string;
  category: "rent" | "salary" | "utilities" | "inventory" | "marketing" | "transport" | "maintenance" | "misc";
  description: string;
  amount: number;
  paymentMethod: "cash" | "card" | "upi" | "bank_transfer" | "cheque";
  
  // Date and person
  expenseDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  recordedByName: string;
  
  // Vendor/Recipient
  vendorName?: string;
  vendorContact?: string;
  
  // Receipt/Proof
  receiptUrl?: string;
  hasReceipt: boolean;
  
  // Recurring
  isRecurring: boolean;
  recurrencePeriod?: "daily" | "weekly" | "monthly" | "yearly";
  nextDueDate?: Date;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    expenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ["rent", "salary", "utilities", "inventory", "marketing", "transport", "maintenance", "misc"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank_transfer", "cheque"],
      required: true,
    },
    
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recordedByName: {
      type: String,
      required: true,
    },
    
    vendorName: String,
    vendorContact: String,
    
    receiptUrl: String,
    hasReceipt: {
      type: Boolean,
      default: false,
    },
    
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePeriod: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    nextDueDate: Date,
    
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate expense number
ExpenseSchema.pre<IExpense>("save", async function () {
  if (!this.expenseNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    const count = await (mongoose.models.Expense as Model<IExpense>).countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lte: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      },
    });
    
    const sequential = (count + 1).toString().padStart(4, "0");
    this.expenseNumber = `EXP${year}${month}${sequential}`;
  }
});

// Static: Get expense summary by category for a date range
ExpenseSchema.statics.getSummaryByCategory = async function (
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        expenseDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);
};

// Static: Get daily expenses
ExpenseSchema.statics.getDailyExpenses = async function (date: Date) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  const result = await this.aggregate([
    {
      $match: {
        expenseDate: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
  
  return result[0] || { total: 0, count: 0 };
};

// Indexes
ExpenseSchema.index({ expenseNumber: 1 });
ExpenseSchema.index({ category: 1, expenseDate: -1 });
ExpenseSchema.index({ expenseDate: -1 });
ExpenseSchema.index({ isRecurring: 1, nextDueDate: 1 });

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
