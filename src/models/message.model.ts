// models/message.model.ts
import mongoose from "mongoose";

interface IMessage {
  _id?: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      // required: true,
    },
    text: {
      type: String,
      // required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    time: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;

