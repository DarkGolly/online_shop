function onlogInPage(event) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        sessionStorage.setItem('session', JSON.stringify(data));
        window.location.href = '/index.html';
      } else {
        alert('Неверное имя пользователя или пароль!');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  alert("Авторизация прошла успешно.")
}

function onExit(){
  sessionStorage.clear();
  window.location.href='index.html';
}