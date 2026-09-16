import { apiFetch } from "../api/api.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const passwordInput = document.getElementById("password");
    const password2Input = document.getElementById("password2");

    // Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    // Si no existe token, no podemos restablecer la contraseña
    if (!token) {

        Swal.fire({
            icon: "error",
            title: "Enlace inválido",
            text: "No encontramos un token de recuperación válido."
        }).then(() => {
            window.location.href = "recuperar-password.html";
        });

        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const password = passwordInput.value;
        const password2 = password2Input.value;

        if (!password || !password2) {

            Swal.fire({
                icon: "error",
                title: "Campos requeridos",
                text: "Completa ambos campos de contraseña."
            });

            return;
        }

        if (!passwordRegex.test(password)) {

            Swal.fire({
                icon: "error",
                title: "Contraseña inválida",
                text: "Debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial."
            });

            return;
        }

        if (password !== password2) {

            Swal.fire({
                icon: "error",
                title: "Las contraseñas no coinciden",
                text: "Verifica que ambas contraseñas sean iguales."
            });

            return;
        }

        try {

            await apiFetch("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    token: token,
                    nuevaPassword: password
                })
            });

            sessionStorage.removeItem("recoveryEmail");

            await Swal.fire({
                icon: "success",
                title: "¡Contraseña actualizada!",
                text: "Tu contraseña fue restablecida correctamente."
            });

            window.location.href = "inicio-sesion.html";

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "No se pudo cambiar la contraseña",
                text: error.message ||
                    "El enlace puede haber expirado o no ser válido."
            });
        }
    });
});