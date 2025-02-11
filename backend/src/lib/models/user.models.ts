import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      default: "",
    },
    lastName: {
      type: String,
      required: true,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    supabaseId: { type: String, required: true, unique: true }, // SuperTokens userId
  },
  { timestamps: true } // This adds createdAt and updatedAt fields automatically
);

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
