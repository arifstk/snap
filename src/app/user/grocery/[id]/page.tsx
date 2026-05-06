// snap/src/app/user/grocery/[id]/page.tsx
import connectDb from '@/lib/db'
import Grocery from '@/models/grocery.model';
import React from 'react'
interface Props {
  params: Promise <{ id: string }>
}

const GroceryDetailPage = async ({ params }: Props) => {
  const {id} = await params;
  await connectDb();
  const item = await Grocery.findById(id).lean();
  if (!item) return
  <div>Item not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={item.image} alt={item.name} className="w-full h-80 object-contain" />

      <h1 className="text-2xl font-bold mt-4">{item.name}</h1>
      <p className="text-gray-500">{item.category}</p>

      <p className="mt-2 text-lg font-semibold">
        Price: {item.price}
      </p>

      <p className="mt-2">Unit: {item.unit}</p>
    </div>
  )
}

export default GroceryDetailPage

