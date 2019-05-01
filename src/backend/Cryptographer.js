/*
    The trouble with using 3rd-party libraries for crypto like this is that you need
    to review them every single time there's an update to the library.
 */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Database = require('./Database');

const SALT_ROUNDS = 10;

module.exports = {

    async generateUniqueSalt() {
        let prospectiveSalt = this.makeSalt();
        let saltIsFound = await Database.saltIsFound(prospectiveSalt);
        while (saltIsFound) {
            prospectiveSalt = this.makeSalt();
            saltIsFound = await Database.saltIsFound(prospectiveSalt);
        }
        return prospectiveSalt;
    },

    /**
     * @returns {Promise<String>}
     */
    makeSalt() {
        return bcrypt.genSalt(SALT_ROUNDS).then();
    },

    /**
     * TODO: Keyed hashes as well: https://en.wikipedia.org/wiki/HMAC
     *
     * @param {String} str
     * @param {String} salt
     * @returns {Promise<String>}
     */
    encrypt(str, salt) {
        let normalizedStr = this.sha512(salt + str);
        return this.bcrypt(normalizedStr, salt);
        // TODO: I feel there is a danger here in which either of these
        // can have a character changed to the end-of-string character,
        // incorrectly terminating subsequent operations on the string and
        // therefore having the possibility that two different passwords
        // produce the same encrypted result. We should probably convert it
        // to a byte array before encrypting, and then base64-encode
        // that byte array. I think that would avoid the problem...?

    },

    /**
     * @param str
     * @returns {string}
     */
    sha512(str) {
        const hash = crypto.createHash('sha512');
        return hash.digest('hex');
    },

    /**
     * @param str
     * @param salt
     * @returns {Promise<String>}
     */
    async bcrypt(str, salt) {
        return bcrypt.hash(str, salt).then()
    },

    /**
     * When comparing sensitive information such as passwords, we want to be
     * as consistent as possible in how much time the process takes. Otherwise,
     * a malefactor can examine the timing of requests and gain insight into
     * how data flows through the program.
     *
     * @param {String} str1
     * @param {String} str2
     * @returns {boolean}
     */
    slowEquals(str1, str2) {
        let diff = str1.length ^ str2.length;
        for(let i = 0; i < str1.length && i < str2.length; i++)
            diff = diff | (str1.charCodeAt(i) ^ str2.charCodeAt(i));
        return diff === 0;
    }
};
