document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM está listo');
    
    function detectDevice() {
        const width = window.innerWidth;
        
        // Ocultar todo
        document.querySelectorAll('.mobile-only, .desktop-only')
            .forEach(el => el.style.display = 'none');
        
        // Mostrar según dispositivo
        if (width <= 768) {
            document.querySelectorAll('.mobile-only')
                .forEach(el => el.style.display = 'block');
        } else {
            document.querySelectorAll('.desktop-only')
                .forEach(el => el.style.display = 'flex');
        }
    }

    detectDevice();
    window.addEventListener('resize', detectDevice);
});