const API_URL = "http://localhost:8080/api/canchas";

const parametros = new URLSearchParams(window.location.search);
const idCancha = parametros.get("id");

let canchaActual = null;

const obtenerReservas = () => JSON.parse(localStorage.getItem("reservas")) || [];
const convertirHoraAMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return (horas * 60) + minutos;
};
const calcularHoraFinal = (horaInicio, duracion) => convertirHoraAMinutos(horaInicio) + (duracion * 60);

// Petición Axios con try/catch para traer la cancha desde el backend
async function cargarDatosCancha() {
    if (!idCancha) {
        window.location.href = "./canchas.html";
        return;
    }

    try {
        const respuesta = await axios.get(`${API_URL}/${idCancha}`);
        canchaActual = respuesta.data;
        mostrarCancha(canchaActual);
        cargarHorarios();
    } catch (error) {
        console.error("Error al obtener datos de la cancha:", error);
        Swal.fire({
            icon: "error",
            title: "Cancha no encontrada",
            text: "No se encontró información de la cancha en el servidor."
        }).then(() => {
            window.location.href = "./canchas.html";
        });
    }
}

const mostrarCancha = (cancha) => {
    document.getElementById("nombreCancha").textContent = cancha.nombreCancha;
    document.getElementById("ubicacionCancha").textContent = cancha.ubicacion;
    document.getElementById("descripcionCancha").textContent = cancha.descripcion || "Cancha sintética profesional.";
    document.getElementById("precioCancha").textContent = Number(cancha.precio).toLocaleString("es-CO");

    const imagenUrl = Array.isArray(cancha.imagen) ? cancha.imagen[0] : (cancha.imagen || "../assets/images/canchas/cancha11.jpg");
    const imgEl = document.getElementById("imagenCancha");
    imgEl.src = imagenUrl;
    imgEl.alt = cancha.nombreCancha;

    actualizarTotal();
};

const actualizarTotal = () => {
    if (!canchaActual) return;
    const duracion = Number(document.getElementById("duracion").value);
    const total = Number(canchaActual.precio) * duracion;
    document.getElementById("totalReserva").textContent = total.toLocaleString("es-CO");
};

const horarioEstaOcupado = (canchaId, fecha, hora, duracion) => {
    const reservas = obtenerReservas();
    const nuevaHoraInicio = convertirHoraAMinutos(hora);
    const nuevaHoraFinal = calcularHoraFinal(hora, duracion);

    return reservas.some(reserva => {
        if (Number(reserva.canchaId) !== Number(canchaId)) return false;
        if (reserva.fecha !== fecha) return false;

        const reservaHoraInicio = convertirHoraAMinutos(reserva.hora);
        const reservaHoraFinal = calcularHoraFinal(reserva.hora, Number(reserva.duracion));

        return nuevaHoraInicio < reservaHoraFinal && nuevaHoraFinal > reservaHoraInicio;
    });
};

const cargarHorarios = () => {
    const fecha = document.getElementById("fechaReserva").value;
    const horaSelect = document.getElementById("horaReserva");
    const duracion = Number(document.getElementById("duracion").value);

    horaSelect.innerHTML = `<option value="">Selecciona una hora</option>`;
    if (!fecha || !canchaActual || !duracion) return;

    const horaInicio = 8;
    const horaFin = 22;
    const hoy = new Date().toISOString().split("T")[0];
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    for (let hora = horaInicio; hora < horaFin; hora++) {
        const horaTexto = `${String(hora).padStart(2, "0")}:00`;
        if (hora + duracion > horaFin) continue;

        const horaYaPaso = (fecha === hoy) && (hora * 60 <= minutosAhora);
        const ocupado = horarioEstaOcupado(canchaActual.id, fecha, horaTexto, duracion);

        const option = document.createElement("option");
        option.value = horaTexto;

        if (horaYaPaso) {
            option.textContent = `${horaTexto} - ⚫ No disponible`;
            option.disabled = true;
        } else if (ocupado) {
            option.textContent = `${horaTexto} - 🔴 Ocupado`;
            option.disabled = true;
        } else {
            option.textContent = `${horaTexto} - 🟢 Disponible`;
        }
        horaSelect.appendChild(option);
    }
};

// Eventos de formulario
document.getElementById("fechaReserva").min = new Date().toISOString().split("T")[0];
document.getElementById("fechaReserva").addEventListener("change", cargarHorarios);
document.getElementById("duracion").addEventListener("change", () => {
    actualizarTotal();
    cargarHorarios();
});

document.getElementById("formReserva").addEventListener("submit", function (event) {
    event.preventDefault();
    if (!canchaActual) return;

    const fecha = document.getElementById("fechaReserva").value;
    const hora = document.getElementById("horaReserva").value;
    const duracion = Number(document.getElementById("duracion").value);

    if (!fecha || !hora) {
        Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Debes seleccionar fecha y horario disponible."
        });
        return;
    }

    if (horarioEstaOcupado(canchaActual.id, fecha, hora, duracion)) {
        Swal.fire({
            icon: "error",
            title: "Horario ocupado",
            text: "Esta cancha acaba de ser reservada para ese horario."
        });
        cargarHorarios();
        return;
    }

    const nuevaReserva = {
        id: Date.now(),
        canchaId: canchaActual.id,
        nombreCancha: canchaActual.nombreCancha,
        cliente: document.getElementById("nombreCliente").value.trim(),
        email: document.getElementById("emailCliente").value.trim(),
        telefono: document.getElementById("telefonoCliente").value.trim(),
        fecha,
        hora,
        duracion,
        precioHora: Number(canchaActual.precio),
        total: Number(canchaActual.precio) * duracion
    };

    const reservas = obtenerReservas();
    reservas.push(nuevaReserva);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    Swal.fire({
        icon: "success",
        title: "¡Reserva Exitosa!",
        text: `Has reservado ${canchaActual.nombreCancha}`,
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "./canchas.html";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
    if (!isLoggedIn) {
        window.location.href = "./inicio-sesion.html";
        return;
    }
    cargarDatosCancha();
});