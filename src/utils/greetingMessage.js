import { messages } from "../data/messages.js";

export function createGreetingMessage (userName) {
    console.log(`${messages.greeting}, ${userName}!`);
}