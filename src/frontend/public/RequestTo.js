class RequestTo {

    /**
     * @param {String} uri
     */
    constructor (uri) {
        this._uri = uri;
        this._details = {};
    }

    /**
     * @param text
     * @returns {RequestTo}
     */
    sendingPlainText(text) {
        this._details.contentType = HttpProtocols.CONTENT_TYPES.plainText;
        this._details.body = text;
        return this;
    }

    /**
     * @returns {FutureResponse}
     */
    POST() {
        this._details.method = "POST";
        let promisedResponse = fetch(this._uri, this._details);
        return new FutureResponse(promisedResponse);
    }
}