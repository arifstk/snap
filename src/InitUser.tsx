// initUser.ts
'use client';
import useGetMe from "./hooks/useGetMe";

export const InitUser = () => {
  useGetMe();
  return null;
};

export default InitUser;

