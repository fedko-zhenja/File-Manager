import { createExitMessage } from "./utils/exitMessage.js";
import { createGreetingMessage } from "./utils/greetingMessage.js";
import { getUserName } from "./utils/userName.js";
import { commandNamesArray } from "./data/comandNames.js";
import { createIncorrectMessage } from "./utils/incorrectMessage.js";

export class FileManager {
    constructor() {
        this.userName = getUserName();

        createGreetingMessage(this.userName);

        process.stdin.on('data', async (data) => {
            const userCommand = data.toString().toLowerCase().trim();
            this.commandListener(userCommand);
        })

        process.on('SIGINT', () => {
            this.exit();
        });
    }

    commandListener = (command) => {
        commandNamesArray.includes(command) ? this[command]() : createIncorrectMessage(); 
    }

    exit = () => {
        createExitMessage(this.userName);
    }
}