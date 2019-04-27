const MATH_URI = '/proc';
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
 * @callback PromiseMapper
 * @param {String}
 * @returns {PromiseLike}
 */

/**
 * @param {HTMLElement} htmlElement
 * @returns {PromiseMapper}
 */
function placeEvaluatedExpressionIn(htmlElement){
    return evaluatedExpr => {
        htmlElement.innerText = evaluatedExpr;
        htmlElement.style.color = undefined;
    };
}

/**
 * @param {HTMLElement} htmlElement
 * @returns {PromiseMapper}
 */
function displayErrorsIn(htmlElement) {
    return error => {
        htmlElement.innerText = error;
        htmlElement.style.color = 'darkred';
    };
}