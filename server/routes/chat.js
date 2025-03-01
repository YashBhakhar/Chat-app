import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { addMembers, getMyChats, getMyGroups, newGroupChat } from '../controllers/chat.js';

const app = express.Router();

app.use(isAuthenticated)

app.post('/newGroup', newGroupChat)
app.get('/getChats', getMyChats)
app.get('/getGroups', getMyGroups)
app.get('/addMembers', addMembers)

export default app;