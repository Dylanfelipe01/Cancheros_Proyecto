const canchas = JSON.parse(localStorage.getItem("canchas")) || [];

const canchasEstaticas = [
    {
        id: 1,
        nombreCancha: "Cancha la 38",
        ubicacion: "Galán, Calle 56 #32",
        imagen: "../imagenes/cancha_ejemplo2.png",
        rating: 4.9,
        reseñas: "120+",
        tipo: "Fútbol 5",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 100000
    },

    {
        id: 2,
        nombreCancha: "Cancha El Gol",
        ubicacion: "Soledad, Calle 30 #15",
        imagen: "../imagenes/canchas/cancha2.jpg",
        rating: 4.7,
        reseñas: "85+",
        tipo: "Fútbol 5",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 80000
    },

    {
        id: 3,
        nombreCancha: "Cancha Los Campeones",
        ubicacion: "Barranquilla, Calle 72 #40",
        imagen: "../imagenes/canchas/cancha3.jpg",
        rating: 4.8,
        reseñas: "150+",
        tipo: "Fútbol 7",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 120000
    },

    {
        id: 4,
        nombreCancha: "Cancha La 72",
        ubicacion: "Barranquilla, Calle 72 #25",
        imagen: "../imagenes/canchas/cancha4.jpg",
        rating: 4.6,
        reseñas: "70+",
        tipo: "Fútbol 5",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 90000
    },

    {
        id: 5,
        nombreCancha: "Cancha El Estadio",
        ubicacion: "Barranquilla, Carrera 38 #45",
        imagen: "../imagenes/canchas/cancha5.jpg",
        rating: 5.0,
        reseñas: "200+",
        tipo: "Fútbol 8",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 150000
    },
    {
    id: 6,
    nombreCancha: "Cancha La 84",
    ubicacion: "Barranquilla, Calle 84 #46",
    imagen: "../imagenes/canchas/cancha6.jpg",
    rating: 4.7,
    reseñas: "95+",
    tipo: "Fútbol 5",
    servicios: [
        {
            icono: "fa-solid fa-person-shelter",
            nombreCancha: "Camerinos"
        },
        {
            icono: "fa-solid fa-square-parking",
            nombreCancha: "Parqueadero"
        }
    ],
    precio: 85000
    },

    {
        id: 7,
        nombreCancha: "Cancha Los Amigos",
        ubicacion: "Soledad, Carrera 18 #52",
        imagen: "../imagenes/canchas/cancha7.jpg",
        rating: 4.9,
        reseñas: "180+",
        tipo: "Fútbol 7",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 110000
    },

    {
        id: 8,
        nombreCancha: "Cancha El Campeón",
        ubicacion: "Barranquilla, Carrera 43 #68",
        imagen: "../imagenes/canchas/cancha10.jpg",
        rating: 4.8,
        reseñas: "140+",
        tipo: "Fútbol 8",
        servicios: [
            {
                icono: "fa-solid fa-person-shelter",
                nombreCancha: "Camerinos"
            },
            {
                icono: "fa-solid fa-square-parking",
                nombreCancha: "Parqueadero"
            }
        ],
        precio: 130000
    }
];

const canchasGuardadasConId = canchas.map((cancha, index) => ({
    ...cancha,
    id: 10 + index
}));

const todasLasCanchas = [
    ...canchasEstaticas,
    ...canchasGuardadasConId
];


function cargarCanchasAdmin() {
    
    const contenedor = document.getElementById("containerMain");
    
    todasLasCanchas.forEach(cancha => {
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
                    <span class="badge-tipo">Fútbol 8</span>
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
                        <a href="./reservas.html" class="btn btn-reservar btn-sm w-50 text-center">
                        Reservar
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            
        `;
    });
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
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cargarCanchasAdmin();
    modalCanchas()
});