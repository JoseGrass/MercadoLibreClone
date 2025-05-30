
import { supabase } from './supabase.js'
import { fetchProducts } from './main.js' // Importa fetchProducts para refrescar la lista de productos

/**
 * Muestra u oculta el modal de administración.
 * Al abrir, configura los listeners para los botones CRUD.
 */
export function mostrarCRUDProductos() {
  const adminModal = document.getElementById('adminModal')
  const closeAdminModalBtn = document.getElementById('closeAdminModal')
  const adminModalOverlay = adminModal ? adminModal.querySelector('.login-modal-overlay') : null;

  if (adminModal) {
    adminModal.style.display = 'flex' // Mostrar el modal
    document.body.style.overflow = 'hidden' // Desactivar el scroll del body

    // Limpiar el formulario al abrir el modal (por si se cerró antes a medias)
    limpiarForm();

    // Asignar eventos a los botones CRUD
    document.getElementById('btnCrear').onclick = mostrarFormCrear
    document.getElementById('btnActualizar').onclick = mostrarFormActualizar
    document.getElementById('btnEliminar').onclick = mostrarFormEliminar

    // Asignar eventos para cerrar el modal
    closeAdminModalBtn.onclick = () => cerrarModalAdmin()
    if (adminModalOverlay) {
      adminModalOverlay.onclick = () => cerrarModalAdmin()
    }
  }
}

/**
 * Cierra el modal de administración y limpia el formulario.
 */
function cerrarModalAdmin() {
  const adminModal = document.getElementById('adminModal')
  if (adminModal) {
    adminModal.style.display = 'none'
    document.body.style.overflow = '' // Restaurar el scroll del body
    limpiarForm() // Limpiar el formulario al cerrar el modal
  }
}

/**
 * Limpia el contenido del contenedor del formulario y el área de resultados.
 */
function limpiarForm() {
  const formContainer = document.getElementById('form-container')
  const output = document.getElementById('output')
  if (formContainer) formContainer.innerHTML = ''
  if (output) output.textContent = ''
}

// --- CREAR PRODUCTO ---
function mostrarFormCrear() {
  limpiarForm()
  const formContainer = document.getElementById('form-container')

  formContainer.innerHTML = `
    <h3>Crear Producto</h3>
    <form id="formCrear">
      <label>Nombre:<br><input type="text" name="nombre" required></label><br>
      <label>Descripción:<br><textarea name="descripcion" required></textarea></label><br>
      <label>Precio:<br><input type="number" name="precio" step="0.01" required></label><br>
      <label>URL Imagen:<br><input type="url" name="imagen_url" required></label><br>
      <button type="submit">Guardar</button>
      <button type="button" id="cancelCrear">Cancelar</button>
    </form>
  `

  document.getElementById('formCrear').onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nombre = formData.get('nombre').trim()
    const descripcion = formData.get('descripcion').trim()
    const precio = parseFloat(formData.get('precio'))
    const imagen_url = formData.get('imagen_url').trim()

    if (!nombre || !descripcion || isNaN(precio) || !imagen_url) {
      alert("Todos los campos son obligatorios y precio debe ser un número válido.")
      return
    }

    const { data, error } = await supabase.from('products').insert([{ nombre, descripcion, precio, imagen_url }]).select()
    mostrarResultado(error, data)
    if (!error) {
        limpiarForm();
        fetchProducts(); // Refresca la lista de productos en la página principal
    }
  }

  document.getElementById('cancelCrear').onclick = () => limpiarForm()
}

// --- ACTUALIZAR PRODUCTO ---
function mostrarFormActualizar() {
  limpiarForm()
  const formContainer = document.getElementById('form-container')

  formContainer.innerHTML = `
    <h3>Actualizar Producto</h3>
    <form id="formActualizar">
      <label>ID del producto:<br><input type="number" name="id" required></label><br>
      <label>Nuevo nombre:<br><input type="text" name="nombre"></label><br>
      <label>Nueva descripción:<br><textarea name="descripcion"></textarea></label><br>
      <label>Nuevo precio:<br><input type="number" name="precio" step="0.01"></label><br>
      <label>Nueva URL Imagen:<br><input type="url" name="imagen_url"></label><br>
      <button type="submit">Actualizar</button>
      <button type="button" id="cancelActualizar">Cancelar</button>
    </form>
  `

  document.getElementById('formActualizar').onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const id = formData.get('id').trim()
    if (!id) {
      alert("El ID es obligatorio")
      return
    }

    const campos = {}
    const nombre = formData.get('nombre').trim()
    const descripcion = formData.get('descripcion').trim()
    const precio = formData.get('precio')
    const imagen_url = formData.get('imagen_url').trim()

    if (nombre) campos.nombre = nombre
    if (descripcion) campos.descripcion = descripcion
    if (precio && !isNaN(parseFloat(precio))) campos.precio = parseFloat(precio)
    if (imagen_url) campos.imagen_url = imagen_url

    if (Object.keys(campos).length === 0) {
      alert("No se ingresaron cambios.")
      return
    }

    const { data, error } = await supabase.from('products').update(campos).eq('id', id).select()
    mostrarResultado(error, data)
    if (!error) {
        limpiarForm();
        fetchProducts(); // Refresca la lista de productos en la página principal
    }
  }

  document.getElementById('cancelActualizar').onclick = () => limpiarForm()
}

// --- ELIMINAR PRODUCTO ---
function mostrarFormEliminar() {
  limpiarForm()
  const formContainer = document.getElementById('form-container')

  formContainer.innerHTML = `
    <h3>Eliminar Producto</h3>
    <form id="formEliminar">
      <label>ID del producto:<br><input type="number" name="id" required></label><br>
      <button type="submit">Eliminar</button>
      <button type="button" id="cancelEliminar">Cancelar</button>
    </form>
  `

  document.getElementById('formEliminar').onsubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const id = Number(formData.get('id'))

    if (!id || isNaN(id)) {
      alert("El ID es obligatorio y debe ser un número válido")
      return
    }

    const { data, error } = await supabase.from('products').delete().eq('id', id).select()
    mostrarResultado(error, data)
    if (!error) {
      limpiarForm()
      fetchProducts()  // Refresca la lista para que desaparezca el producto eliminado
    }
  }

  document.getElementById('cancelEliminar').onclick = () => limpiarForm()
}

/**
 * Muestra el resultado de una operación de Supabase (éxito o error).
 * @param {object} error - Objeto de error de Supabase, si existe.
 * @param {Array} data - Datos devueltos por Supabase en caso de éxito.
 */
function mostrarResultado(error, data) {
  const output = document.getElementById('output')
  if (output) { // Asegurarse de que el elemento existe
    if (error) {
      output.textContent = '❌ Error: ' + error.message
    } else {
      output.textContent = '✅ Resultado:\n' + JSON.stringify(data, null, 2)
    }
  }
}
