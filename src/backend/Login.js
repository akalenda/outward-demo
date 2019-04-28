const Cryptographer = require('Cryptographer');
const FakeDatabase = require('./FakeDatabase');

const SECONDS_PER_MINUTE = 60;
const LOGIN_EXPIRY = 10 * SECONDS_PER_MINUTE;
const usersCurrentyLoggedIn = new Cache(LOGIN_EXPIRY);

class Login {

    static database = new FakeDatabase();

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
        this._encryptedPassword = Cryptographer.encrypt(password);
        this._isLoggedIn = false;
    }

    /**
     * @returns {Login}
     */
    attemptLogin() {
        let storedEncryptedPassword = Login.database.getValueFor(this._username);
        if (storedEncryptedPassword === this._encryptedPassword) {
            this._key = Cryptographer.encrypt(this._username);
            usersCurrentyLoggedIn.put(this._key, this);
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
}

module.exports = Login;