export function createGreetingMessage () {
    const userNameArray = process.argv
        .filter((el) => el.includes('--username='))
        .map((el) => el.replace('--username=', ''));

    const userName = userNameArray[0] ?? 'Stranger';

    console.log(`Welcome to the File Manager, ${userName}!`);
}