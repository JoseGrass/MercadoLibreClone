import { supabase } from './supabase.js'
import { mostrarLogin } from './routes/login.js'


const app = document.getElementById('app')

// Función para obtener productos desde Supabase
async function fetchProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    console.error('Error al obtener productos:', error)
    app.innerHTML = `<p>Error al cargar productos.</p>`
    return
  }

  renderProducts(products)
}

// Función para renderizar productos en el HTML
function renderProducts(products) {
  if (!products.length) {
    app.innerHTML = '<p>No hay productos disponibles.</p>'
    return
  }

  const productHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.imagen_url}" alt="${p.nombre}" />
      <h2>${p.nombre}</h2>
      <p>${p.descripcion}</p>
      <strong>$${p.precio.toLocaleString('es-CO')} COP</strong>
    </div>
  `).join('')

  app.innerHTML = `<div class="product-list">${productHTML}</div>`
}

// Función principal para mostrar contenido general (ejemplo)
window.General = function() {
  fetchProducts()
}

// Función para mostrar datos de usuario (ejemplo)
window.mostrarDatos = function() {
  app.innerHTML = `<h2>Datos del usuario</h2><p>Contenido de usuario aquí...</p>`
}

// Evento al cargar DOM
document.addEventListener('DOMContentLoaded', async () => {
  const user = await validarSesion()
  if (!user) {
    // Usuario no autenticado
    mostrarLogin()
  } else {
    console.log('Usuario logueado:', user.email)
    General() // Carga contenido general
    document.querySelector(".c-nav").innerHTML = `
      <button class="c-nav-item" onclick="General()">Home</button>
      <button class="c-nav-item" onclick="mostrarDatos()">Usuario</button>
      <button class="c-nav-item" id="logoutBtn">Cerrar sesión</button>
    `

    // Agregar listener para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await supabase.auth.signOut()
      location.reload()
    })
  }
})

// Función para validar sesión actual
async function validarSesion() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}
