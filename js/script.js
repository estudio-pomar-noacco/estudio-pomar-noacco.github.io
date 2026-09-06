document.addEventListener('DOMContentLoaded', () => {
    let rawWhatsAppNumber = '5491130043663';
    let professionalName = 'Dr. Ignacio Pomar Noacco';

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

    // 3. Población dinámica del DOM desde data.json
    fetch('data.json')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo leer data.json');
            return res.json();
        })
        .then(data => {
            const setTxt = (id, txt) => {
                const el = document.getElementById(id);
                if (el && txt !== undefined) el.textContent = txt;
            };

            // Datos Generales y Perfil
            if (data.general) {
                const g = data.general;
                if (g.nombre_profesional) professionalName = g.nombre_profesional;
                if (g.telefono_raw) rawWhatsAppNumber = g.telefono_raw;

                // SEO / Título de pestaña
                document.title = `${g.nombre_profesional} | ${g.subtitulo_perfil || 'Abogado'}`;

                setTxt('brand-logo', g.nombre_profesional);
                setTxt('profile-name', g.nombre_profesional);
                setTxt('profile-role', g.subtitulo_perfil);
                setTxt('profile-mat-cpacf', g.matricula_cpacf);
                setTxt('profile-mat-casm', g.matricula_casm);
                setTxt('profile-contact-email', g.email);
                setTxt('profile-contact-phone', g.telefono_display);
                setTxt('profile-contact-jurisdiction', g.jurisdiccion);
                setTxt('location-details', g.detalle_atencion);

                if (g.zona_atencion) {
                    const locAddr = document.getElementById('location-address');
                    if (locAddr) locAddr.innerHTML = `<strong>Área de Atención:</strong> ${g.zona_atencion}`;
                }

                // Footer
                setTxt('footer-brand-title', g.nombre_profesional.toUpperCase());
                setTxt('footer-brand-mats', `Abogado (UBA) • Matrículas CPACF ${g.matricula_cpacf} | CASM ${g.matricula_casm}`);
                setTxt('footer-jurisdiction', `Jurisdicción: ${g.jurisdiccion}`);
                setTxt('footer-phone', g.telefono_display);
                setTxt('footer-email', g.email);
                setTxt('footer-copyright', `© 2026 ${g.nombre_profesional}. Todos los derechos reservados.`);

                // Actualizar enlaces de WhatsApp
                const updateWa = (id, msg) => {
                    const btn = document.getElementById(id);
                    if (btn) btn.href = `https://wa.me/${rawWhatsAppNumber}?text=${encodeURIComponent(msg)}`;
                };

                const msgDefault = `Hola ${g.nombre_profesional}, necesito una consulta legal.`;
                updateWa('header-cta-btn', msgDefault);
                updateWa('mobile-whatsapp-link', msgDefault);
                updateWa('estudio-cta-btn', `Hola ${g.nombre_profesional}, deseo realizar una consulta por un caso.`);
                updateWa('location-btn', `Hola ${g.nombre_profesional}, quisiera coordinar una reunión presencial.`);
                updateWa('floating-whatsapp-btn', `Hola ${g.nombre_profesional}, necesito una consulta legal urgente.`);
            }

            // Hero
            if (data.hero) {
                setTxt('hero-title', data.hero.titulo);
            }

            // Estudio
            if (data.estudio) {
                setTxt('estudio-heading', data.estudio.heading);
                setTxt('estudio-intro', data.estudio.intro); // Soporta los \n\n por el style="white-space: pre-line;"
                setTxt('estudio-detail', data.estudio.detail);
            }

            // Cita
            if (data.cita) {
                setTxt('quote-text', data.cita.texto);
                setTxt('quote-author', data.cita.autor);
            }

            // Áreas de Práctica
            if (data.areas) {
                Object.keys(data.areas).forEach(key => {
                    setTxt(`area-${key}-title`, data.areas[key].titulo);
                    setTxt(`area-${key}-desc`, data.areas[key].descripcion);
                });
            }
        })
        .catch(err => {
            console.error('Error cargando data.json:', err);
        });
});