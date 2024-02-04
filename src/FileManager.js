import { createExitMessage } from "./utils/exitMessage.js";
import { createGreetingMessage } from "./utils/greetingMessage.js";
import { getUserName } from "./utils/userName.js";
import { createIncorrectMessage } from "./utils/incorrectMessage.js";
import { createCurrentDirMessage } from "./utils/currentDirMessage.js";
import { createFailedMessage } from "./utils/failedMessage.js";
import fs from 'fs/promises';
import path from 'node:path';

export class FileManager {
    constructor() {
        this.userName = getUserName();
        this.currentDir = process.cwd();

        createGreetingMessage(this.userName);

        process.stdin.on('data', async (data) => {
            const userCommand = data.toString().toLowerCase().trim();
            this.commandListener(userCommand);
        })

        process.on('SIGINT', () => {
            this.exit();
        });

        this.commands = {
            exit: this.exit,
            // 'up', 
            // 'cd', 
            ls: this.ls,
            // 'cat', 
            // 'add', 
            // 'rn', 
            // 'cp', 
            // 'mv', 
            // 'rm', 
            // 'os', 
            // 'hash', 
            // 'compress', 
            // 'decompress'
        }
    }

    commandListener = async (userCommand) => {
        const command = this.commands[userCommand];
        command ? await command() : createIncorrectMessage();
        createCurrentDirMessage();
    }

    exit = () => {
        createExitMessage(this.userName);
    }

    ls = async () => {
        try {
            const filesAndDirsArr = await fs.readdir(this.currentDir);
 
            const sortedItemArray = (await Promise.all(
                filesAndDirsArr.map(async (el) => {
                    const elPath = path.join(this.currentDir, el);
                    const elStats = await fs.stat(elPath);
            
                    return {
                        name: el,
                        type: elStats.isDirectory() ? 'directory' : 'file',
                    };
              })
            )).sort((a, b) => {
                if (a.type !== b.type) {
                    return a.type === 'directory' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
            console.table(sortedItemArray);
        } catch (error) {
            createFailedMessage();
        }
    }
}