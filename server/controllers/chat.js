import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMembers } from "../lib/helper.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2) {
    return next(
      new ErrorHandler(400, "Group chat must have at least 3 members")
    );
  }

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
  if (!members || members.length < 1) {
    return next(new ErrorHandler(400, "Please provide members"));
  }
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
