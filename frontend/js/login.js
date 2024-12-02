document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    fetch('data/admins.json')
      .then(response => response.json())
      .then(admins => {
        const admin = admins.find(admin => admin.username === username && admin.password === password);
  
        if (admin) {
          alert('Login successful!');
          sessionStorage.setItem('isLoggedIn', 'true'); // Set session flag
          window.location.href = 'dashboard.html';
        } else {
          document.getElementById('errorMsg').style.display = 'block';
        }
      })
      .catch(error => console.error('Error loading admin data:', error));
  });
  