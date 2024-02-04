import { createExitMessage } from "./utils/exitMessage.js";
import { createGreetingMessage } from "./utils/greetingMessage.js";
import { getUserName } from "./utils/userName.js";
import { createIncorrectMessage } from "./utils/incorrectMessage.js";
import { createCurrentDirMessage } from "./utils/currentDirMessage.js";
import { createFailedMessage } from "./utils/failedMessage.js";
import fs from 'fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';

export class FileManager {
    constructor() {
        this.userName = getUserName();
        this.currentDirectory = homedir();
        // this.homeDirectory = homedir();
        // console.log('homeDirectory', this.homeDirectory)

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
            up: this.up,
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
        createCurrentDirMessage(this.currentDirectory);
    }

    up = () => {
        const parentDirectory = path.resolve(this.currentDirectory, '..');

        if (parentDirectory !== this.currentDirectory) {
            this.currentDirectory = parentDirectory;
        }
    }

    exit = () => {
        createExitMessage(this.userName);
    }

    ls = async () => {
        try {
            const filesAndDirsArr = await fs.readdir(this.currentDirectory);
 
            const sortedItemArray = (await Promise.all(
                filesAndDirsArr.map(async (el) => {
                    const elPath = path.join(this.currentDirectory, el);
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
            createFailedMessage(error);
        }
    }
}