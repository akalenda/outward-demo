class BinaryTree {

    constructor(leftChild, data, rightChild) {
        this.leftChild = leftChild;
        this.data = data;
        this.rightChild = rightChild;
    }

    toString() {
        let stringBuilder = [];
        this.traverse(null, node => stringBuilder.push(node.data.toString()), null);
        return stringBuilder.join(' ');
    }

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