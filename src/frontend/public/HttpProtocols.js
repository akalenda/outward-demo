let HTTP_PROTOCOLS = {
    CONTENT_TYPES: {
        plainText: "text/plain",
        json: "application/json",
        html: 'text/html',
        js: 'application/js'
    }
};

try {
    module.exports = HTTP_PROTOCOLS;  // Node JS
} catch(ignoredReferenceError) {
    HttpProtocols = HTTP_PROTOCOLS;  // Browser JS
}