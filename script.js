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

    // 3. Menú móvil (ocultar al hacer click si es necesario)
    // El diseño actual en móvil coloca los links abajo, por lo que el click
    // naturalmente lleva a la sección gracias al smooth scroll de CSS.
    // Solo aseguramos el comportamiento suave.
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // El scroll suave ya está manejado por el CSS 'scroll-behavior: smooth' en el html.
            // Esto es solo un respaldo si quisieramos controlar el offset del header de forma estricta por JS
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Remover active de todos rápidamente al hacer click
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
});