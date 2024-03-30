function registrationUser(event){
  event.preventDefault();
  //const username = document.getElementById('username').value;
  //const password = document.getElementById('password').value;
  const user = {
    username: document.getElementById('username').value, // Empty for new user
    password: document.getElementById('password').value
  };

  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
function onExit(){
  sessionStorage.clear();
  window.location.href='index.html';
}
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var password = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert('Пароли не совпадают!');
  }else{
    registrationUser(event);
  }
});