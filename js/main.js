/* ==========================================
   LÓGICA GLOBAL Y SERVICE WORKER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar año dinámico en el footer si el elemento existe
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// 2. Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
            .then(reg => console.log('SW Raíz registrado con éxito:', reg.scope))
            .catch(err => console.error('Error al registrar SW Raíz:', err));
    });
}