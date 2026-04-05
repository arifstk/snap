// Navbar component
// import React from 'react'
'use client';

import { SearchIcon, ShoppingCartIcon, User } from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react"

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

  // console.log(user)
  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-15 px-4 md:px-8 z-50">

      <Link href={"/"} className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform">
        Snap
      </Link>

      <form className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md">
        <SearchIcon className="text-gray-500 w-5 h-5 mr-2" />
        <input type="text" placeholder="Search groceries..."
          className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </form>

      <div className="flex items-center gap-3 md:gap-6">
        <Link href={"/cart"} className="flex items-center justify-center rounded-full bg-white w-11 h-11 hover:scale-105 shadow-md  transition relative">
          <ShoppingCartIcon className="text-green-600 w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold shadow">0</span>
        </Link>

        <div className="relative">
          <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform"
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

          <AnimatePresence>
            {open &&
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-14 right-0 bg-white rounded-lg shadow-lg p-4 w-48"
              >
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Navbar;

