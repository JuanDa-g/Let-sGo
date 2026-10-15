const params = new URLSearchParams(window.location.search);
const idServicio = parseInt(params.get('id'));
const seccionActual = params.get('seccion');

// Cargar datos desde el JSON
fetch('../datos.json')
    .then(response => response.json())
    .then(data => {
        const servicio = data.servicios.find(s => s.id_servicio === idServicio);
        if (servicio) {
            renderInfoAdicional(servicio, seccionActual);
            renderNavbar(servicio);
        } else {
            console.error('Servicio no encontrado');
        }
    })
    .catch(error => console.error('Error cargando los datos:', error));

// Renderizar la información adicional específica de la sección
function renderInfoAdicional(servicio, seccionActual) {
    // Actualizar enlaces de navegación
    document.getElementById('servicio-link').textContent = servicio.nombre_servicio;
    document.getElementById('servicio-link').href = `servicios.html?id=${idServicio}`;
    
    const seccion = servicio.info_adicional[seccionActual];
    if (seccion) {
        // Actualizar el título y contenido de la sección
        document.getElementById('titulo-seccion').textContent = seccion.nombre;
        document.getElementById('seccion-actual').textContent = seccion.nombre;
        document.getElementById('contenido-seccion-texto').textContent = seccion.contenido;
        
        // Renderizar pestañas de navegación entre secciones
        renderTabsSecciones(servicio.info_adicional, seccionActual);
    } else {
        console.error('Sección no encontrada');
    }
}

// Renderizar las pestañas de navegación entre secciones
function renderTabsSecciones(infoAdicional, seccionActual) {
    const seccionesContainer = document.querySelector('.secciones-tabs');
    seccionesContainer.innerHTML = '';
    
    Object.entries(infoAdicional).forEach(([key, seccion]) => {
        if (seccion.nombre) { // Solo mostrar secciones con nombre
            const tab = document.createElement('a');
            tab.href = `info-adicional.html?id=${idServicio}&seccion=${key}`;
            tab.textContent = seccion.nombre;
            tab.classList.add('seccion-tab');
            
            if (key === seccionActual) {
                tab.classList.add('active');
            }
            
            seccionesContainer.appendChild(tab);
        }
    });
}

// Renderizar el navbar dinámico
function renderNavbar(servicio) {
    const nav = document.querySelector('nav ul');
    nav.innerHTML = ''; 
    
    const enlaces = [
        { href: '../index.html', text: 'Inicio' },
        { href: '#', text: servicio.nombre_servicio, class: 'active' }
    ];
    
    Object.entries(servicio.info_adicional).forEach(([key, seccion]) => {
        if (seccion.nombre) {
            // Cambiamos el href para la sección 5 (paradas)
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
    
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('nav').classList.add('active');
    });
    
    document.querySelector('.close-menu').addEventListener('click', function() {
        document.querySelector('nav').classList.remove('active');
    });
}

// Configurar botón de reserva
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el botón de reserva
    const btnReservar = document.querySelector('.btn-reservar');
    if (btnReservar) {
        btnReservar.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirigir al sistema de reservas externo
            window.location.href = 'sistema-reservas.html';
        });
    }
    
    // Configurar el enlace del navbar para reservar
    const reservarLink = document.querySelector('a[href="#booking"]');
    if (reservarLink) {
        reservarLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sistema-reservas.html';
        });
    }
});