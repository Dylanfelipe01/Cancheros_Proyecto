function cargarCanchasAdmin() {

    const canchas = JSON.parse(
        localStorage.getItem("canchas")
    ) || [];

    const contenedor = document.getElementById("canchasAdmin");

    contenedor.innerHTML = "";

    canchas.forEach(function(canchas) {

        const card = document.createElement("div");

        card.classList.add(
            "col-12",
            "col-md-6",
            "col-lg-4"
        );

        card.innerHTML = `
            <div class="card h-100 shadow">

                <div class="card-body">

                    <h5 class="card-title">
                        ${canchas.nombre}
                    </h5>

                    <p class="card-text">
                        ${canchas.descripcion}
                    </p>

                    <p>
                        <strong>Ubicación:</strong>
                        ${canchas.ubicacion}
                    </p>

                    <p>
                        <strong>Precio:</strong>
                        $${Number(canchas.precio).toLocaleString("es-CO")}
                    </p>

                    <button class="btn btn-primary">
                        Reservar
                    </button>

                </div>

            </div>
        `;

        contenedor.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", function () {

    cargarCanchasAdmin();

});