/**
 * Activity Log Model - Audit Trail
 * Tracks all significant actions for accountability and debugging
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export type ActivityType = 
  | "user_login" | "user_register" | "user_update" | "user_block"
  | "product_create" | "product_update" | "product_delete"
  | "order_create" | "order_update" | "order_cancel" | "order_refund"
  | "payment_success" | "payment_failed" | "payment_refund"
  | "bill_create" | "bill_update" | "bill_print"
  | "expense_create" | "expense_update"
  | "coupon_create" | "coupon_update" | "coupon_delete"
  | "inventory_adjust" | "settings_update";

export interface IActivityLog extends Document {
  type: ActivityType;
  description: string;
  
  // Who performed the action
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  
  // IP and device info
  ipAddress?: string;
  userAgent?: string;
  
  // Affected entity
  entityType: "user" | "product" | "order" | "bill" | "coupon" | "category" | "expense" | "system";
  entityId?: string;
  
  // Change tracking
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  
  // Result
  success: boolean;
  errorMessage?: string;
  
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "user_login", "user_register", "user_update", "user_block",
        "product_create", "product_update", "product_delete",
        "order_create", "order_update", "order_cancel", "order_refund",
        "payment_success", "payment_failed", "payment_refund",
        "bill_create", "bill_update", "bill_print",
        "expense_create", "expense_update",
        "coupon_create", "coupon_update", "coupon_delete",
        "inventory_adjust", "settings_update",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userEmail: String,
    userName: String,
    userRole: String,
    
    ipAddress: String,
    userAgent: String,
    
    entityType: {
      type: String,
      enum: ["user", "product", "order", "bill", "coupon", "category", "expense", "system"],
      required: true,
    },
    entityId: String,
    
    previousData: Schema.Types.Mixed,
    newData: Schema.Types.Mixed,
    
    success: {
      type: Boolean,
      default: true,
    },
    errorMessage: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt
  }
);

// Static method to log activity
ActivityLogSchema.statics.log = async function (
  data: Partial<IActivityLog>
): Promise<IActivityLog> {
  return this.create(data);
};

// Static: Get recent activities
ActivityLogSchema.statics.getRecent = async function (
  limit: number = 50,
  entityType?: string,
  entityId?: string
) {
  const query: any = {};
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("userId", "name email")
    .lean();
};

// Static: Get activity summary for dashboard
ActivityLogSchema.statics.getDailySummary = async function (date: Date) {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        success: true,
      },
    },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// TTL index - auto-delete logs after 90 days
ActivityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);

// Other indexes
ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
