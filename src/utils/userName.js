export function getUserName () {
    const userNameArray = process.argv
        .filter((el) => el.includes('--username='))
        .map((el) => el.replace('--username=', ''));

    const userName = userNameArray[0] ?? 'Stranger';

    return userName;
}