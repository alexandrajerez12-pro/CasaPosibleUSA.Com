/* ==============================================
   DINORAH NATION - BIENES RAÍCES DE LUJO
   JavaScript - Funcionalidad Interactiva
   
   Este archivo contiene todas las interacciones
   del sitio web: menú móvil, formularios, 
   animaciones al scroll, etc.
   ============================================== */

// ==============================================
// 1. ESPERAR A QUE EL DOM ESTÉ LISTO
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar todas las funciones
    initMobileMenu();
    initHeaderScroll();
    initScrollAnimations();
    initSearchForm();
    initContactForm();
    initFavoriteButtons();
    initSmoothScroll();
    
});

// ==============================================
// 2. MENÚ MÓVIL (Hamburguesa)
// ==============================================
function initMobileMenu() {
    // Obtener elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Si no existe el botón, salir
    if (!menuToggle || !nav) return;
    
    // Al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        // Alternar clase 'active' en el botón y navegación
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Cambiar atributo aria para accesibilidad
        const isOpen = nav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });
    
    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// ==============================================
// 3. HEADER AL HACER SCROLL
// ==============================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    // Función que verifica la posición del scroll
    function checkScroll() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }
    
    // Ejecutar al cargar la página
    checkScroll();
    
    // Ejecutar al hacer scroll
    window.addEventListener('scroll', checkScroll);
}

// ==============================================
// 4. ANIMACIONES AL HACER SCROLL (Fade In)
// ==============================================
function initScrollAnimations() {
    // Elementos a animar
    const animatedElements = document.querySelectorAll(
        '.property-card, .about__image-wrapper, .about__content, .contact__info, .contact__form'
    );
    
    // Agregar clase inicial para animación
    animatedElements.forEach(function(element) {
        element.classList.add('fade-in');
    });
    
    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% visible
    };
    
    // Crear el observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Agregar clase para mostrar elemento
                entry.target.classList.add('visible');
                // Dejar de observar este elemento
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar cada elemento
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

// ==============================================
// 5. FORMULARIO DE BÚSQUEDA (Hero)
// ==============================================
function initSearchForm() {
    const searchForm = document.getElementById('searchForm');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(event) {
        // Prevenir envío por defecto
        event.preventDefault();
        
        // Obtener valores
        const location = document.getElementById('searchLocation').value.trim();
        const type = document.getElementById('searchType').value;
        const budget = document.getElementById('searchBudget').value;
        
        // Crear objeto con los datos de búsqueda
        const searchData = {
            location: location,
            type: type,
            budget: budget
        };
        
        // Mostrar en consola (para demostración)
        console.log('🔍 Búsqueda realizada:', searchData);
        
        // Mostrar mensaje al usuario
        showNotification('¡Búsqueda iniciada! Te mostraremos las propiedades disponibles.', 'success');
        
        // Aquí podrías redirigir a una página de resultados
        // window.location.href = '/propiedades?' + new URLSearchParams(searchData);
    });
}

// ==============================================
// 6. FORMULARIO DE CONTACTO
// ==============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        // Prevenir envío por defecto
        event.preventDefault();
        
        // Validar formulario
        if (!validateContactForm(contactForm)) {
            return;
        }
        
        // Obtener el botón de envío
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Mostrar estado de carga
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<span>Enviando...</span>';
        submitButton.disabled = true;
        
        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            interes: document.getElementById('interes').value,
            presupuesto: document.getElementById('presupuesto').value,
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        // Simular envío (en producción, aquí irías a tu servidor)
        setTimeout(function() {
            // Mostrar en consola
            console.log('📧 Formulario enviado:', formData);
            
            // Quitar estado de carga
            submitButton.classList.remove('loading');
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Mostrar mensaje de éxito
            showNotification(
                '¡Gracias por contactarnos! ' + formData.nombre + ', te responderemos pronto.',
                'success'
            );
            
            // Limpiar formulario
            contactForm.reset();
            
        }, 1500); // Simular delay de 1.5 segundos
    });
}

// ==============================================
// 7. VALIDACIÓN DEL FORMULARIO
// ==============================================
function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Limpiar errores anteriores
    form.querySelectorAll('.form-error').forEach(function(error) {
        error.remove();
    });
    form.querySelectorAll('.form-input, .form-select').forEach(function(input) {
        input.style.borderColor = '';
    });
    
    // Validar cada campo requerido
    requiredFields.forEach(function(field) {
        const value = field.value.trim();
        
        if (!value) {
            isValid = false;
            showFieldError(field, 'Este campo es obligatorio');
        } else if (field.type === 'email' && !isValidEmail(value)) {
            isValid = false;
            showFieldError(field, 'Por favor ingresa un email válido');
        }
    });
    
    return isValid;
}

// Mostrar error en un campo específico
function showFieldError(field, message) {
    field.style.borderColor = '#EF4444';
    
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.style.cssText = 'color: #EF4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ==============================================
// 8. BOTONES DE FAVORITOS
// ==============================================
function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.property-card__favorite');
    
    favoriteButtons.forEach(function(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Alternar clase de favorito
            this.classList.toggle('is-favorite');
            
            // Obtener el título de la propiedad
            const card = this.closest('.property-card');
            const propertyTitle = card.querySelector('.property-card__title').textContent;
            
            // Verificar estado
            const isFavorite = this.classList.contains('is-favorite');
            
            // Mostrar notificación
            if (isFavorite) {
                this.querySelector('svg').style.fill = 'var(--color-accent)';
                showNotification('❤️ "' + propertyTitle + '" agregada a favoritos', 'success');
            } else {
                this.querySelector('svg').style.fill = 'none';
                showNotification('"' + propertyTitle + '" quitada de favoritos', 'info');
            }
        });
    });
}

// ==============================================
// 9. SCROLL SUAVE PARA ENLACES INTERNOS
// ==============================================
function initSmoothScroll() {
    // Obtener todos los enlaces que apuntan a secciones internas
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            // Si el href es solo "#", ignorar
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Obtener la altura del header para compensar
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calcular posición del elemento
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Hacer scroll suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==============================================
// 10. SISTEMA DE NOTIFICACIONES
// ==============================================
function showNotification(message, type) {
    // Tipos: 'success', 'error', 'info', 'warning'
    type = type || 'info';
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification notification--' + type;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        max-width: 350px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#1A2B3C'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 0.875rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después de 4 segundos
    setTimeout(function() {
        notification.style.transform = 'translateX(400px)';
        
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 4000);
}

// ==============================================
// 11. UTILIDADES ADICIONALES
// ==============================================

// Formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Debounce para optimizar eventos frecuentes
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        clearTimeout(timeout);
        
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// ==============================================
// 12. MENSAJE EN CONSOLA (Para principiantes)
// ==============================================
console.log('%c🏠 Dinorah Nation - Bienes Raíces', 'font-size: 20px; font-weight: bold; color: #1A2B3C;');
console.log('%c✨ Sitio web desarrollado con amor', 'font-size: 12px; color: #C5A059;');
console.log('%c📧 Para cualquier duda, revisa los comentarios en el código', 'font-size: 12px; color: #6C757D;');
