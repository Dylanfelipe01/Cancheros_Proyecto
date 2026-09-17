import { apiFetch } from "../api/api.js";

// =========================================================
// ELEMENTOS DEL DOM
// =========================================================

const formCancha = document.getElementById("formCancha");
const tablaCanchas = document.getElementById("tablaCanchas");
const modalElement = document.getElementById("agregarCancha");
const modalBootstrap =
    bootstrap.Modal.getOrCreateInstance(modalElement);


// =========================================================
// OBTENER CANCHAS
// =========================================================

const obtenerCanchasBackend = async () => {

    try {

        return await apiFetch("/api/canchas");

    } catch (error) {

        console.error(
            "Error al obtener canchas:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudieron cargar las canchas del servidor."
        });

        return [];
    }
};


// =========================================================
// RENDERIZAR TABLA
// =========================================================

const renderizar = async () => {

    tablaCanchas.innerHTML = `
        <tr>
            <td colspan="10" class="text-center py-4">
                Cargando canchas...
            </td>
        </tr>
    `;

    const canchas = await obtenerCanchasBackend();

    tablaCanchas.innerHTML = "";

    const totalEl =
        document.getElementById("totalCanchas");

    const disponiblesEl =
        document.getElementById("canchasDisponibles");

    const noDisponiblesEl =
        document.getElementById("canchasNoDisponibles");


    if (totalEl) {
        totalEl.textContent = canchas.length;
    }

    if (disponiblesEl) {
        disponiblesEl.textContent =
            canchas.filter(
                cancha => cancha.disponible === true
            ).length;
    }

    if (noDisponiblesEl) {
        noDisponiblesEl.textContent =
            canchas.filter(
                cancha => cancha.disponible === false
            ).length;
    }


    if (canchas.length === 0) {

        tablaCanchas.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="mensaje-sin-canchas text-center py-4"
                >
                    No hay canchas registradas en el servidor.
                </td>
            </tr>
        `;

        return;
    }


    canchas.forEach(cancha => {

        const fila = document.createElement("tr");

        const fotoUrl =
            cancha.imagenUrl ||
            "../../assets/images/canchas/cancha11.jpg";

        fila.innerHTML = `
            <td>${cancha.id}</td>

            <td>
                ${cancha.disponible ? "Sí" : "No"}
            </td>

            <td>
                ${cancha.descripcion || "Sin descripción"}
            </td>

            <td>
                ${cancha.nombreCancha}
            </td>

            <td>
                ${cancha.tipo}
            </td>

            <td>
                $${Number(
                    cancha.precioPorHora
                ).toLocaleString("es-CO")}
            </td>

            <td>
                ${cancha.ubicacion}
            </td>

            <td>
                <img
                    class="imagenPanel"
                    src="${fotoUrl}"
                    alt="${cancha.nombreCancha}"
                    width="60"
                    height="60"
                    style="
                        object-fit: cover;
                        border-radius: 4px;
                    "
                    onerror="this.src='../../assets/images/image.png'"
                >
            </td>

            <td>
                <i
                    class="bi bi-pencil-square fs-5 text-warning cursor-pointer"
                    data-id="${cancha.id}"
                    style="cursor: pointer"
                ></i>
            </td>

            <td>
                <i
                    class="trash-logo bi bi-trash fs-5 text-danger cursor-pointer"
                    data-id="${cancha.id}"
                    style="cursor: pointer"
                ></i>
            </td>
        `;

        tablaCanchas.appendChild(fila);
    });
};


// =========================================================
// PREPARAR NUEVA CANCHA
// =========================================================

function nuevaCancha() {

    modalElement.removeAttribute("data-id-editar");

    formCancha.reset();

    document
        .querySelectorAll(
            "#imagenesContainer .imagen-box"
        )
        .forEach(imagen => imagen.remove());

    document.getElementById("imagenCancha").value = "";
}


// =========================================================
// GUARDAR CANCHA
// POST / PUT
// =========================================================

const guardarCanchaBackend =
    async (payload, idEditar) => {

        try {

            if (idEditar) {

                await apiFetch(
                    `/api/canchas/${idEditar}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload)
                    }
                );

            } else {

                await apiFetch(
                    "/api/canchas",
                    {
                        method: "POST",
                        body: JSON.stringify(payload)
                    }
                );
            }

            return true;

        } catch (error) {

            console.error(
                "Error al guardar:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text:
                    error.message ||
                    "No se pudo sincronizar la cancha con el servidor."
            });

            return false;
        }
    };


// =========================================================
// ELIMINAR CANCHA
// =========================================================

const eliminarCancha = (id) => {

    Swal.fire({

        title: "¿Eliminar cancha?",

        text:
            "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
            "Sí, eliminar",

        cancelButtonText:
            "Cancelar",

        confirmButtonColor:
            "#d33"

    }).then(async resultado => {

        if (!resultado.isConfirmed) {
            return;
        }

        try {

            await apiFetch(
                `/api/canchas/${id}`,
                {
                    method: "DELETE"
                }
            );

            await Swal.fire({
                title: "Cancha eliminada",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            renderizar();

        } catch (error) {

            console.error(
                "Fallo al eliminar:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text:
                    error.message ||
                    "Ocurrió un error en el servidor."
            });
        }
    });
};


// =========================================================
// EDITAR CANCHA
// =========================================================

const editarCancha = async (id) => {

    try {

        const cancha =
            await apiFetch(
                `/api/canchas/${id}`
            );


        modalElement.dataset.idEditar = id;

        document.getElementById(
            "nombreCancha"
        ).value = cancha.nombreCancha;

        document.getElementById(
            "precio"
        ).value = cancha.precioPorHora;

        document.getElementById(
            "ubicacion"
        ).value = cancha.ubicacion;

        document.getElementById(
            "descripcion"
        ).value = cancha.descripcion;

        document.getElementById(
            "form-select-tipo"
        ).value = cancha.tipo;


        const radioDisp =
            document.querySelector(
                `input[name="disponible"][value="${cancha.disponible}"]`
            );

        if (radioDisp) {
            radioDisp.checked = true;
        }


        const imagenesContainer =
            document.getElementById(
                "imagenesContainer"
            );

        imagenesContainer
            .querySelectorAll(".imagen-box")
            .forEach(imagen => imagen.remove());


        if (cancha.imagenUrl) {

            imagenesContainer.insertAdjacentHTML(
                "afterbegin",
                `
                <div class="imagen-box">

                    <img
                        src="${cancha.imagenUrl}"
                        alt=""
                    >

                    <button type="button">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>
                `
            );
        }


        modalBootstrap.show();

    } catch (error) {

        console.error(
            "Error al obtener cancha:",
            error
        );

        Swal.fire({
            icon: "error",
            title: "Error",
            text:
                "No se pudieron obtener los datos de la cancha seleccionada."
        });
    }
};


// =========================================================
// SUBMIT DEL FORMULARIO
// =========================================================

formCancha.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const nombreCancha =
            document
                .getElementById("nombreCancha")
                .value
                .trim();

        const precioPorHora =
            document
                .getElementById("precio")
                .value
                .trim();

        const disponible =
            document.querySelector(
                'input[name="disponible"]:checked'
            )?.value === "true";

        const ubicacion =
            document
                .getElementById("ubicacion")
                .value
                .trim();

        const descripcion =
            document
                .getElementById("descripcion")
                .value
                .trim();

        const tipo =
            document
                .getElementById("form-select-tipo")
                .value;

        const idEditar =
            modalElement.dataset.idEditar;


        const primeraImagen =
            document.querySelector(
                "#imagenesContainer .imagen-box img"
            )?.src ||
            "../../assets/images/canchas/cancha11.jpg";


        if (
            !nombreCancha ||
            !precioPorHora ||
            !ubicacion ||
            !tipo
        ) {

            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text:
                    "Por favor diligencia los campos obligatorios."
            });

            return;
        }


        const payload = {

            nombreCancha,

            precioPorHora:
                parseFloat(precioPorHora),

            disponible,

            ubicacion,

            descripcion,

            tipo,

            // Se mantienen temporalmente
            // hasta que definamos cómo se calcularán
            // realmente estos valores.
            rating: 4.8,

            totalResenas: 100,

            imagenUrl: primeraImagen
        };


        const guardadoExitoso =
            await guardarCanchaBackend(
                payload,
                idEditar
            );


        if (guardadoExitoso) {

            formCancha.reset();

            modalBootstrap.hide();

            modalElement.removeAttribute(
                "data-id-editar"
            );

            renderizar();

            Swal.fire({
                icon: "success",
                title:
                    idEditar
                        ? "Cancha actualizada"
                        : "Cancha agregada con éxito",
                timer: 1500,
                showConfirmButton: false
            });
        }
    }
);


// =========================================================
// EVENTOS DE TABLA
// =========================================================

tablaCanchas.addEventListener(
    "click",
    event => {

        const btnEliminar =
            event.target.closest(
                ".trash-logo"
            );

        const btnEditar =
            event.target.closest(
                ".bi-pencil-square"
            );


        if (btnEliminar) {

            eliminarCancha(
                btnEliminar.dataset.id
            );

        } else if (btnEditar) {

            editarCancha(
                btnEditar.dataset.id
            );
        }
    }
);


// =========================================================
// IMÁGENES
// =========================================================

document
    .getElementById("imagenCancha")
    .addEventListener(
        "change",
        event => {

            Array
                .from(event.target.files)
                .forEach(archivo => {

                    const lector =
                        new FileReader();

                    lector.onload = () => {

                        document
                            .getElementById(
                                "imagenesContainer"
                            )
                            .insertAdjacentHTML(
                                "afterbegin",
                                `
                                <div class="imagen-box">

                                    <img
                                        src="${lector.result}"
                                        alt=""
                                    >

                                    <button type="button">
                                        <i class="bi bi-trash"></i>
                                    </button>

                                </div>
                                `
                            );
                    };

                    lector.readAsDataURL(
                        archivo
                    );
                });
        }
);


document
    .getElementById("imagenesContainer")
    .addEventListener(
        "click",
        event => {

            const boton =
                event.target.closest(
                    ".imagen-box button"
                );

            if (boton) {

                boton
                    .closest(".imagen-box")
                    .remove();
            }
        }
    );


// =========================================================
// NUEVA CANCHA
// =========================================================

document
    .getElementById("btnAgregarCancha")
    ?.addEventListener(
        "click",
        nuevaCancha
    );


// =========================================================
// CARGAR CANCHAS
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    renderizar
);