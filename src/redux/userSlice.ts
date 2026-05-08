// userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
  token?: string;
}

interface IUserSlice {
  userData: IUser | null;
  searchQuery: string;
}

const initialState: IUserSlice = {
  userData: null,
  searchQuery: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
});

export const {setUserData, setSearchQuery}= userSlice.actions;
export default userSlice.reducer;

