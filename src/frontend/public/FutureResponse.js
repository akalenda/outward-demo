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

    redirect() {
        return this.responsePromise.then(response => {
            if (response.redirected === true) {
                window.location.replace(response.url)
            }
        })
    }
}