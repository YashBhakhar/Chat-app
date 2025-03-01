import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from 'jsonwebtoken'

export const isAuthenticated = TryCatch(async (req, resizeBy, next) => {
    const token = req.cookies['chat-token']

    if(!token) return next(new ErrorHandler(401,"Please login to access this route"))

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedData.id

    next()
}) 