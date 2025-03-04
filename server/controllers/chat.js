import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/event.js";
import { getOtherMembers } from "../lib/helper.js";
import { Message } from "../models/message.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, allMembers);

  return res.status(201).json({
    success: true,
    message: "Group chat created",
  });
});

export const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transFormedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMember = getOtherMembers(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, cur) => {
        if (cur._id.toString() !== req.user.toString()) {
          prev.push(cur._id);
        }
        return prev;
      }, []),
    };
  });
  return res.status(200).json({
    success: true,
    message: transFormedChats,
  });
});

export const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  return res.status(200).json({
    success: true,
    message: groups,
  });
});

export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  
  const chat = await Chat.findById(chatId);
  const uniqueMembers = members.filter(
    (i) => !chat.members.includes(i.toString())
  );

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler(400, "This is not nan gnroup chat"));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler(403, "you are ot allowed to add members"));
  }

  const allMembersPromise = await User.find({
    _id: { $in: uniqueMembers },
  }).select("_id name");

  if (allMembersPromise.length) {
    chat.members.push(allMembersPromise.map((i) => i._id));
  } else {
    return next(new ErrorHandler(400, "Member alreqady exist"));
  }

  await chat.save();

  const allUsersName = allMembersPromise.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `you have been added to ${allUsersName} by ${req.user.name}`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

export const removeMembers = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler(400, "This is not nan gnroup chat"));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(new ErrorHandler(403, "you are not allowed to add members"));
  }

  if (chat.members.length <= 3) {
    return next(new ErrorHandler(400, "Group must have atleast 3 members"));
  }

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${user.name} has been removed from group.`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member remove successfully.",
  });
});

export const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler(400, "This is not nan gnroup chat"));
  }

  const remainingMembers = chat.members.filter(
    (member) => member.toString() !== req.user.toString()
  );

  if (chat.creator.toString() === req.user.toString()) {
    chat.creator = remainingMembers[0];
  }

  chat.members = remainingMembers;
  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} has left the group.`);

  return res.status(200).json({
    success: true,
    message: "Member remove successfully.",
  });
});

export const sendAttachment = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }
  const files = req.files || [];

  const attachments = [];

  const messageForDB = {
    content: "",
    attachments,
    sender: user._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: { id: user._id, name: user.name },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
});

export const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) {
      return next(new ErrorHandler(404, "Chat not found"));
    }

    chat.members = chat.members.map(({ id, name, avatar }) => ({
      id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id).populate(
      "members",
      "name avatar"
    );

    if (!chat) {
      return next(new ErrorHandler(404, "Chat not found"));
    }
    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

export const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler(400, "This is not nan gnroup chat"));
  }

  if (chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler(403, "you are not allowed to rename the group")
    );
  }

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group renamed successfully.",
  });
});

export const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler(404, "Chat not found"));
  }

  if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
    return next(
      new ErrorHandler(403, "you are not allowed to delete the group")
    );
  }

  const members = chat.members;

  if (!chat.groupChat && !members.includes(req.user.toString())) {
    return next(
      new ErrorHandler(403, "you are not allowed to delete the group")
    );
  }

  //delete all message and attachments
  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messageWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully.",
  });
});

export const getMessages = TryCatch(async (req, res, next) => {
  const { id: chatId } = req.params;

  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const [messages, totalMessage] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({chat: chatId})
  ]);

  const totalPages = Math.ceil(totalMessage/limit) || 0

  return res.status(200).json({
    success: true,
    message: messages.reverse(),
    totalPages
  });
});
