const params = new URLSearchParams(window.location.search);
const idServicio = parseInt(params.get('id'));

fetch('../datos.json')
    .then(response => response.json())
    .then(data => {
        const servicio = data.servicios.find(s => s.id_servicio === idServicio);
        if (servicio) {
            renderServicio(servicio);
            renderNavbar(servicio);
        } else {
            console.error('Servicio no encontrado');
        }
    })
    .catch(error => console.error('Error cargando los datos:', error));

function renderServicio(servicio) {
    document.querySelector('.titulo-servicio').textContent = servicio.nombre_servicio;
    
    // Ya no renderizamos la galería aquí, solo la descripción
    const descripcion = servicio.info_adicional.seccion_1.contenido;
    document.querySelector('.descripcion-servicio').textContent = descripcion;
}

function renderNavbar(servicio) {
    const nav = document.querySelector('nav ul');
    nav.innerHTML = ''; 
    
    const enlaces = [
        { href: '../index.html', text: 'Inicio' },
        { href: '#', text: servicio.nombre_servicio, class: 'active' }
    ];
    
    // Agregar enlaces dinámicos basados en info_adicional
    Object.entries(servicio.info_adicional).forEach(([key, seccion]) => {
        if (seccion.nombre) {
            const href = key === 'seccion_5' 
                ? `paradas.html?id=${idServicio}` 
                : `info-adicional.html?id=${idServicio}&seccion=${key}`;
            
            enlaces.push({
                href: href,
                text: seccion.nombre
            });
        }
    });
    
    enlaces.push({ href: '#booking', text: 'Reservar', class: 'reservar' });
    
    enlaces.forEach(enlace => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = enlace.href;
        a.textContent = enlace.text;
        if (enlace.class) {
            a.classList.add(enlace.class);
        }
        li.appendChild(a);
        nav.appendChild(li);
    });
}

// Función para la navegación superior de servicios
function renderNavegacionServicio(servicio) {
    const navegacionContainer = document.querySelector('.navegacion-servicio');
    navegacionContainer.innerHTML = '';
    
    const botones = [
        { 
            href: `paaradas.html?id=${idServicio}`, 
            text: 'Galería', 
            icon: 'fas fa-images' 
        },
        { 
            href: '#', 
            text: 'Descripción', 
            icon: 'fas fa-info-circle',
            class: 'active'
        },
        { 
            href: '#bonos', 
            text: 'Bonos', 
            icon: 'fas fa-dollar-sign' 
        },
        { 
            href: 'sistema-reservas.html', 
            text: 'Reservar', 
            icon: 'fas fa-calendar-alt' 
        }
    ];
    
    botones.forEach(boton => {
        const a = document.createElement('a');
        a.href = boton.href;
        a.className = `nav-btn ${boton.class || ''}`;
        a.innerHTML = `<i class="${boton.icon}"></i> ${boton.text}`;
        navegacionContainer.appendChild(a);
    });
}

function aplicarBono() {
    
    const numeroWhatsapp = "573207416806"; 
    const mensaje = "Quiero aplicar al bono";
    const url = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para menú móvil
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenu = document.querySelector('.close-menu');
    const nav = document.querySelector('nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    }

    // Event listener para botón de reservar
    const reservarLink = document.querySelector('a[href="#booking"]');
    if (reservarLink) {
        reservarLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sistema-reservas.html';
        });
    }

    // Event listeners para navegación de servicios
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-btn') || e.target.closest('.nav-btn')) {
            const btn = e.target.matches('.nav-btn') ? e.target : e.target.closest('.nav-btn');
            
            // Si es un enlace interno (no lleva a otra página)
            if (btn.getAttribute('href') === '#bonos') {
                e.preventDefault();
                
                // Cambiar botón activo
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Scroll hacia la sección de bonos
                document.getElementById('bonos').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            } else if (btn.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Cambiar botón activo para descripción
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Scroll hacia descripción
                document.querySelector('.descripcion').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        }
    });

    // Event listener para botón de bonos
    const botonBonos = document.querySelector('.boton-bonos');
    if (botonBonos) {
        botonBonos.addEventListener('click', aplicarBono);
    }
});