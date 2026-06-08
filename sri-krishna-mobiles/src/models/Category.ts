/**
 * Category Model - Product Categories with Brand Support
 * Supports hierarchical categories and brand associations
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    description: String,
    image: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ parent: 1 });

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
