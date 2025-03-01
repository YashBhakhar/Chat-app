import express from 'express';
import { connectDB } from './utils/features.js';
import dotenv from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import { createUser } from './seeders/user.js';

dotenv.config({
  path: './.env'
})

const app = express();

app.use(express.json())
app.use(cookieParser())

const mongoURI = process.env.MONGO_PATH

connectDB(mongoURI)


app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

app.use(errorMiddleware)

app.listen(2025, () => {
  console.log('Server is running on port 3000');
});