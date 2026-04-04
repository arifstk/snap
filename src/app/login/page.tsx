// login page

'use client';
import { Eye, EyeOff, Leaf, Loader2, Lock, LogIn, Mail } from 'lucide-react';
import { motion } from "motion/react";
import Image from 'next/image';
import { useState } from 'react';
import googleLogo from '@/assets/googleLogo.png';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", { email, password, redirect: false });
      setLoading(false);
      toast.success("Login successful!");
      router.push("/");

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const formValidation = email !== "" && password !== "";

  return (
    <div className='flex min-h-screen'>

      {/* ── Left panel ── */}
      <div className='hidden md:flex flex-col items-center justify-center w-1/2 bg-green-700 text-white px-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='flex flex-col items-center text-center gap-6'
        >
          <div className='flex items-center gap-3'>
            <Leaf className='w-16 h-16 text-green-300' />
          </div>
          <h1 className='text-5xl font-extrabold tracking-tight'>Snap</h1>
          <p className='text-green-200 text-lg max-w-xs leading-relaxed'>
            Your smart grocery companion. Fresh deals, fast delivery, every day.
          </p>
          <div className='flex gap-4 mt-4'>
            <div className='bg-green-600 rounded-2xl px-6 py-4 text-center'>
              <p className='text-2xl font-bold'>500+</p>
              <p className='text-green-300 text-sm'>Products</p>
            </div>
            <div className='bg-green-600 rounded-2xl px-6 py-4 text-center'>
              <p className='text-2xl font-bold'>10k+</p>
              <p className='text-green-300 text-sm'>Customers</p>
            </div>
            <div className='bg-green-600 rounded-2xl px-6 py-4 text-center'>
              <p className='text-2xl font-bold'>5★</p>
              <p className='text-green-300 text-sm'>Rating</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div className='flex flex-col items-center justify-center w-full md:w-1/2 px-8 py-12 bg-white'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-sm'
        >
          <h2 className='text-4xl font-extrabold text-green-700 mb-1 text-center'>
            Welcome Back
          </h2>
          <p className='text-gray-500 mb-8 flex items-center justify-center gap-1'>
            Login To Snap <Leaf className='w-4 h-4 text-green-600' />
          </p>

          <form onSubmit={handleLogin} className='flex flex-col gap-5'>
            {/* Email */}
            <div className='relative'>
              <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
              <input
                className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
                type='email'
                placeholder='Your Email'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {/* Password */}
            <div className='relative'>
              <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
              <input
                className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-10 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
                type={showPassword ? 'text' : 'password'}
                placeholder='Your Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {showPassword
                ? <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600' onClick={() => setShowPassword(false)} />
                : <Eye className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600' onClick={() => setShowPassword(true)} />
              }
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={!formValidation || loading}
              className={`flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-2 ${formValidation && !loading
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Login'}
            </button>

            {/* Divider */}
            <div className='flex items-center gap-2 text-gray-400 text-sm'>
              <span className='flex-1 h-px bg-gray-200' />
              OR
              <span className='flex-1 h-px bg-gray-200' />
            </div>

            {/* Google */}
            <button
              type='button'
              onClick={() => signIn("google", {callbackUrl:"/"})}
              className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200'
            >
              <Image src={googleLogo} width={20} height={20} alt='Google Logo' />
              Continue with Google
            </button>
          </form>

          <p className='text-gray-500 mt-6 text-sm flex items-center justify-center gap-1'>
            Want to create an account?
            <span
              className='flex items-center gap-1 cursor-pointer text-green-600 hover:underline'
              onClick={() => router.push("/register")}
            >
              <LogIn className='w-4 h-4' /> Sign Up
            </span>
          </p>
        </motion.div>
      </div>

    </div>
  );
};

export default Login;


// // login page
// 'use client';
// import { ArrowLeft, Eye, EyeOff, Leaf, Loader2, Lock, LogIn, Mail } from 'lucide-react';
// import { motion } from "motion/react"
// import Image from 'next/image';
// import { use, useState } from 'react';
// import googleLogo from '@/assets/googleLogo.png';
// import axios from 'axios';
// // import { set } from 'mongoose';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation';
// import { signIn, useSession } from 'next-auth/react';

// const Login = () => {
//   // const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const session = useSession();
//   console.log(session);

//   const handleLogin = async(e: React.FormEvent<HTMLFormElement>)=> {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signIn("credentials", {
//         email, password
//       });
//       setLoading(false);
//       toast.success("Login successful!");
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//       toast.error("Login failed. Please check your credentials and try again.");
//     }
//   };

//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
//       <motion.h1
//         initial={{
//           y: 10,
//           opacity: 0
//         }}
//         animate={{
//           y: -10,
//           opacity: 1
//         }}
//         transition={{
//           duration: 0.6
//         }}
//         className='text-4xl font-extrabold text-green-700 mb-2'>
//         Welcome Back
//       </motion.h1>
//       <p className='text-gray-600 mb-8 flex items-center'>Login to Snap <Leaf className='w-5 h-5 text-green-600' /></p>
//       <motion.form
//       onSubmit={handleLogin}
//         initial={{
//           opacity: 0
//         }}
//         animate={{
//           opacity: 1
//         }}
//         transition={{
//           duration: 0.6
//         }}
//         className='flex flex-col gap-5 w-full max-w-sm'>
//         <div className='relative'>
//           <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
//           <input
//             className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
//             type='text' placeholder='Your Email'
//             onChange={(e) => setEmail(e.target.value)}
//             value={email}
//           />
//         </div>
//         <div className='relative'>
//           <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
//           <input
//             className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
//             type={showPassword ? 'text' : 'password'} placeholder='Your Password'
//             onChange={(e) => setPassword(e.target.value)}
//             value={password}
//           />
//           {
//             showPassword ? <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-500'
//               onClick={() => setShowPassword(false)} />
//               :
//               <Eye className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-500'
//                 onClick={() => setShowPassword(true)} />
//           }
//         </div>
//         {
//           (() => {
//             const formValidation = email !== "" && password !== "";
//             return <button disabled={!formValidation || loading}
//               className={`flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-4 ${formValidation ?
//                 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//             >
//               {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : "Login"}
//             </button>
//           })()
//         }

//         <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
//           <span className='flex-1 h-px bg-gray-200'></span>
//           OR
//           <span className='flex-1 h-px bg-gray-200'></span>
//         </div>

//         <button className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer' onClick={()=>signIn("google")}>
//           <Image src={googleLogo} width={20} height={20} alt='Google Logo' />
//           Continue with Google
//         </button>
//       </motion.form>

//       <p className='text-gray-600 mt-6 text-sm flex items-center gap-1' onClick={()=>router.push("/register")}>
//         Want to create an account?
//         <span className='flex items-center gap-1 cursor-pointer'>
//           <LogIn className='w-4 h-4 text-green-600 ' /> <span className='text-green-600'>Sign up</span>
//         </span></p>
//     </div>
//   )
// }

// export default Login;

