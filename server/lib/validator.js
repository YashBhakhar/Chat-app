import { body, check, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

export const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(400, errorMessage));
};

export const registerValidator = () => [
  body("name", "Please enter name").notEmpty(),
  body("bio", "Please enter bio").notEmpty(),
  body("password", "Please enter password").notEmpty(),
  body("username", "Please enter username").notEmpty(),
];

export const loginValidator = () => [
  body("password", "Please enter password").notEmpty(),
  body("username", "Please enter username").notEmpty(),
];

export const newGroupChatValidator = () => [
  body("name", "Please enter name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 2 })
    .withMessage("Members must be more then 2"),
];

export const addMembersValidator = () => [
  body("chatId", "Please enter chatId").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter members")
    .isArray({ min: 1 })
    .withMessage("Members must be more then 1"),
];

export const deleteMembersValidator = () => [
  body("chatId", "Please enter chatId").notEmpty(),
  body("userId", "Please enter userId").notEmpty(),
];

export const groupIdValidator = () => [
  param("id", "Please enter chatId").notEmpty(),
];

export const sendAttachmentValidator = () => [
  body("chatId", "Please enter chatId").notEmpty(),
  check("files")
    .notEmpty()
    .withMessage("Please upload attachments")
    .isArray({ min: 1, max: 5 })
    .withMessage("Attachments must be 1-5"),
];

export const renameValidator = () => [
  param("id", "Please enter chatId").notEmpty(),
  body("name", "Please enter name").notEmpty(),
];

export const sendRequestValidator = () => [
  body("userId", "Please enter userId").notEmpty(),
];

export const acceptRequestValidator = () => [
  body("requestId", "Please enter requestId").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add accept status")
    .isBoolean()
    .withMessage("Type must be boolean"),
];
