const Cryptographer = require('Cryptographer');
const Database = require('./Database');
const InternalCache = require('./InternalCache');

const SECONDS_PER_MINUTE = 60;
const LOGIN_EXPIRY = 10 * SECONDS_PER_MINUTE;
const usersCurrentyLoggedIn = new InternalCache(LOGIN_EXPIRY);

class Login {

    static database = Database;

    /**
     * @param {String} key
     * @returns {Login | null}
     */
    static getByKey(key) {
        return usersCurrentyLoggedIn.getAndRefresh(key);
    }

    /**
     * @param {String} username
     * @param {String} password
     */
    constructor(username, password) {
        this._username = username;
        this._salt = Login.database.getSalt(this._username);
        this._encryptedPassword = Cryptographer.encrypt(password, this._salt);
        this._isLoggedIn = false;
    }

    /**
     * @returns {Login}
     */
    attemptLogin() {
        let storedEncryptedPassword = Login.database.getPassword(this._username);
        if (Cryptographer.slowEquals(storedEncryptedPassword, this._encryptedPassword)) {
            this._key = Cryptographer.sha512(this._username);  // TODO: Should we use the heavy-duty encryption for this too?
            usersCurrentyLoggedIn.stash(this._key, this);
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
        return usersCurrentyLoggedIn.refreshAndGetExpirationDate(key);
    }
}

module.exports = Login;