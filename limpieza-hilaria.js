// ===================================
// LIMPIEZA HILARIA - JAVASCRIPT
// ===================================

// VARIABLES GLOBALES
let currentLang = 'es';
let currentStep = 1;
let bookingData = {};

const prices = {
    chico: 500,
    mediano: 700,
    grande: 1000
};

// ===================================
// NAVEGACIÓN ENTRE PASOS
// ===================================
function goToStep1() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    currentStep = 1;
    window.scrollTo({ top: document.getElementById('calculadora').offsetTop - 100, behavior: 'smooth' });
}

function goToStep2() {
    // Guardar datos del paso 1
    bookingData.apartmentType = document.getElementById('apartmentType').value;
    bookingData.quantity = parseInt(document.getElementById('quantity').value);
    bookingData.basePrice = prices[bookingData.apartmentType];
    bookingData.total = calculateTotal();
    
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    document.getElementById('step3').style.display = 'none';
    currentStep = 2;
    window.scrollTo({ top: document.getElementById('calculadora').offsetTop - 100, behavior: 'smooth' });
}

function goToStep3() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    currentStep = 3;
    
    // Actualizar resumen
    updateBookingSummary();
    window.scrollTo({ top: document.getElementById('calculadora').offsetTop - 100, behavior: 'smooth' });
}

// ===================================
// FORMULARIO DE INFORMACIÓN
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const clientForm = document.getElementById('clientInfoForm');
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Guardar datos del cliente
            bookingData.clientName = document.getElementById('clientName').value;
            bookingData.clientEmail = document.getElementById('clientEmail').value;
            bookingData.clientPhone = document.getElementById('clientPhone').value;
            bookingData.clientAddress = document.getElementById('clientAddress').value;
            bookingData.preferredDate = document.getElementById('preferredDate').value;
            bookingData.specialInstructions = document.getElementById('specialInstructions').value;
            
            // Ir al paso 3
            goToStep3();
        });
    }
});

// ===================================
// ACTUALIZAR RESUMEN DE RESERVA
// ===================================
function updateBookingSummary() {
    const serviceNames = {
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
    
    document.getElementById('summaryService').textContent = serviceNames[currentLang][bookingData.apartmentType];
    document.getElementById('summaryQuantity').textContent = bookingData.quantity + (currentLang === 'es' ? ' limpieza(s)' : ' cleaning(s)');
    document.getElementById('summaryName').textContent = bookingData.clientName;
    document.getElementById('summaryAddress').textContent = bookingData.clientAddress;
    document.getElementById('summaryDate').textContent = formatDate(bookingData.preferredDate);
    document.getElementById('summaryTotal').textContent = '$' + bookingData.total.toLocaleString() + ' MXN';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'es' ? 'es-MX' : 'en-US', options);
}

// ===================================
// SELECCIÓN DE MÉTODO DE PAGO
// ===================================
function selectPaymentMethod(method) {
    // Remover selección anterior
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo
    document.querySelector(`#${method}Radio`).checked = true;
    document.querySelector(`#${method}Radio`).closest('.payment-card').classList.add('selected');
    
    // Habilitar botón de confirmar
    document.getElementById('confirmBookingBtn').disabled = false;
    
    // Mostrar instrucciones según método
    showPaymentInstructions(method);
}

function showPaymentInstructions(method) {
    const instructionsDiv = document.getElementById('paymentInstructions');
    instructionsDiv.style.display = 'block';
    
    const instructions = {
        'paypal': {
            'es': `
                <h5><i class="fab fa-paypal"></i> PayPal</h5>
                <p>Al confirmar tu reserva serás redirigido a PayPal para completar el pago de forma segura con tarjeta de crédito o débito.</p>
                <p><strong>Email de PayPal:</strong> logan.gollas314@gmail.com</p>
            `,
            'en': `
                <h5><i class="fab fa-paypal"></i> PayPal</h5>
                <p>When confirming your booking, you will be redirected to PayPal to complete the payment securely with credit or debit card.</p>
                <p><strong>PayPal Email:</strong> logan.gollas314@gmail.com</p>
            `
        },
        'transfer': {
            'es': `
                <h5><i class="fas fa-university"></i> Transferencia Bancaria</h5>
                <p>Al confirmar tu reserva, recibirás los datos bancarios por WhatsApp para realizar tu transferencia.</p>
                <p><strong>Te enviaremos:</strong></p>
                <ul>
                    <li>Banco y número de cuenta</li>
                    <li>CLABE interbancaria</li>
                    <li>Nombre del titular</li>
                </ul>
                <p>Una vez realizada la transferencia, envíanos tu comprobante por WhatsApp.</p>
            `,
            'en': `
                <h5><i class="fas fa-university"></i> Bank Transfer</h5>
                <p>When confirming your booking, you will receive the bank details via WhatsApp to make your transfer.</p>
                <p><strong>We will send you:</strong></p>
                <ul>
                    <li>Bank and account number</li>
                    <li>Interbank CLABE</li>
                    <li>Account holder name</li>
                </ul>
                <p>Once the transfer is made, send us your receipt via WhatsApp.</p>
            `
        },
        'mercadopago': {
            'es': `
                <h5><i class="fas fa-credit-card"></i> Mercado Pago</h5>
                <p>Al confirmar tu reserva, recibirás un enlace de pago de Mercado Pago por WhatsApp.</p>
                <p><strong>Puedes pagar con:</strong></p>
                <ul>
                    <li>Tarjeta de crédito o débito</li>
                    <li>Transferencia bancaria</li>
                    <li>Efectivo en tiendas de conveniencia</li>
                </ul>
            `,
            'en': `
                <h5><i class="fas fa-credit-card"></i> Mercado Pago</h5>
                <p>When confirming your booking, you will receive a Mercado Pago payment link via WhatsApp.</p>
                <p><strong>You can pay with:</strong></p>
                <ul>
                    <li>Credit or debit card</li>
                    <li>Bank transfer</li>
                    <li>Cash at convenience stores</li>
                </ul>
            `
        },
        'cash': {
            'es': `
                <h5><i class="fas fa-money-bill-wave"></i> Efectivo</h5>
                <p>No necesitas pagar ahora. El pago se realizará en efectivo al momento de recibir el servicio.</p>
                <p><strong>Importante:</strong></p>
                <ul>
                    <li>Ten el monto exacto listo</li>
                    <li>Recibirás un recibo por tu pago</li>
                    <li>La reserva queda confirmada al agendar</li>
                </ul>
            `,
            'en': `
                <h5><i class="fas fa-money-bill-wave"></i> Cash</h5>
                <p>No need to pay now. Payment will be made in cash when receiving the service.</p>
                <p><strong>Important:</strong></p>
                <ul>
                    <li>Have the exact amount ready</li>
                    <li>You will receive a receipt for your payment</li>
                    <li>Booking is confirmed upon scheduling</li>
                </ul>
            `
        }
    };
    
    instructionsDiv.innerHTML = instructions[method][currentLang];
}

// ===================================
// CONFIRMAR RESERVA
// ===================================
function confirmBooking() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    bookingData.paymentMethod = paymentMethod;
    
    // Enviar información por WhatsApp
    sendBookingToWhatsApp();
    
    // Procesar según método de pago
    if (paymentMethod === 'paypal') {
        processPayPalPayment();
    } else {
        showConfirmationMessage();
    }
}

function sendBookingToWhatsApp() {
    const message = `
🌟 NUEVA RESERVA - LIMPIEZA HILARIA

📋 INFORMACIÓN DEL SERVICIO:
• Tipo: ${bookingData.apartmentType.toUpperCase()}
• Cantidad de limpiezas: ${bookingData.quantity}
• Precio por limpieza: $${bookingData.basePrice}
• Total: $${bookingData.total} MXN

👤 DATOS DEL CLIENTE:
• Nombre: ${bookingData.clientName}
• Email: ${bookingData.clientEmail}
• Teléfono: ${bookingData.clientPhone}
• Dirección: ${bookingData.clientAddress}

📅 FECHA PREFERIDA: ${bookingData.preferredDate}

💳 MÉTODO DE PAGO: ${bookingData.paymentMethod.toUpperCase()}

📝 INSTRUCCIONES ESPECIALES:
${bookingData.specialInstructions || 'Ninguna'}

---
Reserva realizada desde: ${window.location.href}
    `.trim();
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/523221086599?text=${encodedMessage}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappURL, '_blank');
}

function processPayPalPayment() {
    const total = bookingData.total;
    const description = `${bookingData.quantity} limpieza(s) - ${bookingData.apartmentType}`;
    
    // Crear formulario PayPal
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    form.target = '_blank';
    
    const fields = {
        'cmd': '_xclick',
        'business': 'logan.gollas314@gmail.com',
        'item_name': `Limpieza Hilaria - ${description}`,
        'amount': (total / 20).toFixed(2), // Convertir MXN a USD
        'currency_code': 'USD',
        'return': window.location.href + '?payment=success',
        'cancel_return': window.location.href + '?payment=cancelled',
        'custom': JSON.stringify({
            name: bookingData.clientName,
            email: bookingData.clientEmail,
            phone: bookingData.clientPhone
        })
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
    
    showConfirmationMessage();
}

function showConfirmationMessage() {
    const messages = {
        'es': '¡Reserva confirmada! Hemos enviado los detalles por WhatsApp. Te contactaremos pronto para confirmar tu fecha.',
        'en': 'Booking confirmed! We have sent the details via WhatsApp. We will contact you soon to confirm your date.'
    };
    
    alert(messages[currentLang]);
    
    // Reiniciar formulario
    setTimeout(() => {
        location.reload();
    }, 2000);
}

// ===================================
// SISTEMA BILINGÜE
// ===================================
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        switchLanguage(lang);
        
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

function switchLanguage(lang) {
    currentLang = lang;
    
    document.querySelectorAll('[data-es]').forEach(element => {
        if (lang === 'es') {
            element.textContent = element.getAttribute('data-es');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    document.querySelectorAll('[data-placeholder-es]').forEach(element => {
        if (lang === 'es') {
            element.placeholder = element.getAttribute('data-placeholder-es');
        } else {
            element.placeholder = element.getAttribute('data-placeholder-en');
        }
    });
    
    document.querySelectorAll('option[data-es]').forEach(option => {
        if (lang === 'es') {
            option.textContent = option.getAttribute('data-es');
        } else {
            option.textContent = option.getAttribute('data-en');
        }
    });
    
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
    
    const basePrice = prices[apartmentType];
    const subtotal = basePrice * quantity;
    
    let discountPercent = 0;
    if (quantity >= 12) {
        discountPercent = 20;
    } else if (quantity >= 5) {
        discountPercent = 10;
    }
    
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const total = subtotal - discountAmount;
    
    document.getElementById('pricePerCleaning').textContent = `$${basePrice.toLocaleString()}`;
    document.getElementById('quantityDisplay').textContent = quantity;
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `$${total.toLocaleString()} MXN`;
    
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

function calculateTotal() {
    const apartmentType = document.getElementById('apartmentType').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const basePrice = prices[apartmentType];
    const subtotal = basePrice * quantity;
    
    let discountPercent = 0;
    if (quantity >= 12) {
        discountPercent = 20;
    } else if (quantity >= 5) {
        discountPercent = 10;
    }
    
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    return subtotal - discountAmount;
}

calculatePrice();

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

document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .package-card, .stat-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
    observer.observe(el);
});

// ===================================
// LOG DE BIENVENIDA
// ===================================
console.log('%c✨ Limpieza Hilaria', 'color: #2c5f2d; font-size: 30px; font-weight: bold;');
console.log('%cSistema de reservas v2.0 - Multi-pago', 'color: #666; font-size: 14px;');
console.log('%c💎 Web diseñada por TheWuero Web Design', 'color: #f8b739; font-size: 12px;');

// ===================================
// DETECCIÓN DE IDIOMA DEL NAVEGADOR
// ===================================
window.addEventListener('load', function() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    if (browserLang.startsWith('en') && currentLang === 'es') {
        document.querySelector('.lang-btn[data-lang="en"]').click();
    }
    
    // Establecer fecha mínima (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        dateInput.setAttribute('min', minDate);
    }
});
