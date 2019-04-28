class BinaryTree {

    /**
     * @param {BinaryTree} leftChild
     * @param {*} data
     * @param {BinaryTree} rightChild
     */
    constructor(leftChild, data, rightChild) {
        this.leftChild = leftChild;
        this.data = data;
        this.rightChild = rightChild;
    }

    /**
     * @returns {string}
     */
    toString() {
        let stringBuilder = [];
        this.traverse(null, node => stringBuilder.push(node.data.toString()), null);
        return stringBuilder.join(' ');
    }

    /**
     * @param {function(BinaryTree)} preorderOp
     * @param {function(BinaryTree)} inorderOp
     * @param {function(BinaryTree)} postorderOp
     */
    traverse(preorderOp, inorderOp, postorderOp) {
        function recurse(currentNode) {
            if (currentNode) {
                if (preorderOp)
                    preorderOp(currentNode);
                recurse(currentNode.leftChild);
                if (inorderOp)
                    inorderOp(currentNode);
                recurse(currentNode.rightChild);
                if (postorderOp)
                    postorderOp(currentNode);
            }
        }
        recurse(this);
    }
}

module.exports = BinaryTree;