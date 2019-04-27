class FutureResponse {

    /**
     * @param {Promise<Response>} responsePromise
     */
    constructor (responsePromise) {
        this.responsePromise = responsePromise;
    }

    /**
     * @returns {Promise<String>}
     */
    receivePlainText() {
        return this.responsePromise.then(response => response.text());
    }
}