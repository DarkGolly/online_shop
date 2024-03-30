// Function to load products from the server and display them

function loadPageContent(event, page, category = '') {
  event.preventDefault();

  if (page === 'products.html') {
      fetch(page)
          .then(response => response.text())
          .then(html => {
              document.getElementById('content').innerHTML = html;
              loadProducts(category); // Load products of the clicked category
          })
          .catch(error => console.error('Error loading page:', error));
  }
  // If not loading products, the "About" section remains displayed
}

function loadProducts(category) {
  let url = 'http://localhost:3000/api/products';
  if (category) {
      url += `?category=${encodeURIComponent(category)}`;
  }

  fetch(url)
      .then(response => response.json())
      .then(products => displayProducts(products))
      .catch(error => console.error('Error fetching products:', error));
}


// Cart functional

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  for (let i = 0; i <= cart.length-1;i++){
    if (cart[i].id == product.id){
      alert("Данный товар уже есть в вашей корзине.");
      return;
    }
  }
  if (product.quantity == 0){
    alert("Данного товара нет в наличии.");
    return;
  }
  product.count = 1;
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
}

function displayCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';

  cart.forEach((item, index) => {
      cartItemsContainer.innerHTML += `
          <div class="cart-item">
              <div class="item-info">
                  <span>${item.name} - ${item.price} руб.</span>
              </div>
              <div class="item-action">
                  
                  <button class="btn btn-danger" onclick="removeFromCart(${index})">Удалить</button>
              </div>
          </div>`;
  });
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
}

function clearCart() {
  localStorage.removeItem('cart');
  displayCartItems();
}
function handleCheckout(event) {
  //event.preventDefault();
  if (localStorage.getItem('cart')==null){
    alert("Заполните корзину!");
  }else if (document.getElementById('fullname').value &&document.getElementById('phone').value&&document.getElementById('address').value){
    const order = {
      products: localStorage.getItem('cart'),
      fullname: document.getElementById('fullname').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      paymentMethod: document.getElementById('payment-method').value
    }
      fetch('http://localhost:3000/api/addOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
        .then(response => {
          response.json().then(r => {
            if (r) {
              alert("Ждите звонка.");
              clearCart();
              window.location.href = '/index.html';
            } else {
              alert("Что-то пошло не так. Попробуйте позже.");
            }
          })
        })
        .catch((error) => {
          console.log("Что-то пошло не так. Попробуйте позже." + error);
        });

    alert("Заказ оформлен! ");
    window.location.href = '/index.html';
  }else{
    alert("Заполните форму!");
  }
}

function displayCheckoutItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const checkoutItemsContainer = document.getElementById('checkout-items');
  let totalPrice = 0;

  checkoutItemsContainer.innerHTML = '';
  cart.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.textContent = `${item.name} - ${item.price} руб.    ${item.count} шт.`;
      checkoutItemsContainer.appendChild(itemElement);
      totalPrice += parseInt(item.price) * parseInt(item.count);
  });

  // Display total price
  const totalPriceElement = document.createElement('div');
  totalPriceElement.className = 'total-price';
  totalPriceElement.textContent = `Итого: ${totalPrice} руб.`;
  checkoutItemsContainer.appendChild(totalPriceElement);
}


// Admin Functional

const adminCredentials = {
  username: 'admin',
  password: 'admin'  // In real application, use secure methods
};

function showAdminLogin() {
  const user = prompt('Enter username:');
  const pass = prompt('Enter password:');

  if (user === adminCredentials.username && pass === adminCredentials.password) {
      window.location.href = 'admin.html'; // Redirect to admin page
  } else {
      alert('Неверные логин или пароль.');
  }
}
function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'admin')
  { // Hardcoded credentials
      window.location.href = 'admin.html'; // Redirect to admin page
  }
  else if(false){
      
  } else {
      alert('Неверные логин или пароль!');
  }
}

// Fetch Main Categories from the Server
function fetchMainCategories() {
  fetch('http://localhost:3000/api/categories')
      .then(response => response.json())
      .then(categories => {
          const categoryList = document.getElementById('category-list');
          categoryList.innerHTML = categories.map(cat => 
              `<li>
                  <a href="#" onclick="toggleSubcategories(event, ${cat.id})">${cat.name}</a>
                  <ul id="subcategories-${cat.id}" class="subcategories"></ul>
              </li>`
          ).join('');
      })
      .catch(error => console.error('Error:', error));
}

function toggleSubcategories(event, categoryId) {
  event.preventDefault();
  const allSubcategoryLists = document.querySelectorAll('.subcategories');
  allSubcategoryLists.forEach(list => {
      if (list.id !== `subcategories-${categoryId}`) {
          list.style.display = 'none'; // Hide other subcategories
      }
  });

  const subcategoriesList = document.getElementById(`subcategories-${categoryId}`);
  if(subcategoriesList.style.display === 'none' || subcategoriesList.innerHTML === '') {
      fetchSubcategories(categoryId, subcategoriesList);
      subcategoriesList.style.display = 'block';
  } else {
      subcategoriesList.style.display = 'none'; // Toggle visibility
  }
}

function fetchSubcategories(categoryId, subcategoriesList) {
  fetch(`http://localhost:3000/api/subcategories?category=${categoryId}`)
      .then(response => response.json())
      .then(subcategories => {
          subcategoriesList.innerHTML = subcategories.map(sub => 
              `<li><a href="#" onclick="fetchProductsBySubcategory(${sub.id})">${sub.name}</a></li>`
          ).join('');
      })
      .catch(error => console.error('Error:', error));
}

// Fetch and Display Products Based on Subcategory
function fetchProductsBySubcategory(subcategoryId) {
  fetch(`http://localhost:3000/api/products?subcategory=${subcategoryId}`)
      .then(response => response.json())
      .then(products => {
          displayProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {

  const contentArea = document.getElementById("content");
  contentArea.innerHTML = '<div id="product-grid"></div>'; // Reset and prepare the product grid
  const productsContainer = document.getElementById("product-grid");

  products.forEach(product => {
      const productElement = document.createElement("div");
      productElement.className = 'card';
      productElement.innerHTML = `
          <img src="/images/${product.image_url}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p  class="card-text">${product.description}</p>
            <p class="card-text">Цена: ${product.price} руб.</p>
          </div>
          <a onclick='addToCart(${JSON.stringify(product)})' class="btn btn-primary" >Добавить в корзину</a>
      `;
      productsContainer.appendChild(productElement);
  });
}

// Initial fetch of main categories
// document.addEventListener("DOMContentLoaded", fetchMainCategories);
// document.addEventListener('DOMContentLoaded', displayCartItems); // For cart items
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.href.includes('checkout.html')) {
    displayCheckoutItems();
  } else {
    fetchMainCategories();
    displayCartItems();
  }
});
function onExit(){
  sessionStorage.clear();
  const name = document.getElementById('login');
  const name_main = document.getElementById('login-main');
  const exitbtn = document.getElementById('exit');
  name.innerHTML = 'Войти';
  name_main.innerHTML = 'Войти';
  exitbtn.style.display = 'none';
}
function isLogIned(){
  const name = document.getElementById('login');
  const name_main = document.getElementById('login-main');
  const exitbtn = document.getElementById('exit');
  const orderBtn = document.getElementById('byOrder');
  if (sessionStorage.getItem('session') !== null){
    let s = JSON.parse(sessionStorage.getItem('session'));
    if (s.rule){
      name.innerHTML = "Админка";
    }else name.innerHTML = "Корзина";

    name_main.innerHTML = s.username;
    exitbtn.style.display = 'flex';
  }else{
    orderBtn.style.display = 'none';
    exitbtn.style.display = 'none';
    name.innerHTML = 'Войти';
    name_main.innerHTML = 'Войти';
  }
}

function onLogIned(event){

  if (sessionStorage.getItem('session')){
    if (JSON.parse(sessionStorage.getItem('session')).rule){
      window.location.href = 'admin.html'
    }
    else{
      window.location.href = 'cart.html'
    }
  }else{
    window.location.href = 'login.html'
  }
  /*fetch('http://localhost:3000/api/categories')
    .then(response => response.json())
    .then(categories => {
      const categoryList = document.getElementById('category-list');
      categoryList.innerHTML = categories.map(cat =>
        `<li>
                  <a href="#" onclick="toggleSubcategories(event, ${cat.id})">${cat.name}</a>
                  <ul id="subcategories-${cat.id}" class="subcategories"></ul>
              </li>`
      ).join('');
    })
    .catch(error => console.error('Error:', error));*/


  //const login = document.getElementById('login');
  //login.innerHTML = 'sanya';
}

isLogIned()