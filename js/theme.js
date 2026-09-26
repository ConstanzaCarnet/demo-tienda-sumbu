const STORAGE_KEY = "sumbu-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Busca el botón cada vez que se llama, no solo al inicio
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const esOscuro = theme === "dark";
  const texto = esOscuro ? "Modo claro" : "Modo oscuro";
  // El texto solo se ve en el menú desplegado (móvil/tablet); en escritorio queda el ícono
  btn.innerHTML = `<span class="btn__theme-icon" aria-hidden="true">${esOscuro ? "☀️" : "🌙"}</span><span class="btn__theme-label">${texto}</span>`;
  btn.setAttribute("aria-label", "Cambiar a " + texto.toLowerCase());
  btn.title = "Cambiar a " + texto.toLowerCase();
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

// Aplica el tema guardado cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function () {
  const saved = localStorage.getItem(STORAGE_KEY) || "light";
  applyTheme(saved);
});
