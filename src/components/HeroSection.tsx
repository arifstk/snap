//HeroSection.tsx
'use client';
import { Leaf, Truck, Smartphone } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Fresh Organic Groceries",
      subtitle: "Farm-fresh fruits, vegetables, and more, delivered straight to your doorstep.",
      btnText: "Shop Now",
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
    id: 2,
    icon: <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
    title: "Fast Delivery",
    subtitle: "Get your groceries delivered to your doorstep in no time.",
    btnText: "Shop Now",
    bg: "https://media.istockphoto.com/id/1398228427/photo/food-delivery-rider-delivers-food.jpg?s=1024x1024&w=is&k=20&c=wOjVHbr1P2_OjoQD6R6Ri5ORR4PCeOXltRlbKLXPWQo="
    },
    {
      id: 3,
      icon: <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Mobile Ordering",
      subtitle: "Order groceries from the comfort of your phone.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1770013413878-2530e2c3d82b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const [current, setCurrent] =useState(0);
  useEffect(()=> {

  }, []);

  return (
    <div>
    HeroSection
    </div>
  )
}

export default HeroSection;

