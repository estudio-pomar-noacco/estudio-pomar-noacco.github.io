document.addEventListener('DOMContentLoaded', () => {
    // Variable global local para el número de WhatsApp (fallback por defecto)
    let rawWhatsAppNumber = '5491130043663';
    let professionalName = 'Dr. Ignacio Pomar';

    // 1. Control del Menú Móvil (con animación fa-bars / fa-xmark)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('active');
            if (menuIcon) {
                if (isOpen) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-xmark');
                } else {
                    menuIcon.classList.remove('fa-xmark');
                    menuIcon.classList.add('fa-bars');
                }
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

    // 2. Manejador del Formulario de Contacto (Envío estructurado por WhatsApp dinámico)
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

    // 3. Carga y Mapeo Dinámico desde data.json
    fetch('data.json')
        .then(res => {
            if (!res.ok) throw new Error('data.json no encontrado');
            return res.json();
        })
        .then(data => {
            const setTxt = (id, txt) => {
                const el = document.getElementById(id);
                if (el && txt) el.textContent = txt;
            };

            // General / Perfil / Contacto
            if (data.general) {
                const g = data.general;

                if (g.nombre_profesional) professionalName = g.nombre_profesional;
                if (g.telefono_raw) rawWhatsAppNumber = g.telefono_raw;

                setTxt('brand-logo', g.nombre_profesional);
                setTxt('profile-name', g.nombre_profesional);
                setTxt('profile-role', g.subtitulo_perfil);
                setTxt('profile-mat-cpacf', g.matricula_cpacf);
                setTxt('profile-mat-casm', g.matricula_casm);
                setTxt('profile-contact-email', g.email);
                setTxt('profile-contact-phone', g.telefono_display);
                setTxt('profile-contact-jurisdiction', g.jurisdiccion);
                setTxt('location-details', g.detalle_atencion);

                // Footer
                if (g.nombre_profesional) {
                    setTxt('footer-brand-title', g.nombre_profesional.toUpperCase());
                    setTxt('footer-copyright', `© 2026 ${g.nombre_profesional}. Todos los derechos reservados.`);
                }
                setTxt('footer-brand-mats', `Abogado (UBA) • Matrículas CPACF ${g.matricula_cpacf} | CASM ${g.matricula_casm}`);
                setTxt('footer-jurisdiction', `Jurisdicción: ${g.jurisdiccion}`);
                setTxt('footer-phone', g.telefono_display);
                setTxt('footer-email', g.email);

                if (g.zona_atencion) {
                    const locAddr = document.getElementById('location-address');
                    if (locAddr) locAddr.innerHTML = `<strong>Área de Atención:</strong> ${g.zona_atencion}`;
                }

                // Actualizar enlaces directos de WhatsApp
                const updateWa = (id, textEncoded) => {
                    const btn = document.getElementById(id);
                    if (btn) btn.href = `https://wa.me/${rawWhatsAppNumber}?text=${textEncoded}`;
                };
                updateWa('header-cta-btn', 'Hola%20Dr.%20Ignacio%20Pomar,%20necesito%20una%20consulta%20legal.');
                updateWa('mobile-whatsapp-link', 'Hola%20Dr.%20Ignacio%20Pomar,%20necesito%20una%20consulta%20legal.');
                updateWa('estudio-cta-btn', 'Hola%20Dr.%20Ignacio%20Pomar,%20deseo%20realizar%20una%20consulta%20por%20un%20caso.');
                updateWa('location-btn', 'Hola%20Dr.%20Ignacio%20Pomar,%20quisiera%20coordinar%20una%20reuni%C3%B3n%20presencial.');
                updateWa('floating-whatsapp-btn', 'Hola%20Dr.%20Ignacio%20Pomar,%20necesito%20una%20consulta%20legal%20urgente.');
            }

            // Hero
            if (data.hero && data.hero.titulo) {
                setTxt('hero-title', data.hero.titulo);
            }

            // Estudio
            if (data.estudio) {
                setTxt('estudio-heading', data.estudio.heading);
                setTxt('estudio-intro', data.estudio.intro);
                setTxt('estudio-detail', data.estudio.detail);
            }

            // Cita
            if (data.cita) {
                setTxt('quote-text', data.cita.texto);
                setTxt('quote-author', data.cita.autor);
            }

            // Áreas de Práctica
            if (data.areas) {
                ['penal', 'familia', 'litigacion', 'laboral', 'sucesiones', 'empresario'].forEach(key => {
                    if (data.areas[key]) {
                        setTxt(`area-${key}-title`, data.areas[key].titulo);
                        setTxt(`area-${key}-desc`, data.areas[key].descripcion);
                    }
                });
            }
        })
        .catch(err => {
            console.warn('data.json no disponible, se mantiene contenido HTML base:', err);
        });
});