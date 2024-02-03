import { messages } from "../data/messages.js";
import { createCurrentDirMessage } from "./currentDirMessage.js";

export function createGreetingMessage (userName) {
    console.log(`${messages.greeting}, ${userName}!`);
    createCurrentDirMessage();
}