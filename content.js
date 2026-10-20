// StickItUP! Content Script v2.0.0

let notes = [];
let isDarkMode = false;
let globallyHidden = false;
let urlMatchSetting = 'exact';

const init = async () => {
    const data = await chrome.storage.local.get(['notes', 'darkMode', 'globallyHidden', 'urlMatchSetting']);
    notes = data.notes || [];
    isDarkMode = data.darkMode || false;
    globallyHidden = data.globallyHidden || false;
    urlMatchSetting = data.urlMatchSetting || 'exact';

    renderNotes();
    applyTheme();
};

const applyTheme = () => {
    document.body.classList.remove('siu-dark', 'siu-light');
    document.body.classList.add(isDarkMode ? 'siu-dark' : 'siu-light');
};

const shouldShowNoteOnPage = (note, currentUrl, matchSetting) => {
    try {
        if (!note.url) return false;
        const cleanUrl = (urlStr) => {
            const url = new URL(urlStr);
            return url.origin + url.pathname.replace(/\/$/, '') + url.search;
        };
        const currentClean = cleanUrl(currentUrl);
        const noteClean = cleanUrl(note.url);

        if (matchSetting === 'exact') {
            return currentClean === noteClean;
        } else if (matchSetting === 'domain') {
            return new URL(currentUrl).origin === new URL(note.url).origin;
        }
        return currentClean === noteClean;
    } catch (e) {
        return note.url === currentUrl;
    }
};

const renderNotes = () => {
    document.querySelectorAll('.siu-note').forEach(n => n.remove());
    if (globallyHidden) return;
    const currentUrl = window.location.href;
    notes.forEach(note => {
        if (shouldShowNoteOnPage(note, currentUrl, urlMatchSetting)) {
            createNoteElement(note);
        }
    });
};

const getFontClassName = (font) => {
    if (!font) return 'siu-font-outfit';
    if (font.includes('Caveat')) return 'siu-font-caveat';
    if (font.includes('Lora') || font.includes('Playfair')) return 'siu-font-playfair';
    if (font.includes('JetBrains') || font.includes('Fira')) return 'siu-font-fira';
    return 'siu-font-outfit';
};

// SVG Icons
const icons = {
    delete: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    color: `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2v-1.5c0-.8.7-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-4.4-4-9-9-9zM6.5 12A1.5 1.5 0 1 1 8 10.5 1.5 1.5 0 0 1 6.5 12zm3-4A1.5 1.5 0 1 1 11 6.5 1.5 1.5 0 0 1 9.5 8zm5 0A1.5 1.5 0 1 1 16 6.5 1.5 1.5 0 0 1 14.5 8zm3 4A1.5 1.5 0 1 1 19 10.5 1.5 1.5 0 0 1 17.5 12z"/></svg>`,
    edit: `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    pinActive: `<svg viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>`,
    pinInactive: `<svg viewBox="0 0 24 24"><path d="M14 4v5c0 1.12.37 2.16 1 3H9c.65-.86 1-1.9 1-3V4h4m3-2H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h1v4c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/></svg>`,
    collapseActive: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
    collapseInactive: `<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>`
};

const createNoteElement = (note) => {
    const el = document.createElement('div');
    el.className = 'siu-note';
    el.id = `siu-note-${note.id}`;

    el.style.left = `${note.x}px`;
    el.style.top = `${note.y}px`;
    if (note.width) el.style.width = `${note.width}px`;
    if (note.height) el.style.height = `${note.height}px`;
    el.style.background = note.color || '#ffffff';

    if (note.isPinned) el.classList.add('siu-pinned');
    if (note.isCollapsed) el.classList.add('siu-collapsed');

    el.innerHTML = `
        <div class="siu-note-header">
            <div class="siu-note-controls">
                <button class="siu-control-btn siu-delete" title="Delete">${icons.delete}</button>
                <button class="siu-control-btn siu-color" title="Theme">${icons.color}</button>
                <button class="siu-control-btn siu-customize-toggle" title="Customize">${icons.edit}</button>
                <button class="siu-control-btn siu-pin-btn ${note.isPinned ? 'active' : ''}" title="${note.isPinned ? 'Unpin' : 'Pin'}">${note.isPinned ? icons.pinActive : icons.pinInactive}</button>
                <button class="siu-control-btn siu-collapse-btn ${note.isCollapsed ? 'active' : ''}" title="${note.isCollapsed ? 'Expand' : 'Collapse'}">${note.isCollapsed ? icons.collapseActive : icons.collapseInactive}</button>
            </div>
            <div class="siu-drag-handle"></div>
        </div>
        <textarea class="siu-note-body" placeholder="Write something...">${note.content || ''}</textarea>
        
        <div class="siu-color-picker" style="display: none;">
            <div class="siu-color-dot" style="background: #ffffff;" data-color="#ffffff" title="White"></div>
            <div class="siu-color-dot" style="background: #fdf2f8;" data-color="#fdf2f8" title="Pink"></div>
            <div class="siu-color-dot" style="background: #fef3c7;" data-color="#fef3c7" title="Yellow"></div>
            <div class="siu-color-dot" style="background: #ecfccb;" data-color="#ecfccb" title="Green"></div>
            <div class="siu-color-dot" style="background: #e0f2fe;" data-color="#e0f2fe" title="Blue"></div>
            <div class="siu-color-dot" style="background: #1c1c1e;" data-color="#1c1c1e" title="Dark"></div>
        </div>
        
        <div class="siu-customize-panel" style="display: none;">
            <div class="siu-panel-section">
                <label>Font</label>
                <select class="siu-font-select">
                    <option value="'Inter', sans-serif" ${note.fontFamily === "'Inter', sans-serif" ? 'selected' : ''}>Inter (Sans)</option>
                    <option value="'Caveat', cursive" ${note.fontFamily === "'Caveat', cursive" ? 'selected' : ''}>Caveat (Handwriting)</option>
                    <option value="'Lora', serif" ${note.fontFamily === "'Lora', serif" ? 'selected' : ''}>Lora (Serif)</option>
                    <option value="'JetBrains Mono', monospace" ${note.fontFamily === "'JetBrains Mono', monospace" ? 'selected' : ''}>JetBrains Mono</option>
                </select>
            </div>
            
            <div class="siu-panel-row">
                <div class="siu-panel-section">
                    <label>Size</label>
                    <div class="siu-size-controls">
                        <button class="siu-size-btn siu-size-dec">−</button>
                        <span class="siu-size-val">${note.fontSize || 14}px</span>
                        <button class="siu-size-btn siu-size-inc">+</button>
                    </div>
                </div>
                
                <div class="siu-panel-section">
                    <label>Style</label>
                    <div class="siu-style-controls">
                        <button class="siu-style-btn siu-btn-bold ${note.isBold ? 'active' : ''}">B</button>
                        <button class="siu-style-btn siu-btn-italic ${note.isItalic ? 'active' : ''}">I</button>
                        <button class="siu-style-btn siu-btn-underline ${note.isUnderline ? 'active' : ''}">U</button>
                    </div>
                </div>
            </div>
            
            <div class="siu-panel-section">
                <label>Align</label>
                <div class="siu-align-controls">
                    <button class="siu-align-btn siu-btn-left ${(!note.alignment || note.alignment === 'left') ? 'active' : ''}">L</button>
                    <button class="siu-align-btn siu-btn-center ${note.alignment === 'center' ? 'active' : ''}">C</button>
                    <button class="siu-align-btn siu-btn-right ${note.alignment === 'right' ? 'active' : ''}">R</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(el);

    const textarea = el.querySelector('.siu-note-body');
    textarea.className = `siu-note-body ${getFontClassName(note.fontFamily)}`;
    textarea.style.fontSize = `${note.fontSize || 14}px`;
    textarea.style.textAlign = note.alignment || 'left';
    textarea.style.fontWeight = note.isBold ? '600' : 'normal';
    textarea.style.fontStyle = note.isItalic ? 'italic' : 'normal';
    textarea.style.textDecoration = note.isUnderline ? 'underline' : 'none';

    makeDraggable(el, note.id);

    el.addEventListener('mouseup', () => {
        if (note.isPinned || note.isCollapsed) return;
        const newWidth = el.offsetWidth;
        const newHeight = el.offsetHeight;
        if (newWidth !== note.width || newHeight !== note.height) {
            updateNote(note.id, { width: newWidth, height: newHeight });
        }
    });

    textarea.addEventListener('input', (e) => updateNote(note.id, { content: e.target.value }));

    el.querySelector('.siu-delete').addEventListener('click', () => {
        deleteNote(note.id);
        el.remove();
    });

    const colorPicker = el.querySelector('.siu-color-picker');
    const customizePanel = el.querySelector('.siu-customize-panel');

    el.querySelector('.siu-color').addEventListener('click', () => {
        customizePanel.style.display = 'none';
        colorPicker.style.display = colorPicker.style.display === 'none' ? 'flex' : 'none';
    });

    el.querySelectorAll('.siu-color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.getAttribute('data-color');
            el.style.background = color;
            updateNote(note.id, { color });
            colorPicker.style.display = 'none';
        });
    });

    el.querySelector('.siu-customize-toggle').addEventListener('click', () => {
        colorPicker.style.display = 'none';
        customizePanel.style.display = customizePanel.style.display === 'none' ? 'flex' : 'none';
    });

    el.querySelector('.siu-font-select').addEventListener('change', (e) => {
        const fontFamily = e.target.value;
        textarea.className = `siu-note-body ${getFontClassName(fontFamily)}`;
        updateNote(note.id, { fontFamily });
    });

    const sizeVal = el.querySelector('.siu-size-val');
    el.querySelector('.siu-size-dec').addEventListener('click', () => {
        let currentSize = note.fontSize || 14;
        if (currentSize > 10) {
            currentSize -= 1;
            textarea.style.fontSize = `${currentSize}px`;
            sizeVal.textContent = `${currentSize}px`;
            updateNote(note.id, { fontSize: currentSize });
        }
    });

    el.querySelector('.siu-size-inc').addEventListener('click', () => {
        let currentSize = note.fontSize || 14;
        if (currentSize < 36) {
            currentSize += 1;
            textarea.style.fontSize = `${currentSize}px`;
            sizeVal.textContent = `${currentSize}px`;
            updateNote(note.id, { fontSize: currentSize });
        }
    });

    const boldBtn = el.querySelector('.siu-btn-bold');
    boldBtn.addEventListener('click', () => {
        const active = !boldBtn.classList.contains('active');
        boldBtn.classList.toggle('active');
        textarea.style.fontWeight = active ? '600' : 'normal';
        updateNote(note.id, { isBold: active });
    });

    const italicBtn = el.querySelector('.siu-btn-italic');
    italicBtn.addEventListener('click', () => {
        const active = !italicBtn.classList.contains('active');
        italicBtn.classList.toggle('active');
        textarea.style.fontStyle = active ? 'italic' : 'normal';
        updateNote(note.id, { isItalic: active });
    });

    const underlineBtn = el.querySelector('.siu-btn-underline');
    underlineBtn.addEventListener('click', () => {
        const active = !underlineBtn.classList.contains('active');
        underlineBtn.classList.toggle('active');
        textarea.style.textDecoration = active ? 'underline' : 'none';
        updateNote(note.id, { isUnderline: active });
    });

    const setAlignment = (align) => {
        textarea.style.textAlign = align;
        el.querySelector('.siu-btn-left').classList.toggle('active', align === 'left');
        el.querySelector('.siu-btn-center').classList.toggle('active', align === 'center');
        el.querySelector('.siu-btn-right').classList.toggle('active', align === 'right');
        updateNote(note.id, { alignment: align });
    };

    el.querySelector('.siu-btn-left').addEventListener('click', () => setAlignment('left'));
    el.querySelector('.siu-btn-center').addEventListener('click', () => setAlignment('center'));
    el.querySelector('.siu-btn-right').addEventListener('click', () => setAlignment('right'));

    const pinBtn = el.querySelector('.siu-pin-btn');
    pinBtn.addEventListener('click', () => {
        const active = !el.classList.contains('siu-pinned');
        el.classList.toggle('siu-pinned', active);
        pinBtn.classList.toggle('active', active);
        pinBtn.innerHTML = active ? icons.pinActive : icons.pinInactive;
        pinBtn.setAttribute('title', active ? 'Unpin' : 'Pin');
        updateNote(note.id, { isPinned: active });
    });

    const collapseBtn = el.querySelector('.siu-collapse-btn');
    collapseBtn.addEventListener('click', () => {
        const active = !el.classList.contains('siu-collapsed');
        el.classList.toggle('siu-collapsed', active);
        collapseBtn.classList.toggle('active', active);
        collapseBtn.innerHTML = active ? icons.collapseActive : icons.collapseInactive;
        collapseBtn.setAttribute('title', active ? 'Expand' : 'Collapse');
        updateNote(note.id, { isCollapsed: active });
    });
};

const makeDraggable = (el, id) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const handle = el.querySelector('.siu-drag-handle');
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (el.classList.contains('siu-pinned') || el.classList.contains('siu-collapsed')) return;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const newTop = el.offsetTop - pos2;
        const newLeft = el.offsetLeft - pos1;

        el.style.top = `${Math.max(0, Math.min(newTop, window.innerHeight - 50))}px`;
        el.style.left = `${Math.max(0, Math.min(newLeft, window.innerWidth - 50))}px`;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        updateNote(id, { x: el.offsetLeft, y: el.offsetTop });
    }
};

const updateNote = async (id, changes) => {
    notes = notes.map(n => n.id === id ? { ...n, ...changes } : n);
    await chrome.storage.local.set({ notes });
};

const deleteNote = async (id) => {
    notes = notes.filter(n => n.id !== id);
    await chrome.storage.local.set({ notes });
};

const addNewNote = async () => {
    if (globallyHidden) {
        globallyHidden = false;
        await chrome.storage.local.set({ globallyHidden: false });
    }
    const defaults = await chrome.storage.local.get(['defaultColor', 'defaultFontFamily']);
    const newNote = {
        id: Date.now(),
        content: '',
        x: 120 + (Math.random() * 60),
        y: 120 + (Math.random() * 60),
        width: 280,
        height: 160,
        color: defaults.defaultColor || '#1c1c1e', // default pastel yellow
        fontFamily: defaults.defaultFontFamily || "'Inter', sans-serif",
        fontSize: 14,
        isPinned: false,
        isCollapsed: false,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        alignment: 'left',
        url: window.location.href,
        timestamp: Date.now()
    };
    notes.push(newNote);
    await chrome.storage.local.set({ notes });
    createNoteElement(newNote);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addNote') addNewNote();
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
        if (changes.darkMode) { isDarkMode = changes.darkMode.newValue; applyTheme(); }
        let shouldFullReRender = false;
        if (changes.globallyHidden) { globallyHidden = changes.globallyHidden.newValue; shouldFullReRender = true; }
        if (changes.urlMatchSetting) { urlMatchSetting = changes.urlMatchSetting.newValue; shouldFullReRender = true; }
        if (changes.notes) {
            const newNotes = changes.notes.newValue || [];
            if (newNotes.length !== notes.length) {
                notes = newNotes;
                shouldFullReRender = true;
            } else {
                notes = newNotes;
                notes.forEach(note => {
                    const el = document.getElementById(`siu-note-${note.id}`);
                    if (el) {
                        const textarea = el.querySelector('.siu-note-body');
                        if (textarea && document.activeElement !== textarea) {
                            textarea.value = note.content || '';
                            el.style.left = `${note.x}px`;
                            el.style.top = `${note.y}px`;
                            if (note.width) el.style.width = `${note.width}px`;
                            if (note.height) el.style.height = `${note.height}px`;
                        }
                        el.style.background = note.color || '#ffffff';
                        
                        el.classList.toggle('siu-pinned', !!note.isPinned);
                        const pinBtn = el.querySelector('.siu-pin-btn');
                        if (pinBtn) {
                            pinBtn.classList.toggle('active', !!note.isPinned);
                            pinBtn.innerHTML = note.isPinned ? icons.pinActive : icons.pinInactive;
                        }

                        el.classList.toggle('siu-collapsed', !!note.isCollapsed);
                        const collapseBtn = el.querySelector('.siu-collapse-btn');
                        if (collapseBtn) {
                            collapseBtn.classList.toggle('active', !!note.isCollapsed);
                            collapseBtn.innerHTML = note.isCollapsed ? icons.collapseActive : icons.collapseInactive;
                        }

                        if (textarea) {
                            textarea.className = `siu-note-body ${getFontClassName(note.fontFamily)}`;
                            textarea.style.fontSize = `${note.fontSize || 14}px`;
                            textarea.style.textAlign = note.alignment || 'left';
                            textarea.style.fontWeight = note.isBold ? '600' : 'normal';
                            textarea.style.fontStyle = note.isItalic ? 'italic' : 'normal';
                            textarea.style.textDecoration = note.isUnderline ? 'underline' : 'none';
                        }
                    }
                });
            }
        }
        if (shouldFullReRender) renderNotes();
    }
});

init();
