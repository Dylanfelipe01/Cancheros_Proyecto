function convertirImagenBase64(archivo) {

    return new Promise((resolve, reject) => {

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.onerror = () => reject(lector.error);

        lector.readAsDataURL(archivo);
    });
}


const formCancha = document.getElementById("formCancha");


formCancha.addEventListener("submit", async (event) => {

    const nombreCancha = document.getElementById("nombreCancha");
    const precio = document.getElementById("precio");
    const disponible = document.querySelector(
        'input[name="disponible"]:checked'
    );
    const imagenCancha = document.getElementById("imagenCancha");
    const ubicacion = document.getElementById("ubicacion");
    const descripcion = document.getElementById("descripcion");

    const ConReservas = document.getElementById("tablaReservas");
    const mensajeSinReserva =
        document.getElementById("mensajeSinReservas");


    event.preventDefault();


    // ==========================
    // VALIDACIONES
    // ==========================

    if (nombreCancha.value.trim() === "") {

        Swal.fire({
            title: "El campo del nombre está vacío.",
            text: "Debes ingresar el nombre de la cancha.",
            icon: "error"
        });

        return;
    }


    if (precio.value.trim() === "") {

        Swal.fire({
            title: "El precio es obligatorio.",
            text: "Debes colocar un valor en el campo.",
            icon: "error"
        });

        return;
    }


    if (isNaN(precio.value)) {

        Swal.fire({
            title: "Precio inválido",
            text: "El precio debe contener solamente números.",
            icon: "error"
        });

        return;
    }


    if (!disponible) {

        Swal.fire({
            title: "Campo obligatorio.",
            text: "Selecciona uno de los dos estados de la cancha.",
            icon: "error"
        });

        return;
    }


    if (imagenCancha.files.length === 0) {

        Swal.fire({
            title: "Las fotos son requeridas.",
            text: "Debes seleccionar al menos una foto.",
            icon: "error"
        });

        return;
    }


    if (ubicacion.value.trim() === "") {

        Swal.fire({
            title: "La ubicación es obligatoria.",
            text: "Debes colocar una ubicación en el campo.",
            icon: "error"
        });

        return;
    }


    if (descripcion.value.trim() === "") {

        Swal.fire({
            title: "La descripción es obligatoria.",
            text: "Debes colocar una descripción.",
            icon: "error"
        });

        return;
    }


    // ==========================
    // CONVERTIR IMAGEN
    // ==========================

    const archivoImagen = imagenCancha.files[0];

    const imagenBase64 =
        await convertirImagenBase64(archivoImagen);


    // ==========================
    // OBTENER CANCHAS
    // ==========================

    const canchas =
        JSON.parse(localStorage.getItem("canchas")) || [];


    // ==========================
    // CREAR CANCHA
    // ==========================

    const nuevaCancha = {

        id: Date.now(),

        nombre: nombreCancha.value.trim(),

        precio: Number(precio.value),

        disponible: disponible.value === "true",

        descripcion: descripcion.value.trim(),

        ubicacion: ubicacion.value.trim(),

        imagen: imagenBase64
    };


    // ==========================
    // GUARDAR EN ARRAY
    // ==========================

    canchas.push(nuevaCancha);


    // ==========================
    // GUARDAR EN LOCALSTORAGE
    // ==========================

    localStorage.setItem(
        "canchas",
        JSON.stringify(canchas)
    );


    // ==========================
    // MOSTRAR EN TABLA ADMIN
    // ==========================

    mensajeSinReserva.style.display = "none";


    ConReservas.innerHTML += `

        <tr>

            <td>
                ${nuevaCancha.id}
            </td>

            <td>
                ${nuevaCancha.disponible ? "Sí" : "No"}
            </td>

            <td>
                ${nuevaCancha.descripcion}
            </td>

            <td>
                ${nuevaCancha.nombre}
            </td>

            <td>
                $${nuevaCancha.precio.toLocaleString("es-CO")}
            </td>

            <td>
                ${nuevaCancha.ubicacion}
            </td>

            <td>

                <img
                    src="${nuevaCancha.imagen}"
                    alt="${nuevaCancha.nombre}"
                    width="60"
                    height="60"
                >

            </td>

        </tr>
    `;


    // ==========================
    // CERRAR MODAL
    // ==========================

    document.getElementById("cerrarVentana").click();


    // ==========================
    // LIMPIAR FORMULARIO
    // ==========================

    nombreCancha.value = "";

    precio.value = "";

    document.querySelectorAll(
        'input[name="disponible"]'
    ).forEach(radio => {
        radio.checked = false;
    });

    imagenCancha.value = "";

    ubicacion.value = "";

    descripcion.value = "";

});
