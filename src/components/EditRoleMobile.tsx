// Edit Role Mobile Component
'use client';
import axios from "axios";
import { ArrowRight, Bike, User, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { useState } from "react";

const router = useRouter();

const EditRoleMobile = () => {
  const [roles, setRoles] = useState([
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike }
  ]);

  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const handleEdit = async ()=> {
    // Handle the logic to save the selected role and mobile number
    try {
      const result = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile: mobile
      })
      // console.log(result.data);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen p-6 w-full bg-white'>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {
          roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole == role.id
            return (
              <motion.div
                key={role.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all cursor-pointer
                ${isSelected
                    ? "border-green-600 bg-green-100 shadow-lg"
                    : "border-gray-300 bg-white hover:border-green-400"
                  }`}
              >
                <Icon />
                <span>{role.label}</span>
              </motion.div>
            )
          })
        }
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray-200 font-medium mb-2">Enter Your Mobile No.</label>
        <input
          type="tel"
          id='mobile'
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="eg. +0001234567890"
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        disabled={mobile.length!==11 || !selectedRole}
        className={`flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 w-50 mt-5
          ${selectedRole && mobile.length===11 ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          onClick={handleEdit}
      >
        Go to Home <ArrowRight size={18} />
      </motion.button>
    </div>
  )
}

export default EditRoleMobile;

