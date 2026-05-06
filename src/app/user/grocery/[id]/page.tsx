// app/user/grocery/[id]/page.tsx
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import GroceryDetailClient from "./GroceryDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}


const GroceryDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  await connectDb();
  const item = await Grocery.findById(id).lean();

  if (!item) return <div>Item not found</div>;
  return (
    <div>
      <GroceryDetailClient item={JSON.parse(JSON.stringify(item))} />
    </div>
  )
}

export default GroceryDetailPage

