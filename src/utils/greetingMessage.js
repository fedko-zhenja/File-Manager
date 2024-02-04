import { messages } from "../data/messages.js";
import { createCurrentDirMessage } from "./currentDirMessage.js";
import { homedir } from 'node:os';

export function createGreetingMessage (userName) {
    console.log('\x1b[32m%s\x1b[0m', `${messages.greeting}, ${userName}!`);
    createCurrentDirMessage(homedir());
}