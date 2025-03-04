import express from "express";
import {
    acceptFriendRequest,
  getMyFriends,
  getMyProfile,
  getNotification,
  login,
  logout,
  register,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validator.js";

const app = express.Router();

app.post(
  "/register",
  singleAvatar,
  registerValidator(),
  validateHandler,
  register
);
app.post("/login", loginValidator(), validateHandler, login);

app.use(isAuthenticated);

app.get("/profile", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put(
  "/sendRequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);
app.put(
  "/acceptRequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get(
  "/notification",
  getNotification
);

app.get('/friends', getMyFriends)

export default app;
