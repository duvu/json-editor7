class TreeNode {
    key: string;
    value: object;
    parent: object;
    children: Array<TreeNode>;

    constructor(key, value = key, parent = null) {
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = [];
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }
}

class Tree {
    root: TreeNode;

    constructor(key, value = key) {
        this.root = new TreeNode(key, value);
    }

    // implement pre-order traversal for the tree by using generator function
    *_traversal(node = this.root) {
        yield node;
        if (node.children.length > 0) {
            for (let child of node.children) {
                yield* this._traversal(child);
            }
        }
    }

    insert(parentNodeKey, key, value = key) {
        for (let node of this._traversal()) {
            if (node.key === parentNodeKey) {
                node.children.push(new TreeNode(key, value, node));
                return true;
            }
        }
        return false;
    }

    remove(key) {
        for (let node of this._traversal()) {
            const filtered = node.children.filter(x => x.key !== key);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    find(key) {
        for (let node of this._traversal()) {
            if (node.key === key) return node;
        }
        return undefined;
    }
}
export default Tree;
