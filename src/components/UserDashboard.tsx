// UserDashboard.tsx
// import React from 'react'
import HeroSection from './HeroSection';
import connectDb from '@/lib/db';
import Grocery from '@/models/grocery.model';
import GrocerySection from './GrocerySection';

const UserDashboard = async () => {
  await connectDb();
  const groceries = await Grocery.find({}).sort({ createdAt: -1 })
  const plainGrocery = JSON.parse(JSON.stringify(groceries))

  return (
    <>
      <HeroSection />
      <GrocerySection groceries={plainGrocery}/>
    </>
  )
}

export default UserDashboard;
