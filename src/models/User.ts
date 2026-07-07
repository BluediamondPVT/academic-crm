import mongoose, { Schema, models } from "mongoose";
import { ROLES } from "@/config/roles";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Default fetch mein password nahi aayega (Security)
    },
    role: {
      type: String,
      enum: [ROLES.ADMIN, ROLES.COUNSELOR],
      default: ROLES.COUNSELOR,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);


const User = models.User || mongoose.model("User", userSchema);

export default User;