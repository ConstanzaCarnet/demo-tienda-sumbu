/*
  forms.js - Lógica de los formularios.
  Se carga SOLO en las páginas que tienen formulario:
  pages/login.html y pages/register.html
*/

/*Inicio de sesión*/
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    console.log("Login:", { email });
    alert("¡Inicio de sesión exitoso! (simulado)");
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    console.log("Registro:", { nombre });
    alert(`¡Cuenta creada para ${nombre}! (simulado)`);
  });
}
