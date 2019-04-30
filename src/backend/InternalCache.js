const MILLISECONDS_PER_SECOND = 1000;

class InternalCache {

    /*
        Redis can be good for this sort of thing.
        Rolling our own proper-like, we'd have a MinHeap priority queue to track expiring entries.
        For this demo, though, we'll just have a simple map.
     */

    /**
     * @param {number} secondsToLive
     */
    constructor(secondsToLive) {
        this._secondsToLive = secondsToLive;
        this._continueFlushing = true;

        /**
         * @type {Map<String, Entry>}
         * @private
         */
        this._map = new Map();

        // noinspection JSIgnoredPromiseFromCall
        //this.startPeriodicFlushing(); TODO: Disabled because it messes with debugger step-through. Uncomment later.
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    stash(key, value) {
        this._map.set(key, new Entry(value, this._generateExpirationDate()));
    }

    /**
     * @param {string} key
     * @returns {* | undefined}
     */
    getAndRefresh(key) {
        let entry = this._map.get(key);
        if (entry) {
            this._refreshTimeOn(entry);
            return entry.value;
        }
        return undefined;
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        return this._map.get(key).value;
    }

    /**
     * @param {String} key
     * @returns {Date}
     */
    refreshAndGetExpirationDate(key){
        let entry = this._map.get(key);
        this._refreshTimeOn(entry);
        return entry.expirationDate;
    }

    /**
     * @param key
     * @returns {boolean}
     */
    remove(key) {
        return this._map.delete(key);
    }

    /**
     * @returns {Date}
     * @private
     */
    _generateExpirationDate() {
        let time = (new Date().getTime()) + (this._secondsToLive * MILLISECONDS_PER_SECOND);
        return new Date(time);
    }

    async startPeriodicFlushing() {
        // TODO: Depending on how long this takes, we may want to do it more frequently
        // It'd be a tradeoff. More frequent flushes means smaller batches, but more context switches
        const millisecondsInterval = this._secondsToLive * MILLISECONDS_PER_SECOND;
        while (this._continueFlushing) {
            this._flushingService = setInterval(this._flushExpiredEntries, millisecondsInterval);
        }
    }

    _iterator() {
        return this._map[Symbol.iterator]();
    }

    _flushExpiredEntries() {
        let keysToFlush = [];
        for (let key in this._iterator()) {
            if (this._map.hasOwnProperty(key)) {
                // I think there is a possibility the iterator could be compromised if we remove entries here
                // I'll play it safe and queue them to be removed afterward
                if (this._map.get(key).hasExpired()) {
                    keysToFlush.push(key);
                }
            }
        }
        keysToFlush.forEach(this.remove);  // TODO: double-check that `this` binds to the InternalCache
    }

    stopPeriodicFlushing(){
        this._continueFlushing = false;
        clearTimeout(this._flushingService);
    }

    _refreshTimeOn(entry){
        entry.expirationDate = this._generateExpirationDate();
    }
}

/**
 * @private
 */
class Entry {

    /**
     * @param {*} value
     * @param {Date} expirationDate
     */
    constructor(value, expirationDate){
        this.value = value;
        this.expirationDate = expirationDate;
    }

    /**
     * @returns {boolean}
     */
    hasExpired(){
        return this.expirationDate < new Date();
    }
}

module.exports = InternalCache;