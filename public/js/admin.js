// Функция для добавления строк в таблицу
function addRowsToTable(orders) {
  const tableBody = document.querySelector('#ordersTable tbody');

  console.log(orders)

  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.products}</td>
            <td>${order.fullname}</td>
            <td>${order.phone}</td>
            <td>${order.address}</td>
            <td>${order.paymentMethod}</td>
            <td>${order.order_date}</td>
            <td><button class="btn btn-danger btn-sm delete-btn" id="${order.id}" >Удалить</button></td>
        `;
    tableBody.appendChild(row);
  });
}

// Добавление обработчика событий для кнопки удаления
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('delete-btn')) {
    fetch(`/api/orders/${parseInt(event.srcElement.id)}`, { method: 'DELETE' })
      .then(() => fetchProducts())
      .catch(error => console.error('Error:', error));
    window.location.reload();
  }
});
function getOrders(){
  fetch('http://localhost:3000/api/orders')
    .then(response => response.json())
    .then(orders => {
      orders.map(item =>{
        addRowsToTable(new Array (item));
      });
    })
    .catch(error => console.error('Error:', error));
}
getOrders();
// Заполнение таблицы данными о заказах

