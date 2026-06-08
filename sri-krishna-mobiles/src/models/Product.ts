/**
 * Product Model - Mobile Spare Parts & Accessories
 * Supports variants, compatibility, stock tracking, and SEO
 */

import mongoose, { Schema, Document, Model } from "mongoose";

// Product Variant (color, storage, etc.)
export interface IProductVariant {
  id: string;
  name: string; // e.g., "Black", "128GB"
  sku: string;
  price: number;
  compareAtPrice?: number; // Original price for display
  stock: number;
  lowStockThreshold: number;
  images: string[];
  isActive: boolean;
}

// Compatibility with phone models
export interface ICompatibility {
  brand: string; // Samsung, Apple, Xiaomi, etc.
  model: string; // Galaxy S21, iPhone 13, etc.
  modelNumber?: string; // SM-G991B, A2633, etc.
  isCompatible: boolean;
}

// Product Review
export interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: mongoose.Types.ObjectId;
  brand?: string; // Brand of the part/accessory itself
  
  // Pricing
  price: number;
  compareAtPrice?: number;
  costPrice?: number; // For profit calculations
  
  // Stock Management
  stock: number;
  lowStockThreshold: number;
  trackStock: boolean;
  allowBackorders: boolean;
  sku: string;
  barcode?: string;
  
  // Variants
  hasVariants: boolean;
  variants: IProductVariant[];
  
  // Compatibility for mobile parts
  compatibility: ICompatibility[];
  
  // Media
  images: string[];
  featuredImage?: string;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  
  // Status
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  
  // Reviews & Ratings
  reviews: IReview[];
  averageRating: number;
  reviewCount: number;
  
  // Analytics
  viewCount: number;
  salesCount: number;
  
  // GST/Tax
  gstRate: number; // 18%, 12%, 5%, etc.
  hsnCode?: string; // Harmonized System of Nomenclature
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  isLowStock(): boolean;
  isInStock(): boolean;
  getEffectiveStock(): number;
}

const ProductVariantSchema = new Schema<IProductVariant>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: Number,
  stock: { type: Number, required: true, default: 0 },
  lowStockThreshold: { type: Number, default: 5 },
  images: [String],
  isActive: { type: Boolean, default: true },
});

const CompatibilitySchema = new Schema<ICompatibility>({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  modelNumber: String,
  isCompatible: { type: Boolean, default: true },
});

const ReviewSchema = new Schema<IReview>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    brand: String,
    
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: Number,
    costPrice: Number,
    
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    trackStock: {
      type: Boolean,
      default: true,
    },
    allowBackorders: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: String,
    
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [ProductVariantSchema],
    
    compatibility: [CompatibilitySchema],
    
    images: [String],
    featuredImage: String,
    
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    
    reviews: [ReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    
    viewCount: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    
    gstRate: {
      type: Number,
      default: 18, // 18% default GST
    },
    hsnCode: String,
  },
  {
    timestamps: true,
  }
);

// Instance methods
ProductSchema.methods.isLowStock = function (): boolean {
  if (!this.trackStock) return false;
  if (this.hasVariants) {
    return this.variants.some((v: IProductVariant) => 
      v.isActive && v.stock <= v.lowStockThreshold
    );
  }
  return this.stock <= this.lowStockThreshold;
};

ProductSchema.methods.isInStock = function (): boolean {
  if (!this.trackStock) return true;
  if (this.hasVariants) {
    return this.variants.some((v: IProductVariant) => 
      v.isActive && v.stock > 0
    );
  }
  return this.stock > 0 || this.allowBackorders;
};

ProductSchema.methods.getEffectiveStock = function (): number {
  if (!this.trackStock) return 999999; // Unlimited
  if (this.hasVariants) {
    return this.variants
      .filter((v: IProductVariant) => v.isActive)
      .reduce((sum: number, v: IProductVariant) => sum + v.stock, 0);
  }
  return this.stock;
};

// Update average rating when reviews change
ProductSchema.pre<IProduct>("save", function () {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
});

// Indexes for performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isNewArrival: 1, isActive: 1 });
ProductSchema.index({ isOnSale: 1, isActive: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ "compatibility.brand": 1, "compatibility.model": 1 });
ProductSchema.index({ name: "text", description: "text", keywords: "text" }); // Full-text search
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
