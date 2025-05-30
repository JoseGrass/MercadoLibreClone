import { supabase } from '../supabase.js'

// Variables globales para los modales
let loginModal = null
let registerModal = null

export async function checkAuth() {
  // Inicializar variables después de que el DOM esté cargado
  loginModal = document.getElementById('loginModal')
  registerModal = document.getElementById('registerModal')
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    setupModals()
  } else {
    const user = session.user
    updateUserHeader(user)
  }
}

function setupModals() {
  // Asegurar que los modales estén disponibles
  if (!loginModal) loginModal = document.getElementById('loginModal')
  if (!registerModal) registerModal = document.getElementById('registerModal')

  // Event listeners para abrir el modal de login
  const loginLinks = document.querySelectorAll('a[href="#"]')
  loginLinks.forEach(link => {
    if (link.textContent.includes('Ingresa') || link.textContent.includes('Ingresar a tu cuenta')) {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        showLoginModal()
      })
    }
    // Event listeners para "Crea tu cuenta"
    if (link.textContent.includes('Crea tu cuenta')) {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        showRegisterModal()
      })
    }
  })

  // Event listeners para cerrar modales
  const closeLoginBtn = document.getElementById('closeLoginModal')
  const closeRegisterBtn = document.getElementById('closeRegisterModal')
  
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', hideLoginModal)
  }
  
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', hideRegisterModal)
  }

  // Event listeners para overlays
  if (loginModal) {
    const loginOverlay = loginModal.querySelector('.login-modal-overlay')
    if (loginOverlay) {
      loginOverlay.addEventListener('click', hideLoginModal)
    }
  }

  if (registerModal) {
    const registerOverlay = registerModal.querySelector('.login-modal-overlay')
    if (registerOverlay) {
      registerOverlay.addEventListener('click', hideRegisterModal)
    }
  }

  // Event listeners para formularios
  const loginForm = document.getElementById('newLoginForm')
  const registerForm = document.getElementById('registerForm')
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister)
  }

  // Event listeners para cambiar entre modales
  const openRegisterBtn = document.getElementById('openRegisterModal')
  const openLoginBtn = document.getElementById('openLoginModal')

  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', (e) => {
      e.preventDefault()
      hideLoginModal()
      showRegisterModal()
    })
  }

  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', (e) => {
      e.preventDefault()
      hideRegisterModal()
      showLoginModal()
    })
  }

  // Event listeners para Google
  const googleBtns = document.querySelectorAll('.login-btn-google')
  googleBtns.forEach(btn => {
    btn.addEventListener('click', handleGoogleAuth)
  })

  // Escape key para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (loginModal && loginModal.style.display === 'flex') {
        hideLoginModal()
      }
      if (registerModal && registerModal.style.display === 'flex') {
        hideRegisterModal()
      }
    }
  })
}

// Funciones para mostrar/ocultar modales
function showLoginModal() {
  if (loginModal) {
    loginModal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      const emailInput = document.getElementById('emailPhone')
      if (emailInput) {
        emailInput.focus()
      }
    }, 100)
  }
}

function hideLoginModal() {
  if (loginModal) {
    loginModal.style.display = 'none'
    document.body.style.overflow = ''
  }
}

function showRegisterModal() {
  if (registerModal) {
    registerModal.style.display = 'flex'
    document.body.style.overflow = 'hidden'
    
    setTimeout(() => {
      const nameInput = document.getElementById('registerName')
      if (nameInput) {
        nameInput.focus()
      }
    }, 100)
  }
}

function hideRegisterModal() {
  if (registerModal) {
    registerModal.style.display = 'none'
    document.body.style.overflow = ''
  }
}

// Manejo del login
async function handleLogin(e) {
  e.preventDefault()
  
  const emailInput = document.getElementById('emailPhone')
  let submitBtn = null
  
  if (loginModal) {
    submitBtn = loginModal.querySelector('.login-btn-primary')
  }
  
  if (!emailInput || !submitBtn) return
  
  const email = emailInput.value.trim()
  
  if (!email) {
    showError('Por favor ingresa tu email o teléfono')
    return
  }

  const originalText = submitBtn.textContent
  submitBtn.textContent = 'Enviando...'
  submitBtn.disabled = true

  try {
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      showError('Error al enviar el enlace: ' + error.message)
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    } else {
      submitBtn.textContent = '✓ Enlace enviado'
      submitBtn.style.background = '#00a650'
      showSuccess('Te enviamos un enlace mágico a tu email. Revisa tu bandeja de entrada.')
      
      setTimeout(() => {
        hideLoginModal()
        submitBtn.textContent = originalText
        submitBtn.style.background = '#3483fa'
        submitBtn.disabled = false
        emailInput.value = ''
      }, 3000)
    }
  } catch (error) {
    showError('Error inesperado. Intenta nuevamente.')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

// Manejo del registro
async function handleRegister(e) {
  e.preventDefault()
  
  const nameInput = document.getElementById('registerName')
  const emailInput = document.getElementById('registerEmail')
  const birthdateInput = document.getElementById('registerBirthdate')
  const phoneInput = document.getElementById('registerPhone')
  let submitBtn = null
  
  if (registerModal) {
    submitBtn = registerModal.querySelector('.login-btn-primary')
  }
  
  if (!nameInput || !emailInput || !birthdateInput || !phoneInput || !submitBtn) return
  
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const birthdate = birthdateInput.value
  const phone = phoneInput.value.trim()
  
  // Validaciones
  if (!name || !email || !birthdate || !phone) {
    showError('Por favor completa todos los campos')
    return
  }

  if (!isValidEmail(email)) {
    showError('Por favor ingresa un email válido')
    return
  }

  // Validar edad mínima (18 años)
  const today = new Date()
  const birth = new Date(birthdate)
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (age < 18 || (age === 18 && monthDiff < 0)) {
    showError('Debes ser mayor de 18 años para registrarte')
    return
  }

  const originalText = submitBtn.textContent
  submitBtn.textContent = 'Creando cuenta...'
  submitBtn.disabled = true

  try {
    // Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: generateTempPassword(),
      options: {
        data: {
          name: name,
          phone: phone,
          birthdate: birthdate
        }
      }
    })

    if (error) {
      showError('Error al crear la cuenta: ' + error.message)
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    } else {
      submitBtn.textContent = '✓ Cuenta creada'
      submitBtn.style.background = '#00a650'
      showSuccess('¡Cuenta creada exitosamente! Te enviamos un enlace de confirmación a tu email.')
      
      setTimeout(() => {
        hideRegisterModal()
        submitBtn.textContent = originalText
        submitBtn.style.background = '#3483fa'
        submitBtn.disabled = false
        // Limpiar formulario
        nameInput.value = ''
        emailInput.value = ''
        birthdateInput.value = ''
        phoneInput.value = ''
      }, 3000)
    }
  } catch (error) {
    showError('Error inesperado. Intenta nuevamente.')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

// Funciones auxiliares
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
}

async function handleGoogleAuth() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (error) {
      showError('Error al iniciar sesión con Google: ' + error.message)
    }
  } catch (error) {
    showError('Error inesperado con Google. Intenta nuevamente.')
  }
}

function showError(message) {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 20000;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `
  toast.textContent = message
  
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `
  document.head.appendChild(style)
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.remove()
    style.remove()
  }, 5000)
}

function showSuccess(message) {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00a650;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 20000;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.remove()
  }, 5000)
}

function updateUserHeader(user) {
  const userActions = document.querySelector('.user-actions')
  if (userActions) {
    const userName = user.user_metadata?.name || user.email.split('@')[0]
    userActions.innerHTML = `
      <a href="#">Crea tu cuenta</a>
      <a href="#" class="user-menu">
        <i class="fas fa-user"></i> Hola, ${userName}
      </a>
      <a href="#" id="logoutBtn">Salir</a>
      <a href="#">Mis compras</a>
      <a href="#"><i class="fas fa-shopping-cart"></i></a>
    `
    
    const logoutBtn = document.getElementById('logoutBtn')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
          try {
            await supabase.auth.signOut()
            showSuccess('Sesión cerrada correctamente')
            setTimeout(() => {
              location.reload()
            }, 1000)
          } catch (error) {
            showError('Error al cerrar sesión')
          }
        }
      })
    }
  }
}

// Escuchar cambios de estado de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    if (session && session.user) {
      updateUserHeader(session.user)
      hideLoginModal()
      hideRegisterModal()
      showSuccess('¡Bienvenido a MercadoLibre!')
    }
  } else if (event === 'SIGNED_OUT') {
    const userActions = document.querySelector('.user-actions')
    if (userActions) {
      userActions.innerHTML = `
        <a href="#">Crea tu cuenta</a>
        <a href="#">Ingresa</a>
        <a href="#">Mis compras</a>
        <a href="#"><i class="fas fa-shopping-cart"></i></a>
      `
      // Re-setup event listeners
      setupModals()
    }
  }
})