class InternalCache {

    /*
        Redis can be good for this sort of thing.
        Rolling our own proper-like, we'd have a MinHeap priority queue to track expiring entries.
        For this demo, though, we'll just have a simple map.
     */

    constructor(secondsToLive) {

    }

    stash(key, value) {

    }

    getAndRefresh(key) {

    }

    get(key) {

    }

    remove(key) {

    }
}

module.exports = InternalCache;