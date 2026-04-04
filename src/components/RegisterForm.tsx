// RegisterForm
import { ArrowLeft, Eye, EyeOff, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react';
import { motion } from "motion/react"
import Image from 'next/image';
import { useState } from 'react';
import googleLogo from '@/assets/googleLogo.png';
import axios from 'axios';
// import { set } from 'mongoose';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

type propType = {
  prevStep: (s: number) => void;
};

const RegisterForm = ({ prevStep }: propType) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const [error, setError] = useState('');
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // handle registration logic here
    try {
      const result = await axios.post('/api/auth/register', { name, email, password });
      // console.log(result.data);
      router.push("/login");
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Something went wrong';
      if (message.toLowerCase().includes('exist') || error?.response?.status === 409) {
        toast.error('This user already exists');
      } else {
        toast.error(message);
      }
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
      <div className='absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer'
        onClick={() => prevStep(1)}
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Back</span>
      </div>
      <motion.h1
        initial={{
          y: 10,
          opacity: 0
        }}
        animate={{
          y: -10,
          opacity: 1
        }}
        transition={{
          duration: 0.6
        }}
        className='text-4xl font-extrabold text-green-700 mb-2'>
        Create Account
      </motion.h1>
      <p className='text-gray-600 mb-8 flex items-center'>Join Snap Today <Leaf className='w-5 h-5 text-green-600' /></p>
      <motion.form
        onSubmit={handleRegister}
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.6
        }}
        className='flex flex-col gap-5 w-full max-w-sm'>
        <div className='relative'>
          <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
            className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
            type='text' placeholder='Your Name'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className='relative'>
          <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
            className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
            type='text' placeholder='Your Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className='relative'>
          <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
            className='w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none'
            type={showPassword ? 'text' : 'password'} placeholder='Your Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {
            showPassword ? <EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-500'
              onClick={() => setShowPassword(false)} />
              :
              <Eye className='absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-500'
                onClick={() => setShowPassword(true)} />
          }
        </div>
        {
          (() => {
            const formValidation = name !== "" && email !== "" && password !== "";
            return <button disabled={!formValidation || loading}
              className={`flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-4 ${formValidation ?
                'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : "Register"}
            </button>
          })()
        }

        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-200'></span>
          OR
          <span className='flex-1 h-px bg-gray-200'></span>
        </div>

        <button type='button' className='w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 cursor-pointer' onClick={()=>signIn("google", {callbackUrl:"/"})}>
          <Image src={googleLogo} width={20} height={20} alt='Google Logo' />
          Continue with Google
        </button>
      </motion.form>

        <p className='text-gray-600 mt-6 text-sm flex items-center gap-1' onClick={()=>router.push("/login")}>
        Already have an account?
        <span className='flex items-center gap-1 cursor-pointer'>
          <LogIn className='w-4 h-4 text-green-600 ' /> <span className='text-green-600'>Sign in</span>
        </span></p>
    </div>
  )
}

export default RegisterForm;

// <span className='font-semibold text-green-600 cursor-pointer'>Sign in</span>

