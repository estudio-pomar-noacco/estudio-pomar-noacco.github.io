document.addEventListener('DOMContentLoaded', () => {
    const rawWhatsAppNumber = '5491130043663';
    const professionalName = 'Dr. Ignacio Pomar';

    // 1. Control del Menú Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            if (menuIcon) {
                menuIcon.classList.toggle('fa-bars', !isOpen);
                menuIcon.classList.toggle('fa-xmark', isOpen);
            }
        });

        // Cerrar menú al hacer clic en cualquier enlace
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Envío del Formulario a WhatsApp
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const email = document.getElementById('form-email').value.trim() || 'No especificado';
            const materia = document.getElementById('form-materia').value;
            const message = document.getElementById('form-message').value.trim();

            const waText = `Hola ${professionalName}, mi nombre es ${name}.%0A%0A- Teléfono: ${phone}%0A- Email: ${email}%0A- Materia: ${materia}%0A- Mensaje: ${message}`;
            const waUrl = `https://wa.me/${rawWhatsAppNumber}?text=${waText}`;

            window.open(waUrl, '_blank');
        });
    }
});