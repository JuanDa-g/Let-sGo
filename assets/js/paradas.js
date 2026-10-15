// Variables globales
let paradasData = {};
let currentParada = '';
let currentImageIndex = 0;
let idServicio = new URLSearchParams(window.location.search).get('id');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarParadas();
    if (idServicio) cargarServicio();
    setupTabListeners();
});

// Cargar datos del servicio para el navbar
function cargarServicio() {
    database.ref('servicios/' + idServicio).once('value')
        .then(snapshot => {
            const servicio = snapshot.val();
            if (servicio) renderNavbar(servicio);
        })
        .catch(error => {
            console.error("Error al cargar servicio:", error);
            renderNavbarDefault();
        });
}

// Cargar paradas desde Firebase con la estructura específica
function cargarParadas() {
    database.ref('publicaciones-destinos').orderByChild('categoria/nombre').equalTo('Paradas').once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (!data) {
                mostrarError("No se encontraron paradas en la base de datos");
                return;
            }

            // Procesar datos de paradas según la estructura específica
            paradasData = {};
            Object.keys(data).forEach(key => {
                const parada = data[key];
                paradasData[key] = {
                    id: parada.id || key,
                    title: parada.titulo || "Parada sin nombre",
                    description: parada.descripcion || "Descripción no disponible",
                    duration: "30 min", 
                    location: "San Andrés", 
                    images: parada.galeria_fotos ? parada.galeria_fotos.map(foto => foto.ruta) : ["../img/placeholder.jpg"],
                    url_maps: parada.url_maps || [],
                    categoria: parada.categoria || { id: 0, nombre: "Parada" },
                    tipo_contenido: parada.tipo_contenido || { descripcion: "foto", icono: "", id: 1 }
                };
            });

            renderSidebarParadas();
            
            // Seleccionar primera parada por defecto
            const primeraParada = Object.keys(paradasData)[0];
            if (primeraParada) {
                selectParada(primeraParada);
            }
        })
        .catch(error => {
            console.error("Error al cargar paradas:", error);
            mostrarError("Error al cargar las paradas. Por favor intente más tarde.");
        });
}

// Renderizar sidebar con paradas
function renderSidebarParadas() {
    const lista = document.querySelector('.paradas-list');
    if (!lista) return;

    lista.innerHTML = '';

    Object.entries(paradasData).forEach(([key, parada]) => {
        const li = document.createElement('li');
        li.setAttribute('data-parada', key);
        
        li.innerHTML = `
            <div class="parada-item">
                <div class="parada-name">${parada.title}</div>
                <div class="parada-time">
                    <i class="fas fa-clock"></i> ${parada.duration}
                </div>
            </div>
        `;
        
        li.addEventListener('click', () => selectParada(key));
        lista.appendChild(li);
    });
}

// Seleccionar parada
function selectParada(paradaKey) {
    // Actualizar sidebar
    document.querySelectorAll('.paradas-list li').forEach(item => {
        item.classList.remove('active');
    });
    const selectedItem = document.querySelector(`[data-parada="${paradaKey}"]`);
    if (selectedItem) selectedItem.classList.add('active');

    // Actualizar contenido
    currentParada = paradaKey;
    currentImageIndex = 0;
    loadParadaContent(paradaKey);
}

// Cargar contenido de la parada
function loadParadaContent(paradaKey) {
    const data = paradasData[paradaKey];
    if (!data) return;

    updateGallery(data);
    updateInfo(data);
    updateMap(data);
}

// Actualizar galería
function updateGallery(data) {
    const mainImage = document.getElementById('mainImage');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    const thumbnails = document.getElementById('thumbnails');

    if (!mainImage || !imageTitle || !imageDescription || !thumbnails) return;

    // Validar que haya imágenes
    const images = data.images && data.images.length > 0 ? 
        data.images.map(img => img.startsWith('http') ? img : `../img/${img}`) : 
        ["../img/placeholder.jpg"];

    // Actualizar imagen principal
    mainImage.src = images[currentImageIndex];
    mainImage.alt = data.title;
    imageTitle.textContent = data.title;
    imageDescription.textContent = data.description;

    // Actualizar miniaturas
    thumbnails.innerHTML = '';
    images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === currentImageIndex ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${data.title} ${index + 1}">`;
        thumbnail.addEventListener('click', () => selectImage(index));
        thumbnails.appendChild(thumbnail);
    });
}

// Actualizar información
function updateInfo(data) {
    const infoTitle = document.getElementById('infoTitle');
    const infoDescription = document.getElementById('infoDescription');
    const infoHighlights = document.getElementById('infoHighlights');

    if (!infoTitle || !infoDescription || !infoHighlights) return;

    infoTitle.textContent = data.title;
    infoDescription.textContent = data.description;

    infoHighlights.innerHTML = `
        <div class="highlight-item">
            <i class="fas fa-clock"></i>
            <h5>Duración</h5>
            <p>${data.duration}</p>
        </div>
        <div class="highlight-item">
            <i class="fas fa-map-marker-alt"></i>
            <h5>Ubicación</h5>
            <p>${data.location}</p>
        </div>
        <div class="highlight-item">
            <i class="fas fa-camera"></i>
            <h5>Fotos</h5>
            <p>${data.images && data.images.length > 0 ? data.images.length + ' disponibles' : 'No disponibles'}</p>
        </div>
        <div class="highlight-item">
            <i class="fas fa-users"></i>
            <h5>Actividad</h5>
            <p>Grupal</p>
        </div>
    `;
}

// Actualizar mapa (puedes implementar Google Maps aquí)
function updateMap(data) {
    const mapPlaceholder = document.querySelector('.map-placeholder p');
    if (mapPlaceholder) {
        mapPlaceholder.textContent = `Ubicación: ${data.location}`;
        
        // Si hay URLs de mapas, podrías usarlas aquí
        if (data.url_maps && data.url_maps.length > 0) {
            const mapUrl = Object.values(data.url_maps[0])[0];
            if (mapUrl) {
                // Aquí podrías integrar Google Maps o mostrar el enlace
            }
        }
    }
}

// Funciones para navegación de imágenes
function selectImage(index) {
    currentImageIndex = index;
    updateGallery(paradasData[currentParada]);
}

function previousImage() {
    const images = paradasData[currentParada].images || [];
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    updateGallery(paradasData[currentParada]);
}

function nextImage() {
    const images = paradasData[currentParada].images || [];
    currentImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    updateGallery(paradasData[currentParada]);
}

// Renderizar navbar
function renderNavbar(servicio) {
    const nav = document.querySelector('nav ul');
    if (!nav) return;

    nav.innerHTML = '';
    
    // Enlaces básicos
    const enlaces = [
        { href: '../index.html', text: 'Inicio' },
        { href: '#', text: servicio.nombre || 'Servicio', class: 'active' }
    ];

    // Añadir enlaces dinámicos
    if (servicio.info_adicional) {
        Object.entries(servicio.info_adicional).forEach(([key, seccion]) => {
            if (seccion.nombre) {
                const href = `info-adicional.html?id=${idServicio}&seccion=${key}`;
                enlaces.push({ href, text: seccion.nombre });
            }
        });
    }

    // Añadir botón de reserva
    enlaces.push({ href: '#booking', text: 'Reservar', class: 'reservar' });

    // Renderizar enlaces
    enlaces.forEach(enlace => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = enlace.href;
        a.textContent = enlace.text;
        if (enlace.class) a.classList.add(enlace.class);
        li.appendChild(a);
        nav.appendChild(li);
    });

    // Configurar menú móvil
    document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
        document.querySelector('nav').classList.add('active');
    });

    document.querySelector('.close-menu')?.addEventListener('click', () => {
        document.querySelector('nav').classList.remove('active');
    });
}

function renderNavbarDefault() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;

    nav.innerHTML = `
        <li><a href="../index.html">Inicio</a></li>
        <li><a href="#" class="active">Paradas</a></li>
        <li><a href="#booking" class="reservar">Reservar</a></li>
    `;
}

function mostrarError(mensaje) {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${mensaje}</p>
                <button onclick="window.location.reload()">Reintentar</button>
            </div>
        `;
    }
}

// Configurar listeners de tabs
function setupTabListeners() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            selectTab(tabId);
        });
    });
}

function selectTab(tabId) {
    // Actualizar tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

    // Actualizar contenido
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId)?.classList.add('active');
}