const FakeDatabase = require('./FakeDatabase');

/**
 * This class would serve as an interface between our own app
 * and the API of some whatever database. As such, if the
 * database in use were to be changed, changes to the code
 * would largely be contained to this class.
 */
module.exports = {

    /**
     * @param {string} username
     * @returns {Promise<String>}
     */
    async getPassword(username) {
        return await FakeDatabase.apiGet('passwordsByUser', username);
    },

    /**
     * @param {string} username
     * @returns {Promise<String>}
     */
    async getSalt(username) {
        return await FakeDatabase.apiGet('saltsByUser', username);
    },

    /**
     * @param salt
     * @returns {Promise<boolean>}
     */
    async saltIsFound(salt) {
        return !!(await FakeDatabase.apiGet('usersBySalt', salt));
    },

    /**
     * @param {string} username
     * @param {string} salt
     * @returns {Promise<boolean>}
     */
    async storeSalt(username, salt) {
        let booleanPromise1 = FakeDatabase.apiPut('saltsByUser', username, salt);
        let booleanPromise2 = FakeDatabase.apiPut('usersBySalt', salt, username);
        let ok1 = await booleanPromise1;
        let ok2 = await booleanPromise2;
        return isBoolean(ok1) && isBoolean(ok2);
    },

    /**
     * @param username
     * @param encryptedPassword
     * @returns {Promise<boolean>}
     */
    async storeEncryptedPassword(username, encryptedPassword) {
        let oldValueWasReplaced = await FakeDatabase.apiPut('passwordsByUser', username, encryptedPassword);
        return isBoolean(oldValueWasReplaced);  // replaced or not, the value was stored
    }
};

function isBoolean(value) {
    return value === true || value === false;
}