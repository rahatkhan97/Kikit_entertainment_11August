// auth.js - Redirect if user is not logged in
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}
