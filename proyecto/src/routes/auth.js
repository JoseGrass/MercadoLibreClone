import { supabase } from '../supabase.js'

const authContainer = document.getElementById('auth')

export async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    renderLogin()
  } else {
    const user = session.user
    authContainer.innerHTML = `
      <p>👋 Hola, ${user.email} 
      <button id="logoutBtn">Cerrar sesión</button></p>
    `
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await supabase.auth.signOut()
      location.reload()
    })
  }
}

function renderLogin() {
  authContainer.innerHTML = `
    <form id="loginForm">
      <input type="email" placeholder="Correo electrónico" required />
      <button type="submit">Entrar</button>
    </form>
  `

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target[0].value

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert('Error al enviar correo mágico')
    } else {
      alert('Revisa tu correo para iniciar sesión')
    }
  })
}
