
// =====================================================
// MIS RESERVAS
// =====================================================


// =====================================================
// OBTENER RESERVAS DEL LOCAL STORAGE
// =====================================================

const obtenerReservas = () => {

    return JSON.parse(
        localStorage.getItem("reservas")
    ) || [];

};


// =====================================================
// OBTENER USUARIO ACTUAL
// =====================================================

const obtenerUsuarioActual = () => {

    /*
     * Aquí vamos a buscar el usuario que inició sesión.
     *
     * Por ahora revisamos varias claves posibles
     * para adaptarnos a tu login actual.
     */

    const usuario =
        JSON.parse(localStorage.getItem("usuario")) ||
        JSON.parse(localStorage.getItem("usuarioActual")) ||
        JSON.parse(localStorage.getItem("user"));

    return usuario;

};


// =====================================================
// ELEMENTOS HTML
// =====================================================

const listaReservas =
    document.getElementById("listaReservas");

const sinReservas =
    document.getElementById("sinReservas");


// =====================================================
// MODAL
// =====================================================

const modalElement =
    document.getElementById("modalEditarReserva");

const modalEditar =
    new bootstrap.Modal(modalElement);


// =====================================================
// CAMPOS DEL MODAL
// =====================================================

const editarCancha =
    document.getElementById("editarCancha");

const editarFecha =
    document.getElementById("editarFecha");

const editarHora =
    document.getElementById("editarHora");

const editarPrecio =
    document.getElementById("editarPrecio");

const guardarCambios =
    document.getElementById("guardarCambios");


// =====================================================
// RESERVA SELECCIONADA
// =====================================================

let reservaSeleccionada = null;


// =====================================================
// OBTENER FECHA Y HORA ACTUAL
// =====================================================

const obtenerFechaHoraActual = () => {

    return new Date();

};


// =====================================================
// CONVERTIR FECHA + HORA
// =====================================================

const convertirFechaHora = (fecha, hora) => {

    return new Date(`${fecha}T${hora}`);

};


// =====================================================
// OBTENER RESERVAS DEL USUARIO
// =====================================================

const obtenerReservasDelUsuario = () => {

    const reservas =
        obtenerReservas();

    const usuario =
        obtenerUsuarioActual();


    /*
     * Si todavía no tenemos un usuario guardado,
     * mostramos las reservas.
     *
     * Esto nos permite probar mientras terminamos
     * el sistema de login.
     */

    if (!usuario) {

        return reservas;

    }


    /*
     * Intentamos identificar al usuario
     * utilizando el correo.
     */

    if (usuario.email) {

        return reservas.filter(reserva =>
            reserva.email === usuario.email
        );

    }


    /*
     * También soportamos correoElectronico
     * por si tu login utiliza ese nombre.
     */

    if (usuario.correo) {

        return reservas.filter(reserva =>
            reserva.email === usuario.correo
        );

    }


    return reservas;

};


// =====================================================
// OBTENER SOLO RESERVAS FUTURAS
// =====================================================

const obtenerReservasFuturas = () => {

    const reservas =
        obtenerReservasDelUsuario();

    const ahora =
        obtenerFechaHoraActual();


    return reservas.filter(reserva => {

        const fechaHoraReserva =
            convertirFechaHora(
                reserva.fecha,
                reserva.hora
            );

        return fechaHoraReserva > ahora;

    });

};


// =====================================================
// FORMATEAR FECHA
// =====================================================

const formatearFecha = (fecha) => {

    const [año, mes, dia] =
        fecha.split("-");

    return `${dia}/${mes}/${año}`;

};


// =====================================================
// FORMATEAR PRECIO
// =====================================================

const formatearPrecio = (precio) => {

    return Number(precio)
        .toLocaleString("es-CO");

};


// =====================================================
// MOSTRAR RESERVAS
// =====================================================

const mostrarReservas = () => {

    listaReservas.innerHTML = "";


    const reservasFuturas =
        obtenerReservasFuturas();


    // ==========================================
    // NO HAY RESERVAS
    // ==========================================

    if (reservasFuturas.length === 0) {

        sinReservas.style.display = "block";

        return;

    }


    sinReservas.style.display = "none";


    // ==========================================
    // CREAR FILAS
    // ==========================================

    reservasFuturas.forEach(reserva => {

        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                ${reserva.nombreCancha}
            </td>

            <td>
                ${formatearFecha(reserva.fecha)}
            </td>

            <td>
                ${reserva.hora}
            </td>

            <td>
                $${formatearPrecio(reserva.total)}
            </td>

            <td>

                <span class="badge bg-success">

                    CONFIRMADA

                </span>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm btn-editar"
                    data-id="${reserva.id}">

                    <i class="bi bi-pencil-fill"></i>

                    Editar

                </button>


                <button
                    class="btn btn-danger btn-sm btn-cancelar"
                    data-id="${reserva.id}">

                    <i class="bi bi-trash-fill"></i>

                    Cancelar

                </button>

            </td>

        `;


        listaReservas.appendChild(fila);

    });


    // ==========================================
    // BOTONES EDITAR
    // ==========================================

    document
        .querySelectorAll(".btn-editar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    abrirEditar(
                        Number(boton.dataset.id)
                    );

                }
            );

        });


    // ==========================================
    // BOTONES CANCELAR
    // ==========================================

    document
        .querySelectorAll(".btn-cancelar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    cancelarReserva(
                        Number(boton.dataset.id)
                    );

                }
            );

        });

};


// =====================================================
// ABRIR EDITAR
// =====================================================

const abrirEditar = (id) => {

    const reservas =
        obtenerReservas();


    const reserva =
        reservas.find(
            reserva =>
                Number(reserva.id) === Number(id)
        );


    if (!reserva) {

        return;

    }


    // ==========================================
    // COMPROBAR QUE TODAVÍA SEA FUTURA
    // ==========================================

    const fechaHoraReserva =
        convertirFechaHora(
            reserva.fecha,
            reserva.hora
        );


    if (
        fechaHoraReserva <=
        obtenerFechaHoraActual()
    ) {

        Swal.fire({

            icon: "warning",

            title: "Reserva no disponible",

            text:
                "La fecha y hora de esta reserva ya pasaron."

        });

        mostrarReservas();

        return;

    }


    // ==========================================
    // GUARDAR RESERVA SELECCIONADA
    // ==========================================

    reservaSeleccionada =
        reserva;


    // ==========================================
    // MOSTRAR DATOS
    // ==========================================

    editarCancha.value =
        reserva.nombreCancha;


    editarFecha.value =
        reserva.fecha;


    editarHora.value =
        reserva.hora;


    editarPrecio.value =
        `$${formatearPrecio(reserva.total)}`;


    // ==========================================
    // FECHA MÍNIMA
    // ==========================================

    const ahora =
        obtenerFechaHoraActual();


    const año =
        ahora.getFullYear();

    const mes =
        String(
            ahora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            ahora.getDate()
        ).padStart(2, "0");


    const hoy =
        `${año}-${mes}-${dia}`;


    editarFecha.min =
        hoy;


    modalEditar.show();

};


// =====================================================
// CONVERTIR HORA A MINUTOS
// =====================================================

const convertirHoraAMinutos = (hora) => {

    const [horas, minutos] =
        hora.split(":").map(Number);

    return (
        horas * 60
    ) + minutos;

};


// =====================================================
// CALCULAR HORA FINAL
// =====================================================

const calcularHoraFinal = (
    horaInicio,
    duracion
) => {

    return (
        convertirHoraAMinutos(horaInicio)
        +
        Number(duracion) * 60
    );

};


// =====================================================
// VERIFICAR DISPONIBILIDAD
// =====================================================

const horarioEstaOcupado = (
    reservaActual,
    nuevaFecha,
    nuevaHora
) => {

    const reservas =
        obtenerReservas();


    const nuevaHoraInicio =
        convertirHoraAMinutos(
            nuevaHora
        );


    const nuevaHoraFinal =
        calcularHoraFinal(
            nuevaHora,
            reservaActual.duracion
        );


    return reservas.some(reserva => {


        // ==========================================
        // IGNORAR LA RESERVA ACTUAL
        // ==========================================

        if (
            Number(reserva.id) ===
            Number(reservaActual.id)
        ) {

            return false;

        }


        // ==========================================
        // MISMA CANCHA
        // ==========================================

        if (
            Number(reserva.canchaId) !==
            Number(reservaActual.canchaId)
        ) {

            return false;

        }


        // ==========================================
        // MISMA FECHA
        // ==========================================

        if (
            reserva.fecha !==
            nuevaFecha
        ) {

            return false;

        }


        // ==========================================
        // HORA FINAL RESERVA EXISTENTE
        // ==========================================

        const reservaHoraInicio =
            convertirHoraAMinutos(
                reserva.hora
            );


        const reservaHoraFinal =
            calcularHoraFinal(
                reserva.hora,
                reserva.duracion
            );


        // ==========================================
        // COMPROBAR CRUCE
        // ==========================================

        return (
            nuevaHoraInicio < reservaHoraFinal &&
            nuevaHoraFinal > reservaHoraInicio
        );

    });

};


// =====================================================
// GUARDAR CAMBIOS
// =====================================================

guardarCambios.addEventListener(
    "click",
    () => {


        if (!reservaSeleccionada) {

            return;

        }


        const nuevaFecha =
            editarFecha.value;


        const nuevaHora =
            editarHora.value;


        // ==========================================
        // VALIDAR CAMPOS
        // ==========================================

        if (
            !nuevaFecha ||
            !nuevaHora
        ) {

            Swal.fire({

                icon: "warning",

                title: "Datos incompletos",

                text:
                    "Selecciona una fecha y una hora."

            });

            return;

        }


        // ==========================================
        // VALIDAR FECHA Y HORA
        // ==========================================

        const nuevaFechaHora =
            convertirFechaHora(
                nuevaFecha,
                nuevaHora
            );


        if (
            nuevaFechaHora <=
            obtenerFechaHoraActual()
        ) {

            Swal.fire({

                icon: "error",

                title: "Fecha u hora inválida",

                text:
                    "No puedes seleccionar una fecha u hora que ya haya pasado."

            });

            return;

        }


        // ==========================================
        // COMPROBAR DISPONIBILIDAD
        // ==========================================

        const ocupado =
            horarioEstaOcupado(
                reservaSeleccionada,
                nuevaFecha,
                nuevaHora
            );


        if (ocupado) {

            Swal.fire({

                icon: "error",

                title: "Horario no disponible",

                text:
                    "La cancha ya está reservada para esa fecha y hora."

            });

            return;

        }


        // ==========================================
        // OBTENER TODAS LAS RESERVAS
        // ==========================================

        const reservas =
            obtenerReservas();


        // ==========================================
        // BUSCAR RESERVA
        // ==========================================

        const indice =
            reservas.findIndex(
                reserva =>
                    Number(reserva.id) ===
                    Number(reservaSeleccionada.id)
            );


        if (indice === -1) {

            return;

        }


        // ==========================================
        // ACTUALIZAR SOLO FECHA Y HORA
        // ==========================================

        reservas[indice].fecha =
            nuevaFecha;


        reservas[indice].hora =
            nuevaHora;


        // ==========================================
        // GUARDAR EN LOCAL STORAGE
        // ==========================================

        localStorage.setItem(
            "reservas",
            JSON.stringify(reservas)
        );


        // ==========================================
        // CERRAR MODAL
        // ==========================================

        modalEditar.hide();


        reservaSeleccionada =
            null;


        // ==========================================
        // ACTUALIZAR TABLA
        // ==========================================

        mostrarReservas();


        // ==========================================
        // MENSAJE
        // ==========================================

        Swal.fire({

            icon: "success",

            title: "Reserva actualizada",

            text:
                "La fecha y hora fueron actualizadas correctamente.",

            timer: 2000,

            showConfirmButton: false

        });

    }
);


// =====================================================
// CANCELAR RESERVA
// =====================================================

const cancelarReserva = (id) => {

    const reservas =
        obtenerReservas();


    const reserva =
        reservas.find(
            reserva =>
                Number(reserva.id) ===
                Number(id)
        );


    if (!reserva) {

        return;

    }


    Swal.fire({

        title: "¿Cancelar reserva?",

        text:
            `Vas a cancelar la reserva de ${reserva.nombreCancha}.`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Sí, cancelar",

        cancelButtonText: "No"

    }).then(resultado => {


        if (!resultado.isConfirmed) {

            return;

        }


        const indice =
            reservas.findIndex(
                reserva =>
                    Number(reserva.id) ===
                    Number(id)
            );


        if (indice === -1) {

            return;

        }


        /*
         * En lugar de borrar la reserva,
         * cambiamos su estado.
         */

        reservas[indice].estado =
            "CANCELADA";


        localStorage.setItem(
            "reservas",
            JSON.stringify(reservas)
        );


        mostrarReservas();


        Swal.fire({

            icon: "success",

            title: "Reserva cancelada",

            text:
                "La reserva fue cancelada correctamente.",

            timer: 2000,

            showConfirmButton: false

        });

    });

};


// =====================================================
// INICIAR
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        mostrarReservas();

    }
);

