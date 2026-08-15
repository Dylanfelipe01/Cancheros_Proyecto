
const formCancha = document.getElementById("formCancha");
const tablaCanchas = document.getElementById("tablaCanchas");

const mostrarMensajeSinCancha = () => {
    tablaCanchas.innerHTML = `
        <tr id="sinCanchas">
            <td id="mensajeSinCanchas" colspan="7" class="mensaje-sin-canchas">
                No hay canchas agregadas todavía.
            </td>
        </tr>
    `
}

document.addEventListener("DOMContentLoaded", () => {
    const guardado = localStorage.getItem("tablas");

    if (guardado && guardado.trim() !== "") {
        tablaCanchas.innerHTML = guardado;
    }else{
        mostrarMensajeSinCancha()
    }
});

//Validaciones para el formular agregar cancha donde no le permite al usuario agregar una cancha hasta
//completar todo el formulario
const validarFormulario = (nombreCancha, precio, disponible, imagenCancha, ubicacion, descripcion, cerrarVentana, mensajeSinCanchas) => {
    
    if(!validarNombreCancha(nombreCancha)){
        Swal.fire({
            title: "El campo del nombre esta vacío.",
            text: "Debes ingresar el nombre de la cancha.",
            icon: "error"
        });
        return false;
    }

    if(!validarPrecioCancha(precio)){
        Swal.fire({
            title: "Precio inválido",
            text: "El precio debe contener solamente números.",
            icon: "error"
        });
        return false
    }

    if(!validarNumero(precio)){
        Swal.fire({
            title: "El precio es obligatorio.",
            text: "Debes colocar un valor en el campo.",
            icon: "error"
        });
        return false
    }

    if(!validarDisponibleCancha(disponible)){
        Swal.fire({
            title: "Campo obligatorio.",
            text: "Selecciona uno de los dos estados de la cancha.",
            icon: "error"
        });
        return false
    }

    if(!validarImagenCancha(imagenCancha)){
        Swal.fire({
            title: "Las fotos son requeridas.",
            text: "Debes seleccionar al menos una foto.",
            icon: "error"
        });
        return false
    }

    if(!validarUbicacionCancha(ubicacion)){
        Swal.fire({
            title: "La ubicación es obligatoria.",
            text: "Debes colocar una ubicación en el campo.",
            icon: "error"
        });
        return false
    }

    if(!validarDescripcionCancha(descripcion)){
        Swal.fire({
            title: "La descripcion es obligatoria.",
            text: "Debes colocar una descripción.",
            icon: "error"
        });
        return false
    }

    return true

}

const validarNombreCancha = (nombreCancha) => {
    if(nombreCancha.value.trim() === ""){
        return false
    }
    return true;
}

const validarPrecioCancha = (precio) => {
    if(precio.value.trim() === ""){
        
        return false;
    }
    return true
}

const validarNumero = (precio) => {
    if (isNaN(precio.value)) {
        return false
    }
    return true;
}

const validarDisponibleCancha = (disponible) => {
    if(!disponible){
        
        return false;
    }
    return true
}

const validarImagenCancha = (imagenCancha) => {
    if(imagenCancha.files.length === 0){
        
        return false;
    }
    return true
}

const validarUbicacionCancha = (ubicacion) => {
    if(ubicacion.value.trim() === ""){
        
        return false;
    }
    return true
}

const validarDescripcionCancha = (descripcion) => {
    if(descripcion.value.trim() === ""){
        
        return false;
    }

    return true
}

const agregarCancha = (nombreCancha, precio, disponible, imagenCancha, ubicacion, descripcion, cerrarVentana, mensajeSinCanchas) => {
    document.activeElement.blur();

    const archivoImagen = imagenCancha.files[0];

    const url = URL.createObjectURL(archivoImagen);

    let contador = Number(localStorage.getItem("contadorCanchas")) || 0;
    contador++;

    localStorage.setItem("contadorCanchas", contador);
    
    const tablas = `
        <tr>
            <td>${contador}</td>
            <td>${disponible.value ? "Si" : "No"}</td>
            <td>${descripcion.value}</td>
            <td>${nombreCancha.value}</td>
            <td>${precio.value}</td>
            <td>${ubicacion.value}</td>
            <td>
                <img src="${url}" alt="${nombreCancha.value}" width="60" height="60" />
            </td>
            <td><i class="trash-logo bi bi-trash fs-3"></i></td>
        </tr>
    `
    const guardado = localStorage.getItem("tablas");
    if(guardado){
        tablaCanchas.innerHTML = guardado + tablas
    }else{
        tablaCanchas.innerHTML += tablas
    }

    localStorage.setItem("tablas", tablaCanchas.innerHTML);

}

formCancha.addEventListener("submit", (event) => {
    
    const nombreCancha = document.getElementById("nombreCancha");
    const precio = document.getElementById("precio");
    const disponible = document.querySelector('input[name="disponible"]:checked');
    const imagenCancha = document.getElementById("imagenCancha");
    const ubicacion = document.getElementById("ubicacion");
    const descripcion = document.getElementById("descripcion");
    const cerrarVentana = document.getElementById("cerrarVentana");
    const sinCanchas = document.getElementById("sinCanchas");
    const modal = document.getElementById("agregarCancha");

    event.preventDefault();

    if(!validarFormulario(nombreCancha, precio, disponible, imagenCancha, ubicacion, descripcion, cerrarVentana)){
        return;
    }

    if (sinCanchas) {
        sinCanchas.remove();
    }
    
    agregarCancha(nombreCancha, precio, disponible, imagenCancha, ubicacion, descripcion, cerrarVentana);
    
    
    
    document.activeElement.blur();
    /*
    document.getElementById("cerrarVentana").click()

    nombreCancha.value = ""
    precio.value = "";
    imagenCancha.value = "";
    ubicacion.value = "";
    descripcion.value = "";

    if (disponible) {
        disponible.checked = false;
    }*/

    formCancha.reset();

    const modalBootstrap = bootstrap.Modal.getInstance(modal);
    modalBootstrap.hide();

    Swal.fire({
        title: "Cancha agregada",
        icon: "success"
    });
})




