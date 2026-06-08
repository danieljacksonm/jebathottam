/**
 * User Model - Customer and Admin Accounts
 * Supports NextAuth.js integration with role-based access
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  id: string;
  label: string; // "Home", "Office", etc.
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string; // Hashed, optional for OAuth users
  image?: string;
  phone?: string;
  role: "customer" | "admin" | "superadmin" | "staff" | "cashier";
  isActive: boolean;
  isBlocked: boolean;
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password by default in queries
    },
    image: String,
    phone: String,
    role: {
      type: String,
      enum: ["customer", "admin", "superadmin", "staff", "cashier"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    addresses: [AddressSchema],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    emailVerified: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
