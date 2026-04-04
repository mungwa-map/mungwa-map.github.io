(function() {
  'use strict';

  // ===== State =====
  const state = {
    selectedRegion: null,
    userStories: [],
    likes: {},       // { storyId: true } — 내가 공감한 글
    userSort: 'latest', // 'latest' | 'likes'
    theme: 'light',
    discoveryIndex: -1,
    detailMap: null   // Leaflet 인스턴스 (시·군 상세 타일 지도)
  };

  // ===== DOM Helpers =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== Region Helpers =====
  function getChildRegionIds(regionId) {
    return Object.keys(REGIONS).filter(function(id) {
      return REGIONS[id].parentRegion === regionId;
    });
  }

  function getRegionAndChildIds(regionId) {
    return [regionId].concat(getChildRegionIds(regionId));
  }

  // ===== Initialize =====
  function init() {
    loadState();
    setupTheme();
    setupMap();
    setupPanel();
    setupWriteForm();
    setupModals();
    setupKeyboard();
    setupDiscovery();
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

    zoomToRegion(regionId);
  }

  // ===== Panel =====
  function setupPanel() {
    $('#panelClose').addEventListener('click', closePanel);
    $('#overlay').addEventListener('click', closePanel);
    $('#zoomBackBtn').addEventListener('click', zoomOut);
    $('#storyOpenBtn').addEventListener('click', function() {
      if (state.selectedRegion) showPanel(state.selectedRegion);
    });
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
    // 패널만 닫음 — 줌 상태 유지
    $('#storyPanel').classList.remove('open');
    $('#overlay').classList.remove('visible');
    document.body.classList.remove('panel-open');
  }

  // ===== SVG Map Zoom =====
  var ORIGINAL_VIEWBOX = '0 0 550 780';

  function zoomToRegion(regionId) {
    var region = REGIONS[regionId];

    // 시·군(parentRegion 있음) → 상세 지도
    if (region && region.parentRegion) {
      showDetailMap(regionId);
      return;
    }

    // 하위 지역 없는 광역시/도 → 바로 상세 지도
    var children = getChildRegionIds(regionId);
    if (children.length === 0) {
      showDetailMap(regionId);
      return;
    }

    var svg = $('#koreaMap');
    var allIds = getRegionAndChildIds(regionId);

    // bbox에 상위 도도 포함
    var bboxIds = allIds.slice();
    if (region && region.parentRegion && bboxIds.indexOf(region.parentRegion) === -1) {
      bboxIds.push(region.parentRegion);
    }

    // 합산 bounding box
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    bboxIds.forEach(function(id) {
      var el = $('.region[data-region="' + id + '"]');
      if (!el) return;
      var path = el.querySelector('path');
      if (!path) return;
      var bbox = path.getBBox();
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });

    if (minX === Infinity) return;

    var pad = 30;
    var vbW = (maxX - minX) + pad * 2;
    var vbH = (maxY - minY) + pad * 2;
    svg.setAttribute('viewBox', (minX - pad) + ' ' + (minY - pad) + ' ' + vbW + ' ' + vbH);
    svg.classList.add('zoomed');

    // 글귀 카드 숨김
    var dc = $('#discoveryCard');
    if (dc) dc.classList.add('hidden');

    // 대상 지역 표시 + 하위 지역 뱃지 표시 (크기는 rAF에서 보정)
    allIds.forEach(function(id) {
      var el = $('.region[data-region="' + id + '"]');
      if (el) el.classList.add('zoom-target');
      var label = $('[data-label="' + id + '"]');
      if (label) label.classList.add('zoom-label');
      var badge = $('[data-badge="' + id + '"]');
      if (badge && REGIONS[id] && REGIONS[id].parentRegion) {
        badge.classList.add('zoom-badge');
      }
    });

    // 다음 프레임: 실제 렌더링 크기 기반으로 컴포넌트 정규화
    var _vbW = vbW;
    requestAnimationFrame(function() {
      var svgRect = svg.getBoundingClientRect();
      var rs = svgRect.width / _vbW; // 현재 줌 렌더 스케일
      if (rs <= 0) return;

      // 라벨 — 화면 기준 고정 px
      $$('.zoom-label').forEach(function(label) {
        var target = label.classList.contains('sub-label') ? 12
          : label.classList.contains('metro-label') ? 13 : 16;
        label.style.fontSize = (target / rs) + 'px';
        label.style.strokeWidth = (2.5 / rs) + 'px';
      });

      // 뱃지 — 화면 기준 고정 px
      $$('.zoom-badge').forEach(function(badge) {
        var bc = badge.querySelector('circle');
        if (bc) bc.setAttribute('r', 10 / rs);
        var bt = badge.querySelector('text');
        if (bt) {
          bt.style.fontSize = (11 / rs) + 'px';
          bt.setAttribute('dy', (4 / rs));
        }
      });
    });
    if (region && region.parentRegion) {
      var pEl = $('.region[data-region="' + region.parentRegion + '"]');
      if (pEl) pEl.classList.add('zoom-target');
    }

    // 시·군 클릭 시 형제 지역도 반투명으로 표시
    if (region && region.parentRegion) {
      getChildRegionIds(region.parentRegion).forEach(function(sibId) {
        if (sibId === regionId) return;
        var sibEl = $('.region[data-region="' + sibId + '"]');
        if (sibEl) sibEl.classList.add('zoom-sibling');
        var sibLabel = $('[data-label="' + sibId + '"]');
        if (sibLabel) sibLabel.classList.add('zoom-label');
      });
    }

    // 도(道) 레벨에서는 마커 없이 지역 선택만
    // UI — 줌백 버튼만 (이야기 버튼은 상세 지도에서만)
    $('#zoomBackBtn').classList.add('visible');
    var hint = $('#mapHint');
    if (hint) hint.classList.add('hidden');
  }

  function showDetailMap(regionId) {
    var region = REGIONS[regionId];
    var parentId = region ? region.parentRegion : null;
    var mapData = (typeof DETAIL_MAPS !== 'undefined') ? DETAIL_MAPS[regionId] : null;

    var pinnedWorks = LITERARY_DATA.filter(function(w) { return w.region === regionId; });

    state.detailMap = null;
    var mapDiv = $('#detailMap');
    mapDiv.innerHTML = '';
    mapDiv.classList.add('visible');

    // SVG 생성
    var ns = 'http://www.w3.org/2000/svg';
    var vb = mapData ? mapData.viewBox : '0 0 400 500';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', vb);
    svg.setAttribute('class', 'dm-svg');

    // 배경
    var bg = document.createElementNS(ns, 'rect');
    bg.setAttribute('class', 'dm-bg');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', vb.split(' ')[2]);
    bg.setAttribute('height', vb.split(' ')[3]);
    bg.setAttribute('rx', '8');
    svg.appendChild(bg);

    if (mapData) {
      // 구/면 경계
      if (mapData.districts) {
        var dg = document.createElementNS(ns, 'g');
        dg.setAttribute('class', 'dm-districts');
        mapData.districts.forEach(function(d) {
          var p = document.createElementNS(ns, 'path');
          p.setAttribute('d', d.path);
          p.setAttribute('class', 'dm-district');
          dg.appendChild(p);
          if (d.labelX != null) {
            var t = document.createElementNS(ns, 'text');
            t.setAttribute('x', d.labelX);
            t.setAttribute('y', d.labelY);
            t.setAttribute('class', 'dm-district-label');
            t.textContent = d.name;
            dg.appendChild(t);
          }
        });
        svg.appendChild(dg);
      }

      // 하천/바다
      if (mapData.rivers) {
        mapData.rivers.forEach(function(r) {
          var p = document.createElementNS(ns, 'path');
          p.setAttribute('d', r.path);
          p.setAttribute('class', 'dm-river');
          svg.appendChild(p);
          if (r.labelX != null) {
            var t = document.createElementNS(ns, 'text');
            t.setAttribute('x', r.labelX);
            t.setAttribute('y', r.labelY);
            t.setAttribute('class', 'dm-river-label');
            t.textContent = r.name;
            svg.appendChild(t);
          }
        });
      }


      // 작품 마커 — 해당 구/면 라벨 위에 배치
      if (mapData.districts && pinnedWorks.length > 0) {
        var districtLabels = mapData.districts.filter(function(d) { return d.labelX != null; });

        // 작품 → 구/면 매칭 (이름 매칭 → 최근접 fallback)
        function findDistrict(w) {
          var matched = null;
          districtLabels.forEach(function(d) {
            if (d.name.indexOf(w.district) !== -1) matched = d;
          });
          if (!matched && mapData.workPositions && mapData.workPositions[w.id]) {
            var pos = mapData.workPositions[w.id];
            var minD = Infinity;
            districtLabels.forEach(function(d) {
              var dx = d.labelX - pos.x, dy = d.labelY - pos.y;
              var dist = dx * dx + dy * dy;
              if (dist < minD) { minD = dist; matched = d; }
            });
          }
          return matched;
        }

        // 구/면별 그룹핑
        var byDist = {};
        pinnedWorks.forEach(function(w) {
          var d = findDistrict(w);
          if (!d) return;
          if (!byDist[d.name]) byDist[d.name] = { district: d, works: [] };
          byDist[d.name].works.push(w);
        });

        // 렌더링 — 구/면당 동그라미 1개, 클릭 시 랜덤 작품
        Object.keys(byDist).forEach(function(key) {
          var info = byDist[key];
          var d = info.district;
          var works = info.works;

          var g = document.createElementNS(ns, 'g');
          g.setAttribute('class', 'dm-work');
          g.setAttribute('transform', 'translate(' + d.labelX + ',' + (d.labelY - 14) + ')');
          g.style.cursor = 'pointer';

          var c = document.createElementNS(ns, 'circle');
          c.setAttribute('r', '3');
          c.setAttribute('class', 'dm-work-dot');
          g.appendChild(c);

          g.addEventListener('click', function(e) {
            e.stopPropagation();
            var pick = works[Math.floor(Math.random() * works.length)];
            showDetail(Object.assign({}, pick, { storyType: 'literature' }));
          });
          svg.appendChild(g);
        });
      }
    }

    mapDiv.appendChild(svg);

    // viewBox를 실제 콘텐츠 영역에 맞게 자동 조정
    requestAnimationFrame(function() {
      var bgRect = svg.querySelector('.dm-bg');
      // 배경 rect를 bbox 계산에서 제외
      if (bgRect) bgRect.setAttribute('display', 'none');
      var bbox = svg.getBBox();
      if (bgRect) bgRect.removeAttribute('display');
      if (bbox.width > 0 && bbox.height > 0) {
        var pad = 20;
        var fitX = bbox.x - pad;
        var fitY = bbox.y - pad;
        var fitW = bbox.width + pad * 2;
        var fitH = bbox.height + pad * 2;
        svg.setAttribute('viewBox', fitX + ' ' + fitY + ' ' + fitW + ' ' + fitH);
        if (bgRect) {
          bgRect.setAttribute('x', fitX);
          bgRect.setAttribute('y', fitY);
          bgRect.setAttribute('width', fitW);
          bgRect.setAttribute('height', fitH);
        }
        // 다음 프레임: SVG 실제 렌더링 크기로 글자 정규화
        var _fitW = fitW, _fitH = fitH;
        requestAnimationFrame(function() {
          var svgRect = svg.getBoundingClientRect();
          var rs = Math.min(svgRect.width / _fitW, svgRect.height / _fitH);
          if (rs <= 0) return;
          svg.querySelectorAll('.dm-district-label').forEach(function(t) {
            t.style.fontSize = (11 / rs) + 'px';
          });
          svg.querySelectorAll('.dm-work-title').forEach(function(t) {
            t.style.fontSize = (10 / rs) + 'px';
          });
          svg.querySelectorAll('.dm-work-author').forEach(function(t) {
            t.style.fontSize = (8 / rs) + 'px';
          });
          svg.querySelectorAll('.dm-work-dot').forEach(function(c) {
            c.setAttribute('r', 8 / rs);
          });
          svg.querySelectorAll('.dm-river-label').forEach(function(t) {
            t.style.fontSize = (8 / rs) + 'px';
          });
        });
      }
    });

    // 지역명 오버레이
    var titleEl = document.createElement('div');
    titleEl.className = 'dm-title';
    titleEl.textContent = region.name;
    mapDiv.appendChild(titleEl);


    state.detailMap = true;

    $('#zoomBackBtn').classList.add('visible');
    $('#storyOpenBtn').classList.add('visible');
    var hint = $('#mapHint');
    if (hint) hint.classList.add('hidden');
  }

  function zoomOut() {
    // 상세 지도 정리
    if (state.detailMap) {
      state.detailMap = null;
      var dm = $('#detailMap');
      dm.innerHTML = '';
      dm.classList.remove('visible');
    }

    var svg = $('#koreaMap');
    svg.setAttribute('viewBox', ORIGINAL_VIEWBOX);
    svg.classList.remove('zoomed');

    $$('.zoom-target').forEach(function(el) { el.classList.remove('zoom-target'); });
    $$('.zoom-label').forEach(function(el) {
      el.classList.remove('zoom-label');
      el.style.fontSize = '';
      el.style.strokeWidth = '';
    });
    $$('.zoom-badge').forEach(function(el) {
      var bc = el.querySelector('circle');
      if (bc) bc.setAttribute('r', '9');
      var bt = el.querySelector('text');
      if (bt) { bt.style.fontSize = ''; bt.setAttribute('dy', '3.5'); }
      el.classList.remove('zoom-badge');
    });
    $$('.zoom-sibling').forEach(function(el) { el.classList.remove('zoom-sibling'); });

    $('#workMarkers').innerHTML = '';
    $('#zoomBackBtn').classList.remove('visible');
    $('#storyOpenBtn').classList.remove('visible');

    // 글귀 카드 복원
    var dc = $('#discoveryCard');
    if (dc) dc.classList.remove('hidden');

    // 선택 상태 초기화
    $$('.region').forEach(r => {
      r.classList.remove('selected');
      r.classList.remove('parent-highlight');
    });
    state.selectedRegion = null;

    // 패널도 닫기
    $('#storyPanel').classList.remove('open');
    $('#overlay').classList.remove('visible');
    document.body.classList.remove('panel-open');
  }

  function addWorkMarkers(regionId) {
    var group = $('#workMarkers');
    group.innerHTML = '';

    var allIds = getRegionAndChildIds(regionId);
    var works = LITERARY_DATA.filter(function(w) { return allIds.indexOf(w.region) !== -1; });

    var byRegion = {};
    works.forEach(function(w) {
      if (!byRegion[w.region]) byRegion[w.region] = [];
      byRegion[w.region].push(w);
    });

    Object.keys(byRegion).forEach(function(rId) {
      var rWorks = byRegion[rId];
      var el = $('.region[data-region="' + rId + '"]');
      if (!el) return;
      var path = el.querySelector('path');
      if (!path) return;
      var bbox = path.getBBox();
      var cx = bbox.x + bbox.width / 2;
      var cy = bbox.y + bbox.height / 2;

      rWorks.forEach(function(w, i) {
        var total = rWorks.length;
        var offsetX = (i - (total - 1) / 2) * 15;

        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'work-marker');
        g.setAttribute('transform', 'translate(' + (cx + offsetX) + ',' + cy + ')');

        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'marker-dot');
        circle.setAttribute('r', '4');
        g.appendChild(circle);

        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'marker-label');
        text.setAttribute('y', '-7');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '7');
        text.textContent = w.title;
        g.appendChild(text);

        g.addEventListener('click', function(e) {
          e.stopPropagation();
          showDetail({ ...w, storyType: 'literature' });
        });

        group.appendChild(g);
      });
    });
  }

  // ===== Stories =====
  function renderStories() {
    var regionId = state.selectedRegion;
    if (!regionId) return;

    var litContainer = $('#literaryList');
    var userContainer = $('#userList');
    litContainer.innerHTML = '';
    userContainer.innerHTML = '';

    // 문학작품 영역 (상위 도면 하위 지역 포함)
    var allIds = getRegionAndChildIds(regionId);
    var literary = LITERARY_DATA.filter(function(w) { return allIds.indexOf(w.region) !== -1; });
    $('#litSectionTitle').textContent = '\uBB38\uD559\uC791\uD488 ' + literary.length + '\uD3B8';

    // 작품별 독자 이야기 수 집계
    var allUserStories = state.userStories.filter(function(s) { return allIds.indexOf(s.region) !== -1; });
    var userCountByWork = {};
    allUserStories.forEach(function(s) {
      if (s.relatedWork) {
        userCountByWork[s.relatedWork] = (userCountByWork[s.relatedWork] || 0) + 1;
      }
    });

    if (literary.length === 0) {
      litContainer.innerHTML =
        '<div class="empty-state">' +
        '<p>\uC544\uC9C1 \uB4F1\uB85D\uB41C \uBB38\uD559\uC791\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4</p>' +
        '<p class="empty-sub">\uC774 \uC9C0\uC5ED\uC758 \uCCAB \uC774\uC57C\uAE30\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694</p>' +
        '</div>';
    } else {
      literary.forEach(function(w, i) {
        var card = createStoryCard({ ...w, storyType: 'literature', readerCount: userCountByWork[w.id] || 0 });
        card.style.animationDelay = (i * 0.05) + 's';
        litContainer.appendChild(card);
      });
    }

    // 자유 이야기 영역 (작품 미연결 글만)
    var freeStories = allUserStories.filter(function(s) { return !s.relatedWork; });

    // 정렬
    if (state.userSort === 'likes') {
      freeStories.sort(function(a, b) { return (b.likeCount || 0) - (a.likeCount || 0); });
    } else {
      freeStories.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    }

    // 자유 이야기가 있을 때만 섹션 표시
    var divider = $('.panel-divider');
    if (freeStories.length === 0) {
      userContainer.innerHTML = '';
      $('#userSectionTitle').innerHTML = '';
      if (divider) divider.style.display = 'none';
    } else {
      if (divider) divider.style.display = '';

      var sortHtml = freeStories.length > 1
        ? '<div class="sort-toggle">' +
          '<button class="sort-btn' + (state.userSort === 'latest' ? ' active' : '') + '" data-sort="latest">\uCD5C\uC2E0\uC21C</button>' +
          '<button class="sort-btn' + (state.userSort === 'likes' ? ' active' : '') + '" data-sort="likes">\uACF5\uAC10\uC21C</button>' +
          '</div>'
        : '';

      $('#userSectionTitle').innerHTML = '\uC790\uC720 \uC774\uC57C\uAE30 ' + freeStories.length + '\uAC1C' + sortHtml;

      // 정렬 버튼 이벤트
      $$('#userSectionTitle .sort-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          state.userSort = btn.dataset.sort;
          renderStories();
        });
      });

      freeStories.forEach(function(s, i) {
        var card = createStoryCard({ ...s, storyType: 'user' });
        card.style.animationDelay = (i * 0.05) + 's';
        userContainer.appendChild(card);
      });
    }
  }

  function createStoryCard(story) {
    var card = document.createElement('div');
    card.className = 'story-card fade-in';

    // 하위 지역 작품이면 서브리전 태그 표시
    var subRegionTag = '';
    if (story.region !== state.selectedRegion && REGIONS[story.region]) {
      subRegionTag = '<span class="badge badge-subregion">' + escHtml(REGIONS[story.region].shortName) + '</span> ';
    }

    if (story.storyType === 'literature') {
      var readerCountHtml = story.readerCount > 0
        ? '<p class="card-reader-count">\uB3C5\uC790 \uC774\uC57C\uAE30 ' + story.readerCount + '\uAC1C</p>'
        : '';
      card.innerHTML =
        subRegionTag +
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-meta">' + escHtml(story.author) + ' \u00B7 ' + story.year + '</p>' +
        '<p class="card-location">' + escHtml(story.location) + '</p>' +
        '<p class="card-excerpt">' + escHtml(story.excerpt) + '</p>' +
        readerCountHtml;
    } else {
      var relatedHtml = '';
      if (story.relatedWork) {
        var work = LITERARY_DATA.find(function(w) { return w.id === story.relatedWork; });
        if (work) {
          relatedHtml = '<p class="card-related">\u300E' + escHtml(work.title) + '\u300F \uC5D0 \uB300\uD55C \uC774\uC57C\uAE30</p>';
        }
      }
      var locationHtml = story.location
        ? '<p class="card-location">' + escHtml(story.location) + '</p>'
        : '';
      var likeCount = story.likeCount || 0;
      var liked = state.likes[story.id] ? ' liked' : '';
      card.innerHTML =
        subRegionTag +
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h4 class="card-title">' + escHtml(story.title) + '</h4>' +
        '<p class="card-meta">' + escHtml(story.author) + ' \u00B7 ' + formatDate(story.date) + '</p>' +
        relatedHtml +
        locationHtml +
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

      // 길찾기 링크 (좌표가 있는 경우)
      var mapLinkHtml = '';
      if (story.coords) {
        var mapUrl = 'https://map.naver.com/p/search/' + encodeURIComponent(story.location) +
          '?c=' + story.coords.lng + ',' + story.coords.lat + ',15,0,0,0,dh';
        mapLinkHtml = '<a class="map-link" href="' + mapUrl + '" target="_blank" rel="noopener">\uD83D\uDCCD \uAE38\uCC3E\uAE30</a>';
      }

      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-literature">' + escHtml(story.genre) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-meta">' + escHtml(story.author) + ' \u00B7 ' + story.year + '</p>' +
        '<p class="detail-location">' + escHtml(story.location) + mapLinkHtml + '</p>' +
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

      var userLocationHtml = story.location
        ? '<p class="detail-location">' + escHtml(story.location) + '</p>'
        : '';

      content.innerHTML =
        '<button class="modal-close-btn modal-close-top" data-close="detailModal">&times;</button>' +
        '<span class="badge badge-user">' + getCategoryLabel(story.category) + '</span>' +
        '<h3>' + escHtml(story.title) + '</h3>' +
        '<p class="detail-meta">' + escHtml(story.author) + ' \u00B7 ' + formatDate(story.date) + '</p>' +
        workLinkHtml +
        userLocationHtml +
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
        location: form.location.value.trim() || null,
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
    var workIds = getRegionAndChildIds(state.selectedRegion);
    var works = LITERARY_DATA.filter(function(w) { return workIds.indexOf(w.region) !== -1; });
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
      var region = REGIONS[regionId];
      var allIds = getRegionAndChildIds(regionId);
      var litCount = LITERARY_DATA.filter(function(w) { return allIds.indexOf(w.region) !== -1; }).length;
      var userCount = state.userStories.filter(function(s) { return allIds.indexOf(s.region) !== -1; }).length;
      var total = litCount + userCount;

      var badge = $('[data-badge="' + regionId + '"]');
      if (badge) {
        badge.querySelector('text').textContent = total;
        if (total > 0) {
          badge.classList.add('visible');
        } else {
          badge.classList.remove('visible');
        }
        // 세분화 지역은 메인 지도에서 숨���
        if (region.parentRegion) {
          badge.classList.add('sub-badge');
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

  // ===== Discovery (오늘의 발견) =====
  function setupDiscovery() {
    // 셔플된 작품 순서 생성
    state.discoveryOrder = shuffleArray(LITERARY_DATA.map(function(_, i) { return i; }));
    state.discoveryIndex = 0;
    showDiscoveryCard();

    // 카드 클릭 → 해당 지역 선택 + 상세보기
    $('#discoveryCard').addEventListener('click', function(e) {
      if (e.target.closest('#discoveryNext')) return;
      var work = LITERARY_DATA[state.discoveryOrder[state.discoveryIndex]];
      if (!work) return;

      // 지역 하이라이트
      $$('.region').forEach(function(r) { r.classList.remove('discovery-glow'); });
      var el = $('.region[data-region="' + work.region + '"]');
      if (el) el.classList.add('discovery-glow');

      selectRegion(work.region);
      // 약간의 딜레이 후 상세 모달
      setTimeout(function() {
        showDetail({ ...work, storyType: 'literature' });
      }, 300);
    });

    // 다음 버튼
    $('#discoveryNext').addEventListener('click', function(e) {
      e.stopPropagation();
      nextDiscovery();
    });
  }

  function showDiscoveryCard() {
    var idx = state.discoveryOrder[state.discoveryIndex];
    var work = LITERARY_DATA[idx];
    if (!work) return;

    var excerptEl = $('#discoveryExcerpt');
    var metaEl = $('#discoveryMeta');

    var place = REGIONS[work.region] ? REGIONS[work.region].shortName : '';
    excerptEl.textContent = work.excerpt;
    metaEl.textContent = work.author + ' · \u300E' + work.title + '\u300F · ' + place;
  }

  function nextDiscovery() {
    var excerptEl = $('#discoveryExcerpt');
    var metaEl = $('#discoveryMeta');

    // 이전 하이라이트 제거
    $$('.region').forEach(function(r) { r.classList.remove('discovery-glow'); });

    // 페이드 아웃
    excerptEl.classList.add('fade-out');
    metaEl.classList.add('fade-out');

    setTimeout(function() {
      state.discoveryIndex = (state.discoveryIndex + 1) % state.discoveryOrder.length;
      showDiscoveryCard();
      // 페이드 인
      excerptEl.classList.remove('fade-out');
      metaEl.classList.remove('fade-out');
    }, 350);
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
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
