(function() {
  'use strict';

  // ===== State =====
  const state = {
    selectedRegion: null,
    currentFilter: 'all',
    userStories: [],
    theme: 'light'
  };

  // ===== DOM Helpers =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== Initialize =====
  function init() {
    loadState();
    setupTheme();
    setupMap();
    setupPanel();
    setupWriteForm();
    setupModals();
    setupKeyboard();
    updateAllBadges();
    registerSW();
  }

  // ===== State Persistence =====
  function loadState() {
    try {
      state.userStories = JSON.parse(localStorage.getItem('literary-map-stories') || '[]');
    } catch { state.userStories = []; }
    state.theme = localStorage.getItem('literary-map-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function saveStories() {
    localStorage.setItem('literary-map-stories', JSON.stringify(state.userStories));
  }

  // ===== Theme =====
  function setupTheme() {
    applyTheme();
    $('#themeToggle').addEventListener('click', toggleTheme);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    $('#themeToggle').textContent = state.theme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('literary-map-theme', state.theme);
    applyTheme();
  }

  // ===== Map =====
  function setupMap() {
    $$('.region').forEach(el => {
      el.addEventListener('click', () => {
        const regionId = el.dataset.region;
        selectRegion(regionId);
      });
    });
  }

  function selectRegion(regionId) {
    // Deselect previous
    $$('.region').forEach(r => {
      r.classList.remove('selected');
      r.classList.remove('parent-highlight');
    });

    state.selectedRegion = regionId;
    const el = $(`.region[data-region="${regionId}"]`);
    if (el) el.classList.add('selected');

    // 시·군 선택 시 상위 도 하이라이트
    var region = REGIONS[regionId];
    if (region && region.parentRegion) {
      var parentEl = $(`.region[data-region="${region.parentRegion}"]`);
      if (parentEl) parentEl.classList.add('parent-highlight');
    }

    // Hide hint
    const hint = $('#mapHint');
    if (hint) hint.classList.add('hidden');

    showPanel(regionId);
  }

  // ===== Panel =====
  function setupPanel() {
    $('#panelClose').addEventListener('click', closePanel);
    $('#overlay').addEventListener('click', closePanel);

    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.currentFilter = btn.dataset.filter;
        renderStories();
      });
    });
  }

  function showPanel(regionId) {
    const panel = $('#storyPanel');
    const region = REGIONS[regionId];

    $('#regionTitle').textContent = region.name;
    $('#regionDesc').textContent = region.description;

    // Reset filter
    state.currentFilter = 'all';
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $('.tab-btn[data-filter="all"]').classList.add('active');

    renderStories();
    panel.classList.add('open');
    $('#overlay').classList.add('visible');
    document.body.classList.add('panel-open');
  }

  function closePanel() {
    $('#storyPanel').classList.remove('open');
    $('#overlay').classList.remove('visible');
    document.body.classList.remove('panel-open');
    $$('.region').forEach(r => {
      r.classList.remove('selected');
      r.classList.remove('parent-highlight');
    });
    state.selectedRegion = null;
  }

  // ===== Stories =====
  function renderStories() {
    const container = $('#storyList');
    container.innerHTML = '';

    const regionId = state.selectedRegion;
    if (!regionId) return;

    let stories = [];

    if (state.currentFilter !== 'user') {
      const literary = LITERARY_DATA.filter(w => w.region === regionId);
      stories = stories.concat(literary.map(w => ({ ...w, storyType: 'literature' })));
    }

    if (state.currentFilter !== 'literature') {
      const user = state.userStories.filter(s => s.region === regionId);
      stories = stories.concat(user.map(s => ({ ...s, storyType: 'user' })));
    }

    if (stories.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<p>\uD83D\uDCDA \uC544\uC9C1 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</p>' +
        '<p class="empty-sub">\uCCAB \uBC88\uC9F8 \uC774\uC57C\uAE30\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694</p>' +
        '</div>';
      return;
    }

    stories.forEach(function(story, i) {
      var card = createStoryCard(story);
      card.style.animationDelay = (i * 0.05) + 's';
      container.appendChild(card);
    });
  }

  function createStoryCard(story) {
    var card = document.createElement('div');
    card.className = 'story-card fade-in';

    if (story.storyType === 'literature') {
      card.innerHTML =
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-author">' + escHtml(story.author) + ' \u00B7 ' + story.year + '</p>' +
        '<p class="card-location">\uD83D\uDCCD ' + escHtml(story.location) + '</p>' +
        '<p class="card-excerpt">' + escHtml(story.excerpt) + '</p>';
    } else {
      card.innerHTML =
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-author">' + escHtml(story.author) + '</p>' +
        '<p class="card-date">' + formatDate(story.date) + '</p>' +
        '<p class="card-excerpt">' + escHtml(truncate(story.content, 80)) + '</p>';
    }

    card.addEventListener('click', function() { showDetail(story); });
    return card;
  }

  // ===== Detail Modal =====
  function showDetail(story) {
    var modal = $('#detailModal');
    var content = $('#detailContent');

    if (story.storyType === 'literature') {
      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-author">' + escHtml(story.author) + ' \u00B7 ' + story.year + '</p>' +
        '<p class="detail-location">\uD83D\uDCCD ' + escHtml(story.location) + '</p>' +
        '<div class="detail-excerpt">' + escHtml(story.excerpt) + '</div>' +
        '<p class="detail-desc">' + escHtml(story.description) + '</p>';
    } else {
      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-author">' + escHtml(story.author) + '</p>' +
        '<p class="detail-date">' + formatDate(story.date) + '</p>' +
        '<div class="detail-content">' + escHtml(story.content).replace(/\n/g, '<br>') + '</div>' +
        '<button class="delete-btn" data-delete-id="' + story.id + '">\uC0AD\uC81C\uD558\uAE30</button>';
    }

    // Bind close button
    content.querySelector('[data-close]').addEventListener('click', function() {
      closeModal('detailModal');
    });

    // Bind delete button
    var delBtn = content.querySelector('[data-delete-id]');
    if (delBtn) {
      delBtn.addEventListener('click', function() {
        var id = this.dataset.deleteId;
        if (confirm('\uC815\uB9D0 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?')) {
          deleteStory(id);
          closeModal('detailModal');
          renderStories();
          updateAllBadges();
        }
      });
    }

    openModal('detailModal');
  }

  // ===== Write Form =====
  function setupWriteForm() {
    $('#writeBtn').addEventListener('click', function() {
      if (!state.selectedRegion) return;
      $('#writeRegion').textContent = REGIONS[state.selectedRegion].shortName;
      openModal('writeModal');
    });

    $('#cancelBtn').addEventListener('click', function() {
      closeModal('writeModal');
    });

    $('#writeForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var form = e.target;

      var story = {
        id: generateId(),
        region: state.selectedRegion,
        author: form.author.value.trim(),
        title: form.storyTitle.value.trim(),
        content: form.content.value.trim(),
        category: form.category.value,
        date: new Date().toISOString(),
        storyType: 'user'
      };

      state.userStories.push(story);
      saveStories();
      form.reset();
      closeModal('writeModal');
      renderStories();
      updateAllBadges();

      // Scroll to bottom to show new card
      setTimeout(function() {
        var list = $('#storyList');
        list.scrollTop = list.scrollHeight;
      }, 100);
    });
  }

  // ===== Modal Helpers =====
  function setupModals() {
    // Close modal when clicking background
    $$('.modal').forEach(function(modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });

    // Close buttons
    $$('[data-close]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        closeModal(btn.dataset.close);
      });
    });
  }

  function openModal(id) {
    $('#' + id).classList.add('open');
  }

  function closeModal(id) {
    $('#' + id).classList.remove('open');
  }

  // ===== Keyboard =====
  function setupKeyboard() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Close modals first, then panel
        if ($('#detailModal.open')) {
          closeModal('detailModal');
        } else if ($('#writeModal.open')) {
          closeModal('writeModal');
        } else if ($('#storyPanel.open')) {
          closePanel();
        }
      }
    });
  }

  // ===== Map Badges =====
  function updateAllBadges() {
    Object.keys(REGIONS).forEach(function(regionId) {
      var litCount = LITERARY_DATA.filter(function(w) { return w.region === regionId; }).length;
      var userCount = state.userStories.filter(function(s) { return s.region === regionId; }).length;
      var total = litCount + userCount;

      var badge = $('[data-badge="' + regionId + '"]');
      if (badge) {
        badge.querySelector('text').textContent = total;
        if (total > 0) {
          badge.classList.add('visible');
        } else {
          badge.classList.remove('visible');
        }
      }
    });
  }

  // ===== Story CRUD =====
  function deleteStory(id) {
    state.userStories = state.userStories.filter(function(s) { return s.id !== id; });
    saveStories();
  }

  // ===== Utilities =====
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.getFullYear() + '.' +
      String(d.getMonth() + 1).padStart(2, '0') + '.' +
      String(d.getDate()).padStart(2, '0');
  }

  function truncate(str, len) {
    return str.length > len ? str.substring(0, len) + '...' : str;
  }

  function getCategoryLabel(cat) {
    var labels = { essay: '\uC218\uD544', poem: '\uC2DC', review: '\uAC10\uC0C1', memory: '\uCD94\uC5B5' };
    return labels[cat] || cat;
  }

  function escHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Service Worker =====
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function() {});
    }
  }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', init);
})();
