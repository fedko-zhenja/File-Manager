import { messages } from "../data/messages.js";
import { createCurrentDirMessage } from "./currentDirMessage.js";

export function createIncorrectMessage (userName) {
    console.log(messages.incorrect);
    createCurrentDirMessage();
}