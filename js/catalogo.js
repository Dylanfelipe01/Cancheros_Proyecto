import { canchasEstaticas } from "./canchasData.js";
const contenedor = document.getElementById("containerMain");

window.addEventListener("pageshow", (event) => {

    if (event.persisted) {
        window.location.reload();
    }

});

const canchas = JSON.parse(localStorage.getItem("canchas")) || [];
const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

const canchasGuardadasConId = canchas.map((cancha, index) => ({
    ...cancha,
    id: 10 + index
}));

const todasLasCanchas = [
    ...canchasEstaticas,
    ...canchasGuardadasConId
];

function cargarCanchasAdmin() {
    let contador = 0;

    if(!contenedor) return;

    for(let i = 0; i < 10; i++) {
        contenedor.innerHTML += `
            <div class="col-lg-4 col-md-6">
                <div class="cancha-card">
                <div class="card-img-wrapper placeholder col-20">
    
                    <span class=""></span>
                </div>
                <div class="card-body-custom placeholder-glow">
                    <div class="card-header-info">
                    <h5 class="placeholder col-7"></h5>
                    <span class="placeholder col-2"></span>
                    </div>
                    <div class="cancha-location">
                        <i class="placeholder col-4"></i>
                    </div>
                    <div class="amenities-list">
                    <span class="placeholder col-2"><i class="fa-solid fa-mug-hot"></i></span>
                    <span class="placeholder col-2"><i class="fa-solid fa-wifi"></i></span>
                    <span class="placeholder col-2"><i class="fa-solid fa-square-parking"></i></span>
                    </div>
                    <div class="card-footer-custom flex-column align-items-stretch gap-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="placeholder col-2"></span>
                        <div class="placeholder col-3"><span>/hr</span></div>
                    </div>
    
                    <div class="d-flex gap-2">
                        <!-- Botón para abrir el Modal -->
                        <button class="placeholder col-5">
                        </button>
    
                        <!-- Botón para Redirigir a Reservas -->
                        <button 
                            class="placeholder col-5"
                        >
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        `
    }

    function renderizarCanchas(){
        setTimeout(() => {
            contenedor.innerHTML = "";
            todasLasCanchas.forEach(cancha => {
                contador = contador + 1
                document.getElementById("conteo").textContent = `Mostrando ${contador} resultados`
                
                contenedor.innerHTML += `
                    <div class="col-lg-4 col-md-6">
                        <div class="cancha-card">
                        <div class="card-img-wrapper">
                            <img src="${cancha.imagen}" alt="La 10 Usaquén" />
        
                            <span class="badge-rating"><i class="fa-solid fa-star"></i> 4.9 (150+)</span>
                        </div>
                        <div class="card-body-custom">
                            <div class="card-header-info">
                            <h5 class="cancha-title">${cancha.nombreCancha}</h5>
                            <span class="badge-tipo">${cancha.tipo}</span>
                            </div>
                            <div class="cancha-location">
                                <i class="fa-solid fa-location-dot"></i>${cancha.ubicacion}
                            </div>
                            <div class="amenities-list">
                            <span class="badge-amenity"><i class="fa-solid fa-mug-hot"></i> Resto-Bar</span>
                            <span class="badge-amenity"><i class="fa-solid fa-wifi"></i> Wi-Fi HighSpeed</span>
                            <span class="badge-amenity"><i class="fa-solid fa-square-parking"></i> Valet</span>
                            </div>
                            <div class="card-footer-custom flex-column align-items-stretch gap-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price-label">Desde</span>
                                <div class="price-value">$${cancha.precio} <span>/hr</span></div>
                            </div>
        
                            <div class="d-flex gap-2">
                                <!-- Botón para abrir el Modal -->
                                <button class="btn btn-outline-light btn-sm w-50 fw-semibold" data-bs-toggle="modal"
                                data-bs-target="#canchaModal"
                                data-cancha-id="${cancha.id}">
                                Ver Detalle
                                </button>
        
                                <!-- Botón para Redirigir a Reservas -->
                                <button 
                                    class="reserva btn btn-reservar btn-sm w-50 text-center"
                                    data-cancha-id="${cancha.id}"
                                >
                                    Reservar
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                `;
            });
        }, 500)
    }

    renderizarCanchas()
}
const modalCanchas = () => {

    const canchaModal = document.getElementById("canchaModal");
    
    if (canchaModal) {
        canchaModal.addEventListener("shown.bs.modal", (event) => {
    
            const boton = event.relatedTarget;
            const idCancha = boton.dataset.canchaId;
            const cancha = todasLasCanchas.find(cancha => String(cancha.id) === String(idCancha));

            document.getElementById("modalImagen").src = cancha.imagen;
            document.getElementById("modalImagen").alt = cancha.nombreCancha;
            document.getElementById("modalNombre").textContent = cancha.nombreCancha;
            document.getElementById("modalUbicacion").textContent = cancha.ubicacion;
            document.getElementById("modalPrecio").textContent = `$${cancha.precio} /hr`;

            const btnReservarModal = canchaModal.querySelector(".reserva");
            btnReservarModal.dataset.canchaId = idCancha;
        });

    }
}

function irReservar(){

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("reserva")) {
            if(!isLoggedIn){
                window.location.href = "./inicio-sesion.html"
                
            }else{
                const idCancha = event.target.dataset.canchaId;
        
                window.location.href = `./reservas.html?id=${idCancha}`;
            }
    
        }
    })
}

const formSelectUbicacion = document.getElementById("form-select-ubicacion");
const btnBuscar = document.getElementById("btnBuscar");
const formSelectTipo = document.getElementById("form-select-tipo");
const precioCancha = document.getElementById("precio-cancha");

let valorFormSelectUbicacion;
let valorFormSelectTipo;
let comaUbicacion;

formSelectUbicacion.addEventListener("change", () => {
    valorFormSelectUbicacion = formSelectUbicacion.value
})

formSelectTipo.addEventListener("change", () => {
    valorFormSelectTipo = formSelectTipo.value
})

btnBuscar.addEventListener("click", (e) => {
    e.preventDefault();

    const resultado = todasLasCanchas.filter(cancha => {

        const comaUbicacion = cancha.ubicacion.indexOf(",");
        const ubicacion = cancha.ubicacion.substring(0, comaUbicacion);

        const coincideUbicacion =
            (valorFormSelectUbicacion || []).length === 0 ||
            (valorFormSelectUbicacion || []).includes(ubicacion);

        const coincideTipo =
            (valorFormSelectTipo || []).length === 0 ||
            (valorFormSelectTipo || []).includes(cancha.tipo);

        const coincidePrecio =
            precioCancha.value === "" ||
            cancha.precio === Number(precioCancha.value);

        return coincideUbicacion && coincideTipo && coincidePrecio;
    });

    const reset = document.getElementById("reset")
    reset.innerHTML = `
        <button class="btn btn-primary btn-lg active" role="button" aria-pressed="true">
            <i class="bi bi-arrow-clockwise"></i>
        </button>
    `

    resultado.forEach(cancha => {
        contenedor.innerHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="cancha-card">
                    <div class="card-img-wrapper">
                        <img src="${cancha.imagen}" alt="La 10 Usaquén" />

                        <span class="badge-rating"><i class="fa-solid fa-star"></i> 4.9 (150+)</span>
                    </div>
                    <div class="card-body-custom">
                        <div class="card-header-info">
                            <h5 class="cancha-title">${cancha.nombreCancha}</h5>
                            <span class="badge-tipo">${cancha.tipo}</span>
                        </div>
                        <div class="cancha-location">
                            <i class="fa-solid fa-location-dot"></i>${cancha.ubicacion}
                        </div>
                        <div class="amenities-list">
                            <span class="badge-amenity"><i class="fa-solid fa-mug-hot"></i> Resto-Bar</span>
                            <span class="badge-amenity"><i class="fa-solid fa-wifi"></i> Wi-Fi HighSpeed</span>
                            <span class="badge-amenity"><i class="fa-solid fa-square-parking"></i> Valet</span>
                        </div>
                        <div class="card-footer-custom flex-column align-items-stretch gap-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price-label">Desde</span>
                                <div class="price-value">$${cancha.precio} <span>/hr</span></div>
                            </div>

                            <div class="d-flex gap-2">
                                <!-- Botón para abrir el Modal -->
                                <button class="btn btn-outline-light btn-sm w-50 fw-semibold" data-bs-toggle="modal"
                                data-bs-target="#canchaModal"
                                data-cancha-id="${cancha.id}">
                                Ver Detalle
                                </button>

                                <!-- Botón para Redirigir a Reservas -->
                                <button 
                                    class="reserva btn btn-reservar btn-sm w-50 text-center"
                                    data-cancha-id="${cancha.id}"
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        `;
    })

    reset.addEventListener("click", () => {
        renderizarCanchas()
    })
    
})



document.addEventListener("DOMContentLoaded", function () {
    cargarCanchasAdmin();
    modalCanchas()
    irReservar()
});

export { todasLasCanchas }