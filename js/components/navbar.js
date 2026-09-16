import { apiFetch } from "../api/api.js";

document.addEventListener("DOMContentLoaded", async () => {

    let usuario = null;

    try {

        usuario = await apiFetch("/api/perfil");

    } catch (error) {

        console.log("No hay una sesión activa.");

    }

    const userDropdown = document.querySelector(".userDropdown");
    const userMenu = document.querySelector(".userMenu");

    if (!userDropdown || !userMenu) {
        return;
    }

    if (usuario) {

        userDropdown.textContent = `Hola, ${usuario.nombre}`;

        userMenu.innerHTML = `
            <li>
                <a class="dropdown-item" href="${ruta("usuario", "perfil.html")}">
                    Mi perfil
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="${ruta("usuario", "mis-reservas.html")}">
                    Mis reservas
                </a>
            </li>

            <li>
                <hr class="dropdown-divider">
            </li>

            <li>
                <button type="button" class="cerrarSesion dropdown-item">
                    Cerrar sesión
                </button>
            </li>
        `;

        const cerrarSesion = document.querySelector(".cerrarSesion");

        cerrarSesion.addEventListener("click", async (e) => {

            e.preventDefault();

            try {

                await apiFetch("/auth/logout", {
                    method: "POST"
                });

                window.location.href = rutaInicio();

            } catch (error) {

                console.error("Error al cerrar sesión:", error);

            }

        });

    } else {

        userDropdown.textContent = "Entrar";

        userMenu.innerHTML = `
            <li>
                <a class="dropdown-item" href="${ruta("auth", "inicio-sesion.html")}">
                    Iniciar sesión
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="${ruta("auth", "registro.html")}">
                    Registrarse
                </a>
            </li>
        `;
    }

});


function ruta(seccion, pagina) {

    return window.location.pathname.includes("/pages/")
        ? `../${seccion}/${pagina}`
        : `./pages/${seccion}/${pagina}`;
}


function rutaInicio() {

    return window.location.pathname.includes("/pages/")
        ? "../../index.html"
        : "./index.html";
}