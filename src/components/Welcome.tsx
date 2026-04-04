// welcome.tsx
// "use client";
import { ArrowRight, Bike, ShoppingBasket } from "lucide-react";
import { motion } from "motion/react"

type propType={
  nextStep: (s: number)=>void;
};

const Welcome = ({nextStep}:propType) => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6'>
      <motion.div
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6
        }}
      >
        <div className="flex items-center gap-3">
          <ShoppingBasket className="w-10 h-10 font-bold text-green-700" />
          <h1 className="text-4xl md:text-5xl font-bold text-green-700">Snap</h1>
        </div>
      </motion.div>
      <motion.p
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6,
          delay: 0.3
        }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop destination for fresh groceries, organic produce, and daily essentials delivered right to your doorstep.
      </motion.p>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 0.6,
          delay: 0.5
        }}
        className="flex items-center justify-center gap-10 mt-10"
      >
        <ShoppingBasket className="w-24 h-24 text-green-700 drop-shadow-md" />
        <Bike className="w-24 h-24 text-orange-500 drop-shadow-md" />
      </motion.div>

      <motion.button
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6,
          delay: 0.8
        }}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 cursor-pointer mt-10"
        onClick={() => nextStep(2)}
      >
        Next
        <ArrowRight />
      </motion.button>
    </div>
  )
}

export default Welcome;

// receive this nextStep={setStep} from register page
