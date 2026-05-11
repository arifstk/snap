// src/redux/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  finalTotal: number;
}

// ✅ Payload for calculateTotal — fed from settings so it's never hardcoded
interface ICalculateTotalPayload {
  deliveryFee: number; // from settings.deliveryFee
  freeDeliveryThreshold: number; // from settings.freeDeliveryThreshold
}

const loadCartFromStorage = (): IGrocery[] => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('snap_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const saveCartToStorage = (data: IGrocery[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('snap_cart', JSON.stringify(data));
  }
};

const initialState: ICartSlice = {
  cartData: loadCartFromStorage(),
  subTotal: 0,
  deliveryFee: 0,
  finalTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      saveCartToStorage(state.cartData);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((itm) => itm._id == action.payload);
      if (item) item.quantity += 1;
      saveCartToStorage(state.cartData);
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((itm) => itm._id == action.payload);
      if (item?.quantity && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.cartData = state.cartData.filter(
          (itm) => itm._id !== action.payload,
        );
      }
      saveCartToStorage(state.cartData);
    },
    removeFromCart: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter(
        (itm) => itm._id !== action.payload,
      );
      saveCartToStorage(state.cartData);
    },

    // ✅ calculateTotal now receives fee & threshold from settings — no hardcoding
    calculateTotal: (state, action: PayloadAction<ICalculateTotalPayload>) => {
      const { deliveryFee, freeDeliveryThreshold } = action.payload;
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      state.deliveryFee =
        state.subTotal >= freeDeliveryThreshold ? 0 : deliveryFee;
      state.finalTotal = state.subTotal + state.deliveryFee;
      saveCartToStorage(state.cartData);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  calculateTotal,
} = cartSlice.actions;

export default cartSlice.reducer;


