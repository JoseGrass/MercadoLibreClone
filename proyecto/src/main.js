import { supabase } from './supabase.js'

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

// Ejecuta al cargar
fetchProducts()
