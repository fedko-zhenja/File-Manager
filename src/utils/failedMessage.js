import { messages } from "../data/messages.js";

export function createFailedMessage (error) {
    console.log('\x1b[31m%s\x1b[0m', '\n' + messages.failed + '\n' + error);
}