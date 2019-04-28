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
        this._map = {};
        this._continueFlushing = true;
    }

    /**
     * @param {string} key
     * @param {*} value
     */
    stash(key, value) {
        this._map[key] = new Entry(value, this._generateExpirationTime());
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    getAndRefresh(key) {
        let entry = this._map[key];
        entry.setTime(this._generateExpirationTime());
        return entry.value;
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        return this._map[key].value;
    }

    /**
     * @param key
     * @returns {boolean}
     */
    remove(key) {
        return this._map.delete(key);
    }

    /**
     * @returns {number}
     * @private
     */
    _generateExpirationTime() {
        return (new Date().getTime()) + (this._secondsToLive * MILLISECONDS_PER_SECOND);
    }

    async _periodicallyFlushExpiredEntries() {
        // TODO: Depending on how long this takes, we may want to do it more frequently
        // It'd be a tradeoff. More frequent flushes means smaller batches, but more context switches
        const millisecondsInterval = this._secondsToLive * MILLISECONDS_PER_SECOND;
        while (this._continueFlushing) {
            this._flushingService = setTimeout(this._flushExpiredEntries(), millisecondsInterval);
            await this._flushingService;
        }
    }

    _flushExpiredEntries() {
        let keysToFlush = [];
        for (let key in this._map) {
            if (this._map.hasOwnProperty(key)) {
                // I think there is a possibility the iterator could be compromised if we remove entries here
                // I'll play it safe and queue them to be removed afterward
                if (this._map[key].hasExpired()) {
                    keysToFlush.push(key);
                }
            }
        }
        keysToFlush.forEach(this.remove);  // TODO: double-check that `this` binds to the InternalCache
    }

    shutDownBackgroundProcesses() {
        this._continueFlushing = false;
        clearTimeout(this._flushingService);
    }
}

/**
 * @private
 */
class Entry {

    /**
     * @param {*} value
     * @param {Number} expirationTime
     */
    constructor(value, expirationTime){
        this.value = value;
        this.expirationTime = expirationTime;
    }

    /**
     * @returns {boolean}
     */
    hasExpired(){
        return this.expirationTime > (new Date().getTime());
    }
}

module.exports = InternalCache;