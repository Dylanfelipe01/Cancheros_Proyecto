document.addEventListener("DOMContentLoaded", () => {
    
    const estaLogueado = localStorage.getItem("isLoggedIn") === "true";

    // Obtener el usuario actual
    const usuario = JSON.parse(localStorage.getItem("currentUser"));
    const userDropdown = document.querySelector(".userDropdown");
    const userMenu = document.querySelector(".userMenu");

    if (!userDropdown || !userMenu) {
        return;
    }
    
    if (estaLogueado && usuario) {
        userDropdown.textContent = `Hola, ${usuario.nombre}`;
        userMenu.innerHTML = `
            <li>
                <a class="dropdown-item" href="${ruta("perfil.html")}">
                    Mi perfil
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="${ruta("mis-reservas.html")}">
                    Mis reservas
                </a>
            </li>

            <li><hr class="dropadown-divider"></li>

            <li>
                <button type="button" class="cerrarSesion dropdown-item">
                    Cerrar sesión
                </button>
            </li>
        `;

        if(userMenu){
            const cerrarSesion = document.querySelector(".cerrarSesion");
            cerrarSesion.addEventListener("click", (e) => {
                e.preventDefault();
    
                // Validación antes de cerrar sesión
                const estaLogueado =
                    localStorage.getItem("isLoggedIn") === "true";
    
                if (estaLogueado) {
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("currentUser");
                    localStorage.removeItem("token");
                    window.location.href = "../index.html";
                }
            });
        }
    } else {
        userDropdown.textContent = "Entrar";
        userMenu.innerHTML = `
            <li>
                <a class="dropdown-item" href="${ruta("./inicio-sesion.html")}">
                    Iniciar sesión
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="${ruta("./registro.html")}">
                    Registrarse
                </a>
            </li>
        `;
    }
});

function ruta(pagina) {
    return window.location.pathname.includes("/html/")
        ? `./${pagina}`
        : `./html/${pagina}`;
}
