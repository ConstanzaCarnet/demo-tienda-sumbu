/*
  navbar.js - Lógica del navbar.
  Se carga en las páginas que TIENEN navbar:
  index.html, las categorías de pages/ y about-us.html
*/

/*
  Devuelve la ruta relativa hacia la carpeta pages/ según dónde estemos parados.
  Así los links funcionan igual en cualquier computadora, sin importar en qué
  carpeta se clone el repositorio (no dependemos de rutas absolutas tipo /pages/).
*/
function rutaPages() {
  const estoyEnPages = window.location.pathname.includes("/pages/");
  return estoyEnPages ? "" : "pages/";
}

/*Cierra la sesión y vuelve al login*/
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = rutaPages() + "login.html";
}

function getBasePath() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}

(function markActiveLink() {
  const links = document.querySelectorAll(".navbar-nav .nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    link.classList.remove("active");
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) link.classList.add("active");
  });
})();
