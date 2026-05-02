// // initUser.ts
// 'use client';
// import useGetMe from "./hooks/useGetMe";

// export const InitUser = () => {
//   useGetMe();
//   return null;
// };

// export default InitUser;



'use client';
// src/InitUser.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchSettings } from "@/redux/settingsSlice";
import useGetMe from "./hooks/useGetMe";

export const InitUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  useGetMe(); // your existing user fetch hook

  useEffect(() => {
    dispatch(fetchSettings()); // load settings from DB for ALL pages
  }, [dispatch]);

  return null;
};

export default InitUser;

