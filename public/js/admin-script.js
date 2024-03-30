// Fetch Products from the Server
let categoriesDic = {};
function fetchProducts() {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => displayProducts(data))
        .catch(error => console.error('Error:', error));

}

// Handle Form Submission
function putProductSubmit(event) {
    event.preventDefault();
    const productData = {
        id: document.getElementById('product-id').value, // Empty for new products
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: document.getElementById('product-price').value,
        quantity: document.getElementById('quantity').value,
    };


    fetch(`/api/products/${productData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    })
    .then(() => {
        alert("Данные изменены");
        fetchProducts();
    })
    .catch(error => console.error('Error:', error));
}

// Edit Product
function editProduct(productId) {
    const products = prods;
    //for (let i = 0; i< products.)
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
    }
    window.scrollTo(0, 0);
}

// Delete Product
function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, { method: 'DELETE' })
        .then(() => fetchProducts())
        .catch(error => console.error('Error:', error));
}

// Display Products
function displayProducts(products) {
    prods = products;
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.style.marginBlock = "10px";
        productDiv.className += "border border-primary";

        productDiv.innerHTML = `
            <div class="d-flex position-relative">
              <img src="images/${product.image_url}" class="rounded float-start flex-shrink-0 me-3" style="height: 150px;width: 150px" alt="${product.image_url}">
              <div>
                <h5 class="mt-0">${product.name}</h5>
                <p>${product.description}</p>
                <p>${product.price} руб. - ${product.quantity} шт.</p>
                <a onclick="editProduct(${product.id})" class="btn btn-primary">Edit</a> <a onclick="deleteProduct(${product.id})" class="btn btn-danger">Delete</a>
              </div>
            </div>
        `;
        container.appendChild(productDiv);
    });
}

// Initial fetch of products
fetchProducts();


