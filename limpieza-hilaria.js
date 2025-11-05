// ===================================
// LIMPIEZA HILARIA - JAVASCRIPT
// ===================================

// VARIABLES GLOBALES
let currentLang = 'es';
const prices = {
    chico: 500,
    mediano: 700,
    grande: 1000
};

// ===================================
// SISTEMA BILINGÜE
// ===================================
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        switchLanguage(lang);
        
        // Actualizar botones activos
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

function switchLanguage(lang) {
    currentLang = lang;
    
    // Cambiar todos los elementos con data-es y data-en
    document.querySelectorAll('[data-es]').forEach(element => {
        if (lang === 'es') {
            element.textContent = element.getAttribute('data-es');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Cambiar placeholders de inputs
    document.querySelectorAll('[data-placeholder-es]').forEach(element => {
        if (lang === 'es') {
            element.placeholder = element.getAttribute('data-placeholder-es');
        } else {
            element.placeholder = element.getAttribute('data-placeholder-en');
        }
    });
    
    // Cambiar options de select
    document.querySelectorAll('option[data-es]').forEach(option => {
        if (lang === 'es') {
            option.textContent = option.getAttribute('data-es');
        } else {
            option.textContent = option.getAttribute('data-en');
        }
    });
    
    // Recalcular precios con nuevo idioma
    calculatePrice();
}

// ===================================
// NAVEGACIÓN SUAVE
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// CALCULADORA DE PRECIOS
// ===================================
const apartmentTypeSelect = document.getElementById('apartmentType');
const quantityInput = document.getElementById('quantity');

// Event listeners para calculadora
if (apartmentTypeSelect) {
    apartmentTypeSelect.addEventListener('change', calculatePrice);
}

if (quantityInput) {
    quantityInput.addEventListener('input', calculatePrice);
}

function increaseQty() {
    const input = document.getElementById('quantity');
    let value = parseInt(input.value);
    if (value < 12) {
        input.value = value + 1;
        calculatePrice();
    }
}

function decreaseQty() {
    const input = document.getElementById('quantity');
    let value = parseInt(input.value);
    if (value > 1) {
        input.value = value - 1;
        calculatePrice();
    }
}

function setQuantity(qty) {
    document.getElementById('quantity').value = qty;
    calculatePrice();
}

function calculatePrice() {
    const apartmentType = document.getElementById('apartmentType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Obtener precio base
    const basePrice = prices[apartmentType];
    
    // Calcular subtotal
    const subtotal = basePrice * quantity;
    
    // Calcular descuento
    let discountPercent = 0;
    if (quantity >= 12) {
        discountPercent = 20;
    } else if (quantity >= 5) {
        discountPercent = 10;
    }
    
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const total = subtotal - discountAmount;
    
    // Actualizar UI
    document.getElementById('pricePerCleaning').textContent = `$${basePrice.toLocaleString()}`;
    document.getElementById('quantityDisplay').textContent = quantity;
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `$${total.toLocaleString()} MXN`;
    
    // Mostrar/ocultar descuento
    const discountRow = document.getElementById('discountRow');
    const discountInfo = document.getElementById('discountInfo');
    
    if (discountPercent > 0) {
        discountRow.style.display = 'flex';
        discountInfo.style.display = 'block';
        document.getElementById('discount').textContent = `-$${discountAmount.toLocaleString()} (${discountPercent}%)`;
        document.getElementById('savingsAmount').textContent = `$${discountAmount.toLocaleString()}`;
    } else {
        discountRow.style.display = 'none';
        discountInfo.style.display = 'none';
    }
}

// Calcular precio inicial
calculatePrice();

// ===================================
// PROCESAMIENTO DE PAGO PAYPAL
// ===================================
function proceedToPayment() {
    const apartmentType = document.getElementById('apartmentType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = prices[apartmentType];
    const subtotal = basePrice * quantity;
    
    // Calcular descuento
    let discountPercent = 0;
    if (quantity >= 12) {
        discountPercent = 20;
    } else if (quantity >= 5) {
        discountPercent = 10;
    }
    
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const total = subtotal - discountAmount;
    
    // Obtener nombre del tipo de departamento
    const typeNames = {
        'es': {
            'chico': 'Departamento Chico',
            'mediano': 'Departamento Mediano',
            'grande': 'Departamento Grande'
        },
        'en': {
            'chico': 'Small Apartment',
            'mediano': 'Medium Apartment',
            'grande': 'Large Apartment'
        }
    };
    
    const itemName = typeNames[currentLang][apartmentType];
    const description = currentLang === 'es' 
        ? `${quantity} limpieza(s) - ${itemName}`
        : `${quantity} cleaning(s) - ${itemName}`;
    
    // Crear formulario PayPal
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    form.target = '_blank';
    
    const fields = {
        'cmd': '_xclick',
        'business': 'logan.gollas314@gmail.com',
        'item_name': description,
        'amount': (total / 20).toFixed(2), // Convertir MXN a USD (aprox)
        'currency_code': 'USD',
        'return': window.location.href + '?payment=success',
        'cancel_return': window.location.href + '?payment=cancelled',
        'notify_url': '',
        'no_shipping': '1',
        'no_note': '1',
        'charset': 'utf-8'
    };
    
    for (let [key, value] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    // Mostrar mensaje de confirmación
    const message = currentLang === 'es'
        ? '¡Serás redirigido a PayPal para completar tu pago de forma segura!'
        : 'You will be redirected to PayPal to complete your payment securely!';
    
    alert(message);
}

// Verificar si hay resultado de pago en URL
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
        const message = currentLang === 'es'
            ? '¡Pago exitoso! Nos pondremos en contacto contigo pronto para programar tu servicio.'
            : 'Payment successful! We will contact you soon to schedule your service.';
        alert(message);
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
        const message = currentLang === 'es'
            ? 'Pago cancelado. Si tienes alguna pregunta, contáctanos por WhatsApp.'
            : 'Payment cancelled. If you have any questions, contact us via WhatsApp.';
        alert(message);
        
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// ===================================
// EFECTO NAVBAR AL HACER SCROLL
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 25px rgba(0,0,0,0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    }
});

// ===================================
// FORMULARIO DE CONTACTO
// ===================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = currentLang === 'es'
            ? '¡Gracias por tu mensaje! Te contactaremos pronto.'
            : 'Thank you for your message! We will contact you soon.';
        
        alert(message);
        contactForm.reset();
        
        // Aquí puedes agregar integración con EmailJS o tu backend
    });
}

// ===================================
// ANIMACIÓN AL HACER SCROLL
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .package-card, .stat-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

// ===================================
// CONTADOR ANIMADO
// ===================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Animar contadores cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const h4 = entry.target.querySelector('h4');
            const target = parseInt(h4.textContent);
            animateCounter(h4, target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// SMOOTH SCROLL MEJORADO
// ===================================
document.querySelectorAll('.btn-service').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const calculatorSection = document.getElementById('calculadora');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight la calculadora brevemente
            calculatorSection.style.animation = 'highlight 2s';
            setTimeout(() => {
                calculatorSection.style.animation = '';
            }, 2000);
        }
    });
});

// ===================================
// PROTECCIÓN DE PRECIOS
// ===================================
// Evitar que se cambien los precios desde la consola
Object.freeze(prices);

// ===================================
// LOG DE BIENVENIDA
// ===================================
console.log('%c✨ Limpieza Hilaria', 'color: #2c5f2d; font-size: 30px; font-weight: bold;');
console.log('%cServicio profesional de limpieza en Nuevo Nayarit', 'color: #666; font-size: 14px;');
console.log('%c💎 Web diseñada por TheWuero Web Design', 'color: #f8b739; font-size: 12px;');

// ===================================
// DETECCIÓN DE IDIOMA DEL NAVEGADOR
// ===================================
window.addEventListener('load', function() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    // Si el navegador está en inglés, cambiar automáticamente
    if (browserLang.startsWith('en') && currentLang === 'es') {
        document.querySelector('.lang-btn[data-lang="en"]').click();
    }
});
