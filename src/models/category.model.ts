// models/category.model.ts
import mongoose from "mongoose";

interface ICategory {
  _id?: mongoose.Types.ObjectId;
  name: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;


//         "Fruits & Vegetables",
//         "Dairy & Eggs",
//         "Rice, Atta & Grains",
//         "Snacks & Biscuits",
//         "Spices & Masalas",
//         "Beverages & Drinks",
//         "Personal Care",
//         "Household Essentials",
//         "Instant & packaged Food",
//         "Baby & Pet Care",