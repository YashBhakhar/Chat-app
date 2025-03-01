import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOption, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new User and save it to database and save in cookie
export const register = TryCatch(async (req, res, next) => {
  const { name, username, password, avatar, bio } = req.body;

  const user = await User.create({
    name,
    username,
    password,
    avatar: {
      public_id: "123",
      url: "asd",
    },
    bio,
  });

  sendToken(res, user, 201, "User created successfully.");
});

export const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  console.log(user);
  if (!user) return next(new ErrorHandler(404, "Invalid Username"));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler(404, "Invalid Password"));

  sendToken(res, user, 200, `Welcome back ${user.name}`);
});

export const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user);

  return res.status(200).json({
    success: true,
    user,
  });
});

export const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chat-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "Logout successfully",
    });
});

export const searchUser = TryCatch(async (req, res) => {
  const {name} = req.query
  return res
    .status(200)
    .json({
      success: true,
      message: "Logout successfully",
    });
});
