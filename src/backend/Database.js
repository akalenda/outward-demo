const FakeDatabase = require('FakeDatabase');
const concreteDb = new FakeDatabase();

/**
 * This class would serve as an interface between our own app
 * and the API of some whatever database. As such, if the
 * database in use were to be changed, changes to the code
 * would largely be contained to this class.
 */
class Database {

    static async getPassword(username) {
        return await concreteDb.apiGet('passwordsByUser', username);
    }

    static async getSalt(username) {
        return await concreteDb.apiGet('saltsByUser', username);
    }

    static async saltIsFound(salt) {
        return await !!concreteDb.apiGet('usersBySalt', salt);
    }
}

module.exports = Database;