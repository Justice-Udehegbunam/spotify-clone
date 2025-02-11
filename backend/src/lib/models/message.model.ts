import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true, ref: "User" },
    receiverId: { type: String, required: true, ref: "User" },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }, // Track if the message is read To do this later
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
