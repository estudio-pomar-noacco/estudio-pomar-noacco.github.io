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
    // 2. Envío del Formulario a WhatsApp con Validaciones
    const contactForm = document.getElementById('contact-form');
    const errorMsg = document.getElementById('form-error-msg');

    function showError(mensaje) {
        if (errorMsg) {
            errorMsg.textContent = mensaje;
            errorMsg.style.display = 'block';
        } else {
            alert(mensaje);
        }
    }

    function clearError() {
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
        }
    }

    // Función auxiliar para detectar texto repetitivo sin sentido (ej: "aaaaaaaaaa")
    function esTextoRepetitivo(texto) {
        return /(.)\1{4,}/.test(texto); // Detecta un mismo caracter repetido 5 o más veces seguidas
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearError();

            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const emailInput = document.getElementById('form-email');
            const materiaInput = document.getElementById('form-materia');
            const messageInput = document.getElementById('form-message');

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const materia = materiaInput.value;
            const message = messageInput.value.trim();

            // 1. Validar Nombre
            if (name.length < 3) {
                showError('Por favor, ingrese un nombre y apellido válido.');
                nameInput.focus();
                return;
            }
            if (esTextoRepetitivo(name)) {
                showError('El nombre ingresado no parece ser válido.');
                nameInput.focus();
                return;
            }

            // 2. Validar Teléfono (al menos 8 dígitos numéricos)
            const digitosTelefono = phone.replace(/\D/g, '');
            if (digitosTelefono.length < 8) {
                showError('Ingrese un número de teléfono o celular válido (mínimo 8 dígitos).');
                phoneInput.focus();
                return;
            }

            // 3. Validar Materia seleccionada
            if (!materia) {
                showError('Por favor, seleccione el área de consulta legal.');
                materiaInput.focus();
                return;
            }

            // 4. Validar Email si fue completado
            if (email.length > 0) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showError('El correo electrónico ingresado no tiene un formato válido.');
                    emailInput.focus();
                    return;
                }
            }

            // 5. Validar Mensaje
            if (message.length < 15) {
                showError('Por favor, describa brevemente su consulta (mínimo 15 caracteres).');
                messageInput.focus();
                return;
            }
            if (esTextoRepetitivo(message)) {
                showError('Por favor, ingrese un mensaje descriptivo de su situación.');
                messageInput.focus();
                return;
            }

            // Mensaje limpio y listo para WhatsApp
            const waEmail = email ? email : 'No especificado';
            const waText = `Hola ${professionalName}, mi nombre es ${name}.%0A%0A- Teléfono: ${phone}%0A- Email: ${waEmail}%0A- Materia: ${materia}%0A- Detalle de la consulta: ${message}`;
            const waUrl = `https://wa.me/${rawWhatsAppNumber}?text=${waText}`;

            window.open(waUrl, '_blank');
        });
    }
});