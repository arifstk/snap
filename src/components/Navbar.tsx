// Navbar component
// import React from 'react'
'use client';

import { Boxes, ClipboardCheck, Cross, LogOut, LogOutIcon, Menu, Package, Plus, PlusCircle, Search, SearchIcon, ShoppingCartIcon, Tag, User, X } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react"
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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

const Navbar = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const profileDropdown = useRef<HTMLDivElement>(null);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartData } = useSelector((state: RootState) => state.cart);

  // profile dropdown false on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdown.current && !profileDropdown.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);
  // console.log(user);

  // Sidebar for small screen (ADMIN)
  const sideBar = menuOpen ? createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="fixed top-0 left-0 h-full w-[79%] sm:w-[50%] z-999 bg-linear-to-b from-green-800/50 via-teal-700/80 to-green-900/90 backdrop-blur-lg border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white md:hidden"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-extrabold text-2xl tracking-wide text-white/90">Admin Panel</h1>
          <button className="text-white/80 hover:text-red-400 text-2xl font-bold transition cursor-pointer"
            onClick={() => setMenuOpen(false)}
          ><X className="w-8 h-8" /></button>
        </div>
        <div>  {/*  profile */}
          <div className="flex items-center gap-3 py-3 pl-4 mt-4 rounded-xl bg-white/20 hover:bg-white/30 transition-all shadow-inner">
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden relative">
              {
                user.image ? <Image src={user.image} alt='user' fill
                  className="object-cover rounded-full w-10 h-10"
                /> :
                  (<span className="bg-gray-300 font-bold text-2xl">
                    {user.name
                      .split(" ")
                      .map(n => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>)
              }
            </div>
            <div>
              <div className="text-lg font-semibold tracking-wide">{user.name}</div>
              <div className="text-xs text-gray-700 capitalize tracking-wide">{user.role}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6 font-medium md:hidden ">
          <Link
            href={"/admin/add-category"}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 p-3 pl-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all shadow-inner">
            <Tag className="w-5 h-5" /> Add Category
          </Link>
          <Link href={"/admin/add-grocery"} className="flex items-center gap-3 p-3 pl-4  rounded-lg bg-white/20 hover:bg-white/30 transition-all shadow-inner">
            <PlusCircle className="w-5 h-5" /> Add Grocery</Link>
          <Link href={""} className="flex items-center gap-3 p-3 pl-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all shadow-inner">
            <Boxes className="w-5 h-5" /> View Grocery</Link>
          <Link href={"/admin/manage-orders"} className="flex items-center gap-3 p-3 pl-4 rounded-lg bg-white/20 hover:bg-white/30 transition-all shadow-inner">
            <ClipboardCheck className="w-5 h-5" /> Manage Orders</Link>
        </div>

        <div className="my-5 border-t border-white/20"></div>
        <div className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all cursor-pointer"
          onClick={() => {
            setOpen(false)
            signOut({ callbackUrl: "/login" })
          }}>
          <LogOutIcon className="pl-2 w-6 h-6 text-red-300" /> Logout
        </div>
      </motion.div>
    </AnimatePresence>, document.body,
  ) : null;

  return (
    <div className="max-w-7xl mx-auto w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-15 px-4 md:px-8 z-50">

      <Link href={"/"} className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform">
        Snap
      </Link>

      {/* search bar*/}
      {
        user.role === "user" &&
        <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
          <SearchIcon className="text-gray-500 w-5 h-5 mr-2" />
          <input type="text" placeholder="Search groceries..."
            className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </form>
      }


      <div className="flex items-center gap-3 md:gap-6">
        {/* search icon */}
        {
          user.role === "user" &&
          <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden" onClick={() => setSearchBarOpen((prev) => !prev)}>
            <Search className="text-green-600 w-6 h-6" />
          </div>
        }

        {/* Cart */}
        {
          user.role === "user" &&
          <Link href={"/user/cart"} className="flex items-center justify-center rounded-full bg-white w-11 h-11 hover:scale-105 shadow-md  transition relative">
            <ShoppingCartIcon className="text-green-600 w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">{cartData.length}</span>
          </Link>
        }

        {/* Admin Only */}
        {
          user.role === "admin" &&
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link href={"/admin/add-category"} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
                <Tag className="w-5 h-5" /> Add Category
              </Link>
              <Link href={"/admin/add-grocery"} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
                <PlusCircle className="w-5 h-5" /> Add Grocery</Link>
              <Link href={""} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
                <Boxes className="w-5 h-5" /> View Grocery</Link>
              <Link href={"/admin/manage-orders"} className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all">
                <ClipboardCheck className="w-5 h-5" /> Manage Orders</Link>
            </div>
            {/* Sidebar for Small Screen */}
            <div className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => setMenuOpen(prev => !prev)}>
              <Menu className="text-green-600 w-6 h-6" />
            </div>
          </>
        }

        <div className="relative" ref={profileDropdown}>
          {/* Profile Avatar */}
          <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setOpen(prev => !prev)}
          >
            {
              user.image ? <Image src={user.image} alt='user' fill
                className="object-cover rounded-full"
              /> :
                (<span className="text-green-700 font-bold text-2xl">
                  {user.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>)
            }
          </div>

          {/* dropdown */}
          <AnimatePresence>
            {open &&
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-48 z-999"
              >
                <div className="flex items-center gap-3 py-2 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative">
                    {
                      user.image ? <Image src={user.image} alt='user' fill
                        className="object-cover rounded-full w-10 h-10"
                      /> :
                        (<span className="text-green-700 font-bold text-2xl">
                          {user.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>)
                    }
                  </div>

                  <div>
                    <div className="text-gray-800 font-semibold tracking-tight">{user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>

                {
                  user.role === "user" &&
                  <Link href={"/user/my-orders"} className="flex items-center gap-2 mt-2 px-2 py-3 hover:bg-green-50 rounded-lg text-gray-700" onClick={() => setOpen(false)}
                  >
                    <Package className="w-5 h-5 text-green-600" />
                    My Orders
                  </Link>
                }

                <button className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium cursor-pointer"
                  onClick={() => {
                    setOpen(false)
                    signOut({ callbackUrl: "/login" })
                  }}>
                  <LogOut className="w-5 h-5 text-red-600" />
                  Log Out
                </button>
              </motion.div>
            }
          </AnimatePresence>

          {/* Search icon's bar small device */}
          <AnimatePresence>
            {searchBarOpen &&
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="fixed top-17 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <form className="grow">
                  <input type="text" className="w-full outline-none text-gray-700" placeholder="Search groceries..." />
                </form>
                <button onClick={() => setSearchBarOpen(false)}>
                  <X className="text-gray-500" />
                </button>
              </motion.div>
            }
          </AnimatePresence>

        </div>
      </div>
      {/* Sidebar for small Screen (ADMIN) */}
      {sideBar}
    </div>
  )
}

export default Navbar;

// onClick={() => setOpen(false)}