document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM está listo');

    function detectDevice() {
        const width = window.innerWidth;

        // Mostrar según dispositivo
        if (width <= 768) {
            fetch('header-mobile.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                });
        } else {
            fetch('header-desktop.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('header-container').innerHTML = data;
                });
        }
    }

    detectDevice();
    window.addEventListener('resize', detectDevice);
});