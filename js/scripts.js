// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Header dinámico: Toggle menu para móvil
    // Menú móvil animado
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('#nav-menu-mobile a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Cerrar menú al hacer click fuera (en el overlay)
body.addEventListener('click', (e) => {
    if (body.classList.contains('menu-open') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

    // Función para agregar/quitar secciones en el header
    function addHeaderSection(name, id) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = name;
        li.appendChild(a);
        navMenu.appendChild(li);
    }

    function removeHeaderSection(name) {
        const items = navMenu.querySelectorAll('li');
        items.forEach(item => {
            if (item.textContent === name) {
                item.remove();
            }
        });
    }

    // Ejemplo: Agregar una sección nueva (puedes llamar estas funciones desde consola o integrar en UI)
    // addHeaderSection('Nueva Sección', 'new-section');

    // Dinámica de videos y playlists
    const videoPlayer = document.getElementById('video-player');
    const playlistSelect = document.getElementById('playlist-select');
    const currentPlaylist = document.getElementById('current-playlist');
    const addPlaylistBtn = document.getElementById('add-playlist');

    // Playlists de ejemplo (puedes cargar desde URL params o storage)
    let playlists = {
        'Reacciones Música': [
            { title: 'Reacción 1', src: 'video1.mp4' },
            { title: 'Reacción 2', src: 'video2.mp4' }
        ],
        'Películas': [
            { title: 'Película 1', src: 'movie1.mp4' }
        ]
    };

    // Cargar playlists en select
    function loadPlaylists() {
        playlistSelect.innerHTML = '<option value="">Selecciona una lista</option>';
        Object.keys(playlists).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            playlistSelect.appendChild(option);
        });
    }

    loadPlaylists();

    // Cambiar playlist
    playlistSelect.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (selected) {
            const list = playlists[selected];
            currentPlaylist.innerHTML = '';
            list.forEach((video, index) => {
                const li = document.createElement('li');
                li.textContent = video.title;
                li.addEventListener('click', () => playVideo(video.src));
                currentPlaylist.appendChild(li);
            });
            // Reproducir el primero por default
            if (list.length > 0) playVideo(list[0].src);
        }
    });

    function playVideo(src) {
        videoPlayer.src = src;
        videoPlayer.play();
    }

    // Agregar nueva playlist
    addPlaylistBtn.addEventListener('click', () => {
        const name = prompt('Nombre de la nueva playlist:');
        if (name) {
            playlists[name] = [];
            loadPlaylists();
            // Aquí podrías agregar lógica para agregar videos via URL o input
        }
    });

    // Dinámica via URL: Ej. ?playlist=Reacciones%20Música
    const urlParams = new URLSearchParams(window.location.search);
    const playlistParam = urlParams.get('playlist');
    if (playlistParam && playlists[playlistParam]) {
        playlistSelect.value = playlistParam;
        playlistSelect.dispatchEvent(new Event('change'));
    }

    // Para horarios: Podrías hacer dinámico similar, pero por ahora estático
});
// Sistema de Tabs
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Quitar active de todos
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

        // Activar el clickeado
        button.classList.add('active');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});
// Cargar videos dinámicamente desde videos.json
async function loadVideos() {
    const grid = document.getElementById('video-grid');
    if (!grid) return; // Si no estamos en la página con videos, salir

    try {
        const response = await fetch('data/videos.json');
        if (!response.ok) throw new Error('No se pudo cargar el archivo');
        
        const videos = await response.json();
        
        grid.innerHTML = ''; // Limpiar mensaje de carga

        if (videos.length === 0) {
            grid.innerHTML = '<p>No hay videos aún. ¡Agrega algunos!</p>';
            return;
        }

        videos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.style.cursor = 'pointer';
            card.onclick = () => {
                window.location.href = `player.html?video=${video.id}`;
            };

            card.innerHTML = `
                <div class="thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    <div class="play-icon">▶</div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <p class="meta">Publicado: ${video.date} • ${video.tags.join(' • ')}</p>
                </div>
            `;

            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error cargando videos:', error);
        grid.innerHTML = `<p style="color: red;">Error al cargar videos: ${error.message}</p>`;
    }
}

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', loadVideos);

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
    // ... tu otro código de tabs, menú, etc.
});