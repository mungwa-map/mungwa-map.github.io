(function() {
  'use strict';

  // ===== State =====
  const state = {
    selectedRegion: null,
    userStories: [],
    likes: {},       // { storyId: true } — 내가 공감한 글
    userSort: 'latest', // 'latest' | 'likes'
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
    try {
      state.likes = JSON.parse(localStorage.getItem('literary-map-likes') || '{}');
    } catch { state.likes = {}; }
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
  }

  function showPanel(regionId) {
    var panel = $('#storyPanel');
    var region = REGIONS[regionId];

    $('#regionTitle').textContent = region.name;
    $('#regionDesc').textContent = region.description;

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
    var regionId = state.selectedRegion;
    if (!regionId) return;

    var litContainer = $('#literaryList');
    var userContainer = $('#userList');
    litContainer.innerHTML = '';
    userContainer.innerHTML = '';

    // 문학작품 영역
    var literary = LITERARY_DATA.filter(function(w) { return w.region === regionId; });
    $('#litSectionTitle').textContent = '\uBB38\uD559\uC791\uD488 ' + literary.length + '\uD3B8';

    if (literary.length === 0) {
      litContainer.innerHTML = '<p class="section-empty">\uB4F1\uB85D\uB41C \uBB38\uD559\uC791\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4</p>';
    } else {
      literary.forEach(function(w, i) {
        var card = createStoryCard({ ...w, storyType: 'literature' });
        card.style.animationDelay = (i * 0.05) + 's';
        litContainer.appendChild(card);
      });
    }

    // 사용자 이야기 영역
    var user = state.userStories.filter(function(s) { return s.region === regionId; });

    // 정렬
    if (state.userSort === 'likes') {
      user.sort(function(a, b) { return (b.likeCount || 0) - (a.likeCount || 0); });
    } else {
      user.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    }

    var sortHtml = user.length > 1
      ? '<div class="sort-toggle">' +
        '<button class="sort-btn' + (state.userSort === 'latest' ? ' active' : '') + '" data-sort="latest">\uCD5C\uC2E0\uC21C</button>' +
        '<button class="sort-btn' + (state.userSort === 'likes' ? ' active' : '') + '" data-sort="likes">\uACF5\uAC10\uC21C</button>' +
        '</div>'
      : '';

    $('#userSectionTitle').innerHTML = '\uC774 \uACF3\uC758 \uC774\uC57C\uAE30 ' + user.length + '\uAC1C' + sortHtml;

    // 정렬 버튼 이벤트
    $$('#userSectionTitle .sort-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        state.userSort = btn.dataset.sort;
        renderStories();
      });
    });

    if (user.length === 0) {
      userContainer.innerHTML =
        '<div class="empty-state">' +
        '<p>\uC544\uC9C1 \uC774\uC57C\uAE30\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4</p>' +
        '<p class="empty-sub">\uCCAB \uBC88\uC9F8 \uC774\uC57C\uAE30\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694</p>' +
        '</div>';
    } else {
      user.forEach(function(s, i) {
        var card = createStoryCard({ ...s, storyType: 'user' });
        card.style.animationDelay = (i * 0.05) + 's';
        userContainer.appendChild(card);
      });
    }
  }

  function createStoryCard(story) {
    var card = document.createElement('div');
    card.className = 'story-card fade-in';

    if (story.storyType === 'literature') {
      card.innerHTML =
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-meta">' + escHtml(story.author) + ' \u00B7 ' + story.year + '</p>' +
        '<p class="card-location">' + escHtml(story.location) + '</p>' +
        '<p class="card-excerpt">' + escHtml(story.excerpt) + '</p>';
    } else {
      var relatedHtml = '';
      if (story.relatedWork) {
        var work = LITERARY_DATA.find(function(w) { return w.id === story.relatedWork; });
        if (work) {
          relatedHtml = '<p class="card-related">\u300E' + escHtml(work.title) + '\u300F \uC5D0 \uB300\uD55C \uC774\uC57C\uAE30</p>';
        }
      }
      var likeCount = story.likeCount || 0;
      var liked = state.likes[story.id] ? ' liked' : '';
      card.innerHTML =
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-meta">' + escHtml(story.author) + ' \u00B7 ' + formatDate(story.date) + '</p>' +
        relatedHtml +
        '<p class="card-excerpt">' + escHtml(story.content) + '</p>' +
        '<div class="card-footer">' +
        '<button class="like-btn' + liked + '" data-like-id="' + story.id + '">\u2665 ' + (likeCount > 0 ? likeCount : '') + '</button>' +
        '</div>';
    }

    card.addEventListener('click', function(e) {
      // 공감 버튼은 별도 처리
      if (e.target.closest('.like-btn')) return;
      showDetail(story);
    });

    // 공감 버튼
    var likeBtn = card.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleLike(story.id);
        renderStories();
      });
    }

    return card;
  }

  // ===== Detail Modal =====
  function showDetail(story) {
    var modal = $('#detailModal');
    var content = $('#detailContent');

    if (story.storyType === 'literature') {
      // 관련 사용자 글 목록
      var relatedStories = state.userStories.filter(function(s) { return s.relatedWork === story.id; });
      var relatedHtml = '';
      if (relatedStories.length > 0) {
        relatedHtml = '<div class="detail-related"><h4 class="detail-related-title">\uB3C5\uC790\uB4E4\uC758 \uC774\uC57C\uAE30 ' + relatedStories.length + '\uAC1C</h4>';
        relatedStories.forEach(function(s) {
          relatedHtml += '<div class="detail-related-item" data-related-id="' + s.id + '">' +
            '<p class="related-title">' + escHtml(s.title) + '</p>' +
            '<p class="related-meta">' + escHtml(s.author) + ' \u00B7 ' + formatDate(s.date) + '</p>' +
            '</div>';
        });
        relatedHtml += '</div>';
      }

      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-meta">' + escHtml(story.author) + ' \u00B7 ' + story.year + ' \u00B7 ' + escHtml(story.location) + '</p>' +
        '<div class="detail-excerpt">' + escHtml(story.excerpt) + '</div>' +
        '<p class="detail-desc">' + escHtml(story.description) + '</p>' +
        relatedHtml +
        '<button class="write-comment-btn" data-work-id="' + story.id + '">\uB098\uB3C4 \uD55C\uB9C8\uB514</button>';
    } else {
      // 연결된 작품 링크
      var workLinkHtml = '';
      if (story.relatedWork) {
        var work = LITERARY_DATA.find(function(w) { return w.id === story.relatedWork; });
        if (work) {
          workLinkHtml = '<p class="detail-work-link" data-work-id="' + work.id + '">\u300E' + escHtml(work.title) + '\u300F ' + escHtml(work.author) + ' \u203A</p>';
        }
      }

      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-meta">' + escHtml(story.author) + ' \u00B7 ' + formatDate(story.date) + '</p>' +
        workLinkHtml +
        '<div class="detail-content">' + escHtml(story.content).replace(/\n/g, '<br>') + '</div>' +
        '<button class="delete-btn" data-delete-id="' + story.id + '">\uC0AD\uC81C\uD558\uAE30</button>';
    }

    // Bind close button
    content.querySelector('[data-close]').addEventListener('click', function() {
      closeModal('detailModal');
    });

    // Bind "나도 한마디" button
    var commentBtn = content.querySelector('[data-work-id].write-comment-btn');
    if (commentBtn) {
      commentBtn.addEventListener('click', function() {
        closeModal('detailModal');
        openWriteModal(this.dataset.workId);
      });
    }

    // Bind work link (사용자 글 → 작품 상세로 이동)
    var workLink = content.querySelector('.detail-work-link[data-work-id]');
    if (workLink) {
      workLink.addEventListener('click', function() {
        var work = LITERARY_DATA.find(function(w) { return w.id === workLink.dataset.workId; });
        if (work) showDetail({ ...work, storyType: 'literature' });
      });
    }

    // Bind related story items
    content.querySelectorAll('[data-related-id]').forEach(function(item) {
      item.addEventListener('click', function() {
        var s = state.userStories.find(function(u) { return u.id === item.dataset.relatedId; });
        if (s) showDetail({ ...s, storyType: 'user' });
      });
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
      openWriteModal();
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
        relatedWork: form.relatedWork.value || null,
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
        var panel = $('#panelBody');
        panel.scrollTop = panel.scrollHeight;
      }, 100);
    });
  }

  function openWriteModal(preselectedWorkId) {
    if (!state.selectedRegion) return;
    $('#writeRegion').textContent = REGIONS[state.selectedRegion].shortName;

    // 관련 작품 드롭다운 채우기
    var select = $('#relatedWorkSelect');
    select.innerHTML = '<option value="">\uC791\uD488 \uC120\uD0DD \uC548 \uD568 \u2014 \uC790\uC720 \uAE00</option>';
    var works = LITERARY_DATA.filter(function(w) { return w.region === state.selectedRegion; });
    works.forEach(function(w) {
      var opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = '\u300E' + w.title + '\u300F ' + w.author;
      select.appendChild(opt);
    });

    if (preselectedWorkId) {
      select.value = preselectedWorkId;
    }

    openModal('writeModal');
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

  function toggleLike(storyId) {
    // 공감 토글
    var story = state.userStories.find(function(s) { return s.id === storyId; });
    if (!story) return;

    if (state.likes[storyId]) {
      delete state.likes[storyId];
      story.likeCount = Math.max(0, (story.likeCount || 1) - 1);
    } else {
      state.likes[storyId] = true;
      story.likeCount = (story.likeCount || 0) + 1;
    }

    localStorage.setItem('literary-map-likes', JSON.stringify(state.likes));
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
