
// PRODUCT NODE
class Node {
    constructor(product) {
        this.product = product;
        this.left = null;
        this.right = null;
    }
}

// BINARY SEARCH TREE
class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(product) {
        const newNode = new Node(product);

        if (!this.root) {
            this.root = newNode;
            return true;
        }

        let current = this.root;

        while (true) {
            if (product.id === current.product.id) {
                return false;
            }

            if (product.id < current.product.id) {
                if (!current.left) {
                    current.left = newNode;
                    return true;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return true;
                }
                current = current.right;
            }
        }
    }

    search(id) {
        let current = this.root;

        while (current) {
            if (id === current.product.id) {
                return current.product;
            }

            current = id < current.product.id
                ? current.left
                : current.right;
        }

        return null;
    }

    inorder(node = this.root, result = []) {
        if (node) {
            this.inorder(node.left, result);
            result.push(node.product);
            this.inorder(node.right, result);
        }
        return result;
    }

    preorder(node = this.root, result = []) {
        if (node) {
            result.push(node.product);
            this.preorder(node.left, result);
            this.preorder(node.right, result);
        }
        return result;
    }

    postorder(node = this.root, result = []) {
        if (node) {
            this.postorder(node.left, result);
            this.postorder(node.right, result);
            result.push(node.product);
        }
        return result;
    }

    delete(id) {
        this.root = this.removeNode(this.root, id);
    }

    removeNode(node, id) {
        if (!node) return null;

        if (id < node.product.id) {
            node.left = this.removeNode(node.left, id);
        } else if (id > node.product.id) {
            node.right = this.removeNode(node.right, id);
        } else {
            // Case 1: No child
            if (!node.left && !node.right) return null;

            // Case 2: One child
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // Case 3: Two children
            let successor = node.right;

            while (successor.left) {
                successor = successor.left;
            }

            node.product = successor.product;
            node.right = this.removeNode(
                node.right,
                successor.product.id
            );
        }

        return node;
    }
}

// CREATE BST
const bst = new BinarySearchTree();

// PRELOADED SAMPLE PRODUCTS
const defaultProducts = [
    { id: 50, name: "Laptop", category: "Electronics", price: 55000, quantity: 10 },
    { id: 30, name: "Keyboard", category: "Accessories", price: 1200, quantity: 20 },
    { id: 70, name: "Smartphone", category: "Electronics", price: 25000, quantity: 15 },
    { id: 20, name: "Notebook", category: "Stationery", price: 80, quantity: 100 },
    { id: 40, name: "Mouse", category: "Accessories", price: 600, quantity: 30 },
    { id: 60, name: "Headphones", category: "Electronics", price: 1800, quantity: 25 },
    { id: 80, name: "Office Chair", category: "Furniture", price: 4500, quantity: 12 },
    { id: 35, name: "USB Cable", category: "Accessories", price: 250, quantity: 40 }
];

// SAVE DATA
function saveData() {
    localStorage.setItem(
        "products",
        JSON.stringify(bst.inorder())
    );
}

// LOAD DATA
function loadData() {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
        JSON.parse(savedProducts).forEach(product => {
            bst.insert(product);
        });
    } else {
        defaultProducts.forEach(product => {
            bst.insert(product);
        });
        saveData();
    }
}

// DISPLAY PRODUCTS
function render() {
    const products = bst.inorder();

    const table = document.getElementById("productTable");

    table.innerHTML = "";

    products.forEach(product => {
        table.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price.toLocaleString("en-IN")}</td>
                <td>${product.quantity}</td>
                <td>
                    <button class="action-btn edit-btn"
                        onclick="editProduct(${product.id})">
                        Edit
                    </button>

                    <button class="action-btn delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalProducts").innerText =
        products.length;

    document.getElementById("totalStock").innerText =
        products.reduce((sum, p) => sum + p.quantity, 0);

    const totalValue = products.reduce(
        (sum, p) => sum + p.price * p.quantity, 0
    );

    document.getElementById("totalValue").innerText =
        "₹" + totalValue.toLocaleString("en-IN");

    displayTree();
}

// ADD PRODUCT
document.getElementById("productForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        const product = {
            id: Number(document.getElementById("productId").value),
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("category").value.trim(),
            price: Number(document.getElementById("price").value),
            quantity: Number(document.getElementById("quantity").value)
        };

        if (!product.name || !product.category ||
            product.price < 0 || product.quantity < 0) {
            alert("Please enter valid product details.");
            return;
        }

        if (bst.search(product.id)) {
            alert("Product ID already exists!");
            return;
        }

        bst.insert(product);

        saveData();
        render();

        this.reset();

        alert("Product added successfully!");
    }
);

// SEARCH PRODUCT
function searchProduct() {
    const id = Number(document.getElementById("searchId").value);
    const product = bst.search(id);
    const result = document.getElementById("searchResult");

    if (product) {
        result.innerHTML = `
            <strong>Product Found!</strong><br>
            ID: ${product.id}<br>
            Name: ${product.name}<br>
            Category: ${product.category}<br>
            Price: ₹${product.price}<br>
            Quantity: ${product.quantity}
        `;
    } else {
        result.innerHTML = "Product not found!";
    }
}

// DELETE PRODUCT
function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        bst.delete(id);
        saveData();
        render();
        alert("Product deleted successfully!");
    }
}

// EDIT PRODUCT
function editProduct(id) {
    const product = bst.search(id);

    if (!product) return;

    const name = prompt("Enter Product Name:", product.name);
    if (name === null) return;

    const category = prompt("Enter Category:", product.category);
    if (category === null) return;

    const price = prompt("Enter Price:", product.price);
    if (price === null) return;

    const quantity = prompt("Enter Quantity:", product.quantity);
    if (quantity === null) return;

    const newPrice = Number(price);
    const newQuantity = Number(quantity);

    if (!name.trim() || !category.trim() ||
        price.trim() === "" || quantity.trim() === "" ||
        !Number.isFinite(newPrice) || !Number.isFinite(newQuantity) ||
        newPrice < 0 || newQuantity < 0) {
        alert("Please enter valid details.");
        return;
    }

    product.name = name.trim();
    product.category = category.trim();
    product.price = newPrice;
    product.quantity = newQuantity;

    saveData();
    render();

    alert("Product updated successfully!");
}

// BST TRAVERSAL
function showTraversal(type) {
    let result = [];

    if (type === "inorder") {
        result = bst.inorder();
    } else if (type === "preorder") {
        result = bst.preorder();
    } else {
        result = bst.postorder();
    }

    const output = result.map(p => p.id).join(" → ");

    document.getElementById("traversalResult").innerHTML =
        `<strong>${type.toUpperCase()} Traversal:</strong><br>${output}`;
}

// DISPLAY BST STRUCTURE
function displayTree() {
    const container = document.getElementById("treeDisplay");

    container.innerHTML = "";

    if (!bst.root) {
        container.innerText = "No products available.";
        return;
    }

    const queue = [bst.root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const level = document.createElement("div");

        level.className = "tree-level";

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();

            const circle = document.createElement("span");
            circle.className = "tree-node";
            circle.textContent = node.product.id;

            circle.title = node.product.name;

            level.appendChild(circle);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        container.appendChild(level);
    }
}

// START APPLICATION
loadData();
render();
