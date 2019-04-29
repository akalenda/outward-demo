const BinaryTree = require('./BinaryTree');

class MathExpression extends BinaryTree {

    /**
     * TODO: Generalize to multiple operations per expression
     * @param {String} str
     * @returns {MathExpression}
     */
    static from(str) {
        let operatorBoundaryRegex = /(?<=[-+*/])|(?=[-+*/])/;
        let terms = str.split(operatorBoundaryRegex);

        let leftOperand = new MathExpression(null, Number(terms[0]), null);
        let operator = operatorStringToFunctor(terms[1]);
        let rightOperand = new MathExpression(null, Number(terms[2]), null);

        return new MathExpression(leftOperand, operator, rightOperand);
    }

    /**
     * @returns {number}
     */
    evaluate(){
        if (typeof this.data === 'function') {
            let operator = this.data;
            let leftOperand = this.leftChild.evaluate();
            let rightOperand = this.rightChild.evaluate();
            return operator(leftOperand, rightOperand);
        }
        return this.data;
    }
}

const SUM = (a, b) => a + b;
const SUBTRACT = (a, b) => a - b;
const MULTIPLY = (a, b) => a * b;
const DIVIDE = (a, b) => a / b;

/**
 * @param operatorAsString
 * @returns {function(number, number): number}
 */
function operatorStringToFunctor(operatorAsString) {
    switch(operatorAsString) {
        case '+': return SUM;
        case '-': return SUBTRACT;
        case '*': return MULTIPLY;
        case '/': return DIVIDE;
        default: throw new Error("Unsupported operator " + operatorAsString);
    }
}

module.exports = MathExpression;