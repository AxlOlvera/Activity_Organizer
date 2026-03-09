// ============================================================
// CONSTANTES GLOBALES DEL PROYECTO
// ============================================================

export const MODULOS_CONFIG = {
  "Navbar & Footer":              { icono: "🧭", dev: "Ursula" },
  "Cart & Checkout":              { icono: "🛒", dev: "Ursula / Diego" },
  "Products & Cards":             { icono: "🖼️", dev: "Ursula" },
  "Users & Admin":                { icono: "👤", dev: "Ursula / Diego" },
  "Contact & Global":             { icono: "📬", dev: "Jordy" },
  "Spring Boot":                  { icono: "☕", dev: "Axl / Isaac" },
  "Base de Datos":                { icono: "🗄️", dev: "Jordy / Isaac" },
  "Integración Frontend-Backend": { icono: "🔗", dev: "Axl / Diana" },
  "Presentación":                 { icono: "🎬", dev: "Axl" },
  "QA":                           { icono: "🧪", dev: "Diana / Diego" },
  "Admin Dashboard":              { icono: "🛡️", dev: "Lili" },
  "Documentación":                { icono: "📄", dev: "Paola" },
}

export const INTEGRANTES = [
  "Carlos Adrian Guadarrama Gomez",
  "Diana Laura Lopez Ibarra",
  "Diego Ulises López Rodriguez",
  "Genaro Corazón de León Castillo",
  "Isaac López Carmona",
  "Jordy Manuel Hernandez Rosario",
  "Liliana Montserrat Domínguez Sucres",
  "Mario Axl Sánchez Olvera",
  "Paola Alejandra Duque Salgado",
  "Ursula Karina López Vela",
]

// Genera el slug de URL a partir del nombre completo
// Ej: "Isaac López Carmona" → "isaac-lopez-carmona"
export function nombreASlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar acentos
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Encuentra el nombre completo a partir de un slug
export function slugANombre(slug) {
  return INTEGRANTES.find(n => nombreASlug(n) === slug) || null
}

export const ESTADO_LABELS = {
  pendiente:   "Pendiente",
  "en-progreso": "En Progreso",
  completado:  "Completado",
}

export const PRIORIDAD_LABELS = {
  critica:    "🔥 Crítica",
  importante: "🛠️ Importante",
  mejora:     "🌟 Mejora",
}

export const TIPO_ICONS = {
  fix:     "⚙️",
  feat:    "✨",
  upgrade: "🚀",
}

export function generarId() {
  return "t" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}
