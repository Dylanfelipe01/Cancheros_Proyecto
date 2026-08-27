document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");

 
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  // 2. Manejar el evento de inicio de sesión
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Validaciones básicas de entrada
    if (!email || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      alert("Por favor ingresa un correo electrónico válido.");
      return;
    }

    // Obtener los datos almacenados durante el registro (estructura simulada o real de Kevin)
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser"));

    // Validar coincidencia de credenciales
    if (!registeredUser) {
      alert("No hay ningún usuario registrado aún. Por favor regístrate.");
      return;
    }

    if (registeredUser.email !== email || registeredUser.password !== password) {
      alert("Correo electrónico o contraseña incorrectos.");
      return;
    }

    // Manejo de la función "Recordarme"
    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Persistir estado de sesión activa
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(registeredUser));

    alert("¡Inicio de sesión exitoso!");
    // window.location.href = "dashboard.html"; // Redirección al panel principal
  });
});