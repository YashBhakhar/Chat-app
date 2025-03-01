import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

export const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chat-APP" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

export const sendToken = (res, user, code, message) => {
  const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);

  return res
    .status(code)
    .cookie("chat-token", token, cookieOption)
    .json({ success: true, message });
};

export const emitEvent = (req, event, users, data) => {
  console.log('yash', event);
  
}