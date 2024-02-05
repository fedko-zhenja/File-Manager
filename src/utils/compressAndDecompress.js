import fs from 'fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from "fs";
import zlib from 'node:zlib';
import { createFailedMessage } from './failedMessage.js';
import { createCurrentDirMessage } from './currentDirMessage.js';

export async function compressAndDecompress (currentDirectory, args, operationName) {
    const filePath = path.resolve(currentDirectory, args[0]);
    const folderPath = path.resolve(currentDirectory, args[1]);

    try {
        await fs.access(filePath);
        await fs.access(folderPath).catch(() => fs.writeFile(folderPath, ''));

        const readStream = createReadStream(filePath);
        const writeStream = createWriteStream(folderPath);
        const brotliStream = operationName === 'compress' ? zlib.createBrotliCompress() : zlib.createBrotliDecompress();

        brotliStream.on('error', (error) => {
            if (error.code === 'Z_BUF_ERROR') {
              console.error('\x1b[31m%s\x1b[0m', `The file is not a valid Brotli compressed file.`);
            } else {
              createFailedMessage(error);
            }
            createCurrentDirMessage(currentDirectory);
        });
    
        writeStream.on('error', (error) => {
            createFailedMessage(error);
            createCurrentDirMessage(currentDirectory);
        });

        readStream.pipe(brotliStream).pipe(writeStream);

        await new Promise((res, rej) => {
            writeStream.on('finish', res);
            writeStream.on('error', rej);
        })
    } catch (error) {
        createFailedMessage(error);
    }
}