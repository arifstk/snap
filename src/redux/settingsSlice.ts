// src/redux/settingsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────
interface IBannerSlide {
  id: number;
  title: string;
  subtitle: string;
  btnText: string;
  bg: string;
  link: string;
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

export interface ISettings {
  websiteName: string;
  logoUrl: string;
  bannerSlides: IBannerSlide[];
  deliveryFee: number;
  freeDeliveryThreshold: number;
  contactInfo: IContactInfo;
  socialLinks: ISocialLinks;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  maxCartItems: number;
  currencySymbol: string;
  taxRate: number;
}

interface ISettingsSlice {
  data: ISettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const defaultSettings: ISettings = {
  websiteName: "FreshMart",
  logoUrl: "",
  bannerSlides: [],
  deliveryFee: 0,
  freeDeliveryThreshold: 100,
  contactInfo: { email: "", phone: "", address: "" },
  socialLinks: { facebook: "", instagram: "", twitter: "" },
  maintenanceMode: false,
  allowGuestCheckout: true,
  maxCartItems: 50,
  currencySymbol: "$",
  taxRate: 8.5,
};

const initialState: ISettingsSlice = {
  data: defaultSettings,
  isLoading: false,
  isSaving: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchSettings = createAsyncThunk(
  "settings/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json.settings as ISettings;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch settings",
      );
    }
  },
);

export const saveSettings = createAsyncThunk(
  "settings/save",
  async (payload: Partial<ISettings>, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      return json.settings as ISettings;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to save settings",
      );
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLocalSettings: (state, action: PayloadAction<Partial<ISettings>>) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(saveSettings.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.data = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLocalSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
