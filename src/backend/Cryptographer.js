const Database = require('./Database');

/*
    It's generally a bad idea to roll your own password-hiding libraries like this...
    But this is a demo after all
 */
class Cryptographer {

    static generateUniqueSalt() {
        let prospectiveSalt = Cryptographer.makeSalt();
        while (Database.saltIsFound(prospectiveSalt)) {
            prospectiveSalt = Cryptographer.makeSalt();
        }
        return prospectiveSalt;
    }

    static makeSalt(length=512) {
        // TODO: https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator
        // For now, we just want to get the program working to some extent. This will do for now...
        return "" + Math.random();
    }

    /**
     * TODO: Keyed hashes as well: https://en.wikipedia.org/wiki/HMAC
     *
     * @param {String} str
     * @param {String} salt
     * @returns {String}
     */
    static encrypt(str, salt) {
        let normalizedStr = Cryptographer.sha512(salt + str);
        let finalStr = Cryptographer.bcrypt(normalizedStr);
        // TODO: I feel there is a danger here in which either of these
        // can have a character changed to the end-of-string character,
        // incorrectly terminating subsequent operations on the string and
        // therefore having the possibility that two different passwords
        // produce the same encrypted result. We should probably convert it
        // to a byte array before encrypting, and then base64-encode
        // that byte array. I think that would avoid the problem...?
        return finalStr;

    }

    static sha512(str) {
        return undefined;
    }

    static bcrypt(str) {

    }

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
    static slowEquals(str1, str2) {
        let diff = str1.length ^ str2.length;
        for(let i = 0; i < str1.length && i < str2.length; i++)
            diff = diff | (str1.charCodeAt(i) ^ str2.charCodeAt(i));
        return diff === 0;
    }
}

module.export = Cryptographer;