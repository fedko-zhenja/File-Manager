import { createExitMessage } from "./utils/exitMessage.js";
import { createGreetingMessage } from "./utils/greetingMessage.js";
import { getUserName } from "./utils/userName.js";
import { createIncorrectMessage } from "./utils/incorrectMessage.js";
import { createCurrentDirMessage } from "./utils/currentDirMessage.js";
import { createFailedMessage } from "./utils/failedMessage.js";
import fs from 'fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
import { createReadStream, createWriteStream } from "fs";
import { messages } from "./static/messages.js";
import { basename, resolve } from "path";
import { OsInfo } from "./utils/osInfo.js";
import crypto from 'node:crypto';
import zlib from 'node:zlib';

export class FileManager {
    constructor() {
        this.userName = getUserName();
        this.currentDirectory = homedir();
        this.osInfo = new OsInfo();
        // this.homeDirectory = homedir();
        // console.log('homeDirectory', this.homeDirectory)

        createGreetingMessage(this.userName);

        process.stdin.on('data', async (data) => {
            const userCommand = data.toString().toLowerCase().trim();
            
            const [command, ...args] = userCommand.split(' ');
            // console.log(command, args);
            this.commandListener(command, args);
        })

        process.on('SIGINT', () => {
            this.exit();
        });

        this.commands = {
            exit: this.exit,
            up: this.up,
            cd: this.cd,
            ls: this.ls,
            cat: this.cat,
            add: this.add,
            rn: this.rn,
            cp: this.cp, 
            mv: this.mv,
            rm: this.rm,
            os: this.os,
            hash: this.hash,
            compress: this.compress,
            decompress: this.decompress,
        }
    }

    commandListener = async (userCommand, args) => {
        const command = this.commands[userCommand];
        command ? await command(args) : createIncorrectMessage();

        createCurrentDirMessage(this.currentDirectory);
    }

    compress = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);
        const folderPath = path.resolve(this.currentDirectory, args[1]);

        try {
            await fs.access(filePath);
            await fs.access(folderPath).catch(() => fs.writeFile(folderPath, ''));

            const readStream = createReadStream(filePath);
            const writeStream = createWriteStream(folderPath);
            const brotliStream = zlib.createBrotliCompress();

            readStream.pipe(brotliStream).pipe(writeStream);

            await new Promise((res, rej) => {
                writeStream.on('finish', res);
                writeStream.on('error', rej);
            })
        } catch (error) {
            createFailedMessage(error);
        }
    }

    decompress = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);
        const folderPath = path.resolve(this.currentDirectory, args[1]);

        try {
            await fs.access(filePath);
            await fs.access(folderPath).catch(() => fs.writeFile(folderPath, ''));

            const readStream = createReadStream(filePath);
            const writeStream = createWriteStream(folderPath);
            const brotliStream = zlib.createBrotliDecompress();

            readStream.pipe(brotliStream).pipe(writeStream);

            await new Promise((res, rej) => {
                writeStream.on('finish', res);
                writeStream.on('error', rej);
            })
        } catch (error) {
            createFailedMessage(error);
        }
    }

    hash = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);

        try {
            await fs.access(filePath);

            const hash = crypto.createHash('sha256');
            const fileData = await fs.readFile(filePath);

            hash.update(fileData);

            const finalHash = hash.digest('hex');
            console.log(finalHash);
        } catch (error) {
            createFailedMessage(error);
        }
    }

    os = (args) => {
        this.osInfo.commandListener(args);
    }

    mv = async (args) => {
        try {
            const resalt = await this.cp(args);
            resalt.isError ? null : await this.rm([args[0]]);
        } catch (error) {
            console.log(1)
            createFailedMessage(error);
        }
    }

    rm = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);

        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
        } catch (error) {
            createFailedMessage(error);
        }
    }

    cp = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);
        const folderPath = path.resolve(this.currentDirectory, args[1]);
        const resalt = {isError: false};

        try {
            await fs.access(filePath);
            await fs.access(folderPath);

            const copyFile = path.resolve(folderPath, basename(filePath))
            
            await new Promise((resolve, reject) => {
                const readStream = createReadStream(filePath);
                const writeStream = createWriteStream(copyFile);
    
                readStream.pipe(writeStream);
    
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
        } catch (error) {
            createFailedMessage(error);
            resalt.isError = true;
        } finally {
            return resalt;
        }
    }

    rn = async (args) => {
        const oldFile = path.resolve(this.currentDirectory, args[0]);
        const newFile = path.resolve(this.currentDirectory, args[1]);

        try {
            await fs.access(newFile); 
            createFailedMessage(messages.fileExists);
        } catch {
            try {
                await fs.access(oldFile);
                await fs.rename(oldFile, newFile);
            } catch(error) {
                createFailedMessage(error); 
            }
        }
    }

    add = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);
        await fs.writeFile(filePath, '');
    }

    cat = async (args) => {
        const filePath = path.resolve(this.currentDirectory, args[0]);

        try {
            await fs.access(filePath);
            
            const readStream = createReadStream(filePath);

            const dataPromise = new Promise((resolve) => {
                readStream.on('data', (chunk) => {
                    process.stdout.write(chunk);
                });
    
                readStream.on('end', () => {
                    resolve();
                });
            });
    
            await dataPromise;
            
        } catch(error) {
            createFailedMessage(error);
        }
    }

    cd = async (args) => {
        const newPath = path.resolve(this.currentDirectory, args[0]);

        try {
            await fs.access(newPath);
            this.currentDirectory = newPath;
        } catch(error) {
            createFailedMessage(error);
        }
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