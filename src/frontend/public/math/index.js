const MATH_URI = '/api/math';
const resultsField = document.getElementById('results');
const submitButton = document.getElementById('submitButton');
const mathExprInput = document.getElementById('mathExpr');

try{
    submitButton.onclick = function submitButtonClicked(ignored) {
        submitMathExpressionToServer()
    };
    mathExprInput.addEventListener('keyup', function(event){
        if (event.key === "Enter"){
            submitMathExpressionToServer();
        }
    });
}catch(error){
    displayErrorsIn(resultsField)(error);
}

function submitMathExpressionToServer() {
    let mathExpression = mathExprInput.value;
    if (expressionIsValid(mathExpression)) {
        haveServerEvaluate(mathExpression)
            .then(placeEvaluatedExpressionIn(resultsField))
            .catch(displayErrorsIn(resultsField))
        ;
    }
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