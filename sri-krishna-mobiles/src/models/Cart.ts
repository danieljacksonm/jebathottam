/**
 * Cart Model - Persistent Shopping Cart
 * Supports both logged-in users and guest carts
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  quantity: number;
  addedAt: Date;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId; // For logged-in users
  guestSessionId?: string; // For guest users
  items: ICartItem[];
  
  // Abandoned cart recovery
  lastActive: Date;
  reminderSent: boolean;
  reminderSentAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addItem(productId: string, variantId?: string, quantity?: number): void;
  removeItem(productId: string, variantId?: string): void;
  updateQuantity(productId: string, quantity: number, variantId?: string): void;
  clear(): void;
  getItemCount(): number;
  getCartTotal(): Promise<number>;
}

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true, // Allow null/undefined for guest carts
    },
    guestSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    items: [CartItemSchema],
    
    lastActive: {
      type: Date,
      default: Date.now,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    reminderSentAt: Date,
  },
  {
    timestamps: true,
  }
);

// Instance methods
CartSchema.methods.addItem = function (
  productId: string,
  variantId?: string,
  quantity: number = 1
): void {
  const existingItem = this.items.find(
    (item: ICartItem) =>
      item.product.toString() === productId && item.variantId === variantId
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: new mongoose.Types.ObjectId(productId),
      variantId,
      quantity,
      addedAt: new Date(),
    });
  }
  
  this.lastActive = new Date();
};

CartSchema.methods.removeItem = function (
  productId: string,
  variantId?: string
): void {
  this.items = this.items.filter(
    (item: ICartItem) =>
      !(item.product.toString() === productId && item.variantId === variantId)
  );
  this.lastActive = new Date();
};

CartSchema.methods.updateQuantity = function (
  productId: string,
  quantity: number,
  variantId?: string
): void {
  const item = this.items.find(
    (item: ICartItem) =>
      item.product.toString() === productId && item.variantId === variantId
  );
  
  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId, variantId);
    } else {
      item.quantity = quantity;
    }
  }
  
  this.lastActive = new Date();
};

CartSchema.methods.clear = function (): void {
  this.items = [];
  this.lastActive = new Date();
};

CartSchema.methods.getItemCount = function (): number {
  return this.items.reduce((sum: number, item: ICartItem) => sum + item.quantity, 0);
};

CartSchema.methods.getCartTotal = async function (): Promise<number> {
  await this.populate("items.product");
  
  return this.items.reduce((total: number, item: ICartItem) => {
    const product = item.product as any;
    let price = product.price;
    
    // If variant, use variant price
    if (item.variantId && product.hasVariants) {
      const variant = product.variants.find((v: any) => v.id === item.variantId);
      if (variant) {
        price = variant.price;
      }
    }
    
    return total + price * item.quantity;
  }, 0);
};

// Update lastActive on save
CartSchema.pre<ICart>("save", function () {
  this.lastActive = new Date();
});

// Indexes
CartSchema.index({ user: 1 });
CartSchema.index({ guestSessionId: 1 });
CartSchema.index({ lastActive: 1 }); // For cleaning up old guest carts
CartSchema.index({ reminderSent: 1, lastActive: 1 }); // For abandoned cart emails

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
