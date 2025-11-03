document.addEventListener('DOMContentLoaded', async () => {
    await mostrarSubtotal();

    document.querySelector('.formulario-pago').addEventListener('submit', validarPago);
});

// Mostrar subtotal desde sesión
async function mostrarSubtotal() {
    try {
        const res = await fetch('../includes/functions/get-subtotal.php', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();

        const subtotal = data.subtotal || 0;

        document.getElementById('subtotal').textContent = `₡${Number(subtotal).toLocaleString()}`;
        document.getElementById('total').textContent = `₡${Number(subtotal).toLocaleString()}`;
    } catch (err) {
        console.error('Error al cargar subtotal:', err);
    }
}

// Validar datos de pago
function validarPago(e) {
    e.preventDefault();

    const numero = document.getElementById('numero-tarjeta').value.replace(/\s+/g, '');
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value;
    const nombre = document.getElementById('nombre-tarjeta').value;

    if (!numero || !vencimiento || !cvv || !nombre) {
        showToast("Completa todos los campos requeridos.");
        return;
    }

    if (!validarLuhn(numero)) {
        showToast("Número de tarjeta inválido.");
        return;
    }

    const [mes, anio] = vencimiento.split('/').map(x => parseInt(x));
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;

    if (mes < 1 || mes > 12 || anio < añoActual || (anio === añoActual && mes < mesActual)) {
        showToast("Fecha de vencimiento inválida o tarjeta expirada.");
        return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
        showToast("CVV inválido.");
        return;
    }

    showToast("Pago exitoso.");
}

// Función Luhn
function validarLuhn(numero) {
    let suma = 0;
    let alternar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
        let n = parseInt(numero[i]);
        if (alternar) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        suma += n;
        alternar = !alternar;
    }
    return (suma % 10) === 0;
}

async function mostrarSubtotal() {
    try {
        const response = await fetch('../includes/functions/get-subtotal.php', {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();

        if (data.success && data.subtotal) {
            // Sumar todos los valores del objeto
            const total = Object.values(data.subtotal).reduce((acc, val) => acc + val, 0);

            document.getElementById('subtotal').textContent = `₡${total.toLocaleString()}`;
            document.getElementById('total').textContent = `₡${total.toLocaleString()}`;
            
        } else {
            console.error('No se pudo obtener el subtotal:', data);
        }
    } catch (error) {
        console.error('Error al obtener subtotal:', error);
    }
}