class RequestTo {

    static DYNAMIC_REQUEST_PREFIX = "?";

    /**
     * @param {String} uri
     */
    constructor (uri) {
        this.request = new Request(RequestTo.DYNAMIC_REQUEST_PREFIX + uri);
    }

    /**
     * @param text
     * @returns {RequestTo}
     */
    sendingPlainText(text) {
        this.request.contentType = HttpProtocols.CONTENT_TYPES.plainText;
        this.request.body = text;
        return this;
    }

    /**
     * @returns {FutureResponse}
     */
    POST() {
        this.request.method = "POST";
        let promisedResponse = fetch(this.request);
        return new FutureResponse(promisedResponse);
    }
}