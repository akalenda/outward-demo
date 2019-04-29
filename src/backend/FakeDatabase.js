const tables = {
    'passwordsByUser': {},
    'saltsByUser': {},
    'usersBySalt': {}
};

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

module.exports = {

    /**
     * @param {String} tableName
     * @param {String} primaryKey
     * @returns {Promise<*>}
     */
    apiGet(tableName, primaryKey) {
        return new Promise(resolve => {
            resolve();
            return tables[tableName][primaryKey];
        });
    },

    /**
     * @param {string} tableName
     * @param {string} primaryKey
     * @param {*} value
     * @returns {Promise<*>}
     */
    apiPut(tableName, primaryKey, value) {
        return new Promise(resolve => {
            resolve();
            let isBeingReplaced = tables[tableName][primaryKey];
            tables[tableName][primaryKey] = value;
            return isBeingReplaced;
        });
    }
};