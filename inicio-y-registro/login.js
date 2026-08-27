document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");
  
  // Referencias para la visibilidad de la contraseña
  const toggleBtn = document.querySelector(".toggle-password");
  const iconEye = toggleBtn?.querySelector(".icon-eye");
  const iconEyeOff = toggleBtn?.querySelector(".icon-eye-off");

  // --- LÓGICA MOSTRAR / OCULTAR CONTRASEÑA ---
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      
      // Cambiar tipo de input
      passwordInput.type = isPassword ? "text" : "password";

      // Cambiar íconos SVG
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

  // --- PERSISTENCIA 'RECORDARME' ---
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  // --- MANEJO DEL SUBMIT E INICIO DE SESIÓN ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }

    // Obtener la lista guardada en el registro
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar coincidencia de credenciales
    const userFound = usuarios.find(
      (user) => user.email === email && user.password === password
    );

    if (!userFound) {
      alert("Correo electrónico o contraseña incorrectos.");
      return;
    }

    // Guardar preferencia de correo
    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Persistir sesión activa
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(userFound));

    alert("¡Inicio de sesión exitoso!");

    // Redirigir al inicio del sitio
    window.location.href = "../index.html";
  });
});