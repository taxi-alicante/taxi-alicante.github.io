/* ==========================================
   LÓGICA GLOBAL, SCROLL Y SERVICE WORKER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar año dinámico en el footer
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Control del botón flotante para subir (#btn-subir)
    const btnSubir = document.getElementById('btn-subir');
    if (btnSubir) {
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                btnSubir.classList.add('mostrar');
            } else {
                btnSubir.classList.remove('mostrar');
            }
        });
    }
});

// 3. Registro del Service Worker Global para toda la PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(reg => console.log('SW Raíz registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar SW Raíz:', err));
    });
}