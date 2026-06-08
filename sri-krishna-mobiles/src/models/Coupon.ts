/**
 * Coupon/Discount Code Model
 * Supports percentage, flat amount, and free shipping discounts
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  
  // Discount Type
  type: "percentage" | "flat" | "free_shipping";
  value: number; // Percentage (0-100) or flat amount
  
  // Limits
  minOrderAmount?: number;
  maxDiscountAmount?: number; // Cap for percentage discounts
  
  // Usage Limits
  usageLimit?: number; // Total times coupon can be used
  usageLimitPerUser?: number; // Times per customer
  usageCount: number;
  
  // Validity
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  
  // Applicability
  applicableProducts?: mongoose.Types.ObjectId[]; // Specific products only
  applicableCategories?: mongoose.Types.ObjectId[]; // Specific categories only
  excludedProducts?: mongoose.Types.ObjectId[];
  
  // Customer eligibility
  newCustomersOnly: boolean;
  specificUsers?: mongoose.Types.ObjectId[]; // VIP coupons
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  isValid(userId?: string, orderAmount?: number): { valid: boolean; message?: string };
  calculateDiscount(orderAmount: number): number;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: String,
    
    type: {
      type: String,
      enum: ["percentage", "flat", "free_shipping"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    
    minOrderAmount: Number,
    maxDiscountAmount: Number,
    
    usageLimit: Number,
    usageLimitPerUser: Number,
    usageCount: {
      type: Number,
      default: 0,
    },
    
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    excludedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    
    newCustomersOnly: {
      type: Boolean,
      default: false,
    },
    specificUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Instance methods
CouponSchema.methods.isValid = function (
  userId?: string,
  orderAmount?: number
): { valid: boolean; message?: string } {
  if (!this.isActive) {
    return { valid: false, message: "Coupon is inactive" };
  }
  
  const now = new Date();
  if (now < this.startDate) {
    return { valid: false, message: "Coupon not yet valid" };
  }
  
  if (this.endDate && now > this.endDate) {
    return { valid: false, message: "Coupon has expired" };
  }
  
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: "Coupon usage limit reached" };
  }
  
  if (this.minOrderAmount && orderAmount && orderAmount < this.minOrderAmount) {
    return { valid: false, message: `Minimum order amount ₹${this.minOrderAmount} required` };
  }
  
  if (this.specificUsers && this.specificUsers.length > 0 && userId) {
    const isAllowed = this.specificUsers.some(
      (id: mongoose.Types.ObjectId) => id.toString() === userId
    );
    if (!isAllowed) {
      return { valid: false, message: "Coupon not applicable for this user" };
    }
  }
  
  return { valid: true };
};

CouponSchema.methods.calculateDiscount = function (orderAmount: number): number {
  if (this.type === "free_shipping") {
    return 0; // Shipping handled separately
  }
  
  if (this.type === "flat") {
    return Math.min(this.value, orderAmount);
  }
  
  if (this.type === "percentage") {
    const discount = (orderAmount * this.value) / 100;
    if (this.maxDiscountAmount) {
      return Math.min(discount, this.maxDiscountAmount);
    }
    return discount;
  }
  
  return 0;
};

// Indexes
CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, endDate: 1 });

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
