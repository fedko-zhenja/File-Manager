import { messages } from "../data/messages.js";

export function createExitMessage (userName) {
    console.log(`${messages.exit[0]}, ${userName}, ${messages.exit[1]}!`)
    process.exit();
}