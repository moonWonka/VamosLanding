document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navegación activa con IntersectionObserver
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Gatilla cuando la sección está a la mitad de la pantalla
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remover clase active de todos los links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Añadir clase active al link correspondiente
                const currentId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // 2. Animaciones al hacer scroll (Scroll Reveal)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px', // Gatilla un poco antes de que aparezca completamente
        threshold: 0
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 3. Menú móvil toggle y cierre automático
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Opcional: animar el ícono de hamburguesa
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Cerrar menú móvil al hacer click
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }

            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
});