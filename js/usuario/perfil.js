import { apiFetch } from "../api/api.js";

window.addEventListener("pageshow", (event) => {

    if (event.persisted) {
        window.location.reload();
    }

});

document.addEventListener("DOMContentLoaded", async () => {

    // =========================================================
    // OBTENER USUARIO AUTENTICADO
    // =========================================================

    let usuario;

    try {

        // apiFetch envía automáticamente la cookie HttpOnly
        usuario = await apiFetch("/api/perfil");

    } catch (error) {

        console.error("Error al obtener el perfil:", error);

        Swal.fire({
            icon: "error",
            title: "Sesión no válida",
            text: "Debes iniciar sesión para acceder a tu perfil."
        }).then(() => {

            window.location.href = "../auth/inicio-sesion.html";

        });

        return;
    }


    // =========================================================
    // MOSTRAR FOTO DE PERFIL
    // =========================================================

    const avatar = document.querySelector(".avatar");

    if (usuario.fotoPerfil) {

        avatar.innerHTML = `
            <img src="${usuario.fotoPerfil}" alt="Foto de perfil">
        `;

    }


    // =========================================================
    // MOSTRAR DATOS DEL USUARIO
    // =========================================================

    document.getElementById("nombreUsuario").textContent =
        `${usuario.nombre} ${usuario.apellido}`;

    document.getElementById("correoUsuario").textContent =
        usuario.email;

    document.getElementById("telefonoUsuario").textContent =
        usuario.telefono;


    // =========================================================
    // HISTORIAL DE RESERVAS
    // =========================================================

    mostrarHistorialReservas(usuario);


    // =========================================================
    // EDITAR DATOS
    // =========================================================

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
                        document.getElementById("nuevoNombre")
                            .value
                            .trim();

                    const apellido =
                        document.getElementById("nuevoApellido")
                            .value
                            .trim();

                    const telefono =
                        document.getElementById("nuevoTelefono")
                            .value
                            .trim();


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

                    // No enviamos Authorization.
                    // La cookie HttpOnly se envía automáticamente.

                    const usuarioActualizado =
                        await apiFetch("/api/perfil", {

                            method: "PUT",

                            body: JSON.stringify({

                                nombre: nuevosDatos.nombre,

                                apellido: nuevosDatos.apellido,

                                telefono: nuevosDatos.telefono

                            })

                        });


                    usuario = usuarioActualizado;


                    // Actualizar información visible

                    document.getElementById("nombreUsuario")
                        .textContent =
                        `${usuario.nombre} ${usuario.apellido}`;

                    document.getElementById("telefonoUsuario")
                        .textContent =
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

                        text:
                            error.message ||
                            "No fue posible actualizar tus datos."

                    });

                }

            });

        })

    }


    // =========================================================
    // EDITAR FOTO
    // =========================================================

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


                avatar.innerHTML = `
                    <img src="${imagen}" alt="Foto de perfil">
                `;


                usuario.fotoPerfil = imagen;


                Swal.fire({

                    icon: "success",

                    title: "¡Foto actualizada!",

                    text:
                        "Tu foto de perfil se actualizó visualmente. " +
                        "La conexión con el backend está pendiente."

                });

            };


            lector.readAsDataURL(archivo);

        });

    }


    // =========================================================
    // CAMBIAR CONTRASEÑA
    // =========================================================

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
                        document.getElementById("passwordActual")
                            .value;

                    const nuevaPassword =
                        document.getElementById("nuevaPassword")
                            .value;

                    const confirmarPassword =
                        document.getElementById("confirmarPassword")
                            .value;


                    if (
                        !passwordActual ||
                        !nuevaPassword ||
                        !confirmarPassword
                    ) {

                        Swal.showValidationMessage(
                            "Completa todos los campos."
                        );

                        return false;
                    }


                    const passwordRegex =
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;


                    if (!passwordRegex.test(nuevaPassword)) {

                        Swal.showValidationMessage(
                            "La nueva contraseña debe tener al menos " +
                            "8 caracteres, una mayúscula, un número " +
                            "y un carácter especial."
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
                            "La nueva contraseña debe ser diferente " +
                            "a la actual."
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

                    // La cookie HttpOnly se envía automáticamente.

                    await apiFetch(
                        "/auth/cambiar-password",
                        {

                            method: "POST",

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

                        text:
                            "Tu contraseña se cambió correctamente."

                    });


                } catch (error) {

                    console.error(
                        "Error al cambiar la contraseña:",
                        error
                    );


                    Swal.fire({

                        icon: "error",

                        title:
                            "No se pudo cambiar la contraseña",

                        text:
                            error.message ||
                            "Verifica tu contraseña actual."

                    });

                }

            });

        })

    }


    // =========================================================
    // CERRAR SESIÓN
    // =========================================================

    const botonCerrarSesion =
        document.getElementById("cerrarSesion");


    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener("click", async () => {

            try {

                // Le pedimos al backend eliminar la cookie.

                await apiFetch("/auth/logout", {

                    method: "POST"

                });


                // Volvemos al index.

                window.location.href = "../../index.html";


            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );


                Swal.fire({

                    icon: "error",

                    title: "Error",

                    text:
                        "No fue posible cerrar la sesión."

                });

            }

        });

    }

});


// =========================================================
// HISTORIAL DE RESERVAS
// =========================================================

const mostrarHistorialReservas = (usuario) => {

    if (!usuario) {
        return;
    }


    const reservas =
        JSON.parse(
            localStorage.getItem("reservas")
        ) || [];


    const historial =
        document.getElementById("historialReservas");


    if (!historial) {
        return;
    }


    const misReservas =
        reservas.filter(
            reserva =>
                reserva.email === usuario.email
        );


    historial.innerHTML = "";


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


    misReservas.forEach(reserva => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `
            <td>${reserva.fecha}</td>

            <td>${reserva.hora}</td>

            <td>${reserva.nombreCancha}</td>

            <td>
                $${Number(reserva.total).toLocaleString("es-CO")}
            </td>

            <td>
                <span class="estado-reserva">
                    Confirmada
                </span>
            </td>
        `;


        historial.appendChild(fila);

    });

};
