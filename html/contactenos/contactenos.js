const formulario = document.getElementById("formContacto");

formulario.addEventListener("submit", validarFormulario);

function validarFormulario(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    if (!validarNombre(nombre)) return;

    if (!validarCorreo(correo)) return;

    if (!validarTelefono(telefono)) return;

    if (!validarMensaje(mensaje)) return;

    formulario.submit();
}


function validarNombre(nombre) {

    if (nombre === "") {
        alert("El nombre es obligatorio.");
        return false;
    }

    if (nombre.length < 3) {
        alert("El nombre debe tener mínimo 3 caracteres.");
        return false;
    }

    return true;
}


function validarCorreo(correo) {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(correo)) {
        alert("Correo electrónico inválido.");
        return false;
    }

    return true;
}

function validarTelefono(telefono) {

    const regex = /^[0-9]{10}$/;

    if (!regex.test(telefono)) {
        alert("El teléfono debe tener 10 dígitos.");
        return false;
    }

    return true;
}



function validarMensaje(mensaje){

    if(mensaje === ""){
        alert("Debe escribir un mensaje.");
        return false;
    }

    if(mensaje.length < 10){
        alert("El mensaje debe tener al menos 10 caracteres.");
        return false;
    }

    return true;
}