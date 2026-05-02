// settingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IBannerSlide {
  id: number;
  title: string;
  subtitle: string;
  btnText: string;
  bg: string;
}

interface IContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

interface ISettingsSlice {
  websiteName: string;
  logoUrl: string;
  bannerSlides: IBannerSlide[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  supportPhone: string;
  supportEmail: string;
  contactInfo: IContactInfo;
  socialLinks: ISocialLinks;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  maxCartItems: number;
  currencySymbol: string;
  taxRate: number;
}

const initialState: ISettingsSlice = {
  websiteName: "FreshMart",
  logoUrl: "",
  bannerSlides: [
    {
      id: 1,
      title: "Fresh Organic Groceries",
      subtitle: "Farm-fresh fruits, vegetables, and more, delivered straight to your doorstep.",
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
  deliveryFee: 40,
  freeDeliveryThreshold: 100,
  supportPhone: "+1 (800) 123-4567",
  supportEmail: "support@freshmart.com",
  contactInfo: {
    email: "hello@freshmart.com",
    phone: "+1 (800) 123-4567",
    address: "123 Green Street, Fresh City, FC 10001",
  },
  socialLinks: {
    facebook: "https://facebook.com/freshmart",
    instagram: "https://instagram.com/freshmart",
    twitter: "https://twitter.com/freshmart",
  },
  maintenanceMode: false,
  allowGuestCheckout: true,
  maxCartItems: 50,
  currencySymbol: "$",
  taxRate: 8.5,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateWebsiteName: (state, action: PayloadAction<string>) => {
      state.websiteName = action.payload;
    },
    updateLogoUrl: (state, action: PayloadAction<string>) => {
      state.logoUrl = action.payload;
    },
    updateBannerSlide: (state, action: PayloadAction<IBannerSlide>) => {
      const index = state.bannerSlides.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.bannerSlides[index] = action.payload;
    },
    addBannerSlide: (state, action: PayloadAction<IBannerSlide>) => {
      state.bannerSlides.push(action.payload);
    },
    removeBannerSlide: (state, action: PayloadAction<number>) => {
      state.bannerSlides = state.bannerSlides.filter((s) => s.id !== action.payload);
    },
    updateDeliveryFee: (state, action: PayloadAction<number>) => {
      state.deliveryFee = action.payload;
    },
    updateFreeDeliveryThreshold: (state, action: PayloadAction<number>) => {
      state.freeDeliveryThreshold = action.payload;
    },
    updateSupportPhone: (state, action: PayloadAction<string>) => {
      state.supportPhone = action.payload;
    },
    updateSupportEmail: (state, action: PayloadAction<string>) => {
      state.supportEmail = action.payload;
    },
    updateContactInfo: (state, action: PayloadAction<IContactInfo>) => {
      state.contactInfo = action.payload;
    },
    updateSocialLinks: (state, action: PayloadAction<ISocialLinks>) => {
      state.socialLinks = action.payload;
    },
    toggleMaintenanceMode: (state) => {
      state.maintenanceMode = !state.maintenanceMode;
    },
    toggleGuestCheckout: (state) => {
      state.allowGuestCheckout = !state.allowGuestCheckout;
    },
    updateMaxCartItems: (state, action: PayloadAction<number>) => {
      state.maxCartItems = action.payload;
    },
    updateCurrencySymbol: (state, action: PayloadAction<string>) => {
      state.currencySymbol = action.payload;
    },
    updateTaxRate: (state, action: PayloadAction<number>) => {
      state.taxRate = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  updateWebsiteName,
  updateLogoUrl,
  updateBannerSlide,
  addBannerSlide,
  removeBannerSlide,
  updateDeliveryFee,
  updateFreeDeliveryThreshold,
  updateSupportPhone,
  updateSupportEmail,
  updateContactInfo,
  updateSocialLinks,
  toggleMaintenanceMode,
  toggleGuestCheckout,
  updateMaxCartItems,
  updateCurrencySymbol,
  updateTaxRate,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;