window.addEventListener("pageshow", (event) => {

    if (event.persisted) {
        window.location.reload();
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("currentUser"); // obtener el usuario que inició sesión
import { apiFetch } from "./api.js";

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    // obtener el usuario que inició sesión
    const token = localStorage.getItem("token");

    // si no existe un token regresar al login
    if (!token) {
        window.location.href = "inicio-sesion.html";
        return;
    }

    let usuario;

    // Obtener usuario desde el backend
    try {
        usuario = await apiFetch("/api/perfil", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Guardar temporalmente los datos recibidos
        localStorage.setItem(
            "currentUser",
            JSON.stringify(usuario)
        );

    } catch (error) {

        console.error("Error al obtener el perfil:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        Swal.fire({
            icon: "error",
            title: "Sesión no válida",
            text: "No fue posible cargar tu perfil."
        }).then(() => {
            window.location.href = "inicio-sesion.html";
        });
        return;
    }

    // que no se borre la foto subida al recargar la pagina
    const avatar = document.querySelector(".avatar");

    if (usuario.fotoPerfil) {

        avatar.innerHTML = `
            <img src="${usuario.fotoPerfil}" alt="Foto de perfil">
        `;

    }


    // mostrar los datos del usuario

    document.getElementById("nombreUsuario").textContent =
        `${usuario.nombre} ${usuario.apellido}`;
    document.getElementById("correoUsuario").textContent =
        usuario.email;
    document.getElementById("telefonoUsuario").textContent =
        usuario.telefono;

    mostrarHistorialReservas(usuario);

     // fncionalidad de editar datos de contacto

    const botonEditarDatos =
        document.getElementById("editarDatos");

    if (botonEditarDatos) {

        botonEditarDatos.addEventListener("click", () => {

            Swal.fire({

                title: "Editar datos",

                html: `
                    <input 
                        type="text" 
                        id="nuevoNombre" 
                        class="swal2-input"
                        placeholder="Nombre"
                        value="${usuario.nombre}"
                    >

                    <input 
                        type="text" 
                        id="nuevoApellido" 
                        class="swal2-input"
                        placeholder="Apellido"
                        value="${usuario.apellido}"
                    >

                    <input 
                        type="tel" 
                        id="nuevoTelefono" 
                        class="swal2-input"
                        placeholder="Número de contacto"
                        value="${usuario.telefono}"
                    >
                `,

                showCancelButton: true,

                confirmButtonText: "Guardar cambios",

                cancelButtonText: "Cancelar",

                focusConfirm: false,

                preConfirm: () => {

                    const nombre =
                        document.getElementById("nuevoNombre").value.trim();

                    const apellido =
                        document.getElementById("nuevoApellido").value.trim();

                    const telefono =
                        document.getElementById("nuevoTelefono").value.trim();


                    if (!nombre || !apellido || !telefono) {

                        Swal.showValidationMessage(
                            "Completa todos los campos."
                        );

                        return false;

                    }


                    return {

                        nombre,
                        apellido,
                        telefono

                    };

                }

            }).then(async (resultado) => {

                if (!resultado.isConfirmed) {

                    return;

                }


                const nuevosDatos = resultado.value;

                try {

                    // Actualizar datos en el backend

                    const usuarioActualizado = await apiFetch(
                        "/api/perfil",
                        {
                            method: "PUT",

                            headers: {
                                "Authorization": `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                nombre: nuevosDatos.nombre,

                                apellido: nuevosDatos.apellido,

                                telefono: nuevosDatos.telefono

                            })
                        }
                    );


                    // actualizar usuario actual

                    usuario = usuarioActualizado;

                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(usuario)
                    );


                    // actualizar información visible

                    document.getElementById("nombreUsuario").textContent =
                        `${usuario.nombre} ${usuario.apellido}`;

                    document.getElementById("telefonoUsuario").textContent =
                        usuario.telefono;


                    Swal.fire({

                        icon: "success",

                        title: "Datos actualizados",

                        text: "Tus datos se actualizaron correctamente."

                    });


                } catch (error) {

                    console.error(
                        "Error al actualizar el perfil:",
                        error
                    );

                    Swal.fire({

                        icon: "error",

                        title: "Error",

                        text: error.message ||
                            "No fue posible actualizar tus datos."

                    });

                }
            });

        });
    }

    //editar foto de perfil
    const botonEditarFoto =
        document.getElementById("editarFoto");
    const inputFoto =
        document.getElementById("inputFoto");

    if (botonEditarFoto && inputFoto) {
        botonEditarFoto.addEventListener("click", () => {
            inputFoto.click();
        });

        inputFoto.addEventListener("change", () => {
            const archivo = inputFoto.files[0];
            if (!archivo) {
                return;
            }

            //esto para verificar que si sea una imagen
            if (!archivo.type.startsWith("image/")) {
                Swal.fire({
                    icon: "error",
                    title: "Archivo no válido",
                    text: "Por favor selecciona una imagen."
                });
                return;
            }

            const lector = new FileReader();
            lector.onload = () => {
                const imagen = lector.result;

                // para mostrar la imagen en el perfil
                avatar.innerHTML = ` 
                    <img src="${imagen}" alt="Foto de perfil">
                `;

                // obtener el usuario actual
                usuario.fotoPerfil = imagen;


                // guardar foto en el usuario
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(usuario)
                );

                Swal.fire({
                    icon: "success",
                    title: "¡Foto actualizada!",
                    text: "Tu foto de perfil se actualizó visualmente. La conexión con el backend está pendiente."
                });
            };


            lector.readAsDataURL(archivo);
        });
    }

    //cambiar contraseña

    const botonCambiarPassword =
        document.getElementById("cambiarPassword");


    if (botonCambiarPassword) {

        botonCambiarPassword.addEventListener("click", () => {

            Swal.fire({

                title: "Cambiar contraseña",

                html: `
                    <input 
                        type="password"
                        id="passwordActual"
                        class="swal2-input"
                        placeholder="Contraseña actual"
                    >

                    <input 
                        type="password"
                        id="nuevaPassword"
                        class="swal2-input"
                        placeholder="Nueva contraseña"
                    >

                    <input 
                        type="password"
                        id="confirmarPassword"
                        class="swal2-input"
                        placeholder="Confirmar nueva contraseña"
                    >
                `,

                showCancelButton: true,

                confirmButtonText: "Guardar contraseña",

                cancelButtonText: "Cancelar",

                focusConfirm: false,

                preConfirm: () => {

                    const passwordActual =
                        document.getElementById("passwordActual").value;

                    const nuevaPassword =
                        document.getElementById("nuevaPassword").value;

                    const confirmarPassword =
                        document.getElementById("confirmarPassword").value;


                    if (!passwordActual || !nuevaPassword || !confirmarPassword) {

                        Swal.showValidationMessage(
                            "Completa todos los campos."
                        );

                        return false;

                    }


                    const passwordRegex =
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;


                    if (!passwordRegex.test(nuevaPassword)) {

                        Swal.showValidationMessage(

                            "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."

                        );

                        return false;

                    }


                    if (nuevaPassword !== confirmarPassword) {

                        Swal.showValidationMessage(

                            "Las nuevas contraseñas no coinciden."

                        );

                        return false;

                    }


                    if (nuevaPassword === passwordActual) {

                        Swal.showValidationMessage(

                            "La nueva contraseña debe ser diferente a la actual."

                        );

                        return false;

                    }


                    return {

                        passwordActual,

                        nuevaPassword

                    };

                }

            }).then(async (resultado) => {

                if (!resultado.isConfirmed) {

                    return;

                }


                const datosPassword = resultado.value;


                try {

                    // Cambiar contraseña en el backend

                    await apiFetch(
                        "/auth/cambiar-password",
                        {
                            method: "POST",

                            headers: {
                                "Authorization": `Bearer ${token}`
                            },

                            body: JSON.stringify({

                                passwordActual:
                                    datosPassword.passwordActual,

                                nuevaPassword:
                                    datosPassword.nuevaPassword

                            })
                        }
                    );


                    Swal.fire({

                        icon: "success",

                        title: "¡Contraseña actualizada!",

                        text: "Tu contraseña se cambió correctamente."

                    });


                } catch (error) {

                    console.error(
                        "Error al cambiar la contraseña:",
                        error
                    );

                    Swal.fire({

                        icon: "error",

                        title: "No se pudo cambiar la contraseña",

                        text: error.message ||
                            "Verifica tu contraseña actual."

                    });

                }

            });

        });

    }

    //para que cuando el usuario cierre sesion vuelva a mostrar Entrar
    const botonCerrarSesion =
        document.getElementById("cerrarSesion");
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("isLoggedIn");
            window.location.href = "../index.html";
        });
    }
});

//historial de reservas por usuario
const mostrarHistorialReservas = (usuario) => {
    if (!usuario) {
        return;
    }

    // obtener todas las reservas
    const reservas =
        JSON.parse(localStorage.getItem("reservas")) || [];

    // Buscar el elemento donde mostrar las reservas
    const historial =
        document.getElementById("historialReservas");

    if (!historial) {
        return;
    }

    // filtro de solamente las reservas del usuario actual
    const misReservas = reservas.filter(
        reserva => reserva.email === usuario.email
    );

    // limpiar la tabla
    historial.innerHTML = "";

    // si no tiene reservas
    if (misReservas.length === 0) {
        historial.innerHTML = `
            <tr>
                <td colspan="5">
                    No tienes reservas registradas.
                </td>
            </tr>
        `;
        return;
    }

    // mostrar cada reserva
    misReservas.forEach(reserva => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td>${reserva.nombreCancha}</td>
            <td>$${Number(reserva.total).toLocaleString("es-CO")}</td>
            <td>
                <span class="estado-reserva">
                    Confirmada
                </span>
            </td>
        `;
        historial.appendChild(fila);
    });
};