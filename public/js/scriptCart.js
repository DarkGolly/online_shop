
window.onload = function() {
  loadItems();
  const name_main = document.getElementById('login-main');
  let s = JSON.parse(sessionStorage.getItem('session'));
  name_main.innerHTML = s.username;
};
dirItem = {};
function loadItems(){
  // Получаем список товаров из localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartContainer = document.querySelector('.card-body');
  let outputElement = document.getElementById('totalAmount');
  outputElement.value = 0;
  cartContainer.innerHTML = ``; // Очищаем предыдущий список товаров
  // Функция для отрисовки товара
  // Создаем элементы для товара
  cartItems.forEach((item, index) => {
    outputElement.value +=item.price*item.count;
    dirItem[item.id] = item.count;
    cartContainer.innerHTML += `
          <div class="row">
            <div class="col-md-2">
              <img src="images/${item.image_url}" class="img-fluid" alt="Товар">
            </div>
            <div class="col-md-3">
              <h5>${item.name}</h5>
            </div>
            <div class="col-md-2">
              <h5>Цена: ${item.price} руб.</h5>
            </div>
            <div class="col-md-2">
              <input type="number" oninput="change(event, ${item.price}, ${item.id})" class="form-control" value="${item.count}" min="1" max="${item.quantity}">
            </div>
            <div class="col-md-2">
              <button class="btn btn-danger" onclick="deletDetected(event)" value="${item.id}" >Удалить</button>
            </div>
          </div>`;
  });
  outputElement.textContent = "Итого: "+outputElement.value +" рублей.";
}
function goToCheckout() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartItems.length>0){
    window.location.href = 'checkout.html';
  }else{
    alert("Пополните корзину, чтобы сделать заказ.")
  }
}
function onExit(){
  sessionStorage.clear();
  window.location.href='index.html';
}
function change(event, price, id){
  let quantity = parseInt(event.srcElement.value);
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  let outputElement = document.getElementById('totalAmount');
  if (dirItem[id] < quantity){
    outputElement.value = parseInt(outputElement.value) + parseInt(price);
    cartItems.forEach(item =>{
      if(item.id == id){
        item.count +=1;
      }
    })
    dirItem[id] +=1;
  }else {
    outputElement.value = parseInt(outputElement.value) - parseInt(price);
    cartItems.forEach(item =>{
      if(item.id == id){
        item.count -=1;
      }
    })
    dirItem[id] -=1;
  }
  localStorage.setItem('cart', JSON.stringify(cartItems));
  outputElement.textContent = "Итого: " + outputElement.value + " рублей.";
}
function deletDetected(event){
  // Предполагается, что у каждого товара есть атрибут data-id с уникальным идентификатором
  let itemId = event.srcElement.value;

  // Получаем текущий список товаров из localStorage
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  // Фильтруем список товаров, исключая товар с указанным идентификатором
  let newCat = [];

  for (let i = 0; i <= cartItems.length-1;i++){
    if (cartItems[i].id != itemId){
      newCat.push(cartItems[i]);
    }
  }

  //dirItem.removeItem(itemId);
  //console.log(cartItems);
  // Сохраняем обновленный список товаров обратно в localStorage

  localStorage.setItem('cart', JSON.stringify(newCat));
  // Удаляем элемент товара из DOM
  event.srcElement.parentElement.parentElement.remove();
}