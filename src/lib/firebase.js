
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDXsKlj-FtBvsSXAYCnLwxAPnYY83CP3Ps",
  authDomain: "roadmap-artesanias.firebaseapp.com",
  projectId: "roadmap-artesanias",
  storageBucket: "roadmap-artesanias.firebasestorage.app",
  messagingSenderId: "271271639362",
  appId: "1:271271639362:web:9dd32d25a7014d1e8cf0db",
  measurementId: "G-MHJE65XFQD"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// ============================================================
// HELPERS DE FIRESTORE
// ============================================================

const COLLECTION = 'tareas'

/**
 * Suscripción en tiempo real a todas las tareas.
 * Llama al callback cada vez que Firestore actualiza.
 * Retorna la función para cancelar la suscripción (useEffect cleanup).
 */
export function suscribirTareas(callback) {
  const ref = collection(db, COLLECTION)
  return onSnapshot(ref, (snapshot) => {
    const tareas = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    callback(tareas)
  })
}

/**
 * Guarda o actualiza una tarea en Firestore.
 * Usa el id de la tarea como document ID.
 */
export async function guardarTarea(tarea) {
  const ref = doc(db, COLLECTION, tarea.id)
  await setDoc(ref, tarea)
}

/**
 * Elimina una tarea de Firestore por su id.
 */
export async function eliminarTarea(id) {
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}

/**
 * Carga inicial: sube todas las tareas del JSON a Firestore.
 * Solo se llama una vez si Firestore está vacío.
 */
export async function seedTareasIniciales(tareas) {
  const batch = writeBatch(db)
  tareas.forEach(t => {
    const ref = doc(db, COLLECTION, t.id)
    batch.set(ref, t)
  })
  await batch.commit()
}

/**
 * Verifica si Firestore ya tiene tareas cargadas.
 */
export async function firestoreVacio() {
  const ref = collection(db, COLLECTION)
  const snap = await getDocs(ref)
  return snap.empty
}
