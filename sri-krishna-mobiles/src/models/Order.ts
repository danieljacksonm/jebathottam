/**
 * Order Model - Online & POS Orders
 * Supports both online e-commerce and offline walk-in sales
 */

import mongoose, { Schema, Document, Model } from "mongoose";

// Order Line Item
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  variantId?: string; // If product has variants
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  unitPrice: number; // Price at time of order
  discountAmount: number;
  taxAmount: number; // GST amount
  taxRate: number; // GST %
  total: number; // After discount, before tax
  finalTotal: number; // Total with tax
}

// Address for delivery
export interface IOrderAddress {
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

// Payment Record
export interface IPayment {
  method: "razorpay" | "paypal" | "cash" | "card" | "upi" | "wallet" | "credit";
  provider?: string;
  transactionId?: string;
  orderId?: string; // Razorpay/PayPal order ID
  paymentId?: string; // Razorpay payment ID
  amount: number;
  status: "pending" | "captured" | "completed" | "failed" | "refunded" | "partially_refunded";
  capturedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  amountPaid?: number;
  failureReason?: string;
}

// Order Timeline/Status History
export interface IOrderTimeline {
  status: string;
  description: string;
  timestamp: Date;
  by?: string; // User who made the change
}

// Offline/Walk-in Customer (for POS)
export interface IWalkInCustomer {
  name: string;
  phone: string;
  email?: string;
  isCreditCustomer: boolean;
  creditLimit?: number;
  outstandingBalance?: number;
}

export interface IOrder extends Document {
  // Order Identification
  orderNumber: string;
  type: "online" | "pos"; // Online e-commerce or POS walk-in
  
  // Customer Info
  user?: mongoose.Types.ObjectId; // For online orders (registered user)
  guestEmail?: string; // For guest checkout
  guestPhone?: string;
  walkInCustomer?: IWalkInCustomer; // For POS orders
  
  // Delivery Address (online orders)
  shippingAddress?: IOrderAddress;
  billingAddress?: IOrderAddress;
  
  // Items
  items: IOrderItem[];
  
  // Financial Summary
  subtotal: number; // Before discount
  discountAmount: number;
  discountCode?: string;
  taxAmount: number; // Total GST
  shippingAmount: number;
  total: number; // Final amount
  
  // Payment
  payment: IPayment;
  isPaid: boolean;
  paidAt?: Date;
  
  // Order Status
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "refunded";
  timeline: IOrderTimeline[];
  
  // Shipping
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  
  // Credit Sale (POS)
  isCreditSale: boolean;
  creditDueDate?: Date;
  creditPaidAmount: number;
  creditRemainingAmount: number;
  
  // Notes
  customerNote?: string;
  adminNote?: string;
  
  // Invoice
  invoiceNumber?: string;
  invoiceUrl?: string;
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  
  createdAt: Date;
  updatedAt: Date;
  statusHistory: any[];
  refundDetails?: any;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: String,
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 18 },
  total: { type: Number, required: true },
  finalTotal: { type: Number, required: true },
});

const OrderAddressSchema = new Schema<IOrderAddress>({
  label: String,
  name: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const PaymentSchema = new Schema<IPayment>({
  method: {
    type: String,
    enum: ["razorpay", "paypal", "cash", "card", "upi", "wallet", "credit"],
    required: true,
  },
  provider: String,
  transactionId: String,
  orderId: String,
  paymentId: String,
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "captured", "completed", "failed", "refunded", "partially_refunded"],
    default: "pending",
  },
  capturedAt: Date,
  refundedAt: Date,
  refundAmount: Number,
  refundReason: String,
  metadata: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  paidAt: Date,
  amountPaid: Number,
  failureReason: String,
});

const OrderTimelineSchema = new Schema<IOrderTimeline>({
  status: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  by: String,
});

const WalkInCustomerSchema = new Schema<IWalkInCustomer>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  isCreditCustomer: { type: Boolean, default: false },
  creditLimit: Number,
  outstandingBalance: { type: Number, default: 0 },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["online", "pos"],
      required: true,
      default: "online",
    },
    
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestEmail: String,
    guestPhone: String,
    walkInCustomer: WalkInCustomerSchema,
    
    shippingAddress: OrderAddressSchema,
    billingAddress: OrderAddressSchema,
    
    items: [OrderItemSchema],
    
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    discountCode: String,
    taxAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    
    payment: PaymentSchema,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned", "refunded"],
      default: "pending",
      index: true,
    },
    timeline: [OrderTimelineSchema],
    
    trackingNumber: String,
    carrier: String,
    shippedAt: Date,
    deliveredAt: Date,
    
    isCreditSale: { type: Boolean, default: false },
    creditDueDate: Date,
    creditPaidAmount: { type: Number, default: 0 },
    creditRemainingAmount: { type: Number, default: 0 },
    
    customerNote: String,
    adminNote: String,
    
    invoiceNumber: String,
    invoiceUrl: String,
    
    ipAddress: String,
    userAgent: String,
    referrer: String,
    statusHistory: [Schema.Types.Mixed],
    refundDetails: Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Auto-generate order number
OrderSchema.pre<IOrder>("save", async function () {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    
    // Get count of orders today for sequential number
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await (mongoose.models.Order as Model<IOrder>).countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    
    const sequential = (count + 1).toString().padStart(4, "0");
    this.orderNumber = `ORD${year}${month}${day}${sequential}`;
  }
  
  // Initialize timeline if empty
  if (this.timeline.length === 0) {
    this.timeline.push({
      status: this.status,
      description: `Order placed - ${this.status}`,
      timestamp: new Date(),
    });
  }
  
  // Update credit remaining
  if (this.isCreditSale) {
    this.creditRemainingAmount = this.total - this.creditPaidAmount;
  }
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ "payment.status": 1 });
OrderSchema.index(
  { isCreditSale: 1, creditRemainingAmount: 1 },
  { partialFilterExpression: { isCreditSale: true } }
);
OrderSchema.index({ createdAt: -1 });

// Static methods
OrderSchema.statics.generateOrderNumber = async function (): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  
  const count = await this.countDocuments({
    createdAt: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59, 999)),
    },
  });
  
  const sequential = (count + 1).toString().padStart(4, "0");
  return `ORD${year}${month}${day}${sequential}`;
};

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
