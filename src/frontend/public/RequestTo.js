class RequestTo {

    /**
     * @param {String} uri
     */
    constructor (uri) {
        this._uri = uri;
        this._details = {
            headers: {}
        };
    }

    /**
     * @param text
     * @returns {RequestTo}
     */
    sendingPlainText(text) {
        // TODO: Ugh, this hack! Figure out how to configure koa-bodyparser to parse the plaintext!
        //this._details.headers["Content-Type"] = HttpProtocols.CONTENT_TYPES.plainText;
        //this._details.body = text;
        this.sendingJson({text: text});
        return this;
    }

    /**
     * @param {Object} obj
     * @returns {RequestTo}
     */
    sendingJson(obj) {
        this._details.headers["Content-Type"] = HttpProtocols.CONTENT_TYPES.json;
        this._details.body = JSON.stringify(obj);
        return this;
    }

    /**
     * @returns {FutureResponse}
     */
    POST() {
        this._details.method = "POST";
        let request = new Request(this._uri, this._details);
        let promisedResponse = fetch(request);
        return new FutureResponse(promisedResponse);
    }
}