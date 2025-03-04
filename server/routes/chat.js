import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMembers,
  renameGroup,
  sendAttachment,
} from "../controllers/chat.js";
import { attachmentMulter } from "../middlewares/multer.js";
import {
  addMembersValidator,
  deleteMembersValidator,
  groupIdValidator,
  newGroupChatValidator,
  renameValidator,
  sendAttachmentValidator,
  validateHandler,
} from "../lib/validator.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/newGroup", newGroupChatValidator(), validateHandler, newGroupChat);
app.get("/getChats", getMyChats);
app.get("/getGroups", getMyGroups);
app.put("/addMembers", addMembersValidator(), validateHandler, addMembers);
app.put(
  "/removeMember",
  deleteMembersValidator(),
  validateHandler,
  removeMembers
);
app.delete("/leave/:id", groupIdValidator(), validateHandler, leaveGroup);
app.post(
  "/message",
  attachmentMulter,
  sendAttachmentValidator(),
  validateHandler,
  sendAttachment
);
app.get("/message/:id", groupIdValidator(), validateHandler, getMessages);
app
  .route("/:id")
  .get(groupIdValidator(), validateHandler, getChatDetails)
  .delete(groupIdValidator(), validateHandler, deleteChat)
  .put(renameValidator(), validateHandler, renameGroup);

export default app;
