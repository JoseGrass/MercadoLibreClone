import { supabase } from "../supabase.js";
import { mostrarRegistro } from "./registro.js";  // Descomentar para poder llamar al registro

export function mostrarLogin() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <aside class="formulario-login">
      <h2>Iniciar sesión</h2>
      <form id="login-form">
        <input type="email" id="email" placeholder="Correo electrónico" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <button type="submit">Ingresar</button>
      </form>
      <h2>¿No tienes cuenta?</h2>
      <button id="btn-registro">Regístrate</button>
    </aside>
  `;

  // Manejo del login
  const form = document.querySelector("#login-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al iniciar sesión: " + error.message);
    } else {
      alert("Bienvenido, " + data.user.email);
      location.reload(); // Recargar la página para que se muestre el contenido protegido
    }
  });

  // Cambio a vista de registro
  document.querySelector("#btn-registro").addEventListener("click", () => {
    mostrarRegistro();
  });
}
