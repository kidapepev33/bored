// common.js

// Crear contenedor de notificaciones al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
});

// Función auxiliar para obtener o crear el contenedor
function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Toast notification
function showToast(mensaje, tipo = 'success') {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${tipo}`;
    toast.textContent = mensaje;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confirm como toast flotante - SIEMPRE ARRIBA
function showConfirm(mensaje) {
    return new Promise((resolve) => {
        const container = getToastContainer();
        
        const toast = document.createElement('div');
        toast.className = 'toast-confirm';
        toast.innerHTML = `
            <div class="toast-confirm-message">${mensaje}</div>
            <div class="toast-confirm-buttons">
                <button class="btn-cancel">Cancelar</button>
                <button class="btn-accept">Aceptar</button>
            </div>
        `;
        
        // Insertar al INICIO del contenedor (arriba de todo)
        if (container.firstChild) {
            container.insertBefore(toast, container.firstChild);
        } else {
            container.appendChild(toast);
        }
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        toast.querySelector('.btn-accept').onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                resolve(true);
            }, 300);
        };
        
        toast.querySelector('.btn-cancel').onclick = () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                resolve(false);
            }, 300);
        };
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}