const Cryptographer = require('./Cryptographer');
const Database = require('./Database');
const InternalCache = require('./InternalCache');

const SECONDS_PER_MINUTE = 60;
const LOGIN_EXPIRY = 10 * SECONDS_PER_MINUTE;
const usersCurrentyLoggedIn = new InternalCache(LOGIN_EXPIRY);
const loginDatabase = Database;

class Login {

    /**
     * @param {String} key
     * @returns {Login | null}
     */
    static getByKey(key) {
        return usersCurrentyLoggedIn.getAndRefresh(key);
    }

    /**
     * @param {String} username
     */
    constructor(username) {
        this._username = username;
        this._isLoggedIn = false;
    }

    /**
     * @returns {Login}
     */
    async attemptLogin(givenPassword) {
        let salt = await loginDatabase.getSalt(this._username);
        let givenEncryptedPassword = Cryptographer.encrypt(givenPassword, salt);
        let storedEncryptedPassword = await loginDatabase.getPassword(this._username);
        if (Cryptographer.slowEquals(givenEncryptedPassword, storedEncryptedPassword)) {
            this._key = Cryptographer.sha512(this._username);  // TODO: Should we use the heavy-duty encryption for this too?
            usersCurrentyLoggedIn.stash(this._key, this);
            this._isLoggedIn = true;
            return this;
        }
        return this;
    }

    /**
     * @returns {Login}
     */
    logout() {
        this._isLoggedIn = false;
        if (this._key){
            usersCurrentyLoggedIn.remove(this._key);
        }
        return this;
    }

    /**
     * @returns {String}
     */
    getKey() {
        return this._key;
    }

    getExpirationDate() {
        return usersCurrentyLoggedIn.refreshAndGetExpirationDate(this._key);
    }
}

module.exports = Login;