document.addEventListener('DOMContentLoaded', async () => {
    const addNoteBtn = document.getElementById('addNote');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const globallyHiddenToggle = document.getElementById('globallyHiddenToggle');
    const totalNotesCount = document.getElementById('totalNotesCount');
    const pageNotesCount = document.getElementById('pageNotesCount');
    const defaultFontFamily = document.getElementById('defaultFontFamily');
    const defaultColorTheme = document.getElementById('defaultColorTheme');
    const urlMatchSettingSelect = document.getElementById('urlMatchSetting');
    const searchNotesInput = document.getElementById('searchNotesInput');
    const notesListContainer = document.getElementById('notesListContainer');
    const btnExport = document.getElementById('btnExport');
    const btnImport = document.getElementById('btnImport');
    const importFileInput = document.getElementById('importFileInput');
    const btnClearAll = document.getElementById('btnClearAll');
    const toast = document.getElementById('toast');

    let allNotes = [];
    let currentTabUrl = '';
    let currentTabId = null;

    const showMessage = (msg) => {
        toast.textContent = msg;
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2500);
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.view').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
            if (btn.getAttribute('data-tab') === 'tab-directory') renderNotesDirectory();
        });
    });

    const cleanUrl = (urlStr) => {
        try {
            const url = new URL(urlStr);
            return url.origin + url.pathname.replace(/\/$/, '') + url.search;
        } catch(e) { return urlStr; }
    };

    const shouldShowNoteOnPage = (note, pageUrl, matchSetting) => {
        if (!note.url || !pageUrl) return false;
        try {
            if (matchSetting === 'domain') return new URL(pageUrl).origin === new URL(note.url).origin;
            return cleanUrl(pageUrl) === cleanUrl(note.url);
        } catch(e) { return note.url === pageUrl; }
    };

    const init = async () => {
        const data = await chrome.storage.local.get(['notes', 'darkMode', 'globallyHidden', 'urlMatchSetting', 'defaultColor', 'defaultFontFamily']);
        allNotes = data.notes || [];
        
        if (data.darkMode) { darkModeToggle.checked = true; document.body.classList.add('dark-mode'); }
        globallyHiddenToggle.checked = !data.globallyHidden;

        if (data.urlMatchSetting) urlMatchSettingSelect.value = data.urlMatchSetting;
        if (data.defaultFontFamily) defaultFontFamily.value = data.defaultFontFamily;
        if (data.defaultColor) defaultColorTheme.value = data.defaultColor;

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) { currentTabUrl = tab.url; currentTabId = tab.id; }
        } catch (err) {}

        updateStats();
    };

    const updateStats = () => {
        totalNotesCount.textContent = allNotes.length;
        const matchSetting = urlMatchSettingSelect.value || 'exact';
        pageNotesCount.textContent = allNotes.filter(n => shouldShowNoteOnPage(n, currentTabUrl, matchSetting)).length;
    };

    const icons = {
        teleport: `<svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`
    };

    const renderNotesDirectory = () => {
        const query = searchNotesInput.value.toLowerCase().trim();
        notesListContainer.innerHTML = '';

        const filtered = allNotes.filter(note => {
            const contentMatches = note.content && note.content.toLowerCase().includes(query);
            let domainMatches = false;
            try { domainMatches = new URL(note.url).hostname.toLowerCase().includes(query); } catch (e) {}
            return contentMatches || domainMatches || query === '';
        });

        if (filtered.length === 0) {
            notesListContainer.innerHTML = `<div class="empty">No notes found</div>`;
            return;
        }

        filtered.sort((a, b) => b.timestamp - a.timestamp).forEach(note => {
            let hostname = 'Unknown';
            try { hostname = new URL(note.url).hostname; } catch (e) {}

            const card = document.createElement('div');
            card.className = 'note-card';

            const header = document.createElement('div');
            header.className = 'note-card-header';

            const site = document.createElement('div');
            site.className = 'note-site';
            
            const favicon = document.createElement('img');
            favicon.src = `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`;
            favicon.onerror = () => { favicon.style.display = 'none'; };
            
            const siteName = document.createElement('span');
            siteName.textContent = hostname;

            site.appendChild(favicon);
            site.appendChild(siteName);

            const actions = document.createElement('div');
            actions.className = 'note-actions';

            const teleBtn = document.createElement('button');
            teleBtn.className = 'icon-btn';
            teleBtn.innerHTML = icons.teleport;
            teleBtn.title = "Go to page";
            teleBtn.addEventListener('click', () => chrome.tabs.create({ url: note.url }));

            const delBtn = document.createElement('button');
            delBtn.className = 'icon-btn';
            delBtn.innerHTML = icons.trash;
            delBtn.title = "Delete";
            delBtn.addEventListener('click', async () => {
                if (confirm("Delete this note?")) {
                    allNotes = allNotes.filter(n => n.id !== note.id);
                    await chrome.storage.local.set({ notes: allNotes });
                    card.remove();
                    updateStats();
                }
            });

            actions.appendChild(teleBtn);
            actions.appendChild(delBtn);

            header.appendChild(site);
            header.appendChild(actions);

            const preview = document.createElement('div');
            preview.className = 'note-preview';
            preview.textContent = note.content || 'Empty note';

            card.appendChild(header);
            card.appendChild(preview);
            notesListContainer.appendChild(card);
        });
    };

    addNoteBtn.addEventListener('click', async () => {
        try {
            if (currentTabUrl && !currentTabUrl.startsWith('chrome://') && !currentTabUrl.startsWith('about:')) {
                if (!globallyHiddenToggle.checked) {
                    globallyHiddenToggle.checked = true;
                    await chrome.storage.local.set({ globallyHidden: false });
                }
                await chrome.tabs.sendMessage(currentTabId, { action: 'addNote' });
                setTimeout(async () => {
                    const data = await chrome.storage.local.get(['notes']);
                    allNotes = data.notes || [];
                    updateStats();
                    showMessage("Note added");
                }, 100);
            } else {
                showMessage("Cannot add notes here");
            }
        } catch (err) {
            showMessage("Refresh the page to add notes");
        }
    });

    globallyHiddenToggle.addEventListener('change', async (e) => {
        await chrome.storage.local.set({ globallyHidden: !e.target.checked });
        showMessage(e.target.checked ? "Notes visible" : "Notes hidden");
    });

    darkModeToggle.addEventListener('change', async (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        await chrome.storage.local.set({ darkMode: e.target.checked });
    });

    searchNotesInput.addEventListener('input', renderNotesDirectory);

    defaultFontFamily.addEventListener('change', async (e) => {
        await chrome.storage.local.set({ defaultFontFamily: e.target.value });
        showMessage("Font updated");
    });

    defaultColorTheme.addEventListener('change', async (e) => {
        await chrome.storage.local.set({ defaultColor: e.target.value });
        showMessage("Color updated");
    });

    urlMatchSettingSelect.addEventListener('change', async (e) => {
        await chrome.storage.local.set({ urlMatchSetting: e.target.value });
        updateStats();
        showMessage("URL setting saved");
    });

    btnExport.addEventListener('click', () => {
        if (allNotes.length === 0) return showMessage("Nothing to export");
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allNotes, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", "stickitup_backup.json");
        a.click();
        showMessage("Backup downloaded");
    });

    btnImport.addEventListener('click', () => importFileInput.click());

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    const existingIds = new Set(allNotes.map(n => n.id));
                    const newCount = importedData.filter(n => !existingIds.has(n.id)).length;
                    const merged = [...allNotes];
                    
                    importedData.forEach(imp => {
                        if (imp.id && imp.url) {
                            const idx = merged.findIndex(n => n.id === imp.id);
                            if (idx !== -1) merged[idx] = imp;
                            else merged.push(imp);
                        }
                    });

                    allNotes = merged;
                    await chrome.storage.local.set({ notes: allNotes });
                    updateStats();
                    showMessage(`Imported ${newCount} notes`);
                    if (document.querySelector('.tab-btn.active').getAttribute('data-tab') === 'tab-directory') renderNotesDirectory();
                }
            } catch (err) {
                showMessage("Invalid backup file");
            }
            importFileInput.value = '';
        };
        reader.readAsText(file);
    });

    btnClearAll.addEventListener('click', async () => {
        if (confirm("Delete ALL notes? This cannot be undone.")) {
            allNotes = [];
            await chrome.storage.local.set({ notes: [] });
            updateStats();
            showMessage("All notes deleted");
            if (document.querySelector('.tab-btn.active').getAttribute('data-tab') === 'tab-directory') renderNotesDirectory();
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes.notes) {
            allNotes = changes.notes.newValue || [];
            updateStats();
            if (document.querySelector('.tab-btn.active').getAttribute('data-tab') === 'tab-directory') renderNotesDirectory();
        }
    });

    await init();
});