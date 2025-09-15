document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM está listo');

    function detectDevice() {
        const width = window.innerWidth;
        const currentPath = window.location.pathname;
        let basePath = '/tiendaGBA/includes/components/';

        // Ajusta la ruta base si estamos en una subcarpeta
        if (currentPath.includes('/pages/auth/')) {
            basePath = '../../includes/components/';
        } else if (currentPath.includes('/pages/')) {
            basePath = '../includes/components/';
        }

        // Mostrar según dispositivo
        if (width <= 768) {
            fetch(basePath + 'header-mobile.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                });
        } else {
            fetch(basePath + 'header-desktop.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                });
        }
    }

    detectDevice();
    window.addEventListener('resize', detectDevice);
});