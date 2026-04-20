// user model
import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  location?: {
    type: {
      type: string;
      enum: ["Point"];
      default: "Point";
    };
    coordinates: {
      type: [Number];
      default: [0, 0];
    };
  };
  socketId?: string | null;
  isOnline?: boolean;
}

// interface ILocation {
//   type: string;
//   coordinates: [number, number];
// }

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    mobile: {
      type: String,
      required: false,
      match: [/^[0-9]{10,15}$/, "Please enter a valid mobile number"],
    },
    role: {
      type: String,
      enum: ["user", "deliveryBoy", "admin"],
      default: "user",
    },
    image: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);
userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

