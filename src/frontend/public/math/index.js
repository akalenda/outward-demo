const MATH_URI = '/api/math';
const resultsField = document.getElementById('results');

try{
    document.getElementById('submitButton').onclick = function submitButtonClicked(ignored) {
        let mathExpression = this.value;
        if (expressionIsValid(mathExpression)) {
            haveServerEvaluate(mathExpression)
                .then(placeEvaluatedExpressionIn(resultsField))
                .catch(displayErrorsIn(resultsField))
            ;
        }
    };
}catch(error){
    displayErrorsIn(resultsField)(error);
}

/**
 * @param {String} expr
 * @returns {boolean}
 */
function expressionIsValid(expr) {
    // TODO: fill stub
    return true;
}

/**
 * @param {String} mathExpression
 * @returns {Promise<String>}
 */
function haveServerEvaluate(mathExpression) {
    return new RequestTo(MATH_URI)
        .sendingPlainText(mathExpression)
        .POST()
        .receivePlainText()
    ;
}

/**
 * @param {HTMLElement} htmlElement
 * @returns {(function(String): PromiseLike)}
 */
function placeEvaluatedExpressionIn(htmlElement){
    return evaluatedExpr => {
        htmlElement.innerText = evaluatedExpr;
        htmlElement.style.color = undefined;
    };
}

/**
 * @param {HTMLElement} htmlElement
 * @returns {(function(String): PromiseLike)}
 */
function displayErrorsIn(htmlElement) {
    return error => {
        htmlElement.innerText = error;
        htmlElement.style.color = 'darkred';
    };
}