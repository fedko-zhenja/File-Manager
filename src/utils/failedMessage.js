import { messages } from "../data/messages.js";

export function createFailedMessage () {
    console.log('\x1b[31m%s\x1b[0m', messages.failed);
}