// ====================================================================
// A. VARIABLES GLOBALES (Configuración, Temas, Contexto)
// ====================================================================

const mainColorProperty = '--main-color';

// Estructura de tema optimizada (Colores Sólidos/Mate)
// ... (Toda la variable 'themes' se mantiene igual que antes) ...
const themes = {
    // --- TEMAS OSCUROS ---
    'theme-blue': { 
        '--main-color': '#3e9dff', 
        'body-background': '#0c1a30', // Fondo sólido
        '--card-bg-color': '#1a2940', // Color de tarjeta sólido
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0b0c0',
        '--border-color': '#3e9dff' // Borde usa color principal
    },
    'theme-red': { 
        '--main-color': '#ff3e3e', 
        'body-background': '#300c0c',
        '--card-bg-color': '#401a1a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0a0a0',
        '--border-color': '#ff3e3e'
    },
    'theme-purple': { 
        '--main-color': '#ff3ef2', 
        'body-background': '#300c2e',
        '--card-bg-color': '#401a3e',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0a0be',
        '--border-color': '#ff3ef2'
    },
    'theme-green': { 
        '--main-color': '#3eff75', 
        'body-background': '#0c3015',
        '--card-bg-color': '#1a4023',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0c0a8',
        '--border-color': '#3eff75'
    },
    'theme-orange': { 
        '--main-color': '#ff8c3e', 
        'body-background': '#301a0c',
        '--card-bg-color': '#40291a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0b1a0',
        '--border-color': '#ff8c3e'
    },
    'theme-cyan': { 
        '--main-color': '#3efff2', 
        'body-background': '#0c302e',
        '--card-bg-color': '#1a403e',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#a0c0be',
        '--border-color': '#3efff2'
    },
    'theme-gold': { 
        '--main-color': '#ffd700', 
        'body-background': '#30280c',
        '--card-bg-color': '#403a1a',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#c0bda0',
        '--border-color': '#ffd700'
    },
    'theme-magenta': { 
        '--main-color': '#c03eff', 
        'body-background': '#260c30',
        '--card-bg-color': '#351a40',
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#b4a0c0',
        '--border-color': '#c03eff'
    },

    // --- TEMAS MINIMALISTAS (Claro y Oscuro) ---
    'theme-light': { 
        '--main-color': '#ff6f61', 
        'body-background': '#DEE4E7', // Fondo claro
        '--card-bg-color': '#FFFFFF', // Tarjeta blanca
        '--card-text-color': '#121212', // Texto oscuro
        '--card-text-secondary-color': '#505050',
        '--border-color': '#D0D0D0' // Borde gris claro
    },
    'theme-dark': { 
        '--main-color': '#00aaff', 
        'body-background': '#121212', // Fondo negro
        '--card-bg-color': '#1e1e1e', // Tarjeta gris oscuro
        '--card-text-color': '#ffffff',
        '--card-text-secondary-color': '#aaaaaa',
        '--border-color': '#333333'
    }
};

let playlist = [];
let currentTrackIndex = -1;
let audioContext;
let analyser;
let audioSource; 

// Variables del DOM
let audioPlayer, fileInput, playPauseBtn, playIcon, prevBtn, nextBtn, progressLine, progressBarContainer, 
    currentTimeDisplay, totalTimeDisplay, songTitle, artistName, albumArtContainer, albumIcon, 
    playlistList, playerCard, root, themeOptionsContainer, sensitivitySlider, sensitivityMultiplier;

let skipBackBtn, skipForwardBtn; 
let repeatBtn, repeatIcon;
let repeatMode = 'none';

let progressStylePanel, progressStyleOptions; 
let progressStyle; 

const NUM_BARS = 64;
let dynamicBars = [];
let visualizerBarContainer;

let headerTime, headerBattery, batteryLevelSpan, batteryIconSpan, headerSongTitle;

let foldersPanel, foldersList;
let folderPlaylist = []; 

// VARS PARA LETRAS
let lyricsPanel, lyricsList, lyricsPanelHeader; // <- lyricsPanelHeader AÑADIDO
let lrcMap = new Map(); // Mapa para almacenar archivos .lrc por nombre base
let currentLyrics = []; // Array de {time, text} de la canción actual
let currentLyricIndex = -1;
let lrcBadgeElement; // <- AÑADIDO: Referencia al badge "LRC"
let retryLyricsBtn; // <-- AÑADIDO: Botón reintentar letra

// VARS PARA NUEVAS OPCIONES (AÑADIDO)
let lyricsAlignOptions, lyricsFontSelect, lyricsEffectSelect;

// ===== INICIO VARS BARRA LATERAL (AÑADIDO) =====
let sidebar, sidebarOpenBtn, sidebarCloseBtn, sidebarOverlay, panelToggleList;
// ===== FIN VARS BARRA LATERAL (AÑADIDO) =====

// ===== INICIO VARS BOTÓN MÓVIL (AÑADIDO) =====
let mobileFolderBtn, folderInput;
// ===== FIN VARS BOTÓN MÓVIL =====

// ===== INICIO VARS TEMA DINÁMICO (AÑADIDO) =====
let dynamicThemeToggle;
let isDynamicThemeActive = true;
// ===== FIN VARS TEMA DINÁMICO (AÑADIDO) =====

// ===== INICIO VARS ECUALIZADOR (AÑADIDO) =====
let eqModal, eqOverlay, eqCloseBtn, eqOpenBtn, eqPresetsSelect, eqBandsContainer;
let eqBands = []; // Array para los nodos BiquadFilter
const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
// ===== FIN VARS ECUALIZADOR (AÑADIDO) =====

// ===== INICIO VARS FOOTER (AÑADIDO) =====
let footerSongTitle, footerLyricPhrase, footerSessionTime, footerMostPlayed;
let sessionStartTime;
let sessionPlayCount = {};
// ===== FIN VARS FOOTER (AÑADIDO) =====

// ===== INICIO DE CÓDIGO AÑADIDO/MODIFICADO (ONLINE SYNC) =====

// --- VARS BÚSQUEDA ONLINE ---
let searchInput, searchBtn, searchResultsList, searchStatus;
// ===== INICIO DE MODIFICACIÓN (Arreglo de URL y Playlists) =====
const GITHUB_REPO_URL = 'https://raw.githubusercontent.com/loredojuanlz/canciones-rave/main/'; // <<-- CORREGIDO
const ONLINE_SONG_LIST_PATH = 'playlists.json'; // <<-- CAMBIADO
let allOnlinePlaylists = []; // <<-- CAMBIADO (antes allOnlineSongs)
// ===== FIN DE MODIFICACIÓN (Arreglo de URL y Playlists) =====
let currentPlaylistSource = 'local'; // 'local', 'folder', o 'online'

// --- VARS RAVE SYNC ---
const SYNC_SERVER_URL = 'wss://rave-sync-backend.onrender.com';
let ws;
let currentRoomId = null;
let isHost = false;
let syncInterval = null;

let createRoomBtn, joinRoomBtn, joinRoomInput, roomCodeDisplay, syncStatusElement; // 'syncStatus' renombrado a 'syncStatusElement' para evitar conflicto
// ===== FIN DE CÓDIGO AÑADIDO/MODIFICADO (ONLINE SYNC) =====


// ====================================================================
// B. FUNCIONES DE UI Y TEMAS
// ====================================================================

// ===== INICIO FUNCIONES BARRA LATERAL (AÑADIDO) =====

/**
 * Abre la barra lateral.
 */
function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
}

/**
 * Cierra la barra lateral.
 */
function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
}

/**
 * Aplica el estado de visibilidad a un panel.
 * @param {string} panelSelector - El selector CSS del panel.
 * @param {boolean} isVisible - True si debe ser visible, false si debe ocultarse.
 */
function setPanelVisibility(panelSelector, isVisible) {
    // ===== INICIO DE CÓDIGO MODIFICADO (Selector de Playlist) =====
    // Caso especial para la lista de reproducción, para no seleccionar el panel de carpetas o búsqueda
    let panel;
    if (panelSelector === ".playlist-panel:not(.folders-panel):not(.search-panel)") {
         panel = document.querySelector(".playlist-panel:not(.folders-panel):not(.search-panel)");
    // ===== FIN DE CÓDIGO MODIFICADO =====
    } else {
         panel = document.querySelector(panelSelector);
    }
    
    if (panel) {
        if (isVisible) {
            panel.classList.remove('panel-hidden');
        } else {
            panel.classList.add('panel-hidden');
        }
    }
}

/**
 * Guarda el estado de visibilidad de los paneles en localStorage.
 */
function savePanelVisibility() {
    if (!panelToggleList) return;
    const visibilityState = {};
    panelToggleList.querySelectorAll('.panel-toggle').forEach(checkbox => {
        visibilityState[checkbox.id] = checkbox.checked;
    });
    localStorage.setItem('panelVisibility', JSON.stringify(visibilityState));
}

/**
 * Carga y aplica el estado de visibilidad de los paneles desde localStorage.
 */
function loadPanelVisibility() {
    if (!panelToggleList) return;
    const savedState = JSON.parse(localStorage.getItem('panelVisibility'));
    
    panelToggleList.querySelectorAll('.panel-toggle').forEach(checkbox => {
        let isChecked = true; // Default to visible
        if (savedState && savedState[checkbox.id] !== undefined) {
            isChecked = savedState[checkbox.id];
        }
        checkbox.checked = isChecked;
        const targetSelector = checkbox.dataset.target;
        setPanelVisibility(targetSelector, isChecked);
    });
}

// ===== FIN FUNCIONES BARRA LATERAL (AÑADIDO) =====

function updatePlaylistUI() {
    if (!playlistList) return; 
    
    playlistList.innerHTML = '';
    
    // ===== INICIO DE CÓDIGO MODIFICADO (Mensaje de Playlist) =====
    if (currentPlaylistSource === 'online') {
        playlistList.innerHTML = '<li class="empty-message">Reproduciendo desde GitHub.</li>';
        return;
    }
    // ===== FIN DE CÓDIGO MODIFICADO =====

    if (playlist.length === 0) {
        playlistList.innerHTML = '<li class="empty-message">Carga archivos para ver la lista.</li>';
        return;
    }

    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.name}`;
        li.dataset.index = index; 

        if (index === currentTrackIndex) {
            li.classList.add('current-track');
            setTimeout(() => li.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        }

        playlistList.appendChild(li);
    });
}

/**
 * MODIFICADO: El parámetro 'themeName' ahora puede ser null.
 * Si themeName es null, no guarda en localStorage (usado por tema dinámico).
 */
function applyThemeVariables(theme, themeName) {
    if (!root) return; 
    
    root.style.setProperty('--main-color', theme['--main-color']);
    root.style.setProperty('--body-bg', theme['body-background']);
    root.style.setProperty('--card-bg-color', theme['--card-bg-color']);
    root.style.setProperty('--card-text-color', theme['--card-text-color']);
    root.style.setProperty('--card-text-secondary-color', theme['--card-text-secondary-color']);
    root.style.setProperty('--border-color', theme['--border-color']);

    if (themeName) {
        localStorage.setItem('userTheme', themeName);
    }
    
    updatePlaylistUI(); 
}

function applyProgressStyle(styleName, save = true) {
    if (!progressLine || !visualizerBarContainer) return;

    progressStyle = styleName;
    
    progressLine.setAttribute('data-style', styleName); 
    
    if (styleName === 'bars') {
        visualizerBarContainer.style.opacity = '1';
        visualizerBarContainer.style.visibility = 'visible';
        progressLine.style.opacity = '0'; 
    } else {
        visualizerBarContainer.style.opacity = '0';
        visualizerBarContainer.style.visibility = 'hidden';
        progressLine.style.opacity = '1'; 
        progressLine.style.height = '100%'; 
        
        if (progressLine.style.transform === 'none') {
            progressLine.style.transform = `scaleY(1)`; 
        }
    }
    
    document.querySelectorAll('#progress-style-options .style-swatch').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === styleName) {
            btn.classList.add('active');
        }
    });

    if (save) {
        localStorage.setItem('userProgressStyle', styleName);
    }
}

/**
 * Aplica la alineación de texto al panel de letras.
 */
function applyLyricAlignment(alignName, save = true) {
    if (!lyricsList) return;

    // Quitar clases anteriores
    lyricsList.classList.remove('align-left', 'align-center', 'align-right');
    
    // Añadir clase nueva
    if (alignName === 'left') {
        lyricsList.classList.add('align-left');
    } else if (alignName === 'right') {
        lyricsList.classList.add('align-right');
    } else {
        lyricsList.classList.add('align-center'); // Default
    }

    // Actualizar botones
    if (lyricsAlignOptions) {
        lyricsAlignOptions.querySelectorAll('.style-swatch').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === alignName) {
                btn.classList.add('active');
            }
        });
    }

    // Guardar en localStorage
    if (save) {
        localStorage.setItem('userLyricAlign', alignName);
    }
}

// ===== INICIO DE FUNCIONES AÑADIDAS =====

/**
 * Aplica la fuente de texto al panel de letras.
 */
function applyLyricFont(fontFamily, save = true) {
    if (!root) return; // Usamos root (html) para setear la variable CSS
    
    // Setea la variable CSS que .lyrics-list li usa
    root.style.setProperty('--lyrics-font-family', fontFamily);

    if (save) {
        localStorage.setItem('userLyricFont', fontFamily);
    }
}

/**
 * Aplica el efecto de transición al panel de letras.
 */
function applyLyricEffect(effectName, save = true) {
    if (!lyricsList) return;
    
    // Setea el data-attribute en la lista
    lyricsList.dataset.effect = effectName;

    if (save) {
        localStorage.setItem('userLyricEffect', effectName);
    }
}
// ===== FIN DE FUNCIONES AÑADIDAS =====


// ===================================
// FUNCIONES PARA LA BARRA DE ESTADO (HEADER)
// ===================================

function updateTime() {
    if (!headerTime) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    headerTime.textContent = `${hours}:${minutes} ${ampm}`;
}

function getBatteryStatus() {
    if (!batteryLevelSpan || !batteryIconSpan) return;
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBatteryInfo() {
                const level = Math.round(battery.level * 100);
                batteryLevelSpan.textContent = `${level}%`;
                let iconName;
                if (battery.charging) {
                    if (level > 90) iconName = 'battery_charging_full';
                    else if (level > 50) iconName = 'battery_charging_80';
                    else if (level > 20) iconName = 'battery_charging_30';
                    else iconName = 'battery_charging_20';
                } else {
                    if (level === 100) iconName = 'battery_full';
                    else if (level > 90) iconName = 'battery_6_bar';
                    else if (level > 80) iconName = 'battery_5_bar';
                    else if (level > 60) iconName = 'battery_4_bar';
                    else if (level > 40) iconName = 'battery_3_bar';
                    else if (level > 20) iconName = 'battery_2_bar';
                    else if (level > 5) iconName = 'battery_1_bar';
                    else iconName = 'battery_0_bar';
                }
                batteryIconSpan.textContent = iconName;
                if (headerBattery) {
                    if (level < 20 && !battery.charging) {
                        headerBattery.style.color = '#ff6f61';
                    } else {
                        headerBattery.style.color = '';
                    }
                }
            }
            updateBatteryInfo();
            battery.addEventListener('levelchange', updateBatteryInfo);
            battery.addEventListener('chargingchange', updateBatteryInfo);
        });
    } else {
        batteryLevelSpan.textContent = 'N/A';
        batteryIconSpan.textContent = 'power_off';
    }
}


// ===================================
// C. FUNCIONES DE LETRAS (ACTUALIZADO)
// ===================================

// ===== INICIO: NUEVAS VARIABLES Y FUNCIONES DE CACHÉ (AÑADIDO) =====
const LYRIC_CACHE_KEY = 'lyricCache';
const CACHE_NOT_FOUND = '__NOT_FOUND__'; // Constante para marcar letras no encontradas

/**
 * Obtiene el objeto de caché de letras desde localStorage.
 * @returns {object} El objeto de caché parseado.
 */
function getLyricCache() {
    try {
        const cache = localStorage.getItem(LYRIC_CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    } catch (error) {
        console.error("Error al leer la caché de letras:", error);
        return {}; // Resetear caché si está corrupta
    }
}

/**
 * Guarda una letra específica en la caché de localStorage.
 * @param {string} artist - El artista de la canción.
 * @param {string} title - El título de la canción.
 * @param {string} lyrics - El texto de la letra o CACHE_NOT_FOUND.
 */
function setCachedLyric(artist, title, lyrics) {
    const cache = getLyricCache();
    // Usar claves en minúsculas para consistencia
    const key = `${artist.toLowerCase()}|${title.toLowerCase()}`;
    cache[key] = lyrics;
    
    try {
        localStorage.setItem(LYRIC_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        // Error más común: QuotaExceededError (localStorage lleno)
        console.warn("Error al guardar en caché de letras (posiblemente llena):", error);
        // En una implementación más avanzada, aquí se podría limpiar la caché (ej. LRU)
    }
}
// ===== FIN: NUEVAS VARIABLES Y FUNCIONES DE CACHÉ =====


/**
 * (NUEVA FUNCIÓN AÑADIDA)
 * Analiza el contenido de la letra (array o string) y encuentra una frase popular.
 * Prioriza frases entre comillas, luego frases repetidas.
 */
function findPopularPhrase(lyricsContent) {
    let lines = [];

    // 1. Normalizar la entrada a un array de strings
    if (Array.isArray(lyricsContent) && lyricsContent.length > 0 && typeof lyricsContent[0] === 'object') {
        // Es el array de LRC: [{time, text}, ...]
        lines = lyricsContent.map(l => l.text.trim());
    } else if (typeof lyricsContent === 'string') {
        // Es un string de texto plano
        lines = lyricsContent.split('\n').map(l => l.trim());
    } else if (Array.isArray(lyricsContent)) {
        // Ya es un array de strings
        lines = lyricsContent.map(l => l.trim());
    }

    // 2. Filtrar líneas vacías o muy cortas
    const filteredLines = lines.filter(l => l.length > 10); // Ignora líneas muy cortas
    if (filteredLines.length === 0) return null;

    // 3. Intento 1: Buscar líneas entre comillas
    const quotedLines = filteredLines.filter(l => 
        (l.startsWith('"') && l.endsWith('"')) ||
        (l.startsWith('“') && l.endsWith('”')) ||
        (l.startsWith('‘') && l.endsWith('’'))
    );
    
    if (quotedLines.length > 0) {
        return quotedLines[0]; // Devuelve la primera línea entre comillas
    }

    // 4. Intento 2: Buscar la línea más repetida (que no sea un estribillo común)
    const lineFrequency = {};
    let mostFrequentLine = null;
    let maxCount = 1;
    const commonChorusIndicators = ['[chorus]', '[estribillo]'];

    for (const line of filteredLines) {
        // Ignorar indicadores de estribillo
        if (commonChorusIndicators.includes(line.toLowerCase())) continue;
        
        lineFrequency[line] = (lineFrequency[line] || 0) + 1;
        if (lineFrequency[line] > maxCount) {
            maxCount = lineFrequency[line];
            mostFrequentLine = line;
        }
    }

    // Devolver la línea más frecuente solo si se repite al menos 3 veces
    if (maxCount > 2 && mostFrequentLine) {
        return mostFrequentLine;
    }

    // 5. Fallback: Devolver la primera línea "larga"
    return filteredLines[0] || null;
}


/**
 * Analiza el contenido de un archivo .lrc y devuelve un array de objetos de letra.
 */
function parseLRC(lrcContent) {
    const lines = lrcContent.split('\n');
    const lyrics = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = line.match(timeRegex);
        if (match) {
            const min = parseInt(match[1], 10);
            const sec = parseInt(match[2], 10);
            // Asegura que los milisegundos sean 3 dígitos (ej. .50 -> 500ms)
            const ms = parseInt(match[3].padEnd(3, '0'), 10);
            const time = min * 60 + sec + ms / 1000;
            const text = match[4].trim();

            // Solo añade si hay texto (ignora timestamps vacíos)
            if (text) {
                lyrics.push({ time, text });
            }
        }
    });

    // Ordena por tiempo, aunque LRC ya suele estarlo
    return lyrics.sort((a, b) => a.time - b.time);
}

/**
 * Muestra las letras SINCRONIZADAS (de LRC) en el panel.
 */
function displayLyrics(lyrics) {
    if (!lyricsList) return;
    lyricsList.innerHTML = '';
    currentLyricIndex = -1;

    if (!lyrics || lyrics.length === 0) {
        lyricsList.innerHTML = '<li class="empty-message">No hay letra disponible.</li>';
        return;
    }

    lyrics.forEach((line, index) => {
        const li = document.createElement('li');
        li.textContent = line.text;
        li.dataset.index = index;
        lyricsList.appendChild(li);
    });
}

/**
 * Carga un archivo .lrc (File object) y lo procesa.
 * MODIFICADO: Ahora también muestra el badge LRC y actualiza el footer.
 */
function loadLyrics(lrcFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        currentLyrics = parseLRC(content); // Establece las letras sincronizadas
        displayLyrics(currentLyrics);
        if (lrcBadgeElement) lrcBadgeElement.style.display = 'inline'; // <-- MOSTRAR BADGE
        if (retryLyricsBtn) retryLyricsBtn.style.display = 'none'; // <-- OCULTAR BOTÓN REINTENTAR
        
        // ===== FOOTER (AÑADIDO) =====
        const phrase = findPopularPhrase(currentLyrics);
        if (footerLyricPhrase) footerLyricPhrase.textContent = phrase || '...';
        // ===== FIN FOOTER =====
    };
    reader.readAsText(lrcFile);
}

// ===== INICIO: NUEVAS FUNCIONES PARA LETRAS DE INTERNET =====

/**
 * Muestra letras NO SINCRONIZADAS (de internet) en el panel.
 * MODIFICADO: Actualiza el footer.
 */
function displayUnsyncedLyrics(plainText) {
    if (!lyricsList) return;
    lyricsList.innerHTML = '';
    
    // MUY IMPORTANTE: Vaciar currentLyrics desactiva la lógica de sincronización.
    currentLyrics = []; 
    currentLyricIndex = -1;
    // Asegurarse de que el badge LRC está oculto
    if (lrcBadgeElement) lrcBadgeElement.style.display = 'none';

    const lines = plainText.split('\n');
    if (lines.length === 0 || (lines.length === 1 && lines[0] === '')) {
        lyricsList.innerHTML = '<li class="empty-message">No se pudo encontrar la letra.</li>';
        if (retryLyricsBtn) retryLyricsBtn.style.display = 'flex'; // <-- MOSTRAR BOTÓN REINTENTAR
        // ===== FOOTER (AÑADIDO) =====
        if (footerLyricPhrase) footerLyricPhrase.textContent = 'Letra no encontrada.';
        // ===== FIN FOOTER =====
        return;
    }

    // Letra encontrada, ocultar botón
    if (retryLyricsBtn) retryLyricsBtn.style.display = 'none'; // <-- OCULTAR BOTÓN REINTENTAR

    lines.forEach(line => {
        const li = document.createElement('li');
        // Si la línea está vacía, pone un espacio (nbsp) para mantener el flujo visual
        li.textContent = line.trim() === '' ? '\u00A0' : line; 
        // No se añade data-index porque no hay sincronización
        lyricsList.appendChild(li);
    });
    
    // ===== FOOTER (AÑADIDO) =====
    const phrase = findPopularPhrase(plainText);
    if (footerLyricPhrase) footerLyricPhrase.textContent = phrase || '...';
    // ===== FIN FOOTER =====
}

// ===== INICIO: LÓGICA DE BÚSQUEDA SÓLIDA (NUEVO) =====

// Regex para limpieza "Aggresiva" (Quita TODO en paréntesis/corchetes)
const allBracketsRegex = /(\[.*?\])|(\(.*?\))/g;
// Regex para limpieza "Junk" (Quita feat, official, etc.)
const junkRegex = /\s*([\[\(])(feat|ft|with|official|video|lyric|live|remix|audio|explicit|single|edition|version).*?([\]\)])/ig;

/**
 * (NUEVA FUNCIÓN AÑADIDA)
 * Fuerza una nueva búsqueda de letras. Se activa con el botón de reintentar.
 * MODIFICADO: Ahora pasa `bypassCache = true` a `fetchLyrics`.
 */
function retryLyricSearch() {
    if (currentTrackIndex < 0 || !songTitle || !artistName) {
        return;
    }
    
    // Ocultar botón inmediatamente al hacer clic
    if (retryLyricsBtn) retryLyricsBtn.style.display = 'none';

    // Obtener el artista y título ACTUALES
    const artist = artistName.textContent || 'Artista Desconocido';
    const title = songTitle.textContent || 'Título Desconoci';

    // Llamar a fetchLyrics con el trackIndex actual (para el chequeo de race condition)
    // y Bypassing la caché.
    fetchLyrics(artist, title, currentTrackIndex, true); // <-- AÑADIDO 'true'
}


/**
 * (NUEVA LÓGICA SÓLIDA)
 * Intenta buscar la letra de la canción en caché o en una API pública.
 * Prueba múltiples combinaciones de limpieza de texto.
 * MODIFICADO: Implementa la lógica de CACHÉ (Local -> Caché -> Online).
 */
async function fetchLyrics(artist, title, trackIndex, bypassCache = false) { // <-- AÑADIDO 'bypassCache'
    if (!lyricsList) return;
    
    // Ocultar badge LRC y botón de reintentar al iniciar la búsqueda
    if (lrcBadgeElement) lrcBadgeElement.style.display = 'none';
    if (retryLyricsBtn) retryLyricsBtn.style.display = 'none'; // <-- OCULTAR BOTÓN REINTENTAR

    // 1. Mensaje de carga
    lyricsList.innerHTML = '<li class="empty-message">Buscando letra...</li>'; // Mensaje más corto
    if (footerLyricPhrase) footerLyricPhrase.textContent = 'Buscando letra...'; // <-- FOOTER
    currentLyrics = []; // Desactivar sincronización
    currentLyricIndex = -1;
    
    // 2. Definir las permutaciones de búsqueda
    const baseArtist = artist.split(/[;,]/)[0].trim();
    const baseTitle = title.trim();

    // ===== INICIO DE LÓGICA DE PERMUTACIÓN CORREGIDA =====
    
    // Crear el título para la permutación 4 de forma inteligente
    const titleParts = baseTitle.split(' - ');
    let perm4Title = baseTitle; // Por defecto, es el título completo
    
    if (titleParts.length > 1) {
        // Comprobar si la primera parte NO es solo un número (ej. "01", "02")
        if (isNaN(parseInt(titleParts[0], 10))) {
            // Caso: "Song Name - Remix" -> "Song Name"
            perm4Title = titleParts[0].trim();
        } else if (titleParts.length > 1) { // Asegurarse de que hay más partes
            // Caso: "01 - Song Name" -> "Song Name"
            perm4Title = titleParts.slice(1).join(' - ').trim();
        }
    }

    const permutations = [
        // Intento 1: Tal cual (El más probable)
        { artist: baseArtist, title: baseTitle },
        
        // Intento 2: Limpieza "Junk" (Quita feat, official, etc.)
        { artist: baseArtist.replace(junkRegex, '').trim(), title: baseTitle.replace(junkRegex, '').trim() },
        
        // Intento 3: Limpieza "Aggresiva" (Quita TODO en paréntesis/corch.)
        { artist: baseArtist.replace(allBracketsRegex, '').trim(), title: baseTitle.replace(allBracketsRegex, '').trim() },
        
        // Intento 4: (MODIFICADO) Limpieza de "Hyphen" inteligente
        { artist: baseArtist, title: perm4Title }
    ];
    // ===== FIN DE LÓGICA DE PERMUTACIÓN CORREGIDA =====

    // ===== INICIO DE MODIFICACIÓN (Intento 5: "Artist - Title") =====
    if (titleParts.length > 1) {
        const potentialTitle = titleParts.slice(1).join(' - ').trim();
        if (potentialTitle && (titleParts[0].toLowerCase().includes(baseArtist.toLowerCase()) || baseArtist.toLowerCase().includes(titleParts[0].toLowerCase()))) {
             permutations.push({ artist: baseArtist, title: potentialTitle });
        }
    }
    // ===== FIN DE MODIFICACIÓN =====

    // Deduplicar la lista de intentos.
    const uniquePermutations = new Map();
    permutations.forEach(p => {
        const key = `${p.artist}|${p.title}`;
        // Asegurarse de no tener artist/title vacíos y que no esté duplicado
        if (p.artist && p.title && !uniquePermutations.has(key)) { 
            uniquePermutations.set(key, p);
        }
    });

    // 3. Ejecutar la cadena de búsqueda
    
    // ===== INICIO: LÓGICA DE CACHÉ (AÑADIDO) =====
    
    const lyricCache = getLyricCache();
    
    if (bypassCache) {
        console.log("Bypass de caché solicitado por el usuario.");
    } else {
        // 3.1. PRIMERO: Chequear la caché para todas las permutaciones
        for (const [key, perm] of uniquePermutations) {
            // (Race condition check)
            if (trackIndex !== currentTrackIndex) return;

            const cacheKey = `${perm.artist.toLowerCase()}|${perm.title.toLowerCase()}`;
            const cachedLyric = lyricCache[cacheKey];

            if (cachedLyric) {
                // ¡Cache hit!
                if (cachedLyric === CACHE_NOT_FOUND) {
                    // Está en caché como "no encontrado".
                    // No hacemos nada, el bucle sigue a la siguiente permutación.
                    console.log(`Cache hit (NO ENCONTRADO): ${perm.artist} - ${perm.title}`);
                } else {
                    // ¡Encontrada en caché!
                    console.log(`Cache hit (ENCONTRADO): ${perm.artist} - ${perm.title}`);
                    displayUnsyncedLyrics(cachedLyric); // Esto actualiza el footer
                    return; // ¡ÉXITO! Salir de la función fetchLyrics
                }
            }
        }
    }
    // Si salimos de este bucle, significa que NINGUNA permutación
    // tenía una letra válida en la caché.
    // ===== FIN: LÓGICA DE CACHÉ =====


    // 3.2. SEGUNDO: Buscar en la API (si la caché falló)
    if (lyricsList) lyricsList.innerHTML = '<li class="empty-message">Buscando letra en internet...</li>';
    
    for (const [key, perm] of uniquePermutations) {
        // (Race condition check)
        if (trackIndex !== currentTrackIndex) return; 

        // [NUEVO] Si estamos usando la caché (no bypass) Y la clave
        // está cacheada como "no encontrada", saltar esta fetch.
        const cacheKey = `${perm.artist.toLowerCase()}|${perm.title.toLowerCase()}`;
        if (!bypassCache && lyricCache[cacheKey] === CACHE_NOT_FOUND) {
            continue; // No buscar de nuevo algo que sabemos que falló
        }

        // console.log(`Intentando buscar letra (API): ${perm.artist} - ${perm.title}`); // (Debug)

        try {
            const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(perm.artist)}/${encodeURIComponent(perm.title)}`);
            
            // (Race condition check)
            if (trackIndex !== currentTrackIndex) return;

            if (response.ok) {
                const data = await response.json();
                if (data.lyrics) {
                    // ¡Éxito!
                    console.log(`API fetch success: ${perm.artist} - ${perm.title}`);
                    displayUnsyncedLyrics(data.lyrics); // <-- Esto ya actualiza el footer
                    
                    // [NUEVO] Guardar en caché
                    setCachedLyric(perm.artist, perm.title, data.lyrics);
                    
                    return; // Salir de la función fetchLyrics
                } else {
                    // [NUEVO] API dio OK pero sin letra (json vacío)
                    console.log(`API fetch OK (NO ENCONTRADO): ${perm.artist} - ${perm.title}`);
                    setCachedLyric(perm.artist, perm.title, CACHE_NOT_FOUND);
                }
            } else {
                // [NUEVO] API dio error (ej. 404)
                console.log(`API fetch Error 404 (NO ENCONTRADO): ${perm.artist} - ${perm.title}`);
                setCachedLyric(perm.artist, perm.title, CACHE_NOT_FOUND);
            }
            // Si !response.ok o no hay data.lyrics, el bucle continúa al siguiente intento...
        } catch (error) {
            // Error de red, el bucle continúa al siguiente intento...
            // No guardamos en caché un error de red, para que pueda reintentar
            console.warn(`Intento fallido (red) para ${key}:`, error);
        }
    }

    // 4. Si todos los intentos fallan
    // (Race condition check)
    if (trackIndex !== currentTrackIndex) return;

    console.error("Todos los intentos (caché y API) de búsqueda de letra fallaron.");
    lyricsList.innerHTML = '<li class="empty-message">No se pudo encontrar la letra.</li>';
    if (footerLyricPhrase) footerLyricPhrase.textContent = '...'; // <-- FOOTER
    if (retryLyricsBtn) retryLyricsBtn.style.display = 'flex'; // <-- MOSTRAR BOTÓN REINTENTAR
}
// ===== FIN: LÓGICA DE BÚSQUEDA SÓLIDA =====


// ===================================
// D. FUNCIONES DEL REPRODUCTOR Y VISUALIZADOR
// ===================================

// ===== INICIO: NUEVA FUNCIÓN AÑADIDA (FOOTER) =====
/**
 * Actualiza el contador de la canción más escuchada en la sesión.
 */
function updateMostPlayedUI() {
    if (!footerMostPlayed) return;

    let maxPlays = 0;
    let mostPlayedTrack = '--';

    for (const trackName in sessionPlayCount) {
        if (sessionPlayCount[trackName] > maxPlays) {
            maxPlays = sessionPlayCount[trackName];
            mostPlayedTrack = trackName;
        }
    }
    
    // Muestra solo el nombre, sin el conteo.
    footerMostPlayed.textContent = mostPlayedTrack;
}
// ===== FIN: NUEVA FUNCIÓN AÑADIDA (FOOTER) =====


/**
 * MODIFICADO: Ahora también aplica el tema dinámico si está activado.
 * MODIFICADO: Ahora busca letras en internet (o CACHÉ) si no hay .lrc
 * MODIFICADO: Actualiza el footer (título y contador de "más escuchada").
 * MODIFICADO: Llama a la lógica de RAVE SYNC si es el HOST.
 * MODIFICADO: Maneja pistas locales (File) y online (Object {isOnline, url, name}).
 */
function loadTrack(index, autoPlay = false) {
    if (index >= 0 && index < playlist.length && audioPlayer) {
        
        // RESETEAR LETRAS Y BADGE LRC
        currentLyrics = [];
        displayLyrics(null); // Limpia el panel
        if (lrcBadgeElement) lrcBadgeElement.style.display = 'none'; // <-- OCULTAR BADGE
        if (retryLyricsBtn) retryLyricsBtn.style.display = 'none'; // <-- OCULTAR BOTÓN REINTENTAR
        if (footerLyricPhrase) footerLyricPhrase.textContent = '...'; // <-- FOOTER
        
        currentTrackIndex = index;
        const track = playlist[currentTrackIndex];
        
        // ===== INICIO: LÓGICA DE "MÁS ESCUCHADA" (FOOTER) =====
        const trackName = track.name.replace(/\.[^/.]+$/, "");
        sessionPlayCount[trackName] = (sessionPlayCount[trackName] || 0) + 1;
        updateMostPlayedUI();
        // ===== FIN: LÓGICA "MÁS ESCUCHADA" =====
        
        
        let albumArtUrl = 'https://via.placeholder.com/512x512.png?text=M+Icon'; 

        // ===== INICIO DE CÓDIGO MODIFICADO (Online vs Local) =====
        
        // --- CASO 1: CANCIÓN ONLINE (Objeto) ---
        if (track.isOnline) {
            if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioPlayer.src);
            }
            
            // =======================================================
            // ===== INICIO DE LA CORRECCIÓN DE CORS (PROXY CORS) =====
            // =======================================================
            
            // 1. Asignar la URL con crossOrigin para el audio
            audioPlayer.crossOrigin = "anonymous";
            audioPlayer.src = track.url;
            
            // --- INICIO DE MODIFICACIÓN (Arreglo de metadatos online) ---
            
            // Pre-llenar con info básica
            const basicTitle = track.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');
            songTitle.textContent = basicTitle;
            artistName.textContent = 'Cargando metadatos...';
            if (headerSongTitle) headerSongTitle.textContent = basicTitle; 
            if (footerSongTitle) footerSongTitle.textContent = basicTitle;
            albumArtContainer.style.backgroundImage = 'none';
            albumIcon.style.display = 'block';

            // ===== INICIO DE CORRECCIÓN (RACE CONDITION) =====
            // NO buscar letras aquí, esperar a jsmediatags
            // fetchLyrics('Artista Desconocido', basicTitle, currentTrackIndex); // <--- LÍNEA ELIMINADA
            // ===== FIN DE CORRECCIÓN (RACE CONDITION) =====

            // INTENTAR LEER METADATOS DESDE LA URL (jsmediatags)
            if (window.jsmediatags) {
                
                // 2. Definimos el proxy
                const proxyUrl = 'https://corsproxy.io/?';

                // 3. Creamos la URL para jsmediatags, pasándola a través del proxy.
                // Ya no necesitamos el truco '?nocache'.
                const metadataUrl = `${proxyUrl}${encodeURIComponent(track.url)}`;
                // NOTA: Algunas implementaciones de proxy no necesitan encodeURIComponent,
                // si esta falla, la quitamos. Pero `corsproxy.io` lo prefiere.
                //
                // CORRECCIÓN: corsproxy.io NO necesita encodeURIComponent.
                // Simplemente se anexa: 'https://corsproxy.io/?URL_COMPLETA'
                const metadataUrl_corrected = `${proxyUrl}${track.url}`;


                // 4. Usamos la URL del proxy en jsmediatags
                window.jsmediatags.read(metadataUrl_corrected, { // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN!
                    onSuccess: function(tag) {
            // =======================================================
            // ===== FIN DE LA CORRECCIÓN DE CORS (PROXY CORS) ======
            // =======================================================
                        const tags = tag.tags;
                        const title = tags.title || basicTitle;
                        const artist = tags.artist || 'Artista Desconocido'; 
                        songTitle.textContent = title;
                        artistName.textContent = artist;
                        if (headerSongTitle) headerSongTitle.textContent = title; 
                        if (footerSongTitle) footerSongTitle.textContent = title;

                        // Re-buscar letras si encontramos un artista/título mejor
                        // (O si es la primera vez que se llama)
                        // [MODIFICADO] El 'false' final es implícito (no bypass)
                        fetchLyrics(artist, title, currentTrackIndex); 
                        
                        if (tags.picture) {
                            const picture = tags.picture;
                            let base64String = btoa(picture.data.map(c => String.fromCharCode(c)).join(''));
                            const format = picture.format || 'image/png';
                            const dataUrl = `url(data:${format};base64,${base64String})`;
                            albumArtContainer.style.backgroundImage = dataUrl;
                            albumIcon.style.display = 'none';
                            albumArtUrl = `data:${format};base64,${base64String}`;
                            
                            // ¡AQUÍ SE ACTIVA EL TEMA DINÁMICO!
                            if (isDynamicThemeActive) {
                                extractAndApplyDynamicTheme(albumArtUrl);
                            }
                            
                        } else {
                            albumIcon.style.display = 'block';
                            if (isDynamicThemeActive) {
                                const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                                applyThemeVariables(themes[savedThemeName], savedThemeName);
                            }
                        }
                        updateMediaSession(title, artist, albumArtUrl);
                        
                        if (isHost && currentRoomId) {
                            sendFullSyncState(); 
                            if (autoPlay) startSyncInterval();
                            else stopSyncInterval();
                        }
                    },
                    onError: function(error) {
                        // Fallback si jsmediatags falla (incluso con el proxy)
                        console.warn("Error al leer metadata online (con proxy):", error);
                        artistName.textContent = 'Artista Desconocido';
                        albumIcon.style.display = 'block';
                        updateMediaSession(basicTitle, 'Artista Desconocido', albumArtUrl);
                        
                        if (isDynamicThemeActive) {
                            const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                            applyThemeVariables(themes[savedThemeName], savedThemeName);
                        }
                        
                        if (isHost && currentRoomId) {
                            sendFullSyncState();
                            if (autoPlay) startSyncInterval();
                            else stopSyncInterval();
                        }
                        
                        // ===== AÑADIDO: Llamada de fallback si jsmediatags falla =====
                        fetchLyrics('Artista Desconocido', basicTitle, currentTrackIndex);
                        
                    }
                });
            } else {
                // Fallback si jsmediatags NO ESTÁ CARGADO
                artistName.textContent = 'Online (ID3 no cargado)';
                updateMediaSession(basicTitle, 'Online (ID3 no cargado)', albumArtUrl);
                if (isDynamicThemeActive) {
                     const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                     applyThemeVariables(themes[savedThemeName], savedThemeName);
                }
                if (isHost && currentRoomId) {
                    sendFullSyncState();
                    if (autoPlay) startSyncInterval();
                    else stopSyncInterval();
                }
                
                // ===== AÑADIDO: Llamada de fallback si jsmediatags no existe =====
                fetchLyrics('Online (ID3 no cargado)', basicTitle, currentTrackIndex);
            }
            // --- FIN DE MODIFICACIÓN (Arreglo de metadatos online) ---

        // --- CASO 2: CANCIÓN LOCAL (Archivo/File) ---
        } else {
            if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
                 URL.revokeObjectURL(audioPlayer.src);
            }
            
            const objectURL = URL.createObjectURL(track);
            audioPlayer.src = objectURL;
            
            songTitle.textContent = 'Cargando metadatos...';
            artistName.textContent = '';
            if (headerSongTitle) headerSongTitle.textContent = 'Cargando...'; 
            if (footerSongTitle) footerSongTitle.textContent = 'Cargando...'; // <-- FOOTER
            albumArtContainer.style.backgroundImage = 'none';
            albumIcon.style.display = 'block';

            // BUSCAR LETRAS LOCALES (.lrc)
            // Obtener nombre base (ej. "Mi Cancion")
            const baseName = track.name.replace(/\.[^/.]+$/, "");
            const lrcFile = lrcMap.get(baseName); // Buscar en el mapa
            
            // [LÓGICA DE JSMEDIATAGS (SIN CAMBIOS)]
            if (window.jsmediatags) {
                window.jsmediatags.read(track, {
                    onSuccess: function(tag) {
                        const tags = tag.tags;
                        const title = tags.title || track.name.replace(/\.[^/.]+$/, "");
                        // AQUÍ es donde artist puede ser "Artista 1;Artista 2"
                        const artist = tags.artist || 'Artista Desconocido'; 
                        songTitle.textContent = title;
                        artistName.textContent = artist; // Mostramos el string completo
                        if (headerSongTitle) headerSongTitle.textContent = title; 
                        if (footerSongTitle) footerSongTitle.textContent = title; // <-- FOOTER
                        
                        // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
                        if (lrcFile) {
                            // 1. Si se encontró .lrc local, usarlo.
                            loadLyrics(lrcFile); // <-- Ya actualiza el footer
                        } else {
                            // 2. Si no, buscar en caché/internet
                            fetchLyrics(artist, title, currentTrackIndex); // <-- Ya actualiza el footer
                        }
                        // ===== FIN LÓGICA DE LETRAS =====
                        
                        if (tags.picture) {
                            const picture = tags.picture;
                            let base64String = btoa(picture.data.map(c => String.fromCharCode(c)).join(''));
                            const format = picture.format || 'image/png';
                            const dataUrl = `url(data:${format};base64,${base64String})`;
                            albumArtContainer.style.backgroundImage = dataUrl;
                            albumIcon.style.display = 'none';
                            albumArtUrl = `data:${format};base64,${base64String}`;
                            
                            if (isDynamicThemeActive) {
                                extractAndApplyDynamicTheme(albumArtUrl);
                            }
                            
                        } else {
                            albumIcon.style.display = 'block';
                            if (isDynamicThemeActive) {
                                const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                                applyThemeVariables(themes[savedThemeName], savedThemeName);
                            }
                        }
                        updateMediaSession(title, artist, albumArtUrl);
                        
                        // ===== INICIO SYNC (AÑADIDO) =====
                        if (isHost && currentRoomId) {
                            sendFullSyncState(); // Envía el estado con la nueva canción
                            if (autoPlay) startSyncInterval();
                            else stopSyncInterval();
                        }
                        // ===== FIN SYNC =====
                    },
                    onError: function(error) {
                        const title = track.name.replace(/\.[^/.]+$/, "");
                        const artist = 'Artista Desconocido (Metadata no encontrada)';
                        songTitle.textContent = title;
                        artistName.textContent = artist;
                        if (headerSongTitle) headerSongTitle.textContent = title; 
                        if (footerSongTitle) footerSongTitle.textContent = title; // <-- FOOTER
                        albumIcon.style.display = 'block';
                        
                        // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
                        if (lrcFile) {
                            // 1. Si se encontró .lrc local, usarlo.
                            loadLyrics(lrcFile); // <-- Ya actualiza el footer
                        } else {
                            // 2. Si no, buscar en caché/internet
                            fetchLyrics(artist, title, currentTrackIndex); // <-- Ya actualiza el footer
                        }
                        // ===== FIN LÓGICA DE LETRAS =====
                        
                        updateMediaSession(title, artist, albumArtUrl);
                        
                        if (isDynamicThemeActive) {
                            const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                            applyThemeVariables(themes[savedThemeName], savedThemeName);
                        }
                        
                        // ===== INICIO SYNC (AÑADIDO) =====
                        if (isHost && currentRoomId) {
                            sendFullSyncState();
                            if (autoPlay) startSyncInterval();
                            else stopSyncInterval();
                        }
                        // ===== FIN SYNC =====
                    }
                });
            } else {
                const title = track.name.replace(/\.[^/.]+$/, "");
                songTitle.textContent = title;
                artistName.textContent = 'Librería ID3 no cargada';
                if (headerSongTitle) headerSongTitle.textContent = title; 
                if (footerSongTitle) footerSongTitle.textContent = title; // <-- FOOTER

                // ===== INICIO LÓGICA DE LETRAS (MODIFICADO) =====
                if (lrcFile) {
                    loadLyrics(lrcFile); // <-- Ya actualiza el footer
                } else {
                    fetchLyrics("Artista Desconocido", title, currentTrackIndex); // <-- Ya actualiza el footer
                }
                // ===== FIN LÓGICA DE LETRAS =====
                
                updateMediaSession(title, 'Librería ID3 no cargada', albumArtUrl);
                
                if (isDynamicThemeActive) {
                    const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                    applyThemeVariables(themes[savedThemeName], savedThemeName);
                }
                
                // ===== INICIO SYNC (AÑADIDO) =====
                // Fallback para cuando jsmediatags no carga
                if (isHost && currentRoomId) {
                    sendFullSyncState();
                    if (autoPlay) startSyncInterval();
                    else stopSyncInterval();
                }
                // ===== FIN SYNC =====
            }
        }
        // ===== FIN DE CÓDIGO MODIFICADO (Online vs Local) =====

        updatePlaylistUI();

        function tryPlayOnce() {
            if (autoPlay) {
                // ===== INICIO SYNC (MODIFICADO) =====
                // El cliente no debe hacer autoPlay, debe esperar al Host
                if (isHost || !currentRoomId) {
                    audioPlayer.play().catch(e => {
                        playIcon.textContent = 'play_arrow';
                    });
                }
                // ===== FIN SYNC =====
            }
            audioPlayer.removeEventListener('canplaythrough', tryPlayOnce);
        }

        audioPlayer.addEventListener('canplaythrough', tryPlayOnce);
        audioPlayer.load();
        
        if (repeatMode === 'one') {
            audioPlayer.loop = true;
        } else {
            audioPlayer.loop = false;
        }
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * MODIFICADO: Reconfigurado para insertar el EQ en el grafo de audio.
 */
function initAudioContext() {
    if (audioContext && audioContext.state === 'running') return;
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            
            // Solo crear una nueva fuente si no existe
            if (!audioSource) {
                audioSource = audioContext.createMediaElementSource(audioPlayer);
            }
            
            // ===== INICIO CONFIGURACIÓN EQ (AÑADIDO) =====
            setupEQ(); // Crea las bandas de EQ
            
            // Conectar el grafo de audio:
            // source -> eqBand[0] -> eqBand[1] ... -> eqBand[last] -> analyser -> destination
            audioSource.connect(eqBands[0]); // Conectar fuente a la primera banda
            eqBands[eqBands.length - 1].connect(analyser); // Conectar última banda al analizador
            // (Las bandas intermedias se conectan en setupEQ)
            // ===== FIN CONFIGURACIÓN EQ (AÑADIDO) =====
            
            analyser.connect(audioContext.destination); // Conectar analizador a la salida
            
            analyser.fftSize = 256;
            analyser.minDecibels = -90;
            analyser.maxDecibels = -20;
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } catch (e) {
        console.error('Web Audio API no compatible o falló al iniciar:', e);
    }
}


const bufferLength = 128;
const dataArray = new Uint8Array(bufferLength); 

function visualize() {
    if (!analyser || audioPlayer.paused) {
        requestAnimationFrame(visualize);
        return;
    }

    analyser.getByteFrequencyData(dataArray); 
    const mainColor = getComputedStyle(root).getPropertyValue(mainColorProperty);
    const multiplier = parseFloat(getComputedStyle(root).getPropertyValue('--sensitivity-multiplier'));
    
    let scaleY;

    switch (progressStyle) {
        case 'bars':
            if (dynamicBars.length === 0) {
                createDynamicBars(); 
            }
            if (visualizerBarContainer && visualizerBarContainer.style.opacity === '0') break; 

            dynamicBars.forEach((bar, i) => {
                const freqValue = dataArray[i]; 
                
                let sensitivity;
                if (i < NUM_BARS * 0.15) { sensitivity = 1.5; }
                else if (i < NUM_BARS * 0.45) { sensitivity = 1.2; }
                else { sensitivity = 0.9; } 
                
                const normalizedVolume = Math.pow(Math.min(freqValue / 255, 1), 0.7) * sensitivity;
                const scaleY = 0.5 + normalizedVolume * 12 * multiplier;
                
                bar.style.transform = `scaleY(${scaleY})`;
            });

            progressLine.style.transform = 'none';
            break;
            
        case 'spark':
            const avgVolumeSpark = dataArray.slice(0, bufferLength * 0.8).reduce((a, b) => a + b, 0) / (bufferLength * 0.8);
            const effectIntensitySpark = Math.min(avgVolumeSpark / 150, 1) * multiplier;
            scaleY = 1 + effectIntensitySpark * 0.5;
            progressLine.style.transformOrigin = 'center';
            progressLine.style.transform = `scaleY(${scaleY})`;
            break;

        case 'line':
        default:
            const avgVolumeLine = dataArray.slice(0, bufferLength * 0.8).reduce((a, b) => a + b, 0) / (bufferLength * 0.8);
            const effectIntensityLine = Math.min(avgVolumeLine / 150, 1) * multiplier;
            scaleY = 1 + effectIntensityLine * 0.2;
            progressLine.style.transformOrigin = 'center';
            progressLine.style.transform = `scaleY(${scaleY})`;
            break;
    }
    requestAnimationFrame(visualize);
}

function createDynamicBars() {
    if (!progressBarContainer) return;

    visualizerBarContainer = document.getElementById('visualizer-bar-container');
    if (!visualizerBarContainer) {
        visualizerBarContainer = document.createElement('div');
        visualizerBarContainer.id = 'visualizer-bar-container';
        visualizerBarContainer.style.cssText = `
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
            display: flex; justify-content: space-between; align-items: flex-end;
            padding: 0; z-index: 2; opacity: 0; visibility: hidden; 
            transition: opacity 0.3s ease-in-out, visibility 0.3s linear; 
        `;
        progressBarContainer.prepend(visualizerBarContainer); 
    }
    
    visualizerBarContainer.innerHTML = '';
    dynamicBars = [];

    const BAR_WIDTH_PERCENT = (100 / NUM_BARS) * 0.9; 
    
    for (let i = 0; i < NUM_BARS; i++) {
        const bar = document.createElement('div');
        bar.classList.add('dyn-bar');
        bar.style.width = `${BAR_WIDTH_PERCENT}%`; 
        bar.style.minWidth = '0.1px';
        bar.style.height = '100%';
        bar.style.backgroundColor = 'var(--main-color)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transition = 'transform 0.04s ease-out';
        visualizerBarContainer.appendChild(bar);
        dynamicBars.push(bar);
    }
    
    if(progressLine) progressLine.innerHTML = '';
}

// ===================================
// E. FUNCIONES DE REPETICIÓN
// ===================================
function toggleRepeatMode() {
    // ===== INICIO SYNC (AÑADIDO) =====
    if (!isHost && currentRoomId) return; // Bloquear cliente
    // ===== FIN SYNC =====
    
    if (!repeatIcon || !audioPlayer) return;
    if (repeatMode === 'none') {
        repeatMode = 'one';
        repeatIcon.textContent = 'repeat_one'; 
        repeatIcon.style.color = 'var(--main-color)'; 
        audioPlayer.loop = true;
    } else if (repeatMode === 'one') {
        repeatMode = 'all';
        repeatIcon.textContent = 'repeat'; 
        repeatIcon.style.color = 'var(--main-color)';
        audioPlayer.loop = false;
    } else { 
        repeatMode = 'none';
        repeatIcon.textContent = 'repeat'; 
        repeatIcon.style.color = 'var(--card-text-color)'; 
        audioPlayer.loop = false;
    }
    localStorage.setItem('repeatMode', repeatMode);
}

function loadRepeatMode() {
    const savedMode = localStorage.getItem('repeatMode');
    if (savedMode && ['none', 'one', 'all'].includes(savedMode)) {
        repeatMode = savedMode;
    }
    if (repeatIcon && audioPlayer) {
        if (repeatMode === 'one') {
            repeatIcon.textContent = 'repeat_one';
            repeatIcon.style.color = 'var(--main-color)';
            audioPlayer.loop = true;
        } else if (repeatMode === 'all') {
            repeatIcon.textContent = 'repeat';
            repeatIcon.style.color = 'var(--main-color)';
            audioPlayer.loop = false;
        } else { // 'none'
            repeatIcon.textContent = 'repeat';
            repeatIcon.style.color = 'var(--card-text-color)';
            audioPlayer.loop = false;
        }
    }
}

// ===================================
// F. FUNCIONES DE EXPLORADOR DE CARPETAS (ACTUALIZADO)
// ===================================
function isAudioFile(fileName) {
    const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.aac'];
    const lowerName = fileName.toLowerCase();
    return audioExtensions.some(ext => lowerName.endsWith(ext));
}

function createFolderEntryUI(name, parentElement) {
    const li = document.createElement('li');
    li.classList.add('folder-item', 'collapsed'); 
    li.innerHTML = `<span class="material-icons file-icon">folder</span> ${name}`;
    li.style.cursor = 'pointer';
    li.title = `Abrir/Cerrar: ${name}`;
    const ul = document.createElement('ul');
    li.appendChild(ul);
    parentElement.appendChild(li);
    return ul;
}

function createAudioEntryUI(file, parentElement) {
    const fileIndex = folderPlaylist.length;
    folderPlaylist.push(file);
    const li = document.createElement('li');
    li.classList.add('audio-item');
    li.dataset.folderIndex = fileIndex;
    li.innerHTML = `<span class="material-icons file-icon">audio_file</span> ${file.name}`;
    li.title = `Reproducir: ${file.name}`;
    li.style.cursor = 'pointer';
    parentElement.appendChild(li);
}

/**
 * ACTUALIZADO: Ahora también busca .lrc y los añade al lrcMap
 */
async function processDirectoryEntry(entry, parentElement) {
    if (entry.isFile) {
        if (isAudioFile(entry.name)) {
            entry.file(file => {
                createAudioEntryUI(file, parentElement);
            }, err => {
                console.error('Error al leer el archivo:', err);
            });
        } 
        // NUEVO: Detectar archivos .lrc
        else if (entry.name.toLowerCase().endsWith('.lrc')) {
            entry.file(file => {
                const baseName = file.name.replace(/\.lrc$/i, "");
                lrcMap.set(baseName, file);
            }, err => {
                console.error('Error al leer el archivo .lrc:', err);
            });
        }
    } else if (entry.isDirectory) {
        const folderName = entry.name;
        const newParentUI = createFolderEntryUI(folderName, parentElement);
        const reader = entry.createReader();
        try {
            let entries = [];
            let readEntries = await new Promise((resolve, reject) => {
                reader.readEntries(resolve, reject);
            });
            while (readEntries.length > 0) {
                entries = entries.concat(readEntries);
                readEntries = await new Promise((resolve, reject) => {
                    reader.readEntries(resolve, reject);
                });
            }
            // Procesa recursivamente (esto encontrará audio y lrc en subcarpetas)
            for (const subEntry of entries) {
                await processDirectoryEntry(subEntry, newParentUI); 
            }
        } catch (err) {
            console.error('Error al leer el directorio:', err);
        }
    }
}

// ===== INICIO: NUEVA FUNCIÓN PARA RENDERIZAR ÁRBOL DE ARCHIVOS MÓVIL (AÑADIDO) =====
/**
 * (NUEVA FUNCIÓN)
 * Renderiza la estructura de carpetas de un FileList (con webkitRelativePath)
 * en la UI del panel de carpetas.
 */
function renderFolderTree(node, parentElement) {
    // Primero, renderizar todas las subcarpetas (ordenadas alfabéticamente)
    Object.keys(node).sort().forEach(key => {
        if (key !== '_files') {
            const newParentUI = createFolderEntryUI(key, parentElement);
            // Llamada recursiva para esa subcarpeta
            renderFolderTree(node[key], newParentUI);
        }
    });

    // Segundo, renderizar todos los archivos en este nivel (ordenados alfabéticamente)
    if (node._files) {
        node._files.sort((a, b) => a.name.localeCompare(b.name)).forEach(file => {
            if (isAudioFile(file.name)) {
                // Reutiliza la función existente para crear el <li> de audio
                createAudioEntryUI(file, parentElement);
            } else if (file.name.toLowerCase().endsWith('.lrc')) {
                // Almacena el archivo .lrc en el mapa
                const baseName = file.name.replace(/\.lrc$/i, "");
                lrcMap.set(baseName, file);
            }
        });
    }
}
// ===== FIN: NUEVA FUNCIÓN PARA RENDERIZAR ÁRBOL DE ARCHIVOS MÓVIL =====


// ====================================================================
// G. MEDIA SESSION API
// ====================================================================
function updateMediaSession(title, artist, albumArtUrl) {
    if ('mediaSession' in navigator) {
        const formatMatch = albumArtUrl.match(/^data:(image\/\w+);base64/);
        const imageType = formatMatch ? formatMatch[1] : 'image/png';
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title || 'Título Desconocido',
            artist: artist || 'Artista Desconocido',
            album: 'Tu Reproductor Web', 
            artwork: [
                { src: albumArtUrl, sizes: '512x512', type: imageType }
            ]
        });
    }
}

function setupMediaSessionHandlers() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            if (audioPlayer.paused) {
                audioPlayer.play().catch(e => console.error("Error al reanudar:", e)); 
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            if (!audioPlayer.paused) {
                audioPlayer.pause();
            }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            if (playlist.length > 0) {
                let nextIndex = (currentTrackIndex + 1) % playlist.length;
                loadTrack(nextIndex, true);
            }
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            if (playlist.length > 0) {
                let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
                loadTrack(prevIndex, true);
            }
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            const seekOffset = details.seekOffset || 10; 
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - seekOffset);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            const seekOffset = details.seekOffset || 10; 
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + seekOffset);
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        });
    }
}

// ====================================================================
// I. FUNCIONES DE ECUALIZADOR (AÑADIDO)
// ====================================================================

const EQ_PRESETS = {
    'custom': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'pop': [ -1, 2, 4, 5, 3, 0, -2, -3, -4, -4],
    'rock': [5, 3, -1, -3, -2, 1, 4, 6, 7, 7],
    'jazz': [4, 2, 1, 3, -1, -1, 0, 2, 3, 4],
    'classical': [5, 4, 3, 2, -2, -2, 0, 2, 4, 5],
    'vocal': [-2, -1, 0, 3, 4, 4, 3, 0, -1, -2],
    'bass_boost': [8, 6, 4, 2, 0, 0, 0, 0, 0, 0],
    'treble_boost': [0, 0, 0, 0, 0, 0, 2, 4, 6, 8]
};

/**
 * Crea los nodos de filtro Biquad y los conecta en cadena.
 * También genera la UI para los sliders.
 */
function setupEQ() {
    if (!audioContext || !eqBandsContainer) return;
    
    eqBands = [];
    eqBandsContainer.innerHTML = '';

    EQ_FREQUENCIES.forEach((freq, i) => {
        const filter = audioContext.createBiquadFilter();

        // Determinar tipo de filtro
        if (i === 0) {
            filter.type = 'lowshelf'; // Primera banda (graves)
        } else if (i === EQ_FREQUENCIES.length - 1) {
            filter.type = 'highshelf'; // Última banda (agudos)
        } else {
            filter.type = 'peaking'; // Bandas intermedias
        }

        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1; // Valor Q estándar para 'peaking'

        // Conectar al filtro anterior (si existe)
        if (i > 0) {
            eqBands[i - 1].connect(filter);
        }

        eqBands.push(filter);

        // --- Crear UI para esta banda ---
        const bandDiv = document.createElement('div');
        bandDiv.className = 'eq-band';
        
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'eq-slider-container';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = -12;
        slider.max = 12;
        slider.step = 0.1;
        slider.value = 0;
        
        const gainLabel = document.createElement('span');
        gainLabel.className = 'eq-gain-label';
        gainLabel.textContent = '0.0 dB';
        
        const freqLabel = document.createElement('span');
        freqLabel.className = 'eq-freq-label';
        freqLabel.textContent = (freq < 1000) ? `${freq}Hz` : `${freq / 1000}k`;
        
        sliderContainer.appendChild(slider);
        bandDiv.appendChild(gainLabel);
        bandDiv.appendChild(sliderContainer);
        bandDiv.appendChild(freqLabel);
        eqBandsContainer.appendChild(bandDiv);
        
        // Añadir listener al slider
        slider.addEventListener('input', () => {
            const gain = parseFloat(slider.value);
            filter.gain.value = gain;
            gainLabel.textContent = `${gain.toFixed(1)} dB`;
            if (eqPresetsSelect) eqPresetsSelect.value = 'custom'; // Cambiar a custom
        });
        
        // Listener para resetear con doble click
         slider.addEventListener('dblclick', () => {
            slider.value = 0;
            filter.gain.value = 0;
            gainLabel.textContent = '0.0 dB';
            if (eqPresetsSelect) eqPresetsSelect.value = 'custom';
        });
    });
}

/**
 * Aplica un preset de ecualización seleccionado.
 */
function applyEQPreset() {
    if (!eqPresetsSelect || !eqBandsContainer) return;
    
    const presetName = eqPresetsSelect.value;
    const gains = EQ_PRESETS[presetName];
    if (!gains) return;
    
    const sliders = eqBandsContainer.querySelectorAll('input[type="range"]');
    const labels = eqBandsContainer.querySelectorAll('.eq-gain-label');
    
    eqBands.forEach((filter, i) => {
        const gain = gains[i];
        filter.gain.value = gain;
        if (sliders[i]) sliders[i].value = gain;
        if (labels[i]) labels[i].textContent = `${gain.toFixed(1)} dB`;
    });
}

/**
 * Abre el modal del Ecualizador.
 */
function openEqModal() {
    if (eqModal) eqModal.classList.add('open');
    if (eqOverlay) eqOverlay.classList.add('open');
}

/**
 * Cierra el modal del Ecualizador.
 */
function closeEqModal() {
    if (eqModal) eqModal.classList.remove('open');
    if (eqOverlay) eqOverlay.classList.remove('open');
}

// ====================================================================
// J. TEMA DINÁMICO (MODIFICADO)
// ====================================================================

// --- INICIO FUNCIONES HSL (AÑADIDAS) ---
/**
 * Convierte RGB a HSL.
 * r, g, b están en el rango [0, 255].
 * Devuelve [h, s, l] donde h está en [0, 360] y s, l en [0, 100].
 */
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

/**
 * Convierte HSL a CSS string 'hsl(h, s%, l%)'.
 * h, s, l vienen del array [h, s, l].
 */
function hslToCss(h, s, l) {
    return `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
}
// --- FIN FUNCIONES HSL ---

/**
 * MODIFICADO: Ahora usa HSL para garantizar el contraste.
 * Genera un objeto de tema basado en un color promedio (RGB).
 */
function generateThemeFromColor(r, g, b) {
    // 1. Convertir el color promedio a HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // 2. Definir el color principal (resaltado)
    // Queremos que sea brillante y saturado.
    
    // Asegurar que la saturación no sea demasiado baja (p.ej. gris)
    const finalMainSat = Math.max(50, s); // Mínimo 50% de saturación.
    // Asegurar que la luminosidad sea alta (brillante)
    const finalMainLight = 65; // Fijarlo en 65% para un brillo consistente

    const mainColor = hslToCss(h, finalMainSat, finalMainLight);

    // 3. Definir los fondos (oscuros)
    // Usamos el mismo Tono (h) pero bajamos mucho la luminosidad.
    const bodyLight = 5; // Fondo principal muy oscuro
    const cardLight = 10; // Fondo de tarjeta un poco más claro
    
    // Reducir la saturación en los fondos para que no sean "barrocos"
    const bgSat = Math.min(s, 20); 

    const bodyBg = hslToCss(h, bgSat, bodyLight);
    const cardBg = hslToCss(h, bgSat, cardLight);

    // 4. Definir colores de texto
    // Para fondos tan oscuros, el texto siempre debe ser blanco/claro.
    const textColor = '#FFFFFF';
    // El texto secundario puede usar el HSL con alta luminosidad pero baja saturación
    const secondaryText = hslToCss(h, 15, 75); 

    return {
        '--main-color': mainColor,
        'body-background': bodyBg,
        '--card-bg-color': cardBg,
        '--card-text-color': textColor,
        '--card-text-secondary-color': secondaryText,
        '--border-color': mainColor // El borde usa el color principal brillante
    };
}


/**
 * Extrae el color promedio de una imagen (data URL) y aplica el tema.
 */
function extractAndApplyDynamicTheme(imageUrl) {
    if (!imageUrl.startsWith('data:')) {
        // Si no es data URL (ej. placeholder), revierte a estático
        const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
        applyThemeVariables(themes[savedThemeName], savedThemeName);
        return;
    }
    
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        // Reducir el tamaño del canvas para muestreo más rápido
        const w = canvas.width = 20;
        const h = canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        
        let data, r = 0, g = 0, b = 0, count = 0;
        try {
            data = ctx.getImageData(0, 0, w, h).data;
        } catch (e) {
            console.error("Error al obtener datos de imagen (canvas):", e);
            // Fallback a tema estático si falla
            const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
            applyThemeVariables(themes[savedThemeName], savedThemeName);
            return;
        }
        
        // Muestrear píxeles (cada 4 píxeles) para velocidad
        const step = 4 * 4; // Muestrear cada 4 píxeles
        for (let i = 0; i < data.length; i += step) { 
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Generar y aplicar el tema
        const dynamicTheme = generateThemeFromColor(r, g, b);
        applyThemeVariables(dynamicTheme, null); // Aplicar sin guardar en localStorage
    };
    img.onerror = () => {
        // Fallback si la imagen no se puede cargar
        const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
        applyThemeVariables(themes[savedThemeName], savedThemeName);
    };
    // Asegurar que CORS no sea un problema (aunque con data:URL no debería)
    img.crossOrigin = "Anonymous";
    img.src = imageUrl.replace('url("', '').replace('")', ''); // Limpiar el "url(...)" si viene
}


// ====================================================================
// H. INICIALIZACIÓN (ACTUALIZADO)
// ====================================================================

// ===== INICIO DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====

// ===== INICIO DE MODIFICACIÓN (Petición del usuario) =====
/**
 * (MODIFICADO) Almacena la lista de *playlists* del repositorio de GitHub.
 */
async function fetchAllOnlinePlaylists() { // <<-- CAMBIADO
    if (searchStatus) searchStatus.style.display = 'inline-block';
    if (searchResultsList) searchResultsList.innerHTML = '<li class="empty-message">Cargando playlists online...</li>';
    try {
        // Carga el nuevo archivo playlists.json
        const response = await fetch(`${GITHUB_REPO_URL}${ONLINE_SONG_LIST_PATH}`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar ${ONLINE_SONG_LIST_PATH}`);
        }
        const playlistData = await response.json(); // Esto es un array de objetos
        
        if (Array.isArray(playlistData)) {
            allOnlinePlaylists = playlistData; // Almacenamos los datos de las playlists
            if (searchResultsList) searchResultsList.innerHTML = '<li class="empty-message">Busca para ver resultados.</li>';
        } else {
            throw new Error('El archivo playlists.json no tiene el formato de array esperado.');
        }
        
    } catch (error) {
        console.error("Error al cargar la lista de playlists online:", error);
        if (searchResultsList) searchResultsList.innerHTML = `<li class="empty-message">Error al cargar la base de datos.<br>${error.message}</li>`;
    } finally {
        if (searchStatus) searchStatus.style.display = 'none';
    }
}

/**
 * (MODIFICADO) Filtra la lista de *playlists* online basándose en el input.
 */
function performSearch() {
    if (!searchInput || !searchResultsList) return;
    const query = searchInput.value.toLowerCase().trim();
    if (query.length < 2) {
        searchResultsList.innerHTML = '<li class="empty-message">Escribe al menos 2 letras.</li>';
        return;
    }

    // Busca en la lista de playlists por el nombre
    const results = allOnlinePlaylists.filter(playlist => 
        playlist.name.toLowerCase().includes(query)
    ).slice(0, 50); // Limitar a 50 resultados

    searchResultsList.innerHTML = '';
    if (results.length === 0) {
        searchResultsList.innerHTML = '<li class="empty-message">No se encontraron carpetas.</li>';
        return;
    }

    results.forEach((playlist, index) => {
        // Guardar el índice original de la lista COMPLETA
        const originalIndex = allOnlinePlaylists.findIndex(p => p.name === playlist.name);
        
        const li = document.createElement('li');
        // Mostrar un icono de carpeta
        li.innerHTML = `<span class="material-icons">folder</span> ${playlist.name}`;
        li.title = `Reproducir carpeta: ${playlist.name}`;
        li.dataset.originalIndex = originalIndex; // Clave para cargar la playlist
        searchResultsList.appendChild(li);
    });
}

/**
 * (MODIFICADO) Se dispara al hacer clic en un resultado de búsqueda (carpeta).
 * Crea la playlist online desde la carpeta seleccionada y la reproduce.
 */
function playOnlinePlaylist(event) { // <<-- CAMBIADO
    // ===== INICIO SYNC (AÑADIDO) =====
    if (!isHost && currentRoomId) return; // Bloquear cliente
    // ===== FIN SYNC =====
    
    const targetLi = event.target.closest('li');
    if (!targetLi || targetLi.classList.contains('empty-message') || targetLi.dataset.originalIndex === undefined) {
        return;
    }

    const originalIndex = parseInt(targetLi.dataset.originalIndex, 10);
    const selectedPlaylist = allOnlinePlaylists[originalIndex]; // Obtiene el objeto {name, folderName, songs}

    if (!selectedPlaylist || !selectedPlaylist.songs || selectedPlaylist.songs.length === 0) {
        console.error("Carpeta online inválida o vacía");
        alert("Esta carpeta parece estar vacía o no es válida.");
        return;
    }

    // 1. Crear la nueva playlist online
    // La playlist se construye a partir del array 'songs' de la carpeta seleccionada
    playlist = selectedPlaylist.songs.map(songFileName => {
        // Construir la URL completa: URL_Base + NombreCarpeta + NombreArchivo
        // LA URL BASE YA APUNTA A raw.githubusercontent.com/.../main/
        const songUrl = `${GITHUB_REPO_URL}${encodeURIComponent(selectedPlaylist.folderName)}/${encodeURIComponent(songFileName)}`;
        
        return {
            name: songFileName.replace(/\.[^/.]+$/, "").replace(/_/g, ' '), // Nombre legible
            isOnline: true,
            url: songUrl
        };
    });

    // 2. Establecer la fuente de la playlist actual
    currentPlaylistSource = 'online';

    // 3. Limpiar la playlist local/folder UI
    if (playlistList) playlistList.innerHTML = '<li class="empty-message">Reproduciendo desde GitHub...</li>';
    if (foldersList) foldersList.innerHTML = '<li class="empty-message">Carga local deshabilitada.</li>';

    // 4. Cargar la PRIMERA canción (índice 0) de esta *nueva* playlist
    initAudioContext();
    loadTrack(0, true);
}
// ===== FIN DE MODIFICACIÓN (Petición del usuario) =====

// ===== FIN DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====


document.addEventListener('DOMContentLoaded', () => {

    // ===== INICIO: DETECCIÓN MÓVIL (AÑADIDO) =====
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-detected');
    }
    // ===== FIN: DETECCIÓN MÓVIL =====


    // 1. ASIGNACIONES DE DOM (ACTUALIZADO)
    audioPlayer = document.getElementById('audio-player');
    fileInput = document.getElementById('file-input');
    playPauseBtn = document.getElementById('play-pause-btn');
    playIcon = playPauseBtn ? playPauseBtn.querySelector('.material-icons') : null;
    prevBtn = document.getElementById('prev-btn');
    nextBtn = document.getElementById('next-btn');
    skipBackBtn = document.getElementById('skip-back-btn');
    skipForwardBtn = document.getElementById('skip-forward-btn');
    repeatBtn = document.getElementById('repeat-btn');
    repeatIcon = repeatBtn ? repeatBtn.querySelector('#repeat-icon') : null;
    
    progressLine = document.getElementById('progress-line');
    progressBarContainer = document.getElementById('progress-bar');
    currentTimeDisplay = document.getElementById('current-time');
    totalTimeDisplay = document.getElementById('total-time');
    songTitle = document.querySelector('.song-title');
    artistName = document.querySelector('.artist-name');
    albumArtContainer = document.getElementById('album-art-container');
    albumIcon = document.getElementById('album-icon');
    playlistList = document.getElementById('playlist-list');
    playerCard = document.querySelector('.player-card');
    root = document.documentElement;
    themeOptionsContainer = document.getElementById('theme-options');
    sensitivitySlider = document.getElementById('sensitivity-slider');

    progressStylePanel = document.getElementById('progress-style-panel');
    progressStyleOptions = document.getElementById('progress-style-options');
    
    headerTime = document.getElementById('header-time');
    headerBattery = document.getElementById('header-battery');
    batteryLevelSpan = document.getElementById('battery-level');
    batteryIconSpan = document.getElementById('battery-icon');
    headerSongTitle = document.getElementById('header-song-title');

    // Asignación de panel de letras
    lyricsPanel = document.querySelector('.lyrics-panel');
    lyricsList = document.getElementById('lyrics-list');
    lyricsPanelHeader = document.querySelector('.lyrics-panel h3'); // <-- AÑADIDO
    retryLyricsBtn = document.getElementById('retry-lyrics-btn'); // <-- AÑADIDO
    
    // Asignaciones NUEVAS (AÑADIDO)
    lyricsAlignOptions = document.getElementById('lyrics-align-options');
    lyricsFontSelect = document.getElementById('lyrics-font-select');
    lyricsEffectSelect = document.getElementById('lyrics-effect-select');

    // ACTUALIZADO: Añadir .lyrics-panel al selector de tarjetas
    const cards = document.querySelectorAll('.player-card, .playlist-panel, .color-selector, .lyrics-panel');
    const mainContainer = document.querySelector('.main-container');

    foldersPanel = document.querySelector('.folders-panel');
    foldersList = document.getElementById('folders-list');

    // ===== INICIO ASIGNACIÓN BOTÓN MÓVIL (AÑADIDO) =====
    mobileFolderBtn = document.getElementById('mobile-folder-btn');
    folderInput = document.getElementById('folder-input');
    // ===== FIN ASIGNACIÓN BOTÓN MÓVIL =====

    // ===== INICIO ASIGNACIÓN BARRA LATERAL (AÑADIDO) =====
    sidebar = document.getElementById('sidebar-nav');
    sidebarOpenBtn = document.getElementById('sidebar-open-btn');
    sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    sidebarOverlay = document.getElementById('sidebar-overlay');
    panelToggleList = document.getElementById('panel-toggle-list');
    // ===== FIN ASIGNACIÓN BARRA LATERAL (AÑADIDO) =====
    
    // ===== INICIO ASIGNACIÓN TEMA DINÁMICO (AÑADIDO) =====
    dynamicThemeToggle = document.getElementById('toggle-dynamic-theme');
    // ===== FIN ASIGNACIÓN TEMA DINÁMICO (AÑADIDO) =====
    
    // ===== INICIO ASIGNACIÓN ECUALIZADOR (AÑADIDO) =====
    eqModal = document.getElementById('eq-modal');
    eqOverlay = document.getElementById('eq-modal-overlay');
    eqCloseBtn = document.getElementById('eq-close-btn');
    eqOpenBtn = document.getElementById('open-eq-btn');
    eqPresetsSelect = document.getElementById('eq-presets-select');
    eqBandsContainer = document.getElementById('eq-bands-container');
    // ===== FIN ASIGNACIÓN ECUALIZADOR (AÑADIDO) =====
    
    // ===== INICIO ASIGNACIÓN FOOTER (AÑADIDO) =====
    footerSongTitle = document.getElementById('footer-song-title');
    footerLyricPhrase = document.getElementById('footer-lyric-phrase');
    footerSessionTime = document.getElementById('footer-session-time');
    footerMostPlayed = document.getElementById('footer-most-played');
    // ===== FIN ASIGNACIÓN FOOTER (AÑADIDO) =====

    // ===== INICIO ASIGNACIÓN RAVE SYNC (MODIFICADO) =====
    createRoomBtn = document.getElementById('create-room-btn');
    joinRoomBtn = document.getElementById('join-room-btn');
    joinRoomInput = document.getElementById('join-room-input');
    roomCodeDisplay = document.getElementById('room-code-display');
    syncStatusElement = document.getElementById('sync-status'); // Renombrado
    // ===== FIN ASIGNACIÓN RAVE SYNC (MODIFICADO) =====

    // ===== INICIO DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====
    searchInput = document.getElementById('search-input');
    searchBtn = document.getElementById('search-btn');
    searchResultsList = document.getElementById('search-results-list');
    searchStatus = document.getElementById('search-status');
    // ===== FIN DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====


    sensitivityMultiplier = parseFloat(getComputedStyle(root).getPropertyValue('--sensitivity-multiplier'));

    createDynamicBars(); 
    setupMediaSessionHandlers();
    loadRepeatMode();
    
    // ===== INICIO DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====
    // ===== INICIO DE MODIFICACIÓN (Petición del usuario) =====
    // Cargar la lista de playlists de GitHub al iniciar
    fetchAllOnlinePlaylists(); // <<-- CAMBIADO
    // ===== FIN DE MODIFICACIÓN (Petición del usuario) =====
    // ===== FIN DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====
    
    // ===== INICIO: AÑADIR BADGE "LRC" (NUEVO) =====
    if (lyricsPanelHeader) {
        const badge = document.createElement('span');
        badge.id = 'lrc-badge';
        badge.textContent = 'LRC';
        badge.style.cssText = `
            color: var(--main-color);
            font-size: 0.7em;
            font-weight: bold;
            margin-right: 8px; /* Espacio entre badge y "Letra" */
            vertical-align: middle;
            display: none; /* Oculto por defecto */
            transition: color 0.5s ease-in-out; /* Para que cambie con el tema */
        `;
        lyricsPanelHeader.prepend(badge);
        lrcBadgeElement = badge; // Asignar a la variable global
    }
    // ===== FIN: AÑADIR BADGE "LRC" =====


    // 2. CARGAR Y APLICAR ESTADOS GUARDADOS
    
    // 2.1 Cargar Tema
    const savedThemeName = localStorage.getItem('userTheme');
    let initialThemeName = savedThemeName && themes[savedThemeName] ? savedThemeName : 'theme-dark';
    let initialTheme = themes[initialThemeName];
    applyThemeVariables(initialTheme, initialThemeName);
    
    document.querySelectorAll('.color-swatch').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === initialThemeName) {
            btn.classList.add('active');
        }
    });
    
    // 2.3 Cargar Sensibilidad
    const savedSensitivity = localStorage.getItem('userSensitivity');
    if (savedSensitivity !== null) {
        sensitivityMultiplier = parseFloat(savedSensitivity);
        sensitivitySlider.value = sensitivityMultiplier * 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
    } else {
        sensitivitySlider.value = sensitivityMultiplier * 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
    }
    
    // 2.4 Cargar Estilo de Progreso
    const savedProgressStyle = localStorage.getItem('userProgressStyle');
    progressStyle = savedProgressStyle && ['line', 'spark', 'bars'].includes(savedProgressStyle) ? savedProgressStyle : 'line';
    applyProgressStyle(progressStyle, false); 
    
    // 2.5 Cargar Alineación de Letras
    const savedLyricAlign = localStorage.getItem('userLyricAlign') || 'center'; // Default a 'center'
    applyLyricAlignment(savedLyricAlign, false); // Cargar sin guardar
    
    // 2.6 Cargar Fuente de Letras (AÑADIDO)
    const savedLyricFont = localStorage.getItem('userLyricFont') || "'Roboto', sans-serif"; // Default
    applyLyricFont(savedLyricFont, false);
    if (lyricsFontSelect) lyricsFontSelect.value = savedLyricFont;

    // 2.7 Cargar Efecto de Letras (AÑADIDO)
    const savedLyricEffect = localStorage.getItem('userLyricEffect') || 'highlight'; // Default
    applyLyricEffect(savedLyricEffect, false);
    if (lyricsEffectSelect) lyricsEffectSelect.value = savedLyricEffect;
    
    // 2.8 Cargar Visibilidad de Paneles (AÑADIDO)
    loadPanelVisibility();
    
    // 2.9 Cargar Estado de Tema Dinámico (AÑADIDO)
    const savedDynamicThemeState = localStorage.getItem('dynamicThemeActive');
    isDynamicThemeActive = (savedDynamicThemeState !== 'false'); // Default a true
    if (dynamicThemeToggle) dynamicThemeToggle.checked = isDynamicThemeActive;
    

    // 3. LISTENERS
    
    // Header
    updateTime();
    setInterval(updateTime, 1000); 
    getBatteryStatus();
    
    // ===== INICIO: LISTENERS DE FOOTER (AÑADIDO) =====
    sessionStartTime = Date.now();
    if (footerSessionTime) {
        footerSessionTime.textContent = '00:00:00';
        setInterval(() => {
            const elapsed = Date.now() - sessionStartTime;
            const seconds = Math.floor((elapsed / 1000) % 60).toString().padStart(2, '0');
            const minutes = Math.floor((elapsed / (1000 * 60)) % 60).toString().padStart(2, '0');
            const hours = Math.floor(elapsed / (1000 * 60 * 60)).toString().padStart(2, '0');
            footerSessionTime.textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
    if (footerSongTitle) footerSongTitle.textContent = '--';
    if (footerMostPlayed) footerMostPlayed.textContent = '--';
    if (footerLyricPhrase) footerLyricPhrase.textContent = 'Cargando reproductor...';
    // ===== FIN: LISTENERS DE FOOTER (AÑADIDO) =====
    
    
    // Explorador de Carpetas (Drag & Drop para Escritorio)
    if (foldersPanel && foldersList) {
        if (foldersList.innerHTML === '') {
            foldersList.innerHTML = '<li class="empty-message">Arrastra una carpeta aquí para explorarla.</li>';
        }
        foldersPanel.addEventListener('dragover', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.add('drag-active');
        });
        foldersPanel.addEventListener('dragleave', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.remove('drag-active');
        });
        // ACTUALIZADO: Limpiar lrcMap al soltar y setear source
        foldersPanel.addEventListener('drop', (e) => {
            e.preventDefault(); e.stopPropagation();
            foldersPanel.classList.remove('drag-active');
            const items = e.dataTransfer.items;
            if (items && items.length > 0) {
                foldersList.innerHTML = '';
                folderPlaylist = [];
                lrcMap.clear(); // Limpiar mapa de letras
                
                // ===== INICIO DE CÓDIGO MODIFICADO =====
                currentPlaylistSource = 'folder';
                if (searchResultsList) searchResultsList.innerHTML = '<li class="empty-message">Busca para ver resultados.</li>';
                // ===== FIN DE CÓDIGO MODIFICADO =====

                for (let i = 0; i < items.length; i++) {
                    const entry = items[i].webkitGetAsEntry();
                    if (entry) {
                        processDirectoryEntry(entry, foldersList);
                    }
                }
            }
        });
        foldersList.addEventListener('click', (event) => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            
            const targetLi = event.target.closest('li');
            if (!targetLi) return; 
            if (targetLi.classList.contains('audio-item') && targetLi.dataset.folderIndex !== undefined) {
                const indexToPlay = parseInt(targetLi.dataset.folderIndex, 10);
                playlist = folderPlaylist; // Usar la playlist de carpetas
                
                // ===== INICIO DE CÓDIGO MODIFICADO =====
                currentPlaylistSource = 'folder'; // Setear la fuente
                // ===== FIN DE CÓDIGO MODIFICADO =====

                initAudioContext();
                loadTrack(indexToPlay, true);
            } else if (targetLi.classList.contains('folder-item')) {
                targetLi.classList.toggle('collapsed');
                const icon = targetLi.querySelector('.file-icon');
                if (icon) {
                    icon.textContent = targetLi.classList.contains('collapsed') ? 'folder' : 'folder_open';
                }
            }
        });
    }

    // ===== INICIO: LISTENERS DE CARGA DE CARPETA MÓVIL (AÑADIDO) =====
    if (mobileFolderBtn && folderInput) {
        mobileFolderBtn.addEventListener('click', () => {
            folderInput.click();
        });

        folderInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            foldersList.innerHTML = '';
            folderPlaylist = [];
            lrcMap.clear();

            // ===== INICIO DE CÓDIGO MODIFICADO =====
            currentPlaylistSource = 'folder';
            if (searchResultsList) searchResultsList.innerHTML = '<li class="empty-message">Busca para ver resultados.</li>';
            // ===== FIN DE CÓDIGO MODIFICADO =====

            const fileTree = {}; // Objeto para construir el árbol

            for (const file of files) {
                // webkitRelativePath es la clave: "Carpeta/Subcarpeta/cancion.mp3"
                const path = file.webkitRelativePath;
                
                if (!path) {
                    // Fallback si webkitRelativePath no está disponible
                    // Tratarlo como una lista plana
                    if (isAudioFile(file.name)) {
                        createAudioEntryUI(file, foldersList);
                    } else if (file.name.toLowerCase().endsWith('.lrc')) {
                        const baseName = file.name.replace(/\.lrc$/i, "");
                        lrcMap.set(baseName, file);
                    }
                    continue; // Saltar al siguiente archivo
                }
                
                const parts = path.split('/');
                let currentLevel = fileTree;

                // Recorrer las carpetas (todas menos la última parte, que es el archivo)
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!currentLevel[part]) {
                        currentLevel[part] = {}; // Crear el objeto de subcarpeta si no existe
                    }
                    currentLevel = currentLevel[part]; // Moverse al siguiente nivel
                }

                // Añadir el archivo al nivel actual (en una lista _files)
                const fileName = parts[parts.length - 1];
                if (!currentLevel._files) {
                    currentLevel._files = [];
                }
                currentLevel._files.push(file);
            }

            // Si se usó el fallback, fileTree estará vacío, no hacer nada más
            if (Object.keys(fileTree).length > 0) {
                // Renderizar el árbol desde la raíz
                renderFolderTree(fileTree, foldersList);
            }
            
            // Limpiar el valor del input para permitir recargar la misma carpeta
            e.target.value = null; 
        });
    }
    // ===== FIN: LISTENERS DE CARGA DE CARPETA MÓVIL =====


    // Listener de Temas
    themeOptionsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('color-swatch')) {
            const themeName = target.dataset.theme;
            const selectedTheme = themes[themeName];
            if (selectedTheme) {
                // AÑADIDO: Desactiva el tema dinámico si se elige uno manual
                if (dynamicThemeToggle) {
                    dynamicThemeToggle.checked = false;
                    isDynamicThemeActive = false;
                    localStorage.setItem('dynamicThemeActive', 'false');
                }
                
                applyThemeVariables(selectedTheme, themeName);
                document.querySelectorAll('.color-swatch').forEach(btn => {
                    btn.classList.remove('active');
                });
                target.classList.add('active');
            }
        }
    });

    // Listener de Estilo de Progreso
    progressStyleOptions.addEventListener('click', (event) => {
        const target = event.target.closest('.style-swatch');
        if (target) {
            const styleName = target.dataset.style;
            applyProgressStyle(styleName);
        }
    });

    // Listener de Sensibilidad
    sensitivitySlider.addEventListener('input', (event) => {
        sensitivityMultiplier = event.target.value / 100;
        root.style.setProperty('--sensitivity-multiplier', sensitivityMultiplier);
        localStorage.setItem('userSensitivity', sensitivityMultiplier.toString());
    });
    
    // Listener de Alineación de Letras
    if (lyricsAlignOptions) {
        lyricsAlignOptions.addEventListener('click', (event) => {
            const target = event.target.closest('.style-swatch');
            if (target && target.dataset.align) {
                applyLyricAlignment(target.dataset.align, true);
            }
        });
    }

    // ===== INICIO DE LISTENERS BARRA LATERAL (AÑADIDO) =====
    if (sidebarOpenBtn) {
        sidebarOpenBtn.addEventListener('click', openSidebar);
    }
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    if (panelToggleList) {
        panelToggleList.addEventListener('change', (event) => {
            const target = event.target;
            if (target.classList.contains('panel-toggle') && target.dataset.target) {
                setPanelVisibility(target.dataset.target, target.checked);
                savePanelVisibility();
            }
        });
    }
    // ===== FIN DE LISTENERS BARRA LATERAL (AÑADIDO) =====


    // ===== INICIO DE LISTENERS AÑADIDOS (EQ y Tema Dinámico) =====
    
    // Listener de Tema Dinámico
    if (dynamicThemeToggle) {
        dynamicThemeToggle.addEventListener('change', () => {
            isDynamicThemeActive = dynamicThemeToggle.checked;
            localStorage.setItem('dynamicThemeActive', isDynamicThemeActive);
            
            if (isDynamicThemeActive && audioPlayer.src && albumArtContainer.style.backgroundImage) {
                // Si hay una carátula cargada, aplica el tema dinámico
                let currentArt = albumArtContainer.style.backgroundImage;
                // Limpiar el 'url("...")'
                currentArt = currentArt.replace('url("', '').replace('")', '');
                
                extractAndApplyDynamicTheme(currentArt);
                
            } else if (!isDynamicThemeActive) {
                // Si se desactiva, revierte al tema estático guardado
                const savedThemeName = localStorage.getItem('userTheme') || 'theme-dark';
                applyThemeVariables(themes[savedThemeName], savedThemeName);
            }
        });
    }

    // Listeners de Ecualizador
    if (eqOpenBtn) {
        eqOpenBtn.addEventListener('click', openEqModal);
    }
    if (eqCloseBtn) {
        eqCloseBtn.addEventListener('click', closeEqModal);
    }
    if (eqOverlay) {
        eqOverlay.addEventListener('click', closeEqModal);
    }
    if (eqPresetsSelect) {
        eqPresetsSelect.addEventListener('change', applyEQPreset);
    }
    // ===== FIN DE LISTENERS AÑADIDOS (EQ y Tema Dinámico) =====


    // ===== INICIO DE LISTENERS AÑADIDOS (Letras) =====
    // Listener de Fuente de Letras
    if (lyricsFontSelect) {
        lyricsFontSelect.addEventListener('change', (event) => {
            applyLyricFont(event.target.value, true);
        });
    }

    // Listener de Efecto de Letras
    if (lyricsEffectSelect) {
        lyricsEffectSelect.addEventListener('change', (event) => {
            applyLyricEffect(event.target.value, true);
        });
    }

    // Listener de Botón Reintentar Letras (AÑADIDO)
    if (retryLyricsBtn) {
        retryLyricsBtn.addEventListener('click', retryLyricSearch);
    }
    // ===== FIN DE LISTENERS AÑADIDOS (Letras) =====
    
    // ===== INICIO LISTENERS RAVE SYNC (MODIFICADO) =====
    // Esta es la corrección clave para el "autoplay"
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', () => {
            // Desbloquear el audio con esta acción del usuario
            initAudioContext(); 
            
            isHost = true;
            connectToSyncServer();
        });
    }
    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', () => {
            if (joinRoomInput && joinRoomInput.value.trim().length > 0) {
                // Desbloquear el audio con esta acción del usuario
                initAudioContext(); 
                
                isHost = false;
                connectToSyncServer(joinRoomInput.value.trim());
            } else {
                alert("Por favor, introduce un código de sala para unirte.");
            }
        });
    }
    // ===== FIN LISTENERS RAVE SYNC (MODIFICADO) =====

    // ===== INICIO DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    // ===== INICIO DE MODIFICACIÓN (Petición del usuario) =====
    if (searchResultsList) {
        searchResultsList.addEventListener('click', playOnlinePlaylist); // <<-- CAMBIADO
    }
    // ===== FIN DE MODIFICACIÓN (Petición del usuario) =====
    // ===== FIN DE CÓDIGO AÑADIDO (ONLINE SEARCH) =====


    // Listeners de Audio (ACTUALIZADO)
    
    // ACTUALIZADO: Manejar audio y lrc, y setear source
    fileInput.addEventListener('change', (event) => {
        lrcMap.clear(); // Limpiar mapa de letras
        const files = Array.from(event.target.files);
        const audioFiles = [];
        
        files.forEach(file => {
            if (isAudioFile(file.name)) {
                audioFiles.push(file);
            } else if (file.name.toLowerCase().endsWith('.lrc')) {
                const baseName = file.name.replace(/\.lrc$/i, "");
                lrcMap.set(baseName, file);
            }
        });

        playlist = audioFiles; // Establecer playlist global
        
        // ===== INICIO DE CÓDIGO MODIFICADO =====
        currentPlaylistSource = 'local'; // Setear la fuente
        if (searchResultsList) searchResultsList.innerHTML = '<li class="empty-message">Busca para ver resultados.</li>';
        // ===== FIN DE CÓDIGO MODIFICADO =====

        if (playlist.length > 0) {
            initAudioContext();
            loadTrack(0, true);
        }
    });

    playlistList.addEventListener('click', (event) => {
        // ===== INICIO SYNC (AÑADIDO) =====
        if (!isHost && currentRoomId) return; // Bloquear cliente
        // ===== FIN SYNC =====
        
        // ===== INICIO DE CÓDIGO MODIFICADO =====
        // Si la playlist es online, esta UI no debería hacer nada
        if (currentPlaylistSource === 'online') return;
        // ===== FIN DE CÓDIGO MODIFICADO =====

        const li = event.target.closest('li');
        if (li && li.dataset.index && !li.classList.contains('empty-message')) {
            const index = parseInt(li.dataset.index);
            if (index !== currentTrackIndex) {
                loadTrack(index, true);
            } else {
                audioPlayer.play().catch(() => {});
            }
        }
    });

    playPauseBtn.addEventListener('click', () => {
        // ===== INICIO SYNC (AÑADIDO) =====
        if (!isHost && currentRoomId) { // Bloquear cliente
            console.log("Controles deshabilitados (Modo Cliente)");
            return;
        }
        // ===== FIN SYNC =====
        
        if (playlist.length === 0) {
            alert("Por favor, selecciona archivos de música (MP3/WAV) o busca online.");
            return;
        }
        if (audioPlayer.paused) {
            initAudioContext();
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
    
    if (repeatBtn) {
        repeatBtn.addEventListener('click', toggleRepeatMode);
    }
    
    if (skipBackBtn) {
        skipBackBtn.addEventListener('click', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            
            if (audioPlayer) {
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
            }
        });
    }

    if (skipForwardBtn) {
        skipForwardBtn.addEventListener('click', () => {
            // ===== INICIO SYNC (AÑADIDO) =====
            if (!isHost && currentRoomId) return; // Bloquear cliente
            // ===== FIN SYNC =====
            
            if (audioPlayer) {
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        // ===== INICIO SYNC (AÑADIDO) =====
        if (!isHost && currentRoomId) return; // Bloquear cliente
        // ===== FIN SYNC =====
        
        if (playlist.length > 0) {
            let nextIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(nextIndex, true);
        }
    });

    prevBtn.addEventListener('click', () => {
        // ===== INICIO SYNC (AÑADIDO) =====
        if (!isHost && currentRoomId) return; // Bloquear cliente
        // ===== FIN SYNC =====
        
        if (playlist.length > 0) {
            let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(prevIndex, true);
        }
    });
    
    // ===== INICIO SYNC (AÑADIDO) =====
    // Listener para cuando el HOST busca (seek) manualmente
    audioPlayer.addEventListener('seeked', () => {
        if (isHost && currentRoomId) {
             // Solo envía el sync si el 'seek' ocurrió
            sendFullSyncState();
        }
    });
    // ===== FIN SYNC =====

    // ACTUALIZADO: Añadido sincronizador de letras
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration > 0) {
             const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
             progressLine.style.width = `${progress}%`;
        }
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);

        // MODIFICADO: Solo sincroniza si currentLyrics tiene datos (de LRC)
        if (currentLyrics.length > 0 && lyricsList) {
            const currentTime = audioPlayer.currentTime;
            
            // Encontrar el índice de la línea actual
            let newIndex = currentLyrics.findIndex(line => line.time > currentTime) - 1;
            
            if (newIndex < 0) {
                // Si no hay ninguna línea mayor, puede ser la última línea
                if (currentTime >= currentLyrics[currentLyrics.length - 1].time) {
                    newIndex = currentLyrics.length - 1;
                } else {
                    newIndex = -1; // Antes de la primera línea
                }
            }

            if (newIndex !== currentLyricIndex) {
                currentLyricIndex = newIndex;
                
                // Quitar clase activa de la línea anterior
                const oldActive = lyricsList.querySelector('li.active');
                if (oldActive) {
                    oldActive.classList.remove('active');
                }
                
                // Añadir clase activa a la línea nueva
                if (newIndex >= 0) {
                    const newActive = lyricsList.querySelector(`li[data-index="${newIndex}"]`);
                    if (newActive) {
                        newActive.classList.add('active');
                        // Centrar la línea activa en el panel
                        newActive.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            }
        }
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('play', () => {
        playIcon.textContent = 'pause';
        requestAnimationFrame(visualize);
        
        // ===== INICIO SYNC (AÑADIDO) =====
        if (isHost && currentRoomId) {
            sendFullSyncState();
            startSyncInterval();
        }
        // ===== FIN SYNC =====
    });

    audioPlayer.addEventListener('pause', () => {
        playIcon.textContent = 'play_arrow';
        
        // ===== INICIO SYNC (AÑADIDO) =====
        if (isHost && currentRoomId) {
            sendFullSyncState();
            stopSyncInterval();
        }
        // ===== FIN SYNC =====
    });
    
    // MODIFICADO: Limpia el footer cuando la playlist termina
    audioPlayer.addEventListener('ended', () => {
        if (playlist.length > 0) {
            let nextIndex = (currentTrackIndex + 1);
            if (repeatMode === 'all') {
                nextIndex %= playlist.length;
                loadTrack(nextIndex, true);
            } else { // 'none'
                if (nextIndex < playlist.length) {
                    loadTrack(nextIndex, true);
                } else {
                    audioPlayer.currentTime = 0;
                    progressLine.style.width = '0%';
                    playIcon.textContent = 'play_arrow';
                    currentTrackIndex = -1;
                    updatePlaylistUI();
                    if (headerSongTitle) headerSongTitle.textContent = 'No hay canción';
                    if (footerSongTitle) footerSongTitle.textContent = '--'; // <-- FOOTER
                    if (footerLyricPhrase) footerLyricPhrase.textContent = '...'; // <-- FOOTER
                }
            }
        } else {
            audioPlayer.currentTime = 0;
            progressLine.style.width = '0%';
            playIcon.textContent = 'play_arrow';
            if (headerSongTitle) headerSongTitle.textContent = 'No hay canción';
            if (footerSongTitle) footerSongTitle.textContent = '--'; // <-- FOOTER
            if (footerLyricPhrase) footerLyricPhrase.textContent = '...'; // <-- FOOTER
        }
    });
    
    progressBarContainer.addEventListener('click', (e) => {
        // ===== INICIO SYNC (AÑADIDO) =====
        if (!isHost && currentRoomId) return; // Bloquear cliente
        // ===== FIN SYNC =====
        
        if (audioPlayer.duration > 0) {
            const clickX = e.clientX - progressBarContainer.getBoundingClientRect().left;
            const width = progressBarContainer.clientWidth;
            const seekTime = (clickX / width) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
    });

    requestAnimationFrame(visualize);
    
    // DRAG AND DROP (ACTUALIZADO)
    let draggingCard = null;
    // ===== INICIO DE CÓDIGO MODIFICADO (Añadir .search-panel) =====
    const draggableCards = document.querySelectorAll('.player-card, .playlist-panel, .color-selector, .lyrics-panel');
    draggableCards.forEach(card => {
    // ===== FIN DE CÓDIGO MODIFICADO =====
        card.addEventListener('dragstart', (e) => {
            draggingCard = card;
            setTimeout(() => card.classList.add('dragging'), 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggingCard = null;
        });
        card.addEventListener('dragenter', (e) => {
            e.preventDefault();
            if (card !== draggingCard) {
                const reference = getDragAfterElement(mainContainer, e.clientX);
                if (reference == null) {
                    mainContainer.appendChild(draggingCard);
                } else {
                    mainContainer.insertBefore(draggingCard, reference);
                }
            }
        });
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        card.addEventListener('dragleave', () => {});
    });

    // ACTUALIZADO: Incluir .lyrics-panel y .search-panel en el querySelectorAll
    function getDragAfterElement(container, x) {
        // ===== INICIO DE CÓDIGO MODIFICADO (Añadir .search-panel) =====
        const draggableCards = [...container.querySelectorAll('.player-card:not(.dragging), .playlist-panel:not(.dragging), .color-selector:not(.dragging), .lyrics-panel:not(.dragging)')];
        // ===== FIN DE CÓDIGO MODIFICADO =====
        return draggableCards.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2; 
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});


// ====================================================================
// K. FUNCIONES RAVE SYNC (ACTUALIZADO CON AMBAS CORRECCIONES)
// ====================================================================

/**
 * Habilita o deshabilita los controles del reproductor para el modo cliente.
 */
function setClientMode(isClient) {
    const clientMessage = isClient ? "Controles deshabilitados (Modo Cliente)" : "";

    if (playPauseBtn) {
        playPauseBtn.disabled = isClient;
        playPauseBtn.title = clientMessage;
    }
    if (nextBtn) {
        nextBtn.disabled = isClient;
        nextBtn.title = clientMessage;
    }
    if (prevBtn) {
        prevBtn.disabled = isClient;
        prevBtn.title = clientMessage;
    }
    if (skipBackBtn) {
        skipBackBtn.disabled = isClient;
        skipBackBtn.title = clientMessage;
    }
    if (skipForwardBtn) {
        skipForwardBtn.disabled = isClient;
        skipForwardBtn.title = clientMessage;
    }
    if (repeatBtn) {
        repeatBtn.disabled = isClient;
        repeatBtn.title = clientMessage;
    }
    
    if (playlistList) {
        playlistList.style.pointerEvents = isClient ? 'none' : 'auto';
        playlistList.style.opacity = isClient ? 0.7 : 1;
    }
    if (progressBarContainer) {
        progressBarContainer.style.pointerEvents = isClient ? 'none' : 'auto';
        progressBarContainer.style.opacity = isClient ? 0.7 : 1;
    }
    if (foldersList) {
        // Deshabilitar clics en la lista de carpetas
        foldersList.style.pointerEvents = isClient ? 'none' : 'auto';
        foldersList.style.opacity = isClient ? 0.7 : 1;
    }

    // ===== INICIO DE CÓDIGO AÑADIDO (Deshabilitar Búsqueda) =====
    if (searchResultsList) {
        searchResultsList.style.pointerEvents = isClient ? 'none' : 'auto';
        searchResultsList.style.opacity = isClient ? 0.7 : 1;
    }
    if (searchBtn) {
        searchBtn.disabled = isClient;
        searchBtn.title = clientMessage;
    }
    if (searchInput) {
        searchInput.disabled = isClient;
        searchInput.placeholder = isClient ? "Controles deshabilitados" : "Buscar canción por nombre...";
    }
    // ===== FIN DE CÓDIGO AÑADIDO =====
}

/**
 * Envía la carga útil (payload) a todos en la sala.
 */
function sendToRoom(payload) {
    if (ws && ws.readyState === WebSocket.OPEN && currentRoomId) {
        ws.send(JSON.stringify({
            type: 'relay-message',
            roomId: currentRoomId,
            payload: payload
        }));
    }
}

/**
 * (HOST) Envía el estado completo de reproducción a la sala.
 * ===== ESTA ES LA FUNCIÓN MODIFICADA (V3 - Online Sync) =====
 */
function sendFullSyncState() {
    if (!isHost || !currentRoomId || currentTrackIndex < 0) return;

    const currentTrack = playlist[currentTrackIndex];
    if (!currentTrack) return;
    
    let state = {
        type: 'full-sync',
        trackIndex: currentTrackIndex,
        currentTime: audioPlayer.currentTime,
        isPlaying: !audioPlayer.paused,
        trackName: currentTrack.name, // Ya sea local o online, .name existe
        source: currentPlaylistSource // <-- NUEVO ('local', 'folder', 'online')
    };

    // Si la fuente es 'online', debemos enviar la playlist completa (lista de URLs)
    if (currentPlaylistSource === 'online') {
        // 'playlist' es un array de {name, url, isOnline}
        state.onlinePlaylistUrls = playlist.map(track => track.url);
    }
    
    sendToRoom(state);
}


/**
 * (HOST) Inicia el intervalo de sincronización.
 */
function startSyncInterval() {
    if (!isHost) return;
    stopSyncInterval(); // Limpiar el anterior si existe
    syncInterval = setInterval(sendFullSyncState, 3000); // Sincronizar cada 3 segundos
}

/**
 * (HOST) Detiene el intervalo de sincronización.
 */
function stopSyncInterval() {
    if (syncInterval) {
        clearInterval(syncInterval);
    }
    syncInterval = null;
}

/**
 * (CLIENTE) Maneja un mensaje de 'full-sync' entrante del host.
 * ===== ESTA ES LA FUNCIÓN MODIFICADA (V3 - Online Sync) =====
 */
function handleSyncState(payload) {
    if (isHost) return; // El host no debe escucharse a sí mismo

    // Desestructurar el payload COMPLETO
    const { 
        trackIndex, 
        currentTime, 
        isPlaying, 
        trackName, 
        source, // <-- NUEVO
        onlinePlaylistUrls // <-- NUEVO (puede ser undefined)
    } = payload;


    // ===== INICIO: RECONSTRUCCIÓN DE PLAYLIST (NUEVO) =====
    
    // Si el Host está online, el Cliente DEBE estar online.
    if (source === 'online') {
        if (!onlinePlaylistUrls || onlinePlaylistUrls.length === 0) {
            console.warn("Sync: El Host está online pero no envió la playlist.");
            return;
        }
        
        // Comprobar si la playlist local ya es la correcta
        // (Comprobando la URL de la primera canción)
        const firstTrackUrl = (playlist[0] && playlist[0].isOnline) ? playlist[0].url : null;
        
        if (firstTrackUrl !== onlinePlaylistUrls[0]) {
            console.log("Sync: Reconstruyendo playlist online del Host...");
            // RECONSTRUIR la playlist global del cliente
            playlist = onlinePlaylistUrls.map(url => ({
                // Decodificar el nombre de la URL (ej. "04%20-%20Shape%20of%20You.mp3" -> "04 - Shape of You.mp3")
                name: decodeURIComponent(url.split('/').pop()).replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
                isOnline: true,
                url: url
            }));
            
            // Actualizar la UI para reflejar que estamos en modo online
            currentPlaylistSource = 'online';
            if (playlistList) playlistList.innerHTML = '<li class="empty-message">Sincronizado (Online)...</li>';
            if (foldersList) foldersList.innerHTML = '<li class="empty-message">Carga local deshabilitada.</li>';
            updatePlaylistUI(); // Actualizar la lista de reproducción
        }
    
    // Si el Host está local, el Cliente DEBE estar local.
    } else { // source === 'local' or 'folder'
        if (currentPlaylistSource === 'online') {
            console.warn("Sync: Desincronizado. Host está en modo Local, pero tú estás en Online.");
            if (syncStatusElement) syncStatusElement.textContent = `Error: Host está en Local. Recarga tus archivos locales.`;
            // Detener la lógica de sincronización aquí
            return;
        }
        // Si ambos están en 'local' o 'folder', la lógica continúa.
        currentPlaylistSource = source; 
    }
    // ===== FIN: RECONSTRUCCIÓN DE PLAYLIST =====


    // Verificación de seguridad (igual que antes)
    const localTrack = playlist[trackIndex];
    if (!localTrack) {
        console.warn(`Sync: El Host está en trackIndex ${trackIndex}, pero no lo tenemos.`);
        if (syncStatusElement) syncStatusElement.textContent = `Error: Desincronizado (Falta Track ${trackIndex+1})`;
        return;
    }
    
    // Comparar por nombre
    // NOTA: 'trackName' del payload es el .name legible (ej: "04 - Shape of You")
    // 'localTrack.name' también es el .name legible. Esto debería coincidir.
    if (localTrack.name !== trackName) {
        console.warn(`Sync: Desajuste de nombres. Host: ${trackName}, Local: ${localTrack.name}`);
        if (syncStatusElement) syncStatusElement.textContent = `Alerta: ¿Listas diferentes?`;
    }

    // ===== INICIO DE LA CORRECCIÓN DE LÓGICA (V2 - Sin cambios) =====

    /**
     * Esta función aplica el estado del Host (tiempo y play/pause).
     */
    const applyState = (isNewTrack = false) => {
        
        // 1. Sincronizar tiempo
        const timeDifference = Math.abs(audioPlayer.currentTime - currentTime);
        
        if (isNewTrack || timeDifference > 1.5) {
            console.log(`Sync: Ajustando tiempo (Host: ${currentTime}, Local: ${audioPlayer.currentTime})`);
            audioPlayer.currentTime = currentTime;
        }

        // 2. Sincronizar estado de reproducción
        if (isPlaying && audioPlayer.paused) {
            audioPlayer.play().catch(e => {
                console.warn("Sync: El navegador bloqueó el auto-play. El usuario debe hacer clic.");
                if (syncStatusElement) syncStatusElement.textContent = "¡Haz clic para iniciar el audio!";
            });
        } else if (!isPlaying && !audioPlayer.paused) {
            audioPlayer.pause();
        }
    };

    // DECISIÓN: ¿Es una canción nueva o solo un update de tiempo?
    if (currentTrackIndex !== trackIndex) {
        // --- CASO 1: Es una canción NUEVA ---
        
        const onTrackLoaded = () => {
            console.log("Sync: Nueva canción cargada por el Host. Aplicando estado.");
            applyState(true); 
            audioPlayer.removeEventListener('loadedmetadata', onTrackLoaded);
        };
        
        audioPlayer.addEventListener('loadedmetadata', onTrackLoaded);
        
        // Iniciar la carga de la canción (sin autoPlay)
        loadTrack(trackIndex, false); 
        
    } else {
        // --- CASO 2: Es la MISMA canción ---
        applyState(false);
    }
    
    // ===== FIN DE LA CORRECCIÓN DE LÓGICA (V2) =====

    if (syncStatusElement) syncStatusElement.textContent = `Sincronizado (Host) - ${isPlaying ? "Play" : "Pausa"}`;
}

// =========================================================================
// ===== INICIO DE LA SECCIÓN MODIFICADA (CORRECCIÓN BLOB/JSON) =====
// =========================================================================

/**
 * Maneja los mensajes entrantes del servidor WebSocket.
 * * CORRECCIÓN: Se reemplaza el chequeo 'instanceof Blob' por 'typeof message.data !== "string"' 
 * ===== MODIFICADO (V3 - Alerta de 'room-joined') =====
 */
function handleServerMessage(message) {
    
    // Función interna para manejar la lógica de los mensajes relevados (sincronización)
    const handleRelayMessage = (payload) => {
        if (payload && payload.type === 'full-sync') {
            handleSyncState(payload);
        }
    };
    
    // Función interna para manejar las respuestas directas del servidor (crear/unirse a sala, errores)
    const handleServerResponse = (data) => {
        switch (data.type) {
            case 'room-created':
                currentRoomId = data.roomId;
                if (roomCodeDisplay) roomCodeDisplay.value = currentRoomId;
                if (syncStatusElement) syncStatusElement.textContent = 'Sala creada. ¡Comparte el código!';
                setClientMode(false); // Es Host
                if (createRoomBtn) createRoomBtn.disabled = true;
                if (joinRoomBtn) joinRoomBtn.disabled = true;
                break;
                
            case 'room-joined':
                currentRoomId = data.roomId;
                if (roomCodeDisplay) roomCodeDisplay.value = currentRoomId;
                if (syncStatusElement) syncStatusElement.textContent = 'Unido a la sala. Esperando al Host...';
                if (joinRoomInput) joinRoomInput.value = '';
                setClientMode(true); // Es Cliente
                if (createRoomBtn) createRoomBtn.disabled = true;
                if (joinRoomBtn) joinRoomBtn.disabled = true;
                
                // --- ALERTA MODIFICADA ---
                alert(`¡Te has unido a la sala ${currentRoomId}!\n\nSincronizando con el Host...
                \n- Si el Host usa música LOCAL, asegúrate de cargar la MISMA playlist.
                \n- Si el Host usa música ONLINE, se cargará automáticamente.`);
                break;
                
            case 'client-joined':
                // (HOST) Alguien se unió.
                if (syncStatusElement) syncStatusElement.textContent = '¡Alguien se unió!';
                console.log("Sync: Cliente unido. Enviando estado actual...");
                // Solo enviar estado si ya hay una playlist cargada
                if (playlist.length > 0) {
                    sendFullSyncState(); 
                }
                break;
                
            case 'client-left':
                if (syncStatusElement) syncStatusElement.textContent = 'Alguien se fue.';
                break;
                
            case 'error':
                console.error('Sync Error:', data.message);
                alert(`Error del servidor: ${data.message}`);
                if (syncStatusElement) syncStatusElement.textContent = `Error: ${data.message}`;
                break;
        }
    };

    // --- Lógica principal de manejo de mensajes (Sin cambios) ---
    
    // Si no es una cadena (ej. Blob o ArrayBuffer), debe ser leído asíncronamente.
    if (typeof message.data !== 'string') {
        const reader = new FileReader();
        reader.onload = function() {
            try {
                // El resultado (reader.result) ahora es una cadena JSON
                const data = JSON.parse(reader.result);
                
                if (data.type === 'relay-message') {
                    // Los mensajes de sincronización del Host (que venían como Blob)
                    handleRelayMessage(data.payload);
                } else {
                    // Respuestas directas del servidor (que venían como Blob)
                    handleServerResponse(data);
                }
            } catch (e) {
                console.error("Error al parsear mensaje del WS (Blob/ArrayBuffer):", e, reader.result); 
            }
        };
        // Leer el objeto binario como texto.
        reader.readAsText(message.data);
        return; // Salir de la función, la lógica asíncrona se encargará
    }
    
    // Si es una cadena, intentamos parsear directamente
    try {
        const data = JSON.parse(message.data);
        
        if (data.type === 'relay-message') {
             // Si el servidor envía el mensaje relevado como string
             handleRelayMessage(data.payload);
        } else {
            // Respuestas directas del servidor (ej. 'room-created' como string)
            handleServerResponse(data);
        }
    } catch (e) {
        // Aquí es donde ocurría tu error original
        console.error("Error al parsear mensaje del WS (String):", e, message.data);
    }
}

// =======================================================================
// ===== FIN DE LA SECCIÓN MODIFICADA (CORRECCIÓN BLOB/JSON) =====
// =======================================================================


/**
 * Inicia la conexión con el servidor de señalización.
 * ===== ESTA ES LA FUNCIÓN MODIFICADA (V3 - Online Sync) =====
 */
function connectToSyncServer(roomIdToJoin = null) {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        alert("Ya estás conectado o conectándote a una sala.");
        return;
    }
    
    // ===== INICIO MODIFICACIÓN (Eliminar chequeo de playlist) =====
    /* Se elimina el chequeo 'if (playlist.length === 0)'.
    El cliente que se une a una sala ONLINE no necesita tener 
    una playlist local. El Host puede crear la sala antes de cargar 
    su playlist. La lógica de 'handleSyncState' forzará la 
    playlist correcta en el cliente.
    */
    // ===== FIN MODIFICACIÓN =====

    if (syncStatusElement) syncStatusElement.textContent = 'Conectando al servidor...';
    
    try {
        ws = new WebSocket(SYNC_SERVER_URL);
    } catch (e) {
        console.error("Error al crear WebSocket:", e);
        if (syncStatusElement) syncStatusElement.textContent = 'Error: No se pudo conectar.';
        return;
    }

    ws.onopen = () => {
        if (syncStatusElement) syncStatusElement.textContent = 'Conectado. Creando/Uniéndose a sala...';
        
        if (isHost) {
            // Crear una sala
            ws.send(JSON.stringify({ type: 'create-room' }));
        } else if (roomIdToJoin) {
            // Unirse a una sala
            ws.send(JSON.stringify({ type: 'join-room', roomId: roomIdToJoin.toUpperCase() }));
        }
    };

    // AQUÍ es donde se asigna la función corregida
    ws.onmessage = handleServerMessage;

    ws.onclose = () => {
        console.log("Sync: Conexión cerrada.");
        if (syncStatusElement) syncStatusElement.textContent = 'Estado: Desconectado';
        if (roomCodeDisplay) roomCodeDisplay.value = '';
        stopSyncInterval();
        setClientMode(false); // Habilitar controles de nuevo
        currentRoomId = null;
        isHost = false;
        ws = null;
        if (createRoomBtn) createRoomBtn.disabled = false;
        if (joinRoomBtn) joinRoomBtn.disabled = false;
    };

    ws.onerror = (err) => {
        console.error("Sync: Error de WebSocket:", err);
        if (syncStatusElement) syncStatusElement.textContent = 'Error de conexión.';
        stopSyncInterval();
        setClientMode(false);
        if (createRoomBtn) createRoomBtn.disabled = false;
        if (joinRoomBtn) joinRoomBtn.disabled = false;
        ws = null;
    };
}
