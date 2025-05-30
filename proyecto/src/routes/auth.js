import { supabase } from '../supabase.js'

// Variables globales para los modales (del auth2)
let loginModal = null
let registerModal = null

// Contenedor de autenticación simple (del auth3)
const authContainer = document.getElementById('auth')

/**
 * Función principal de verificación de autenticación (unificada)
 * Combina el enfoque modal del auth2 con el contenedor simple del auth3
 */
export async function checkAuth() {
  // Inicializar variables después de que el DOM esté cargado
  loginModal = document.getElementById('loginModal')
  registerModal = document.getElementById('registerModal')
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    // Usuario no autenticado
    setupModals() // Configurar modales (auth2)
    
    // Si existe el contenedor auth simple, también configurarlo (auth3)
    if (authContainer) {
      renderSimpleLogin()
    }
  } else {
    // Usuario autenticado
    const user = session.user
    updateUserHeader(user) // Actualizar header principal (auth2)
    
    // Si existe el contenedor auth simple, mostrar info del usuario (auth3)
    if (authContainer) {
      renderSimpleUserInfo(user)
    }
  }
}

/**
 * Renderiza login simple en el contenedor auth (del auth3, mejorado)
 */
function renderSimpleLogin() {
  if (!authContainer) return
  
  authContainer.innerHTML = `
    <form id="loginForm" style="display: flex; gap: 0.5rem; align-items: center;">
      <input type="email" placeholder="Correo electrónico" required style="padding: 0.3rem; border-radius: 4px; border: 1px solid #ccc;" />
      <button type="submit" style="background: #3483fa; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer;">Entrar</button>
    </form>
  `

  const loginForm = document.getElementById('loginForm')
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = e.target[0].value

      const submitBtn = e.target.querySelector('button')
      const originalText = submitBtn.textContent
      submitBtn.textContent = 'Enviando...'
      submitBtn.disabled = true

      try {
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
          showError('Error al enviar correo mágico: ' + error.message)
        } else {
          showSuccess('Revisa tu correo para iniciar sesión')
          e.target[0].value = '' // Limpiar campo
        }
      } catch (error) {
        showError('Error inesperado. Intenta nuevamente.')
      } finally {
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }
    })
  }
}

/**
 * Renderiza información del usuario en el contenedor auth simple (del auth3, mejorado)
 */
function renderSimpleUserInfo(user) {
  if (!authContainer) return
  
  const userName = user.user_metadata?.name || user.email.split('@')[0]
  const userRole = user.user_metadata?.role || 'Usuario'
  
  authContainer.innerHTML = `
    <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.9rem;">
      <p style="margin: 0;">👋 Hola, ${userName} <span style="font-size: 0.8rem; opacity: 0.7;">(${userRole})</span></p>
      <button id="simpleLogoutBtn" style="background: #dc3545; color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Cerrar sesión</button>
    </div>
  `
  
  const logoutBtn = document.getElementById('simpleLogoutBtn')
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

/**
 * Configuración de modales de login/registro (del auth2)
 */
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

// Funciones para mostrar/ocultar modales (del auth2)
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

/**
 * Función exportada para mostrar el modal de login desde otros módulos
 * Útil para la integración con main.js que usa mostrarLogin()
 */
export function mostrarLogin() {
  showLoginModal()
}

// Manejo del login CON CONTRASEÑA (del auth2)
async function handleLogin(e) {
  e.preventDefault()
  
  const emailInput = document.getElementById('emailPhone')
  const passwordInput = document.getElementById('loginPassword')
  let submitBtn = null
  
  if (loginModal) {
    submitBtn = loginModal.querySelector('.login-btn-primary')
  }
  
  if (!emailInput || !passwordInput || !submitBtn) {
    showError('Error: Campos del formulario no encontrados')
    return
  }
  
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  
  if (!email || !password) {
    showError('Por favor ingresa tu email y contraseña')
    return
  }

  if (!isValidEmail(email)) {
    showError('Por favor ingresa un email válido')
    return
  }

  if (password.length < 8) {
    showError('La contraseña debe tener al menos 8 caracteres')
    return
  }

  const originalText = submitBtn.textContent
  submitBtn.textContent = 'Iniciando sesión...'
  submitBtn.disabled = true

  try {
    // Intentar iniciar sesión con email y contraseña
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      // Si falla el login con contraseña, intentar con magic link como fallback
      console.log('Login con contraseña falló, intentando magic link:', error.message)
      
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({ email })
      
      if (magicLinkError) {
        showError('Credenciales incorrectas. Verifica tu email y contraseña.')
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
          passwordInput.value = ''
        }, 3000)
      }
    } else {
      // Login exitoso
      submitBtn.textContent = '✓ Iniciando sesión'
      submitBtn.style.background = '#00a650'
      showSuccess('¡Bienvenido de vuelta!')
      
      setTimeout(() => {
        hideLoginModal()
        submitBtn.textContent = originalText
        submitBtn.style.background = '#3483fa'
        submitBtn.disabled = false
        emailInput.value = ''
        passwordInput.value = ''
      }, 1500)
    }
  } catch (error) {
    console.error('Error inesperado en login:', error)
    showError('Error inesperado. Intenta nuevamente.')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

// Manejo del registro CON CONTRASEÑA Y ROL (del auth2)
async function handleRegister(e) {
  e.preventDefault()
  
  const nameInput = document.getElementById('registerName')
  const emailInput = document.getElementById('registerEmail')
  const passwordInput = document.getElementById('registerPassword')
  const birthdateInput = document.getElementById('registerBirthdate')
  const phoneInput = document.getElementById('registerPhone')
  const roleInput = document.getElementById('registerRole')
  let submitBtn = null
  
  if (registerModal) {
    submitBtn = registerModal.querySelector('.login-btn-primary')
  }
  
  if (!nameInput || !emailInput || !passwordInput || !birthdateInput || !phoneInput || !roleInput || !submitBtn) {
    showError('Error: Campos del formulario no encontrados')
    return
  }
  
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const birthdate = birthdateInput.value
  const phone = phoneInput.value.trim()
  const role = roleInput.value
  
  // Validaciones
  if (!name || !email || !password || !birthdate || !phone || !role) {
    showError('Por favor completa todos los campos')
    return
  }

  if (!isValidEmail(email)) {
    showError('Por favor ingresa un email válido')
    return
  }

  if (password.length < 8) {
    showError('La contraseña debe tener al menos 8 caracteres')
    return
  }

  if (!isValidPassword(password)) {
    showError('La contraseña debe contener al menos una letra mayúscula, una minúscula y un número')
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

  // Validar rol
  const validRoles = ['comprador', 'vendedor', 'admin']
  if (!validRoles.includes(role)) {
    showError('Por favor selecciona un tipo de cuenta válido')
    return
  }

  const originalText = submitBtn.textContent
  submitBtn.textContent = 'Creando cuenta...'
  submitBtn.disabled = true

  try {
    // Registrar en Supabase Auth con contraseña
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          phone: phone,
          birthdate: birthdate,
          role: role,
          created_at: new Date().toISOString()
        }
      }
    })

    if (error) {
      console.error('Error en registro:', error)
      
      if (error.message.includes('User already registered')) {
        showError('Este email ya está registrado. Intenta iniciar sesión.')
      } else if (error.message.includes('Password should be at least')) {
        showError('La contraseña debe tener al menos 8 caracteres')
      } else {
        showError('Error al crear la cuenta: ' + error.message)
      }
      
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    } else {
      // Registro exitoso
      submitBtn.textContent = '✓ Cuenta creada'
      submitBtn.style.background = '#00a650'
      
      if (data.user && !data.user.email_confirmed_at) {
        showSuccess('¡Cuenta creada exitosamente! Te enviamos un enlace de confirmación a tu email.')
      } else {
        showSuccess('¡Cuenta creada y confirmada exitosamente!')
      }
      
      // Intentar crear el perfil en una tabla personalizada (opcional)
      try {
        await createUserProfile(data.user, { name, phone, birthdate, role })
      } catch (profileError) {
        console.warn('No se pudo crear el perfil completo:', profileError)
      }
      
      setTimeout(() => {
        hideRegisterModal()
        submitBtn.textContent = originalText
        submitBtn.style.background = '#3483fa'
        submitBtn.disabled = false
        // Limpiar formulario
        nameInput.value = ''
        emailInput.value = ''
        passwordInput.value = ''
        birthdateInput.value = ''
        phoneInput.value = ''
        roleInput.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Error inesperado en registro:', error)
    showError('Error inesperado. Intenta nuevamente.')
    submitBtn.textContent = originalText
    submitBtn.disabled = false
  }
}

// Función para crear perfil de usuario (del auth2)
async function createUserProfile(user, profileData) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          email: user.email,
          name: profileData.name,
          phone: profileData.phone,
          birthdate: profileData.birthdate,
          role: profileData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    
    if (error) {
      console.warn('Error al crear perfil:', error)
    } else {
      console.log('Perfil creado exitosamente:', data)
    }
  } catch (error) {
    console.warn('Error inesperado al crear perfil:', error)
  }
}

// Funciones auxiliares (del auth2)
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

async function handleGoogleAuth() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      showError('Error al iniciar sesión con Google: ' + error.message)
    }
  } catch (error) {
    showError('Error inesperado con Google. Intenta nuevamente.')
  }
}

// Funciones de notificaciones (del auth2)
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
  if (!document.head.querySelector('style[data-toast="true"]')) {
    style.setAttribute('data-toast', 'true')
    document.head.appendChild(style)
  }
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.remove()
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

/**
 * Actualizar header principal (del auth2, mejorado)
 */
function updateUserHeader(user) {
  const userActions = document.querySelector('.user-actions')
  if (userActions) {
    const userName = user.user_metadata?.name || user.email.split('@')[0]
    const userRole = user.user_metadata?.role || 'Usuario'
    
    userActions.innerHTML = `
      <a href="#" class="user-menu">
        <i class="fas fa-user"></i> Hola, ${userName}
        <small style="display: block; font-size: 10px; opacity: 0.8;">${userRole}</small>
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

// Escuchar cambios de estado de autenticación (del auth2, mejorado)
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email)
  
  if (event === 'SIGNED_IN') {
    if (session && session.user) {
      updateUserHeader(session.user) // Actualizar header principal
      hideLoginModal()
      hideRegisterModal()
      showSuccess('¡Bienvenido a MercadoLibre!')
      
      // También actualizar el contenedor simple si existe
      if (authContainer) {
        renderSimpleUserInfo(session.user)
      }
    }
  } else if (event === 'SIGNED_OUT') {
    // Restaurar estado no autenticado
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
    
    // También actualizar el contenedor simple si existe
    if (authContainer) {
      renderSimpleLogin()
    }
  }
})

// Función global para toggle de contraseña (del auth2)
window.togglePassword = function(inputId) {
  const input = document.getElementById(inputId)
  if (!input) return
  
  const icon = input.nextElementSibling?.querySelector('i')
  if (!icon) return
  
  if (input.type === 'password') {
    input.type = 'text'
    icon.classList.remove('fa-eye')
    icon.classList.add('fa-eye-slash')
  } else {
    input.type = 'password'
    icon.classList.remove('fa-eye-slash')
    icon.classList.add('fa-eye')
  }
}