import { messages } from "../data/messages.js";

export function createCurrentDirMessage () {
    console.log('\x1b[34m%s\x1b[0m', `\n${messages.currentDir} ${process.cwd()}\n`);
}