// content.js — tabd.plugin v0.17 ("Shell Slide Edition: HTML panels + bookmark toggle")
(() => {

  const styleEl = document.createElement('link');
styleEl.rel = 'stylesheet';
styleEl.href = chrome.runtime.getURL('style.css');
document.head.appendChild(styleEl);

  const EXT_URL = 'chrome-extension://bcdgbcehhkpoihcemjjpdodlmianinpe';

  const DEFAULT_PROFILE = 'Default';
  const defaultProfileSettings = {
    theme: 'light',
    forceDark: false,
    mods: [],
    bookmarks: [
      { title: 'Search', url: 'https://www.bing.com' },
      { title: 'Mods',   url: `${EXT_URL}/bookmarks.html` },
      { title: 'GitHub', url: 'https://github.com/rockysticks' }
    ]
  };

  let settings = {
    profiles: { [DEFAULT_PROFILE]: { ...defaultProfileSettings } },
    currentProfile: DEFAULT_PROFILE
  };

  let bar, tabStrip, bookmarksPanel;

  function getProfile() {
    const profile = settings.profiles[settings.currentProfile];
    if (!profile.bookmarks) profile.bookmarks = [];
    return profile;
  }

  function applySettings() {
    const profile = getProfile();
    document.documentElement.classList.remove('tabd-light', 'tabd-dark');
    document.documentElement.classList.add(`tabd-${profile.theme}`);
  }

  function runCommand(cmd) {
    if (!cmd) return;
    let url;

    if (cmd.startsWith('web:'))        url = 'https://' + cmd.slice(4);
    else if (cmd.startsWith('local:')) url = cmd.slice(6);
    else if (cmd.startsWith('tabd:'))  url = `${EXT_URL}/${cmd.slice(5)}.html`;
    else if (cmd.startsWith('ask:')) {
      const query = encodeURIComponent(cmd.slice(4));
      url = `https://www.bing.com/search?q=${query}&copilot=1`;
    } else url = cmd;

    window.open(url, '_blank');
  }

  function renderBookmarks() {
    const profile = getProfile();
    const list = Array.isArray(profile.bookmarks) ? profile.bookmarks : [];

    tabStrip.innerHTML = '';
    if (list.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = 'No bookmarks yet. Click 🔖 to manage.';
      msg.style = 'color:#888; padding:4px 10px;';
      tabStrip.append(msg);
      return;
    }

    list.forEach(b => {
      const d = document.createElement('div');
      d.className = 'tabdTab';
      d.textContent = b.title;
      d.onclick = () => window.open(b.url, '_blank');
      tabStrip.append(d);
    });
  }

  function mkBtn(label, onClick) {
    const b = document.createElement('button');
    b.textContent = label;
    b.onclick = onClick;
    return b;
  }

  function renderBookmarksManager() {
    const prof = getProfile();
    bookmarksPanel.innerHTML = '<h3>Inline Bookmark Manager</h3>';

    const list = document.createElement('ul');
    prof.bookmarks.forEach((b, i) => {
      const li = document.createElement('li');
      const title = document.createElement('input');
      const url = document.createElement('input');
      title.value = b.title; url.value = b.url;
      title.placeholder = 'Title'; url.placeholder = 'URL';

      title.oninput = () => b.title = title.value.trim();
      url.oninput = () => b.url = url.value.trim();

      const del = mkBtn('×', () => {
        prof.bookmarks.splice(i, 1);
        chrome.storage.local.set({ tabdSettings: settings });
        renderBookmarksManager(); renderBookmarks();
      });
      li.append(title, url, del);
      list.append(li);
    });
    bookmarksPanel.append(list);

    const newTitle = document.createElement('input');
    const newUrl = document.createElement('input');
    newTitle.placeholder = 'New title';
    newUrl.placeholder = 'https://...';

    const add = mkBtn('➕', () => {
      const title = newTitle.value.trim();
      const url = newUrl.value.trim();
      if (!title || !url) return;
      prof.bookmarks.push({ title, url });
      chrome.storage.local.set({ tabdSettings: settings });
      newTitle.value = ''; newUrl.value = '';
      renderBookmarksManager(); renderBookmarks();
    });

    bookmarksPanel.append(newTitle, newUrl, add);
  }

  function buildUI() {
    bookmarksPanel = document.createElement('div');
    bookmarksPanel.id = 'tabdBookmarksPanel';
    bookmarksPanel.classList.add('hidden');
    document.body.append(bookmarksPanel);

    bar = document.createElement('div');
    bar.id = 'tabdBar';

    const ctrls = document.createElement('div');
    ctrls.id = 'tabdControls';

    const ref = mkBtn('⟳', () => location.reload());

    const bkm = mkBtn('🔖', () => {
      const visible = !bookmarksPanel.classList.contains('hidden');
      bookmarksPanel.classList.toggle('hidden');
      bkm.classList.toggle('active', !visible);
      if (!visible) renderBookmarksManager();
    });

    const openSettings = mkBtn('⚙', () => {
      window.open(`${EXT_URL}/settings.html`, '_blank');
    });

    const input = document.createElement('input');
    input.id = 'tabdCommandInput';
    input.placeholder = 'web:github.com, tabd:settings, ask:Why is it frosty?';
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') runCommand(input.value.trim());
      if (e.key === 'Escape') input.value = '';
    });

    const openBtn = mkBtn('➡', () => runCommand(input.value.trim()));

    ctrls.append(ref, bkm, openSettings, input, openBtn);
    bar.append(ctrls);

    tabStrip = document.createElement('div');
    tabStrip.id = 'tabdTabs';
    bar.append(tabStrip);

    document.body.prepend(bar);
    document.body.classList.add('tabd-bar-pushed');

    renderBookmarks();
    
    // Spacer element that matches bar height
const spacer = document.createElement('div');
spacer.id = 'tabdSpacer';
document.body.prepend(spacer);

// Sync spacer to bar height
const updateSpacer = () => {
  spacer.style.height = `${bar.offsetHeight}px`;
};
requestAnimationFrame(updateSpacer);

// React to future bar size changes
const resizeObserver = new ResizeObserver(updateSpacer);
resizeObserver.observe(bar);

  }

  chrome.storage.local.get('tabdSettings', data => {
    if (data.tabdSettings) {
      Object.assign(settings, data.tabdSettings);
    } else {
      chrome.storage.local.set({ tabdSettings: settings });
    }
    applySettings();
    buildUI();
  });
})();