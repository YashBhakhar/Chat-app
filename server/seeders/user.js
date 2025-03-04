import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { faker, simpleFaker } from "@faker-js/faker";

export const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        password: "Admin123",
        bio: faker.lorem.sentence(10),
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });

      usersPromise.push(tempUser);
    }

    await Promise.all(usersPromise);

    console.log("usersCreated");
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createSingleChat = async () => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatPromises.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]],
          })
        );
      }
    }

    await Promise.all(chatPromises);

    console.log("Chat created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createGroupChats = async (numOfChats) => {
  try {
    const users = await User.find().select("_id");
    const chatPromises = [];
    for (let i = 0; i < numOfChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let j = 0; j < numMembers; j++) {
        const radomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[radomIndex];

        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      chatPromises.push(chat);
    }

    await Promise.all(chatPromises);

    console.log("Chat created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createMessages = async (numMessage) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagePromise = [];

    for (let i = 0; i < numMessage; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagePromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagePromise);

    console.log("Message created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const createMessagesInChat = async (chatId, numMessage) => {
  try {
    const users = await User.find().select("_id");

    const messagePromise = [];

    for (let i = 0; i < numMessage; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagePromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagePromise);

    console.log("Message created successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
