import { supabase } from "../supabase.js";
import { mostrarRegistro } from "./registro.js";

export function mostrarLogin() {
  const app = document.querySelector("#app");

  // Inyecta el HTML del formulario de login
  app.innerHTML = `
    <form id="login-form">
      <h2>Iniciar Sesión</h2>
      <input type="email" name="email" placeholder="Correo electrónico" required />
      <input type="password" name="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      <button type="button" id="btn-registro">Registrarse</button>
    </form>
  `;

  // Ya que el HTML está en el DOM, ahora sí puedes usar querySelector
  const form = document.querySelector("#login-form");
  const btnRegistro = document.querySelector("#btn-registro");

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

  btnRegistro.addEventListener("click", () => {
    mostrarRegistro();
  });
}

