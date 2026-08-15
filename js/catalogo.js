function cargarCanchasAdmin() {

    const canchas =
        JSON.parse(localStorage.getItem("canchas")) || [];

    const contenedor =
        document.getElementById("canchasAdmin");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    canchas.forEach(function (cancha) {

        const columna = document.createElement("div");

       columna.classList.add(
    "col-12",
    "col-md-6",
    "col-xl-4"
);

        columna.innerHTML = `

            <div class="cancha-card">

                <!-- IMAGEN -->
                <div class="card-img-wrapper">

                    <img
                        src="${cancha.imagen}"
                        alt="${cancha.nombre}"
                    />

                    <span class="badge-rating">

                        <i class="fa-solid fa-star"></i>

                        Nueva

                    </span>

                </div>


                <!-- INFORMACIÓN -->
                <div class="card-body-custom">

                    <!-- NOMBRE + TIPO -->
                    <div class="card-header-info">

                        <h5 class="cancha-title">
                            ${cancha.nombre}
                        </h5>

                        <span class="badge-tipo">
                            Fútbol 5
                        </span>

                    </div>


                    <!-- UBICACIÓN -->
                    <div class="cancha-location">

                        <i class="fa-solid fa-location-dot"></i>

                        ${cancha.ubicacion}

                    </div>


                    <!-- CARACTERÍSTICAS -->
                    <div class="amenities-list">

                        <span class="badge-amenity">

                            <i class="fa-solid fa-futbol"></i>

                            Cancha sintética

                        </span>

                        <span class="badge-amenity">

                            <i class="fa-solid fa-circle-check"></i>

                            ${
                                cancha.disponible
                                    ? "Disponible"
                                    : "No disponible"
                            }

                        </span>

                    </div>


                    <!-- PRECIO + RESERVAR -->
                    <div class="card-footer-custom">

                        <div>

                            <span class="price-label">
                                Desde
                            </span>

                            <div class="price-value">

                                $${Number(cancha.precio)
                                    .toLocaleString("es-CO")}

                                <span>/hr</span>

                            </div>

                        </div>


                        <button class="btn btn-reservar">
                            Reservar
                        </button>

                    </div>

                </div>

            </div>

        `;

        contenedor.appendChild(columna);
    });
}


document.addEventListener("DOMContentLoaded", function () {

    cargarCanchasAdmin();

});