import { messages } from "../data/messages.js";

export function createExitMessage (userName) {
    console.log('\x1b[32m%s\x1b[0m', `${messages.exit[0]}, ${userName}, ${messages.exit[1]}!`)
    process.exit();
}