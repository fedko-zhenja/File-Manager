import { messages } from "../data/messages.js";

export function createCurrentDirMessage () {
    console.log(`${messages.currentDir} ${process.cwd()}`);
}