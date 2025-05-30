import { supabase } from '../supabase.js'

const authContainer = document.getElementById('auth')

export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    renderLogin()
  } else {
    const user = session.user
    // Mostrar usuario autenticado en el header
    updateUserHeader(user)
    // Ocultar container de auth
    authContainer.style.display = 'none'
  }
}

function updateUserHeader(user) {
  // Actualizar el área de acciones de usuario en el header
  const userActions = document.querySelector('.user-actions')
  if (userActions) {
    const userEmail = user.email.split('@')[0] // Solo mostrar parte antes del @
    userActions.innerHTML = `
      <a href="#"><i class="fas fa-map-marker-alt"></i> Enviar a Bogotá</a>
      <a href="#" class="user-menu">
        <i class="fas fa-user"></i> Hola, ${userEmail}
      </a>
      <a href="#" id="logoutBtn">Salir</a>
      <a href="#">Mis compras</a>
      <a href="#"><i class="fas fa-shopping-cart"></i></a>
    `
    
    // Agregar evento de logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
      e.preventDefault()
      await supabase.auth.signOut()
      location.reload()
    })
  }
}

function renderLogin() {
  authContainer.style.display = 'block'
  authContainer.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 280px;">
      <h3 style="margin-bottom: 15px; color: #333; font-size: 18px;">Inicia sesión</h3>
      <form id="loginForm">
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          required 
          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px; font-size: 14px;"
        />
        <button 
          type="submit"
          style="width: 100%; background: #3483fa; color: white; border: none; padding: 12px; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: 500;"
        >
          Enviar enlace mágico
        </button>
      </form>
      <p style="margin-top: 10px; font-size: 12px; color: #666; text-align: center;">
        Te enviaremos un enlace para iniciar sesión
      </p>
      <button 
        id="closeAuth"
        style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 18px; cursor: pointer; color: #999;"
      >
        ×
      </button>
    </div>
  `

  // Eventos del formulario
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target[0].value
    const button = e.target.querySelector('button')
    const originalText = button.textContent

    // Mostrar estado de carga
    button.textContent = 'Enviando...'
    button.disabled = true

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert('Error al enviar correo mágico: ' + error.message)
      button.textContent = originalText
      button.disabled = false
    } else {
      button.textContent = '✓ Enlace enviado'
      button.style.background = '#00a650'
      setTimeout(() => {
        authContainer.style.display = 'none'
      }, 2000)
    }
  })

  // Evento para cerrar
  document.getElementById('closeAuth').addEventListener('click', () => {
    authContainer.style.display = 'none'
  })
}

// Mostrar login cuando se hace click en "Ingresa"
document.addEventListener('DOMContentLoaded', () => {
  const loginLinks = document.querySelectorAll('a[href="#"]')
  loginLinks.forEach(link => {
    if (link.textContent.includes('Ingresa')) {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        renderLogin()
      })
    }
  })
})

// Escuchar cambios de estado de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    updateUserHeader(session.user)
    authContainer.style.display = 'none'
  } else if (event === 'SIGNED_OUT') {
    location.reload()
  }
})