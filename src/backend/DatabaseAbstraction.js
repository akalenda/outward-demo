const FakeDatabase = require('./FakeDatabase');
const concreteDb = new FakeDatabase();

/**
 * This class would serve as an interface between our own app
 * and the API of some whatever database. As such, if the
 * database in use were to be changed, changes to the code
 * would largely be contained to this class.
 */

export async function storeEncryptedPassword(username, encryptedPassword) {
    return await concreteDb.apiPut('passwordsByUser', username, encryptedPassword);
}

export async function storeSalt(username, salt) {
    let isSuccess1 = await concreteDb.apiPut('saltsByUser', username, salt);
    let isSuccess2 = await concreteDb.apiPut('usersBySalt', salt, username);
    return isSuccess1 && isSuccess2;
}

export async function getPassword(username) {
    return await concreteDb.apiGet('passwordsByUser', username);
}

export async function getSalt(username) {
    return await concreteDb.apiGet('saltsByUser', username);
}

export async function saltIsFound(salt) {
    return await !!concreteDb.apiGet('usersBySalt', salt);
}