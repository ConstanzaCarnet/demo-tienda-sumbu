/*
  demo.js - Configuración y funciones de la DEMO para comercios.
  👉 Para adaptar la demo a un cliente real, solo cambiá CONFIG.
*/
const CONFIG = {
  // Número del NEGOCIO (formato internacional sin + ni espacios: 549 + característica + número)
  whatsappNegocio: "5493510000000", // ⚠️ número de ejemplo
  nombreNegocio: "Sumbu Shop",

  // Datos de la desarrolladora (franja "sitio de demostración")
  mostrarFranjaDemo: true,
  nombreAutora: "Coti",
  whatsappAutora: "5493516186429",
  portfolio: "https://constanza-carnet.vercel.app/",
};

function linkWhatsApp(numero, mensaje) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // 1) Franja de demostración
  if (CONFIG.mostrarFranjaDemo) {
    const franja = document.createElement("div");
    franja.className = "demo__ribbon";
    franja.innerHTML = `Sitio de demostración · Hecho por ${CONFIG.nombreAutora}. ¿Querés una web así para tu negocio?
      <a href="${linkWhatsApp(CONFIG.whatsappAutora, "Hola Coti, vi la demo y me interesa una web para mi negocio")}" target="_blank" rel="noopener">Escribime</a>
      · <a href="${CONFIG.portfolio}" target="_blank" rel="noopener">Conoceme</a>`;
    document.body.prepend(franja);
  }

  // 2) Botón "Pedir por WhatsApp" en cada producto
  document.querySelectorAll(".product__card").forEach(function (card) {
    const nombre = card.querySelector(".product__card__name")?.textContent.trim();
    const precio = card.querySelector(".product__card__price")?.textContent.trim();
    const body = card.querySelector(".product__card__body");
    if (!nombre || !body) return;
    const btn = document.createElement("a");
    btn.className = "btn__wa";
    btn.target = "_blank";
    btn.rel = "noopener";
    btn.href = linkWhatsApp(
      CONFIG.whatsappNegocio,
      `Hola ${CONFIG.nombreNegocio}! Quiero pedir: ${nombre}${precio ? " (" + precio + ")" : ""}. ¿Está disponible?`
    );
    btn.innerHTML = `${iconoWA()} Pedir por WhatsApp`;
    body.appendChild(btn);
  });

  // 3) Links de contacto genéricos
  document.querySelectorAll(".js-wa-link").forEach(function (a) {
    a.href = linkWhatsApp(CONFIG.whatsappNegocio, `Hola ${CONFIG.nombreNegocio}! Quería hacer una consulta.`);
    a.target = "_blank";
    a.rel = "noopener";
  });

  // 4) Botón flotante
  const flotante = document.createElement("a");
  flotante.className = "wa__float";
  flotante.href = linkWhatsApp(CONFIG.whatsappNegocio, `Hola ${CONFIG.nombreNegocio}! Quería hacer una consulta.`);
  flotante.target = "_blank";
  flotante.rel = "noopener";
  flotante.setAttribute("aria-label", "Escribinos por WhatsApp");
  flotante.innerHTML = iconoWA(30);
  document.body.appendChild(flotante);
});

function iconoWA(size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42m8.02-17.45A11.33 11.33 0 0 0 12.04.72C5.79.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.66L.6 23.62l6.05-1.59a11.3 11.3 0 0 0 5.39 1.37h.01c6.25 0 11.34-5.08 11.34-11.33 0-3.03-1.18-5.87-3.32-8.02"/></svg>`;
}
