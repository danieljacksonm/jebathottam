/**
 * Models Index - Export all MongoDB models
 * Centralized export for clean imports across the application
 */

// User & Authentication
export { User } from "./User";
export type { IUser, IAddress } from "./User";

// Product & Inventory
export { Product } from "./Product";
export type { IProduct, IProductVariant, ICompatibility, IReview } from "./Product";
export { Category } from "./Category";
export type { ICategory } from "./Category";

// Orders & Payments
export { Order } from "./Order";
export type { IOrder, IOrderItem, IOrderAddress, IPayment, IOrderTimeline, IWalkInCustomer } from "./Order";
export { Cart } from "./Cart";
export type { ICart, ICartItem } from "./Cart";
export { Coupon } from "./Coupon";
export type { ICoupon } from "./Coupon";

// POS & Billing
export { Bill } from "./Bill";
export type { IBill, IBillItem, IBillPayment, IBillCustomer } from "./Bill";
export { Expense } from "./Expense";
export type { IExpense } from "./Expense";

// System & Audit
export { ActivityLog } from "./ActivityLog";
export type { IActivityLog, ActivityType } from "./ActivityLog";

// Database Connection
export { default as connectDB } from "../lib/mongoose";
