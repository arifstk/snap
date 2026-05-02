// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// store.ts
// StoreProvider.ts
// userSlice.ts
// and then use this StoreProvider (as a provider) in the layout.tsx file
// create api/me/route.ts
