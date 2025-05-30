import { supabase } from "../supabase.js";
import { mostrarRegistro } from "./registro.js";  // Descomentar para poder llamar al registro

export function mostrarLogin() {
  const app = document.querySelector("#app");

  

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