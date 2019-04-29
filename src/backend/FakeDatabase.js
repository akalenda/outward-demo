const tables = {
    'passwordsByUser': {},
    'saltsByUser': {},
    'usersBySalt': {}
};

function simulateQueryTime(milliseconds, resolve) {
    return new Promise(function(resolve) {
        setTimeout(resolve, milliseconds);
    });
}

/**
 * For demo purposes.
 *
 * One protection that isn't on display in all of this, by the way, is
 * in our backend having different "users" with different permissions:
 * One that's used to create or update passwords, and one that reads
 * passwords (for checking logins). This mitigates the damage a SQL
 * injection might cause, by making it unlikely that malware can
 * change passwords.
 */

class FakeDatabase {

    /**
     * @param {String} tableName
     * @param {String} primaryKey
     * @returns {Promise<*>}
     */
    apiGet(tableName, primaryKey) {
        return simulateQueryTime(20, () => tables[tableName][primaryKey]);
    }

    /**
     * @param {string} tableName
     * @param {string} primaryKey
     * @param {*} value
     * @returns {Promise<*>}
     */
    apiPut(tableName, primaryKey, value) {
        return simulateQueryTime(20, () => tables[tableName][primaryKey] = value);
    }
}

module.exports = FakeDatabase;