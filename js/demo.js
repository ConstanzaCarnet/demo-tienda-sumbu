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

  // Productos desde planilla (Google Sheets → Archivo → Compartir → Publicar en la web → CSV).
  // Pegá acá el link del CSV publicado. Si queda vacío, se muestran los productos escritos en el HTML.
  planillaProductos:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTQSC13M6CAa8Z9wFYiyNZq1TyRWIA3jivic7mzFcCvCxnPVXDyZlkMxBQTzqL8H76fVSeZ8pSGjwy/pub?gid=776560393&single=true&output=csv",
};

// Carpeta raíz del sitio (sirve igual desde index.html o desde pages/)
const RAIZ_SITIO = new URL("..", document.currentScript.src);

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

  // 2) Productos desde la planilla (si está configurada) + botón "Pedir por WhatsApp"
  cargarProductosDePlanilla().then(function () {
    document.querySelectorAll(".product__card").forEach(agregarBotonWA);
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

function agregarBotonWA(card) {
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
}

/* ---------- Productos desde planilla ----------
  Columnas: seccion | etiqueta | nombre | descripcion | precio | foto | mostrar
  - Borrar la fila = el producto desaparece de la web.
  - mostrar = NO  → se oculta sin borrarlo (ej. sin stock).
  Seguridad: todo el texto se inserta con textContent (nunca como HTML) y
  las fotos solo se aceptan como https o como rutas dentro del propio sitio.
*/
async function cargarProductosDePlanilla() {
  const grillas = document.querySelectorAll("[data-seccion]");
  if (!CONFIG.planillaProductos || grillas.length === 0) return;
  // Abierto con doble clic (file://): el navegador bloquea leer la planilla,
  // así que se dejan los productos escritos en el HTML.
  if (location.protocol === "file:") {
    console.warn("Planilla de productos: abrí el sitio con un servidor (Live Server / GitHub Pages) para leerla.");
    return;
  }

  // Se vacían las grillas antes de cargar para no mostrar productos ya borrados
  const fondos = new Map();
  grillas.forEach(function (grilla) {
    const fondo = grilla.querySelector(".product__card-img")?.getAttribute("style") || "";
    fondos.set(grilla, fondo);
    grilla.replaceChildren(mensajeGrilla("Cargando productos…"));
  });

  let filas;
  try {
    const url = new URL(CONFIG.planillaProductos, RAIZ_SITIO);
    // Si se pegó el link "pubhtml" de Google Sheets, se pide la versión CSV
    if (url.hostname === "docs.google.com" && url.pathname.endsWith("/pubhtml")) {
      url.pathname = url.pathname.replace(/\/pubhtml$/, "/pub");
      url.searchParams.set("output", "csv");
    }
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    filas = leerCSV(await resp.text());
  } catch (err) {
    console.error("No se pudo leer la planilla de productos:", err);
    grillas.forEach(function (grilla) {
      grilla.replaceChildren(mensajeGrilla("No pudimos cargar los productos. Escribinos por WhatsApp y te contamos qué hay disponible."));
    });
    return;
  }

  const [encabezado, ...datos] = filas;
  const col = {};
  (encabezado || []).forEach(function (titulo, i) {
    col[normalizar(titulo)] = i;
  });
  const valor = (fila, nombre) => (fila[col[nombre]] ?? "").trim();

  grillas.forEach(function (grilla) {
    const seccion = normalizar(grilla.dataset.seccion);
    const productos = datos
      .slice(0, 500)
      .filter((fila) => valor(fila, "nombre"))
      .filter((fila) => normalizar(valor(fila, "seccion")) === seccion)
      .filter((fila) => normalizar(valor(fila, "mostrar")) !== "no");

    if (productos.length === 0) {
      grilla.replaceChildren(mensajeGrilla("Por ahora no hay productos en esta sección. ¡Consultanos por WhatsApp!"));
      return;
    }
    grilla.replaceChildren(
      ...productos.map((fila) =>
        crearTarjeta(
          {
            etiqueta: valor(fila, "etiqueta") || grilla.dataset.seccion,
            nombre: valor(fila, "nombre"),
            descripcion: valor(fila, "descripcion"),
            precio: formatearPrecio(valor(fila, "precio")),
            foto: urlFotoSegura(valor(fila, "foto")),
          },
          fondos.get(grilla)
        )
      )
    );
  });
}

function crearTarjeta(p, fondo) {
  const el = (tag, clase, texto) => {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto) n.textContent = texto;
    return n;
  };
  const columna = el("div", "col-12 col-sm-6 col-lg-4");
  const card = el("div", "product__card");
  const caja = el("div", "product__card-img");
  if (fondo) caja.setAttribute("style", fondo);
  const img = el("img");
  img.src = p.foto;
  img.alt = p.nombre;
  img.loading = "lazy";
  caja.appendChild(img);

  const body = el("div", "product__card__body");
  body.append(el("div", "product__card__cat", p.etiqueta), el("div", "product__card__name", p.nombre));
  if (p.descripcion) body.appendChild(el("div", "product__card__desc", p.descripcion));
  if (p.precio) body.appendChild(el("div", "product__card__price", p.precio));

  card.append(caja, body);
  columna.appendChild(card);
  return columna;
}

function mensajeGrilla(texto) {
  const p = document.createElement("p");
  p.className = "text-center";
  p.style.color = "var(--color-text-soft)";
  p.textContent = texto;
  return p;
}

// "2500" o "2.500" → "$2.500"; texto como "Próximamente" queda igual
function formatearPrecio(texto) {
  const limpio = texto.replace(/[$\s.]/g, "");
  if (/^\d+$/.test(limpio)) return "$" + Number(limpio).toLocaleString("es-AR");
  return texto;
}

function urlFotoSegura(texto) {
  const porDefecto = new URL("img/sumbu-shop.ar.webp", RAIZ_SITIO).href;
  if (!texto) return porDefecto;
  // Links de Google Drive ("Compartir → cualquier persona con el enlace")
  const drive = texto.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([\w-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w800`;
  try {
    const url = new URL(texto, RAIZ_SITIO);
    if (url.protocol === "https:" || url.origin === RAIZ_SITIO.origin) return url.href;
  } catch (e) {}
  return porDefecto;
}

function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

// Lector de CSV (soporta comillas, comas y saltos de línea dentro de un campo)
function leerCSV(texto) {
  const filas = [];
  let fila = [], campo = "", entreComillas = false;
  texto = texto.replace(/^﻿/, "");
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') entreComillas = false;
      else campo += c;
    } else if (c === '"') entreComillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

function iconoWA(size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 1 1 7.99 4.42m8.02-17.45A11.33 11.33 0 0 0 12.04.72C5.79.72.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.66L.6 23.62l6.05-1.59a11.3 11.3 0 0 0 5.39 1.37h.01c6.25 0 11.34-5.08 11.34-11.33 0-3.03-1.18-5.87-3.32-8.02"/></svg>`;
}
