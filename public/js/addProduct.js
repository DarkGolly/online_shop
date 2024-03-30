
document.getElementById("category")
  .addEventListener("input", function(event){
    if(event.inputType == "insertReplacementText" || event.inputType == null) {
      categoriesDic.forEach(category =>{
        if (category.name == event.target.value){
          console.log(category.name + " "+ category.id);
          fetchSubcategories(category.id);
        }
      })
    }
  })

function fetchCategories() {
  fetch('http://localhost:3000/api/categories')
    .then(response => response.json())
    .then(categories => displayCategories(categories))
    .catch(error => console.error('Error:', error));
}
function fetchSubcategories(categoryId) {
  fetch(`http://localhost:3000/api/subcategories?category=${categoryId}`)
    .then(response => response.json())
    .then(subcategories => {
      const container = document.getElementById('subcategory_s');
      container.innerHTML = '';
      subcategories.forEach(subcategories => {
        container.innerHTML += `
            <option value="${subcategories.name}">
        `;
      });
    })
    .catch(error => console.error('Error:', error));
}
function displayCategories(categories) {
  categoriesDic = categories;
  const container = document.getElementById('category_s');
  container.innerHTML = '';
  categories.forEach(category => {
    container.innerHTML += `
            <option value="${category.name}">
        `;
  });
}
function postProductSubmit(event){
  event.preventDefault();
  const fileInput = document.getElementById('image');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('image', file);
  const productData = {
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    subcategory: document.getElementById('subcategory').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    quantity: document.getElementById('quantity').value,
    image: document.getElementById('image').files.item(0).name
  };
  fetch(`/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
  })
    .then(() => {
    })
    .catch(error => console.error('Error:', error));
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {})
    .catch(error => console.error(error));
  alert("Продукт добавлен");
}

fetchCategories();