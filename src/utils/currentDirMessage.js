import { messages } from "../data/messages.js";

export function createCurrentDirMessage (currentDirectory) {
    const terminalWidth = process.stdout.columns;
    const horizontalLine = '—'.repeat(terminalWidth);

    console.log('\x1b[34m%s\x1b[0m', `\n${messages.currentDir} ${currentDirectory}\n${horizontalLine}`);
}