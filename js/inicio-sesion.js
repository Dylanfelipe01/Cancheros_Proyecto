import { apiFetch } from "./api.js";

export const correoAdmin = "admin@dominio.com";
export const claveAdmin = "admin123456#";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");
  const toggleBtn = document.querySelector(".toggle-password");
  const iconEye = toggleBtn?.querySelector(".icon-eye");
  const iconEyeOff = toggleBtn?.querySelector(".icon-eye-off");

  // Ojito de mostrar contraseña
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      if (isPassword) {
        iconEye.style.display = "none";
        iconEyeOff.style.display = "block";
        toggleBtn.setAttribute("aria-label", "Ocultar contraseña");
      } else {
        iconEye.style.display = "block";
        iconEyeOff.style.display = "none";
        toggleBtn.setAttribute("aria-label", "Mostrar contraseña");
      }
    });
  }

  // Recordarme
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  //Inicio de sesion
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    if (!email.includes("@")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    if(correoAdmin == email && claveAdmin == password){
      window.location.href = "./panel-administrador.html";
      localStorage.setItem("currentUser", JSON.stringify({
        email: email, 
        password: password
      }));
<<<<<<< HEAD:js/inicio-sesion.js
      return;
    }

    // Obtener la lista guardada en el registro
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar coincidencia de credenciales
    const userFound = usuarios.find(
      (user) => user.email === email && user.password === password
    );

    if (!userFound) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Correo electrónico o contraseña incorrectos.",
      });
      
=======
>>>>>>> ramaNuevaDannis:js/login.js
      return;
    }

    // Iniciar sesión mediante el backend
    try {

<<<<<<< HEAD:js/inicio-sesion.js
    // Persistir sesión activa
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userFound));

    Swal.fire({
        icon: "good",
        title: "¡Que bien!",
        text: "¡Inicio de sesión exitoso!",
    });

    // Redirigir al inicio del sitio
    window.location.href = "./canchas.html";
=======
      const respuesta = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      // Guardar preferencia de correo
      if (rememberCheckbox.checked) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Guardar token de autenticación
      localStorage.setItem("token", respuesta.token);

      // Persistir sesión activa
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify(respuesta.usuario)
      );

      Swal.fire({
          icon: "success",
          title: "¡Que bien!",
          text: "¡Inicio de sesión exitoso!",
          }).then(() => {
      window.location.href = "../index.html";
      });

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Correo electrónico o contraseña incorrectos.",
      });

    }
>>>>>>> ramaNuevaDannis:js/login.js
  });
});