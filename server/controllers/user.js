import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { cookieOption, emitEvent, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMembers } from "../lib/helper.js";

// Create a new User and save it to database and save in cookie
export const register = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file

  if (!file) return next(new ErrorHandler(404, "Please upload avatar"));

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
  const { name = "" } = req.query;

  const myChats = await Chat.find({ groupChat: false, members: req.user });

  const allFriends = myChats.flatMap((chat) => chat.members);
  console.log(allFriends);

  const allUserExceptFriends = await User.find({
    _id: { $nin: allFriends },
    name: { $regex: name, $options: "i" },
  });
  console.log(allUserExceptFriends);

  const users = allUserExceptFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));
  return res.status(200).json({
    success: true,
    users,
  });
});

export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler(400, "Request already sent"));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, userId);

  return res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

export const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler(404, "Request not found"));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(new ErrorHandler(401, "Unauthorized"));

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Request accepted successfully",
    senderId: request.sender._id,
  });
});

export const getNotification = TryCatch(async (req, res, next) => {
  const request = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequest = request.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequest,
  });
});

export const getMyFriends = TryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({ members: req.user, groupChat: false }).populate(
    "members",
    "name avatar"
  );

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMembers(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});
