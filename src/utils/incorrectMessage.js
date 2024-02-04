import { messages } from "../data/messages.js";

export function createIncorrectMessage (userName) {
    console.log('\x1b[31m%s\x1b[0m', '\n' + messages.incorrect);
}