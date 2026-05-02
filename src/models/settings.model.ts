// src/models/settings.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  websiteName: string;
  logoUrl: string;
  bannerSlides: {
    id: number;
    title: string;
    subtitle: string;
    btnText: string;
    bg: string;
  }[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  maxCartItems: number;
  currencySymbol: string;
  taxRate: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    websiteName: { type: String, default: "FreshMart" },
    logoUrl: { type: String, default: "" },
    bannerSlides: {
      type: [
        {
          id: Number,
          title: String,
          subtitle: String,
          btnText: String,
          bg: String,
        },
      ],
      default: [
        {
          id: 1,
          title: "Fresh Organic Groceries",
          subtitle:
            "Farm-fresh fruits, vegetables, and more, delivered straight to your doorstep.",
          btnText: "Shop Now",
          bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop",
        },
        {
          id: 2,
          title: "Fast Delivery",
          subtitle: "Get your groceries delivered to your doorstep in no time.",
          btnText: "Shop Now",
          bg: "https://images.unsplash.com/photo-1548695607-9c73430ba065?q=80&w=1325&auto=format&fit=crop",
        },
        {
          id: 3,
          title: "Mobile Ordering",
          subtitle: "Order groceries from the comfort of your phone.",
          btnText: "Shop Now",
          bg: "https://images.unsplash.com/photo-1770013413878-2530e2c3d82b?q=80&w=1170&auto=format&fit=crop",
        },
      ],
    },
    deliveryFee: { type: Number, default: 40 },
    freeDeliveryThreshold: { type: Number, default: 100 },
    contactInfo: {
      email: { type: String, default: "hello@freshmart.com" },
      phone: { type: String, default: "+1 (800) 123-4567" },
      address: { type: String, default: "123 Green Street, Fresh City" },
    },
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com/freshmart" },
      instagram: { type: String, default: "https://instagram.com/freshmart" },
      twitter: { type: String, default: "https://twitter.com/freshmart" },
    },
    maintenanceMode: { type: Boolean, default: false },
    allowGuestCheckout: { type: Boolean, default: true },
    maxCartItems: { type: Number, default: 50 },
    currencySymbol: { type: String, default: "$" },
    taxRate: { type: Number, default: 8.5 },
  },
  { timestamps: true },
);

// Singleton pattern — only one settings document ever exists
const Settings: Model<ISettings> =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;

