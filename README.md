# Roadmap — Tienda Artesanías

Dashboard de tareas colaborativo con React + Firebase + Vercel.

---

## 🚀 Setup en 5 pasos

### 1. Instalar dependencias

```bash
npm install
```

---

### 2. Crear proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Crea un proyecto nuevo (ej: `roadmap-artesanias`)
3. En el panel, ve a **Build → Firestore Database → Create database**
   - Elige **"Start in test mode"** (para desarrollo)
   - Selecciona la región más cercana (ej: `us-central`)
4. Ve a **Project Settings → General → Your apps → Add app → Web (</> )**
5. Registra la app y copia el objeto `firebaseConfig`

---

### 3. Configurar Firebase en el proyecto

Abre `src/lib/firebase.js` y reemplaza los valores del objeto `firebaseConfig`:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",         // ← tu API key
  authDomain:        "tu-proyecto.firebaseapp.com",
  projectId:         "tu-proyecto",       // ← tu project ID
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123:web:abc..."
}
```

---

### 4. Correr en local

```bash
npm run dev
```

Abre `http://localhost:5173`

La primera vez que cargue, sube automáticamente las 38 tareas a Firestore.
Cualquier cambio (crear, editar, eliminar, cambiar estado) se guarda en tiempo real
y se propaga a todos los usuarios que tengan el dashboard abierto.

---

### 5. Subir a Vercel

**Opción A — Desde GitHub (recomendado):**
1. Sube el proyecto a un repositorio GitHub
2. Ve a [vercel.com](https://vercel.com) → New Project → importa el repo
3. Vercel detecta Vite automáticamente
4. En la sección **Environment Variables**, agrega:
   - `VITE_FIREBASE_API_KEY` = tu apiKey
   - `VITE_FIREBASE_PROJECT_ID` = tu projectId
   - *(opcional pero recomendado para no exponer las keys en el código)*
5. Deploy ✓

**Opción B — CLI directo:**
```bash
npm install -g vercel
npm run build
vercel --prod
```

---

## 🔗 URLs del dashboard

| URL | Vista |
|-----|-------|
| `tu-sitio.vercel.app/` | Todas las tareas |
| `tu-sitio.vercel.app/u/carlos-adrian-guadarrama-gomez` | Tareas de Carlos |
| `tu-sitio.vercel.app/u/isaac-lopez-carmona` | Tareas de Isaac |
| `tu-sitio.vercel.app/u/diana-laura-lopez-ibarra` | Tareas de Diana |

Los links personales están disponibles en el sidebar bajo **"MI VISTA"**.
Cada persona puede guardar su URL en favoritos para ver solo sus tareas.

---

## 🏗️ Estructura del proyecto

```
src/
├── lib/
│   ├── firebase.js      ← config y helpers de Firestore
│   └── constants.js     ← módulos, integrantes, labels
├── data/
│   └── tareas.js        ← datos iniciales (se suben a Firestore la 1ra vez)
├── hooks/
│   └── useTareas.js     ← sincronización con Firebase en tiempo real
├── pages/
│   └── Dashboard.jsx    ← página principal (maneja filtros y estado)
└── components/
    ├── Sidebar.jsx       ← filtros, navegación, links personales
    ├── TopBar.jsx        ← título, búsqueda
    ├── ModuleList.jsx    ← lista de módulos y tarjetas de tareas
    ├── TaskModal.jsx     ← modal crear/editar tarea
    ├── ConfirmModal.jsx  ← modal confirmar borrado
    └── AnalyticsPanel.jsx ← gráficas con Recharts
```

---

## 🗄️ Reglas de seguridad en Firestore (producción)

Para cuando el dashboard esté en producción, reemplaza las reglas de test por estas
en Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tareas/{tareaId} {
      // Solo lectura pública, escritura solo con autenticación
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

O si quieres mantenerlo completamente abierto (solo para equipo interno):
```
allow read, write: if true;
```

---

## ✨ Features

- **Tiempo real** — cambios se sincronizan entre todos los usuarios abiertos
- **Rutas personales** — cada integrante tiene su propia URL `/u/nombre`
- **Analytics** — 4 gráficas + tabla resumen con Recharts
- **CRUD completo** — crear, editar, eliminar tareas
- **Detalle expandible** — instrucciones detalladas por tarea
- **Filtros combinables** — módulo + página + estado + búsqueda
# Activity_Organizer
