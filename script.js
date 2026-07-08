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

    // 4. Envío de Formulario por Web3Forms con AJAX (fetch)
    const cotizacionForm = document.getElementById('cotizacion-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    // Coin flip overlay elements
    const coinOverlay = document.getElementById('coin-overlay');
    const coinElement = document.querySelector('.coin');
    const coinCloseBtn = document.getElementById('coin-close-btn');
    const coinSound = document.getElementById('coin-sound');

    /**
     * Muestra el overlay con la animación de moneda y reproduce el sonido.
     */
    function showCoinAnimation() {
        // Resetear estados previos
        coinElement.classList.remove('spinning', 'landed');

        // Activar overlay
        coinOverlay.classList.add('active');

        // Reproducir sonido de moneda
        if (coinSound) {
            coinSound.currentTime = 0;
            coinSound.play().catch(() => {
                // Autoplay bloqueado por el navegador, ignorar silenciosamente
            });
        }

        // Iniciar giro de moneda con un pequeño delay para que el overlay se vea primero
        requestAnimationFrame(() => {
            coinElement.classList.add('spinning');
        });

        // Después de que termine la animación de giro, agregar efecto de brillo pulsante
        setTimeout(() => {
            coinElement.classList.remove('spinning');
            coinElement.classList.add('landed');
        }, 2100);
    }

    /**
     * Cierra el overlay y resetea la animación.
     */
    function closeCoinOverlay() {
        coinOverlay.classList.remove('active');

        // Resetear todo después de que termine la transición de cierre
        setTimeout(() => {
            coinElement.classList.remove('spinning', 'landed');
            if (coinSound) {
                coinSound.pause();
                coinSound.currentTime = 0;
            }
        }, 400);
    }

    // Event listener para cerrar el overlay
    if (coinCloseBtn) {
        coinCloseBtn.addEventListener('click', closeCoinOverlay);
    }

    // Cerrar al hacer click fuera del contenido
    if (coinOverlay) {
        coinOverlay.addEventListener('click', (e) => {
            if (e.target === coinOverlay) {
                closeCoinOverlay();
            }
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && coinOverlay && coinOverlay.classList.contains('active')) {
            closeCoinOverlay();
        }
    });

    if (cotizacionForm && formResult && submitBtn) {
        cotizacionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Evitar envíos duplicados mientras se procesa
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Enviando...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            // Mostrar estado de carga inicial en la alerta
            formResult.style.display = "block";
            formResult.style.backgroundColor = "#e2e8f0";
            formResult.style.color = "#334155";
            formResult.style.border = "1px solid #cbd5e1";
            formResult.textContent = "Procesando su solicitud...";

            const formData = new FormData(cotizacionForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Éxito — ocultar mensaje de texto y mostrar animación de moneda
                    formResult.style.display = "none";
                    cotizacionForm.reset();
                    showCoinAnimation();
                } else {
                    // Error de la API de Web3Forms (ej. clave inválida)
                    console.log(response);
                    formResult.style.backgroundColor = "#f8d7da";
                    formResult.style.color = "#842029";
                    formResult.style.border = "1px solid #f5c2c7";
                    formResult.innerHTML = `<strong>⚠️ Error al enviar:</strong> ${json.message || "Por favor intente nuevamente."}`;
                }
            })
            .catch(error => {
                // Error de red
                console.log(error);
                formResult.style.backgroundColor = "#f8d7da";
                formResult.style.color = "#842029";
                formResult.style.border = "1px solid #f5c2c7";
                formResult.innerHTML = "<strong>⚠️ Error de conexión:</strong> No pudimos conectar con el servidor. Inténtelo más tarde.";
            })
            .then(() => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Ocultar el mensaje de error automáticamente después de 6 segundos
                setTimeout(() => {
                    formResult.style.display = "none";
                }, 6000);
            });
        });
    }
});