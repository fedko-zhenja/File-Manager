import { createIncorrectMessage } from "./incorrectMessage.js";
import { EOL, homedir, arch, userInfo, cpus } from 'node:os';

export class OsInfo {
    constructor() {
        this.commands = {
            eol: this.eol,
            cpus: this.cpus,
            homedir: this.homedir,
            username: this.username,
            architecture: this.architecture
        }
    }

    commandListener = async (args) => {
        if (args[0].startsWith('--')) {
            const userCommand = args[0].toLowerCase().replace(/--/g, '');

            const command = this.commands[userCommand];
            command ? await command(userCommand) : createIncorrectMessage();
        } else {
            createIncorrectMessage();
        }
    }

    eol = () => {
        console.log(JSON.stringify(EOL));
    }

    cpus = () => {
        const cpusFunc = cpus();

        console.log(`\n\x1b[36mOverall amount of CPUs:\x1b[0m ${cpusFunc.length}\n`);

        cpusFunc.forEach((cpu, index) => {
            console.log(`\x1b[35mCPU ${index + 1}\x1b[0m - \x1b[36mmodel:\x1b[0m ${cpu.model} \x1b[36mspeed:\x1b[0m ${cpu.speed / 1000} GHz`)
        })
    }

    homedir = () => {
        console.log(homedir());
    }

    username = () => {
        console.log(userInfo().username);
    }

    architecture = () => {
        console.log(arch());
    }
}