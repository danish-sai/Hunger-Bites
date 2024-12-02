document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
});

function logout() {
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}