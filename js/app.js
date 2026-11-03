/**
 * TWO BY — PLATAFORMA DE MERCADO FINANCEIRO & B3
 * Arquivo: js/app.js
 * Descrição: Controlador mestre SPA com suporte a alteração de foto de perfil
 * de Matheus Peniche, ordenação de tabelas, emissão de ordens, extrato e tema azul B3.
 */

(function () {
  'use strict';

  // Estado Central da Aplicação
  const state = {
    currentView: 'view-inicio',
    selectedStock: 'PETR4',
    selectedTimeframe: '1D',
    orderType: 'Compra',
    orderQuantity: 100,
    altasBaixasTab: 'altas',
    acoesFilter: 'todas',
    acoesSearch: '',
    sortColumn: null,
    sortDirection: 'desc',
    carteiraTab: 'posicoes',
    desempenhoPeriod: '1M',
    activeTool: 'mira',
    theme: localStorage.getItem('twoby-theme') || 'dark',
    userProfile: {
      name: localStorage.getItem('twoby-user-name') || 'Matheus Penicwh',
      email: localStorage.getItem('twoby-user-email') || 'matheuspeniche674@gmail.com',
      cpf: '***.123.456-**',
      bank: 'Itaú (341)',
      agency: '1234',
      account: '56789-0',
      avatarUrl: localStorage.getItem('twoby-user-avatar') || './assets/images/user_avatar_1793115183912.jpg'
    }
  };

  // Inicialização no DOM
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initUserProfile();
    initAvatarChanger();
    initNavigation();
    initHeroCarousel();
    initHeaderSearch();
    initOrderSimulator();
    initAltasBaixasSwitch();
    initTimeframeFilters();
    initDrawingTools();
    initModals();
    initAcoesView();
    initEtfsView();
    initFiisView();
    initRendaFixaView();
    initCarteiraView();
    initAnalisesView();
    initNoticiasView();
    initContaView();
    initMobileMenu();
    initB3LiveSync();

    // Renderiza a visualização inicial
    renderDashboard();

    // Sincroniza dados oficiais da B3 em background imediatamente
    triggerLiveB3Sync(false);

    // Redimensionamento de gráficos responsivos
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        refreshActiveCharts();
      }, 150);
    });
  });

  /* ==========================================================================
     TEMA (DARK / LIGHT)
     ========================================================================== */
  function initTheme() {
    if (state.theme === 'light') {
      document.body.classList.add('light-theme');
    }
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        state.theme = isLight ? 'light' : 'dark';
        localStorage.setItem('twoby-theme', state.theme);
        refreshActiveCharts();
        showToast('Tema alternado com sucesso', 'success');
      });
    }
  }

  /* ==========================================================================
     GERENCIADOR DE FOTO DE PERFIL & DADOS DE MATHEUS PENICHE
     ========================================================================== */
  function initUserProfile() {
    updateProfileDOM();
  }

  function updateProfileDOM() {
    const prof = state.userProfile;
    // Sincroniza fotos
    document.querySelectorAll('.user-avatar-sync').forEach(img => {
      img.src = prof.avatarUrl;
    });

    // Sincroniza nomes
    const headerName = document.getElementById('header-user-name');
    const contaName = document.getElementById('conta-user-name');
    const titularVal = document.getElementById('conta-titular-val');
    const emailEl = document.getElementById('conta-user-email');

    if (headerName) headerName.textContent = prof.name;
    if (contaName) contaName.textContent = prof.name;
    if (titularVal) titularVal.textContent = prof.name;
    if (emailEl) emailEl.textContent = prof.email;
  }

  function initAvatarChanger() {
    const fileInput = document.getElementById('user-avatar-file-input');
    const changeAvatarBtn = document.getElementById('btn-change-avatar');
    const openAvatarModalBtn = document.getElementById('btn-open-avatar-modal');

    // Ao clicar na foto de perfil
    if (changeAvatarBtn && fileInput) {
      changeAvatarBtn.addEventListener('click', () => {
        openAvatarSelectionModal();
      });
    }

    if (openAvatarModalBtn) {
      openAvatarModalBtn.addEventListener('click', () => {
        openAvatarSelectionModal();
      });
    }

    // Leitor de arquivo local do computador
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            showToast('Por favor, selecione um arquivo de imagem válido.', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = function (evt) {
            const dataUrl = evt.target.result;
            setUserAvatar(dataUrl);
            showToast('Foto de perfil de Matheus Peniche atualizada com sucesso!', 'success');
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  function setUserAvatar(url) {
    state.userProfile.avatarUrl = url;
    localStorage.setItem('twoby-user-avatar', url);
    updateProfileDOM();
  }

  // Modal com Galeria e Upload de Foto
  function openAvatarSelectionModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    const currentAvatar = state.userProfile.avatarUrl;
    const presets = [
      { name: 'Matheus Original', url: './assets/images/user_avatar_1793115183912.jpg' },
      { name: 'Sede B3 Noite', url: './assets/images/b3_building_hero_1793115167050.jpg' },
      { name: 'Trader Minimalista', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { name: 'Executivo Tech', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
    ];

    document.getElementById('generic-modal-title').textContent = 'Alterar Foto de Perfil — Matheus Peniche';
    document.getElementById('generic-modal-body').innerHTML = `
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">
        Personalize o avatar de usuário exibido no cabeçalho e na área Minha Conta. Você pode carregar uma foto do seu dispositivo ou escolher um avatar pré-definido:
      </p>

      <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--bg-surface);border-radius:var(--radius-md);margin-bottom:16px;">
        <img src="${currentAvatar}" alt="Foto Atual" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid var(--accent-blue);" />
        <div>
          <strong style="font-size:14px;">${state.userProfile.name}</strong>
          <div style="font-size:11.5px;color:var(--accent-cyan);margin-top:2px;">Foto atual da conta real</div>
        </div>
      </div>

      <div style="margin-bottom:16px;">
        <label class="form-label">Carregar foto do computador:</label>
        <button class="btn-primary" style="width:100%;justify-content:center;padding:11px;" id="btn-trigger-file-upload">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>Escolher Arquivo no Computador (JPG/PNG)</span>
        </button>
      </div>

      <div style="margin-bottom:16px;">
        <label class="form-label">Ou escolha uma imagem pré-configurada:</label>
        <div class="avatar-presets-grid" id="avatar-presets-container">
          ${presets.map((p, idx) => `
            <div style="text-align:center;">
              <img src="${p.url}" alt="${p.name}" class="avatar-preset-item ${currentAvatar === p.url ? 'selected' : ''}" data-preset-url="${p.url}" />
              <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${p.name}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border-subtle);padding-top:14px;">
        <button class="btn-secondary" style="font-size:11.5px;" id="btn-reset-avatar-default">
          Restaurar Padrão
        </button>
        <button class="btn-secondary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Fechar
        </button>
      </div>
    `;

    // Ações do Modal de Avatar
    document.getElementById('btn-trigger-file-upload').addEventListener('click', () => {
      document.getElementById('user-avatar-file-input').click();
      modal.classList.remove('active');
    });

    document.querySelectorAll('[data-preset-url]').forEach(img => {
      img.addEventListener('click', () => {
        const url = img.getAttribute('data-preset-url');
        setUserAvatar(url);
        modal.classList.remove('active');
        showToast('Nova foto de perfil selecionada!', 'success');
      });
    });

    document.getElementById('btn-reset-avatar-default').addEventListener('click', () => {
      setUserAvatar('./assets/images/user_avatar_1793115183912.jpg');
      modal.classList.remove('active');
      showToast('Foto padrão restaurada.', 'success');
    });

    modal.classList.add('active');
  }

  // Modal para Editar Dados do Perfil
  function openEditProfileModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = 'Editar Dados do Perfil';
    document.getElementById('generic-modal-body').innerHTML = `
      <div class="form-group">
        <label class="form-label">Nome Completo</label>
        <input type="text" class="input-custom" id="edit-profile-name" value="${state.userProfile.name}">
      </div>
      <div class="form-group">
        <label class="form-label">E-mail Cadastrado</label>
        <input type="email" class="input-custom" id="edit-profile-email" value="${state.userProfile.email}">
      </div>
      <div class="form-group">
        <label class="form-label">Chave PIX Principal</label>
        <input type="text" class="input-custom" id="edit-profile-pix" value="${state.userProfile.email}">
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;">
        <button class="btn-secondary" onclick="document.getElementById('generic-modal').classList.remove('active')">Cancelar</button>
        <button class="btn-primary" id="btn-save-profile-data">Salvar Alterações</button>
      </div>
    `;

    document.getElementById('btn-save-profile-data').addEventListener('click', () => {
      const newName = document.getElementById('edit-profile-name').value.trim() || 'Matheus Penicwh';
      const newEmail = document.getElementById('edit-profile-email').value.trim() || 'matheuspeniche674@gmail.com';

      state.userProfile.name = newName;
      state.userProfile.email = newEmail;
      localStorage.setItem('twoby-user-name', newName);
      localStorage.setItem('twoby-user-email', newEmail);

      updateProfileDOM();
      modal.classList.remove('active');
      showToast('Dados do perfil de Matheus Peniche salvos com sucesso!', 'success');
    });

    modal.classList.add('active');
  }

  /* ==========================================================================
     NAVEGAÇÃO SPA
     ========================================================================== */
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetViewId = item.getAttribute('data-view');
        switchView(targetViewId);

        const sidebar = document.getElementById('main-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
        }
      });
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-goto');
        if (view) switchView(view);
      });
    });
  }

  function switchView(viewId) {
    state.currentView = viewId;

    document.querySelectorAll('.nav-item[data-view]').forEach(nav => {
      if (nav.getAttribute('data-view') === viewId) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    document.querySelectorAll('.view-section').forEach(view => {
      view.classList.remove('active-view');
    });

    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      if (viewId === 'view-inicio') {
        renderDashboard();
      } else if (viewId === 'view-acoes') {
        renderAcoesTable();
      } else if (viewId === 'view-mercados') {
        renderMercadosPage();
      } else if (viewId === 'view-carteira') {
        renderCarteiraPage();
      } else if (viewId === 'view-analises') {
        renderAnalisesChart();
      }
    }, 50);
  }

  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('main-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }
  }

  /* ==========================================================================
     CAROUSEL DE VÍDEO E BANNERS ARRASTÁVEIS (TOUCH / MOUSE DRAG)
     ========================================================================== */
  function initHeroCarousel() {
    const wrapper = document.getElementById('hero-carousel-wrapper');
    const track = document.getElementById('hero-carousel-track');
    const prevBtn = document.getElementById('carousel-btn-prev');
    const nextBtn = document.getElementById('carousel-btn-next');
    const dotsContainer = document.getElementById('carousel-dots-container');

    if (!wrapper || !track) return;

    const slides = Array.from(track.querySelectorAll('.hero-slide'));
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let deltaX = 0;
    let autoPlayTimer = null;

    function updateCarouselPosition(animate = true) {
      if (animate) {
        track.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)';
      } else {
        track.style.transition = 'none';
      }
      const offsetPercent = -(currentSlide * 100);
      track.style.transform = `translateX(${offsetPercent}%)`;

      // Atualiza dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentSlide);
        });
      }

      // Atualiza vídeos dos slides
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentSlide);
        const video = s.querySelector('video');
        if (video) {
          if (idx === currentSlide) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarouselPosition(true);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateCarouselPosition(true);
    }

    function startAutoplay() {
      stopAutoplay();
      autoPlayTimer = setInterval(nextSlide, 6500);
    }

    function stopAutoplay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Setas
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevSlide();
        startAutoplay();
      });
    }

    // Dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          currentSlide = idx;
          updateCarouselPosition(true);
          startAutoplay();
        });
      });
    }

    // --- Interação de Mouse Drag ---
    wrapper.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      currentX = startX;
      deltaX = 0;
      wrapper.classList.add('is-dragging');
      track.style.transition = 'none';
      stopAutoplay();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX;
      deltaX = currentX - startX;
      const slideWidth = wrapper.offsetWidth || 1;
      const baseOffset = -(currentSlide * 100);
      const deltaPercent = (deltaX / slideWidth) * 100;
      track.style.transform = `translateX(${baseOffset + deltaPercent}%)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.classList.remove('is-dragging');

      const slideWidth = wrapper.offsetWidth || 1;
      const threshold = slideWidth * 0.12;

      if (deltaX < -threshold) {
        nextSlide();
      } else if (deltaX > threshold) {
        prevSlide();
      } else {
        updateCarouselPosition(true);
      }

      startAutoplay();
    });

    // --- Interação Touch em Dispositivos Móveis ---
    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      currentX = startX;
      deltaX = 0;
      track.style.transition = 'none';
      stopAutoplay();
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      currentX = e.touches[0].clientX;
      deltaX = currentX - startX;
      const slideWidth = wrapper.offsetWidth || 1;
      const baseOffset = -(currentSlide * 100);
      const deltaPercent = (deltaX / slideWidth) * 100;
      track.style.transform = `translateX(${baseOffset + deltaPercent}%)`;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const slideWidth = wrapper.offsetWidth || 1;
      const threshold = slideWidth * 0.12;

      if (deltaX < -threshold) {
        nextSlide();
      } else if (deltaX > threshold) {
        prevSlide();
      } else {
        updateCarouselPosition(true);
      }

      startAutoplay();
    });

    // Pausa autoplay quando o mouse estiver sobre o carousel
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', () => {
      if (!isDragging) startAutoplay();
    });

    // Ações dos Botões Internos nos Banners
    const scrollChartBtn = document.getElementById('btn-hero-scroll-chart');
    if (scrollChartBtn) {
      scrollChartBtn.addEventListener('click', () => {
        const chartEl = document.getElementById('main-candlestick-chart') || document.querySelector('.chart-panel-card');
        if (chartEl) {
          chartEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          chartEl.classList.add('highlight-glow');
          setTimeout(() => chartEl.classList.remove('highlight-glow'), 1800);
        }
      });
    }

    const focusPetr4Btn = document.getElementById('btn-slide-focus-petr4');
    if (focusPetr4Btn) {
      focusPetr4Btn.addEventListener('click', async () => {
        if (typeof selectStockForChart === 'function') {
          await selectStockForChart('PETR4');
        }
        const chartEl = document.getElementById('main-candlestick-chart') || document.querySelector('.chart-panel-card');
        if (chartEl) {
          chartEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    // Inicializa posição e autoplay
    updateCarouselPosition(false);
    startAutoplay();
  }

  /* ==========================================================================
     SINCRONIZAÇÃO EM TEMPO REAL — DADOS OFICIAIS B3
     ========================================================================== */
  function initB3LiveSync() {
    const btnSync = document.getElementById('btn-sync-b3-live');
    if (btnSync) {
      btnSync.addEventListener('click', () => {
        triggerLiveB3Sync(true);
      });
    }

    // Auto-refresh a cada 60s quando a página estiver visível
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        triggerLiveB3Sync(false);
      }
    }, 60000);
  }

  async function triggerLiveB3Sync(isUserAction = false) {
    const btnSync = document.getElementById('btn-sync-b3-live');
    const label = document.getElementById('b3-live-status-label');
    if (btnSync) btnSync.classList.add('b3-syncing');
    if (label) label.textContent = 'Sincronizando B3...';

    try {
      const res = await TwoByData.syncLiveB3Quotes();
      if (res && res.success) {
        if (label) {
          const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          label.textContent = `B3 Oficial • ${timeStr}`;
        }

        // Atualiza etiqueta no topo do banner hero
        const heroBadge = document.querySelector('.hero-live-badge span:last-child');
        const ibov = TwoByData.getIndices().find(i => i.id === 'ibovespa');
        if (heroBadge && ibov) {
          heroBadge.textContent = `B3 | AO VIVO • Ibovespa ${ibov.displayValue} (${ibov.changeFormatted})`;
        }

        // Atualiza todas as tabelas e cartões com os novos preços reais
        refreshCurrentViews();

        if (isUserAction) {
          showToast(`Dados oficiais da B3 sincronizados com sucesso (${res.count} ativos atualizados)!`, 'success');
        }
      } else {
        if (label) label.textContent = 'B3 Oficial Conectada';
        if (isUserAction) {
          showToast('Cotações locais atualizadas.', 'info');
        }
      }
    } catch (err) {
      if (label) label.textContent = 'B3 Oficial Conectada';
    } finally {
      if (btnSync) btnSync.classList.remove('b3-syncing');
    }
  }

  function refreshCurrentViews() {
    renderIndicesCards();
    updateStockHeader(state.selectedStock);
    renderAltasBaixasTable();
    renderCarteiraPreview();
    renderDonutPortfolio();

    if (state.currentView === 'view-acoes') renderAcoesTable();
    if (state.currentView === 'view-mercados') renderMercadosPage();
    if (state.currentView === 'view-carteira') renderCarteiraPage();
    if (state.currentView === 'view-etfs') initEtfsView();
    if (state.currentView === 'view-fiis') initFiisView();
  }

  /* ==========================================================================
     DASHBOARD (PÁGINA INICIAL)
     ========================================================================== */
  function renderDashboard() {
    renderIndicesCards();
    renderStockChart(state.selectedStock, state.selectedTimeframe);
    updateStockHeader(state.selectedStock);
    renderDonutPortfolio();
    renderAltasBaixasTable();
    renderCarteiraPreview();
    renderDesempenhoArea(state.desempenhoPeriod);
    renderNewsCompact();
  }

  function renderIndicesCards() {
    const container = document.getElementById('market-indices-grid');
    if (!container) return;

    const indices = TwoByData.getIndices().slice(0, 4);
    container.innerHTML = '';

    indices.forEach(idx => {
      const card = document.createElement('div');
      card.className = 'indicator-card';
      const changeClass = idx.isPositive ? 'positive' : 'negative';
      const arrow = idx.isPositive ? '▲' : '▼';

      card.innerHTML = `
        <div class="indicator-header">
          <span class="indicator-name">${idx.name}</span>
          <span class="indicator-change-badge ${changeClass}">
            ${arrow} ${idx.changeFormatted}
          </span>
        </div>
        <div class="indicator-main">
          <span class="indicator-value tabular-nums">${idx.displayValue}</span>
          <canvas class="sparkline-canvas" id="spark-${idx.id}"></canvas>
        </div>
      `;

      card.addEventListener('click', () => {
        showToast(`Índice ${idx.name}: ${idx.displayValue} (${idx.changeFormatted})`, 'success');
      });

      container.appendChild(card);

      setTimeout(() => {
        TwoByCharts.renderSparkline(`spark-${idx.id}`, idx.sparkline, idx.isPositive);
      }, 20);
    });
  }

  async function renderStockChart(ticker, period) {
    let candles = [];
    if (typeof TwoByData.fetchOfficialHistory === 'function') {
      try {
        candles = await TwoByData.fetchOfficialHistory(ticker, period);
      } catch (err) {
        candles = TwoByData.getStockHistory(ticker, period);
      }
    } else {
      candles = TwoByData.getStockHistory(ticker, period);
    }
    TwoByCharts.renderCandlestick('main-candlestick-chart', candles);
  }

  function updateStockHeader(ticker) {
    const stock = TwoByData.getStocks().find(s => s.ticker === ticker) || TwoByData.getStocks()[0];
    if (!stock) return;

    const logoBadge = document.getElementById('chart-stock-badge');
    const stockName = document.getElementById('chart-stock-name');
    const stockSub = document.getElementById('chart-stock-sub');
    const stockPrice = document.getElementById('chart-stock-price');
    const stockDiff = document.getElementById('chart-stock-diff');

    if (logoBadge) {
      logoBadge.textContent = stock.logoBadge;
    }
    if (stockName) stockName.innerHTML = `${stock.ticker} <span style="font-weight:400;color:var(--text-secondary);font-size:12px;">${stock.company}</span>`;
    if (stockSub) stockSub.textContent = stock.name;
    if (stockPrice) stockPrice.textContent = 'R$ ' + stock.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    if (stockDiff) {
      const isPos = stock.change >= 0;
      stockDiff.className = `stock-price-diff tabular-nums ${isPos ? 'positive' : 'negative'}`;
      stockDiff.textContent = `${isPos ? '▲ +' : '▼ '}${stock.change.toFixed(2)}% (${isPos ? '+' : ''}${stock.changeAbs.toFixed(2)})`;
    }

    const statMax = document.getElementById('stat-ribbon-max');
    const statMin = document.getElementById('stat-ribbon-min');
    const statVol = document.getElementById('stat-ribbon-vol');
    const statTrades = document.getElementById('stat-ribbon-trades');

    if (statMax) statMax.textContent = 'R$ ' + stock.high.toFixed(2);
    if (statMin) statMin.textContent = 'R$ ' + stock.low.toFixed(2);
    if (statVol) statVol.textContent = stock.volume;
    if (statTrades) statTrades.textContent = stock.trades;

    updateSimulatorEstimates();
  }

  function initTimeframeFilters() {
    const buttons = document.querySelectorAll('.timeframe-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedTimeframe = btn.getAttribute('data-period');
        await renderStockChart(state.selectedStock, state.selectedTimeframe);
      });
    });
  }

  function initDrawingTools() {
    document.querySelectorAll('.tool-icon-btn').forEach(tool => {
      tool.addEventListener('click', () => {
        document.querySelectorAll('.tool-icon-btn').forEach(t => t.classList.remove('active'));
        tool.classList.add('active');
        const toolName = tool.getAttribute('title') || 'Ferramenta';
        state.activeTool = toolName;
        showToast(`${toolName} ativada no gráfico de candlesticks`, 'success');
      });
    });
  }

  function initOrderSimulator() {
    const btnBuy = document.getElementById('order-tab-buy');
    const btnSell = document.getElementById('order-tab-sell');
    const qtyInput = document.getElementById('order-qty-input');
    const btnMinus = document.getElementById('qty-minus-btn');
    const btnPlus = document.getElementById('qty-plus-btn');
    const btnExecute = document.getElementById('btn-execute-order-action');
    const orderTypeSelect = document.getElementById('order-type-select');

    if (btnBuy && btnSell) {
      btnBuy.addEventListener('click', () => {
        state.orderType = 'Compra';
        btnBuy.className = 'order-tab-btn buy-active';
        btnSell.className = 'order-tab-btn';
        if (btnExecute) {
          btnExecute.className = 'btn-execute-order';
          btnExecute.textContent = `Comprar ${state.selectedStock}`;
        }
        updateSimulatorEstimates();
      });

      btnSell.addEventListener('click', () => {
        state.orderType = 'Venda';
        btnSell.className = 'order-tab-btn sell-active';
        btnBuy.className = 'order-tab-btn';
        if (btnExecute) {
          btnExecute.className = 'btn-execute-order sell';
          btnExecute.textContent = `Vender ${state.selectedStock}`;
        }
        updateSimulatorEstimates();
      });
    }

    if (btnMinus && btnPlus && qtyInput) {
      btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 100;
        val = Math.max(10, val - 100);
        if (val < 10) val = 10;
        qtyInput.value = val;
        state.orderQuantity = val;
        updateSimulatorEstimates();
      });

      btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 100;
        val += 100;
        qtyInput.value = val;
        state.orderQuantity = val;
        updateSimulatorEstimates();
      });

      qtyInput.addEventListener('input', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        state.orderQuantity = val;
        updateSimulatorEstimates();
      });
    }

    if (orderTypeSelect) {
      orderTypeSelect.addEventListener('change', () => {
        updateSimulatorEstimates();
      });
    }

    if (btnExecute) {
      btnExecute.addEventListener('click', () => {
        const orderType = orderTypeSelect ? orderTypeSelect.value : 'Ordem a mercado';
        const res = TwoByData.executeOrder({
          ticker: state.selectedStock,
          type: state.orderType,
          quantity: state.orderQuantity,
          orderType
        });

        if (res.success) {
          showToast(res.message, 'success');
          renderDonutPortfolio();
          renderCarteiraPreview();
          updateSimulatorEstimates();
        } else {
          showToast(res.message, 'error');
        }
      });
    }
  }

  function updateSimulatorEstimates() {
    const stock = TwoByData.getStocks().find(s => s.ticker === state.selectedStock) || TwoByData.getStocks()[0];
    const qty = state.orderQuantity || 100;
    const price = stock ? stock.price : 32.18;
    const total = qty * price;

    const elEstimated = document.getElementById('order-estimated-value');
    const elAvailable = document.getElementById('order-available-balance');
    const btnExecute = document.getElementById('btn-execute-order-action');

    if (elEstimated) {
      elEstimated.textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    if (elAvailable) {
      const balance = TwoByData.getPortfolio().availableBalance;
      elAvailable.textContent = 'R$ ' + balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
    if (btnExecute) {
      btnExecute.textContent = `${state.orderType} ${state.selectedStock}`;
    }
  }

  function renderDonutPortfolio() {
    const portfolio = TwoByData.getPortfolio();
    const totalFormatted = 'R$ ' + portfolio.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    TwoByCharts.renderDonut('portfolio-donut-chart', portfolio.allocation, '');

    const totalEl = document.getElementById('donut-total-value');
    const diffEl = document.getElementById('donut-total-diff');

    if (totalEl) totalEl.textContent = totalFormatted;
    if (diffEl) {
      diffEl.textContent = `▲ +${portfolio.totalProfitLossPercent.toFixed(2)}% (hoje)`;
    }

    const legendEl = document.getElementById('donut-legend-container');
    if (legendEl) {
      legendEl.innerHTML = '';
      Object.values(portfolio.allocation).forEach(item => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `
          <span>
            <span class="legend-color-dot" style="background-color:${item.color};"></span>
            ${item.label}
          </span>
          <strong class="tabular-nums">${item.percentage.toFixed(1)}%</strong>
        `;
        legendEl.appendChild(div);
      });
    }
  }

  function initAltasBaixasSwitch() {
    const tabAltas = document.getElementById('tab-maiores-altas');
    const tabBaixas = document.getElementById('tab-maiores-baixas');

    if (tabAltas && tabBaixas) {
      tabAltas.addEventListener('click', () => {
        tabAltas.classList.add('active');
        tabBaixas.classList.remove('active');
        state.altasBaixasTab = 'altas';
        renderAltasBaixasTable();
      });

      tabBaixas.addEventListener('click', () => {
        tabBaixas.classList.add('active');
        tabAltas.classList.remove('active');
        state.altasBaixasTab = 'baixas';
        renderAltasBaixasTable();
      });
    }
  }

  function renderAltasBaixasTable() {
    const tbody = document.getElementById('altas-baixas-table-body');
    if (!tbody) return;

    const allStocks = [...TwoByData.getStocks()];
    let sorted = [];

    if (state.altasBaixasTab === 'altas') {
      sorted = allStocks.sort((a, b) => b.change - a.change).slice(0, 5);
    } else {
      sorted = allStocks.sort((a, b) => a.change - b.change).slice(0, 5);
    }

    tbody.innerHTML = '';
    sorted.forEach(stock => {
      const tr = document.createElement('tr');
      const isPos = stock.change >= 0;
      const changeClass = isPos ? 'positive' : 'negative';
      const arrow = isPos ? '▲' : '▼';

      tr.innerHTML = `
        <td><strong class="ticker-code">${stock.ticker}</strong></td>
        <td class="tabular-nums">R$ ${stock.price.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}" style="font-weight:700;">
          ${arrow} ${isPos ? '+' : ''}${stock.change.toFixed(2)}%
        </td>
      `;

      tr.addEventListener('click', () => {
        selectStockForChart(stock.ticker);
      });

      tbody.appendChild(tr);
    });
  }

  async function selectStockForChart(ticker) {
    state.selectedStock = ticker;
    updateStockHeader(ticker);
    await renderStockChart(ticker, state.selectedTimeframe);
    showToast(`Ativo ${ticker} selecionado no gráfico principal`, 'success');
  }

  function renderCarteiraPreview() {
    const tbody = document.getElementById('dashboard-portfolio-body');
    if (!tbody) return;

    const positions = TwoByData.getPortfolio().positions.slice(0, 4);
    tbody.innerHTML = '';

    positions.forEach(pos => {
      const tr = document.createElement('tr');
      const isPos = pos.change >= 0;
      const changeClass = isPos ? 'positive' : 'negative';
      const arrow = isPos ? '▲' : '▼';

      tr.innerHTML = `
        <td><strong class="ticker-code">${pos.ticker}</strong></td>
        <td class="tabular-nums">${pos.quantity}</td>
        <td class="tabular-nums">R$ ${pos.avgPrice.toFixed(2)}</td>
        <td class="tabular-nums">R$ ${pos.currentPrice.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}">${arrow} ${isPos ? '+' : ''}${pos.change.toFixed(2)}%</td>
        <td class="tabular-nums" style="font-weight:700;">R$ ${pos.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
      `;

      tr.addEventListener('click', () => {
        openAssetDetailModal(pos.ticker);
      });

      tbody.appendChild(tr);
    });
  }

  function renderDesempenhoArea(period) {
    const history = TwoByData.getPortfolio().historyPerformance[period] || TwoByData.getPortfolio().historyPerformance['1M'];
    TwoByCharts.renderArea('carteira-performance-canvas', history);

    const periodEl = document.getElementById('desempenho-percent-val');
    if (periodEl) {
      const lastPoint = history[history.length - 1];
      periodEl.textContent = `+${lastPoint.percent.toFixed(2)}% no período`;
    }

    document.querySelectorAll('.desempenho-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.desempenho-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.desempenhoPeriod = btn.getAttribute('data-period');
        renderDesempenhoArea(state.desempenhoPeriod);
      });
    });
  }

  function renderNewsCompact() {
    const container = document.getElementById('dashboard-news-list');
    if (!container) return;

    const news = TwoByData.getNews().slice(0, 3);
    container.innerHTML = '';

    news.forEach(item => {
      const el = document.createElement('div');
      el.className = 'news-item-compact';
      el.innerHTML = `
        <div class="news-meta-compact">
          <span class="tabular-nums" style="color:var(--accent-cyan);font-weight:700;">${item.time}</span>
          <span>·</span>
          <span>${item.source}</span>
          <span>·</span>
          <span>${item.category}</span>
        </div>
        <div class="news-title-compact">${item.title}</div>
      `;
      el.addEventListener('click', () => {
        openNewsModal(item);
      });
      container.appendChild(el);
    });
  }

  /* ==========================================================================
     PÁGINA: AÇÕES COM ORDENAÇÃO DE COLUNAS
     ========================================================================== */
  function initAcoesView() {
    const searchInput = document.getElementById('acoes-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.acoesSearch = e.target.value.toLowerCase().trim();
        renderAcoesTable();
      });
    }

    document.querySelectorAll('.acoes-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.acoes-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.acoesFilter = btn.getAttribute('data-category');
        renderAcoesTable();
      });
    });

    // Eventos de ordenação em colunas
    document.querySelectorAll('#view-acoes th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (state.sortColumn === col) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortColumn = col;
          state.sortDirection = col === 'ticker' || col === 'company' ? 'asc' : 'desc';
        }

        document.querySelectorAll('#view-acoes th.sortable').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(state.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');

        renderAcoesTable();
      });
    });
  }

  function renderAcoesTable() {
    const tbody = document.getElementById('acoes-table-body');
    if (!tbody) return;

    let stocks = [...TwoByData.getStocks()];

    if (state.acoesFilter === 'favoritos') {
      stocks = stocks.filter(s => s.isFavorite);
    } else if (state.acoesFilter === 'dividendos') {
      stocks = stocks.filter(s => s.dy > 5);
    }

    if (state.acoesSearch) {
      stocks = stocks.filter(s =>
        s.ticker.toLowerCase().includes(state.acoesSearch) ||
        s.name.toLowerCase().includes(state.acoesSearch) ||
        s.company.toLowerCase().includes(state.acoesSearch) ||
        s.sector.toLowerCase().includes(state.acoesSearch)
      );
    }

    // Ordenação ativa
    if (state.sortColumn) {
      stocks.sort((a, b) => {
        let valA = a[state.sortColumn];
        let valB = b[state.sortColumn];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return state.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return state.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    tbody.innerHTML = '';

    if (stocks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted);">
            Nenhuma ação encontrada para os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    stocks.forEach(stock => {
      const tr = document.createElement('tr');
      const isPos = stock.change >= 0;
      const changeClass = isPos ? 'positive' : 'negative';
      const arrow = isPos ? '▲' : '▼';

      tr.innerHTML = `
        <td style="width:40px;">
          <button class="favorite-star-btn ${stock.isFavorite ? 'is-fav' : ''}" data-ticker="${stock.ticker}" title="Favoritar">
            ★
          </button>
        </td>
        <td>
          <div class="ticker-cell">
            <div class="ticker-badge-small" style="background:linear-gradient(135deg, #0066FF, #00C2FF);">
              ${stock.logoBadge}
            </div>
            <div>
              <strong class="ticker-code">${stock.ticker}</strong>
              <div style="font-size:11px;color:var(--text-secondary);">${stock.name}</div>
            </div>
          </div>
        </td>
        <td>${stock.company}</td>
        <td class="tabular-nums" style="font-weight:700;">R$ ${stock.price.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}" style="font-weight:700;">
          ${arrow} ${isPos ? '+' : ''}${stock.change.toFixed(2)}%
        </td>
        <td class="tabular-nums">R$ ${stock.high.toFixed(2)}</td>
        <td class="tabular-nums">R$ ${stock.low.toFixed(2)}</td>
        <td class="tabular-nums">${stock.volume}</td>
        <td>
          <button class="btn-primary" style="padding:4px 12px;font-size:11.5px;" data-trade-stock="${stock.ticker}">
            Negociar
          </button>
        </td>
      `;

      tr.querySelector('.favorite-star-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const isFav = TwoByData.toggleFavorite(stock.ticker);
        e.currentTarget.classList.toggle('is-fav', isFav);
        showToast(`${stock.ticker} ${isFav ? 'adicionado aos' : 'removido dos'} favoritos`, 'success');
      });

      tr.querySelector('[data-trade-stock]').addEventListener('click', (e) => {
        e.stopPropagation();
        openNovaOrdemModal(stock.ticker);
      });

      tr.addEventListener('click', () => {
        openAssetDetailModal(stock.ticker);
      });

      tbody.appendChild(tr);
    });
  }

  /* ==========================================================================
     PÁGINAS MERCADOS, ETFS, FIIS, RENDA FIXA
     ========================================================================== */
  function renderMercadosPage() {
    const container = document.getElementById('mercados-cards-list');
    if (!container) return;

    const indices = TwoByData.getIndices();
    container.innerHTML = '';

    indices.forEach(idx => {
      const card = document.createElement('div');
      card.className = 'indicator-card';
      const changeClass = idx.isPositive ? 'positive' : 'negative';
      const arrow = idx.isPositive ? '▲' : '▼';

      card.innerHTML = `
        <div class="indicator-header">
          <div>
            <span class="indicator-name" style="font-size:13px;color:var(--text-primary);">${idx.name}</span>
            <div style="font-size:10.5px;color:var(--text-muted);">${idx.category.toUpperCase()}</div>
          </div>
          <span class="indicator-change-badge ${changeClass}" style="font-size:12px;">
            ${arrow} ${idx.changeFormatted}
          </span>
        </div>
        <div class="indicator-main" style="margin-top:12px;">
          <span class="indicator-value tabular-nums" style="font-size:22px;">${idx.displayValue}</span>
          <canvas class="sparkline-canvas" id="spark-mercado-${idx.id}" style="width:110px;height:42px;"></canvas>
        </div>
      `;

      container.appendChild(card);

      setTimeout(() => {
        TwoByCharts.renderSparkline(`spark-mercado-${idx.id}`, idx.sparkline, idx.isPositive);
      }, 20);
    });
  }

  function initEtfsView() {
    const tbody = document.getElementById('etfs-table-body');
    if (!tbody) return;

    const etfs = TwoByData.getEtfs();
    tbody.innerHTML = '';

    etfs.forEach(etf => {
      const tr = document.createElement('tr');
      const isPos = etf.change >= 0;
      const changeClass = isPos ? 'positive' : 'negative';
      const arrow = isPos ? '▲' : '▼';

      tr.innerHTML = `
        <td><strong class="ticker-code" style="color:var(--accent-cyan);">${etf.ticker}</strong></td>
        <td>
          <strong>${etf.name}</strong>
          <div style="font-size:11px;color:var(--text-muted);">${etf.manager}</div>
        </td>
        <td>${etf.benchmark}</td>
        <td class="tabular-nums" style="font-weight:700;">R$ ${etf.price.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}">${arrow} +${etf.change.toFixed(2)}%</td>
        <td class="tabular-nums">${etf.fee}</td>
        <td class="tabular-nums">${etf.volume}</td>
        <td>
          <button class="btn-primary" style="padding:4px 12px;font-size:11.5px;" data-trade-etf="${etf.ticker}">
            Negociar
          </button>
        </td>
      `;

      tr.querySelector('[data-trade-etf]').addEventListener('click', (e) => {
        e.stopPropagation();
        openNovaOrdemModal(etf.ticker);
      });

      tbody.appendChild(tr);
    });
  }

  function initFiisView() {
    const tbody = document.getElementById('fiis-table-body');
    if (!tbody) return;

    const fiis = TwoByData.getFiis();
    tbody.innerHTML = '';

    fiis.forEach(fii => {
      const tr = document.createElement('tr');
      const isPos = fii.change >= 0;
      const changeClass = isPos ? 'positive' : 'negative';
      const arrow = isPos ? '▲' : '▼';

      tr.innerHTML = `
        <td><strong class="ticker-code" style="color:var(--accent-cyan);">${fii.ticker}</strong></td>
        <td>${fii.name}</td>
        <td><span style="font-size:11px;padding:2px 8px;border-radius:4px;background-color:var(--bg-surface);">${fii.category}</span></td>
        <td class="tabular-nums" style="font-weight:700;">R$ ${fii.price.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}">${arrow} +${fii.change.toFixed(2)}%</td>
        <td class="tabular-nums" style="color:var(--bull-green);font-weight:700;">${fii.dy12m.toFixed(1)}%</td>
        <td class="tabular-nums">${fii.lastDividend}</td>
        <td class="tabular-nums">${fii.pvp.toFixed(2)}</td>
        <td class="tabular-nums">${fii.liquidity}</td>
        <td>
          <button class="btn-secondary" style="padding:4px 10px;font-size:11.5px;" data-trade-fii="${fii.ticker}">
            Investir
          </button>
        </td>
      `;

      tr.querySelector('[data-trade-fii]').addEventListener('click', (e) => {
        e.stopPropagation();
        openNovaOrdemModal(fii.ticker);
      });

      tbody.appendChild(tr);
    });
  }

  function initRendaFixaView() {
    const grid = document.getElementById('renda-fixa-cards-grid');
    if (!grid) return;

    const items = TwoByData.getFixedIncome();
    grid.innerHTML = '';

    items.forEach(fi => {
      const card = document.createElement('div');
      card.className = 'fi-card';

      card.innerHTML = `
        <div>
          <div class="fi-card-header">
            <div>
              <span class="fi-badge">${fi.badge}</span>
              <h3 style="font-size:16px;font-weight:700;margin-top:6px;">${fi.title}</h3>
              <span style="font-size:11px;color:var(--text-muted);">${fi.issuer}</span>
            </div>
          </div>
          <div class="fi-rate tabular-nums">${fi.rate}</div>
          <div class="fi-details-list">
            <div class="fi-detail-row">
              <span>Vencimento:</span>
              <strong class="tabular-nums">${fi.maturity}</strong>
            </div>
            <div class="fi-detail-row">
              <span>Aplicação Mínima:</span>
              <strong class="tabular-nums">${fi.minInvestment}</strong>
            </div>
            <div class="fi-detail-row">
              <span>Liquidez:</span>
              <strong>${fi.liquidity}</strong>
            </div>
            <div class="fi-detail-row">
              <span>Classificação de Risco:</span>
              <strong style="color:var(--bull-green);">${fi.risk}</strong>
            </div>
          </div>
        </div>
        <button class="btn-primary" style="width:100%;justify-content:center;padding:10px;" data-invest-fi="${fi.title}">
          Simular Aplicação
        </button>
      `;

      card.querySelector('[data-invest-fi]').addEventListener('click', () => {
        showToast(`Simulação iniciada para ${fi.title} (${fi.rate}). Cotação demonstrativa.`, 'success');
      });

      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     CARTEIRA & MODAL DE NOVA ORDEM
     ========================================================================== */
  function renderCarteiraPage() {
    const p = TwoByData.getPortfolio();

    const elTotal = document.getElementById('carteira-full-total');
    const elSaldo = document.getElementById('carteira-full-saldo');
    const elLucro = document.getElementById('carteira-full-lucro');

    if (elTotal) elTotal.textContent = 'R$ ' + p.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (elSaldo) elSaldo.textContent = 'R$ ' + p.availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (elLucro) {
      elLucro.textContent = `+R$ ${p.totalProfitLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (+${p.totalProfitLossPercent}%)`;
    }

    renderCarteiraPositionsTable();
    renderCarteiraOrdersTable();
  }

  function initCarteiraView() {
    const tabPos = document.getElementById('tab-carteira-posicoes');
    const tabOrd = document.getElementById('tab-carteira-ordens');
    const tabHist = document.getElementById('tab-carteira-historico');

    if (tabPos && tabOrd) {
      tabPos.addEventListener('click', () => {
        tabPos.classList.add('active');
        tabOrd.classList.remove('active');
        tabHist?.classList.remove('active');
        document.getElementById('carteira-posicoes-view').style.display = 'block';
        document.getElementById('carteira-ordens-view').style.display = 'none';
      });

      tabOrd.addEventListener('click', () => {
        tabOrd.classList.add('active');
        tabPos.classList.remove('active');
        tabHist?.classList.remove('active');
        document.getElementById('carteira-posicoes-view').style.display = 'none';
        document.getElementById('carteira-ordens-view').style.display = 'block';
      });

      tabHist?.addEventListener('click', () => {
        tabHist.classList.add('active');
        tabPos.classList.remove('active');
        tabOrd.classList.remove('active');
        document.getElementById('carteira-posicoes-view').style.display = 'none';
        document.getElementById('carteira-ordens-view').style.display = 'block';
      });
    }

    const btnNovaOrdem = document.getElementById('btn-nova-ordem-modal');
    if (btnNovaOrdem) {
      btnNovaOrdem.addEventListener('click', () => {
        openNovaOrdemModal(state.selectedStock);
      });
    }
  }

  function renderCarteiraPositionsTable() {
    const tbody = document.getElementById('carteira-full-positions-body');
    if (!tbody) return;

    const positions = TwoByData.getPortfolio().positions;
    tbody.innerHTML = '';

    positions.forEach(pos => {
      const tr = document.createElement('tr');
      const isPos = pos.profitAbs >= 0;
      const changeClass = isPos ? 'positive' : 'negative';

      tr.innerHTML = `
        <td><strong class="ticker-code">${pos.ticker}</strong></td>
        <td class="tabular-nums">${pos.quantity}</td>
        <td class="tabular-nums">R$ ${pos.avgPrice.toFixed(2)}</td>
        <td class="tabular-nums">R$ ${pos.currentPrice.toFixed(2)}</td>
        <td class="tabular-nums ${changeClass}" style="font-weight:700;">
          ${isPos ? '+' : ''}R$ ${pos.profitAbs.toFixed(2)} (${isPos ? '+' : ''}${pos.profitPercent}%)
        </td>
        <td class="tabular-nums" style="font-weight:700;">R$ ${pos.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td>
          <button class="btn-secondary" style="padding:4px 10px;font-size:11px;" data-sell-pos="${pos.ticker}">
            Vender
          </button>
        </td>
      `;

      tr.querySelector('[data-sell-pos]').addEventListener('click', (e) => {
        e.stopPropagation();
        openNovaOrdemModal(pos.ticker, 'Venda');
      });

      tbody.appendChild(tr);
    });
  }

  function renderCarteiraOrdersTable() {
    const tbody = document.getElementById('carteira-full-orders-body');
    if (!tbody) return;

    const orders = TwoByData.getPortfolio().orders;
    tbody.innerHTML = '';

    orders.forEach(o => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="tabular-nums">${o.id}</td>
        <td class="tabular-nums">${o.date}</td>
        <td><strong class="ticker-code">${o.ticker}</strong></td>
        <td><span class="${o.type === 'Compra' ? 'positive' : 'negative'}" style="font-weight:700;">${o.type}</span></td>
        <td>${o.orderType}</td>
        <td class="tabular-nums">${o.quantity}</td>
        <td class="tabular-nums">R$ ${o.price.toFixed(2)}</td>
        <td class="tabular-nums">R$ ${o.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        <td><span style="color:var(--bull-green);font-size:11px;font-weight:600;">● ${o.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Modal de Emissão de Nova Ordem
  function openNovaOrdemModal(defaultTicker = 'PETR4', defaultType = 'Compra') {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    const allStocks = TwoByData.getStocks();
    const targetStock = allStocks.find(s => s.ticker === defaultTicker) || allStocks[0];

    document.getElementById('generic-modal-title').textContent = 'Boleta de Nova Ordem — B3';
    document.getElementById('generic-modal-body').innerHTML = `
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        <button class="order-tab-btn ${defaultType === 'Compra' ? 'buy-active' : ''}" style="flex:1;" id="modal-tab-buy">Compra</button>
        <button class="order-tab-btn ${defaultType === 'Venda' ? 'sell-active' : ''}" style="flex:1;" id="modal-tab-sell">Venda</button>
      </div>

      <div class="form-group">
        <label class="form-label">Selecionar Ativo B3</label>
        <select class="select-custom" id="modal-order-ticker">
          ${allStocks.map(s => `
            <option value="${s.ticker}" ${s.ticker === targetStock.ticker ? 'selected' : ''}>
              ${s.ticker} — ${s.name} (R$ ${s.price.toFixed(2)})
            </option>
          `).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Tipo de Ordem</label>
        <select class="select-custom" id="modal-order-type">
          <option value="A mercado">A Mercado (Execução imediata)</option>
          <option value="Limitada">Limitada</option>
          <option value="Stop Loss">Stop Loss</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Quantidade</label>
        <div class="quantity-stepper">
          <button class="stepper-btn" id="modal-qty-minus">−</button>
          <input type="number" class="stepper-input tabular-nums" id="modal-order-qty" value="100" min="10" step="100" />
          <button class="stepper-btn" id="modal-qty-plus">+</button>
        </div>
      </div>

      <div class="order-summary-box">
        <div class="summary-row">
          <span>Saldo em conta:</span>
          <strong class="tabular-nums">R$ ${TwoByData.getPortfolio().availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </div>
        <div class="summary-row">
          <span>Valor estimado total:</span>
          <strong class="tabular-nums" style="color:var(--accent-cyan);font-size:15px;" id="modal-order-total-est">R$ 0,00</strong>
        </div>
      </div>

      <button class="btn-primary" style="width:100%;justify-content:center;padding:12px;font-size:14px;" id="modal-btn-execute-trade">
        Confirmar Ordem de ${defaultType}
      </button>
    `;

    let activeType = defaultType;

    const calcModalTotal = () => {
      const selected = document.getElementById('modal-order-ticker').value;
      const stock = allStocks.find(s => s.ticker === selected) || targetStock;
      const qty = parseInt(document.getElementById('modal-order-qty').value, 10) || 100;
      const total = qty * stock.price;
      document.getElementById('modal-order-total-est').textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      document.getElementById('modal-btn-execute-trade').textContent = `Confirmar ${activeType} de ${qty}x ${stock.ticker}`;
    };

    document.getElementById('modal-tab-buy').addEventListener('click', () => {
      activeType = 'Compra';
      document.getElementById('modal-tab-buy').className = 'order-tab-btn buy-active';
      document.getElementById('modal-tab-sell').className = 'order-tab-btn';
      calcModalTotal();
    });

    document.getElementById('modal-tab-sell').addEventListener('click', () => {
      activeType = 'Venda';
      document.getElementById('modal-tab-sell').className = 'order-tab-btn sell-active';
      document.getElementById('modal-tab-buy').className = 'order-tab-btn';
      calcModalTotal();
    });

    document.getElementById('modal-order-ticker').addEventListener('change', calcModalTotal);
    document.getElementById('modal-order-qty').addEventListener('input', calcModalTotal);

    document.getElementById('modal-qty-minus').addEventListener('click', () => {
      const el = document.getElementById('modal-order-qty');
      let val = parseInt(el.value, 10) || 100;
      val = Math.max(10, val - 100);
      el.value = val;
      calcModalTotal();
    });

    document.getElementById('modal-qty-plus').addEventListener('click', () => {
      const el = document.getElementById('modal-order-qty');
      let val = parseInt(el.value, 10) || 100;
      val += 100;
      el.value = val;
      calcModalTotal();
    });

    calcModalTotal();

    document.getElementById('modal-btn-execute-trade').addEventListener('click', () => {
      const ticker = document.getElementById('modal-order-ticker').value;
      const qty = parseInt(document.getElementById('modal-order-qty').value, 10) || 100;
      const orderType = document.getElementById('modal-order-type').value;

      const res = TwoByData.executeOrder({
        ticker,
        type: activeType,
        quantity: qty,
        orderType
      });

      if (res.success) {
        showToast(res.message, 'success');
        modal.classList.remove('active');
        renderCarteiraPage();
        renderDonutPortfolio();
      } else {
        showToast(res.message, 'error');
      }
    });

    modal.classList.add('active');
  }

  /* ==========================================================================
     ANÁLISES, NOTÍCIAS & MINHA CONTA
     ========================================================================== */
  function initAnalisesView() {
    const select = document.getElementById('analises-comparison-select');
    if (select) {
      select.addEventListener('change', () => {
        renderAnalisesChart();
      });
    }
  }

  function renderAnalisesChart() {
    const series = [
      {
        name: 'PETR4',
        color: '#00E396',
        data: [
          { date: '01/10', pct: 0 },
          { date: '07/10', pct: 2.1 },
          { date: '14/10', pct: 5.4 },
          { date: '21/10', pct: 4.8 },
          { date: '28/10', pct: 8.5 }
        ]
      },
      {
        name: 'VALE3',
        color: '#00C2FF',
        data: [
          { date: '01/10', pct: 0 },
          { date: '07/10', pct: -1.2 },
          { date: '14/10', pct: 1.5 },
          { date: '21/10', pct: 3.2 },
          { date: '28/10', pct: 6.1 }
        ]
      },
      {
        name: 'IBOVESPA',
        color: '#0066FF',
        data: [
          { date: '01/10', pct: 0 },
          { date: '07/10', pct: 0.8 },
          { date: '14/10', pct: 2.2 },
          { date: '21/10', pct: 2.9 },
          { date: '28/10', pct: 4.2 }
        ]
      }
    ];

    TwoByCharts.renderComparison('analises-comparison-canvas', series);
  }

  function initNoticiasView() {
    const list = document.getElementById('noticias-full-feed');
    if (!list) return;

    const allNews = TwoByData.getNews();
    list.innerHTML = '';

    allNews.forEach(n => {
      const item = document.createElement('div');
      item.className = 'panel-card';
      item.style.marginBottom = '14px';
      item.style.cursor = 'pointer';

      item.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text-muted);">
            <span style="color:var(--accent-cyan);font-weight:700;">${n.source}</span>
            <span>·</span>
            <span>${n.category}</span>
            <span>·</span>
            <span>${n.time} (${n.date})</span>
          </div>
          <span style="font-size:11px;color:var(--text-muted);">${n.readTime} de leitura</span>
        </div>
        <h3 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">${n.title}</h3>
        <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;">${n.summary}</p>
      `;

      item.addEventListener('click', () => {
        openNewsModal(n);
      });

      list.appendChild(item);
    });
  }

  function initContaView() {
    const port = TwoByData.getPortfolio();

    const saldoEl = document.getElementById('conta-saldo-disponivel');
    const patriEl = document.getElementById('conta-patrimonio-total');

    if (saldoEl) saldoEl.textContent = 'R$ ' + port.availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    if (patriEl) patriEl.textContent = 'R$ ' + port.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    const btnDep = document.getElementById('btn-action-depositar');
    const btnSac = document.getElementById('btn-action-sacar');
    const btnExt = document.getElementById('btn-action-extrato');
    const btnEdit = document.getElementById('btn-action-editar-perfil');
    const btnLogin = document.getElementById('btn-action-login');

    if (btnDep) btnDep.addEventListener('click', () => openDepositModal());
    if (btnSac) btnSac.addEventListener('click', () => openWithdrawModal());
    if (btnExt) btnExt.addEventListener('click', () => openExtratoModal());
    if (btnEdit) btnEdit.addEventListener('click', () => openEditProfileModal());
    if (btnLogin) btnLogin.addEventListener('click', () => openConfiguracoesModal());
  }

  /* ==========================================================================
     MODAIS UTILITÁRIOS (EXTRATO, CONFIGURAÇÕES, DEPÓSITO, SAQUE)
     ========================================================================== */
  function openExtratoModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    const orders = TwoByData.getPortfolio().orders;

    document.getElementById('generic-modal-title').textContent = 'Extrato de Negociações & Proventos B3';
    document.getElementById('generic-modal-body').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:12px;color:var(--text-secondary);">Histórico completo de transações da conta</span>
        <button class="btn-secondary" style="padding:4px 10px;font-size:11px;" id="btn-export-csv">
          Exportar Extrato (CSV)
        </button>
      </div>

      <div style="max-height:300px;overflow-y:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
        <table class="table-compact">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Ativo</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td class="tabular-nums">${o.date}</td>
                <td><strong class="ticker-code">${o.ticker}</strong></td>
                <td><span class="${o.type === 'Compra' ? 'positive' : 'negative'}">${o.type}</span></td>
                <td class="tabular-nums">${o.quantity}</td>
                <td class="tabular-nums">R$ ${o.price.toFixed(2)}</td>
                <td class="tabular-nums">R$ ${o.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top:16px;text-align:right;">
        <button class="btn-primary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Concluir
        </button>
      </div>
    `;

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      showToast('Extrato de Matheus Peniche exportado em formato CSV demonstrativo.', 'success');
    });

    modal.classList.add('active');
  }

  function openConfiguracoesModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = 'Configurações da Plataforma TWO BY';
    document.getElementById('generic-modal-body').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle);">
          <div>
            <strong>Tema Escuro B3</strong>
            <div style="font-size:11px;color:var(--text-muted);">Interface terminal azul noturno</div>
          </div>
          <button class="btn-secondary" id="modal-btn-theme-toggle" style="padding:6px 12px;font-size:11.5px;">
            ${state.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle);">
          <div>
            <strong>Confirmação de Boleta</strong>
            <div style="font-size:11px;color:var(--text-muted);">Exigir dupla confirmação ao enviar ordens</div>
          </div>
          <input type="checkbox" checked style="width:18px;height:18px;cursor:pointer;">
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-subtle);">
          <div>
            <strong>Notificações do Mercado</strong>
            <div style="font-size:11px;color:var(--text-muted);">Alertas de cotação e notícias B3</div>
          </div>
          <input type="checkbox" checked style="width:18px;height:18px;cursor:pointer;">
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-top:20px;border-top:1px solid var(--border-subtle);padding-top:14px;">
        <button class="btn-secondary" style="color:var(--bear-red);" onclick="document.getElementById('generic-modal').classList.remove('active');showToast('Sessão encerrada (Demo)', 'success')">
          Encerrar Sessão
        </button>
        <button class="btn-primary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Salvar
        </button>
      </div>
    `;

    document.getElementById('modal-btn-theme-toggle').addEventListener('click', () => {
      document.getElementById('theme-toggle-btn')?.click();
      modal.classList.remove('active');
    });

    modal.classList.add('active');
  }

  function initHeaderSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.toUpperCase().trim();
        const stocks = TwoByData.getStocks();
        const match = stocks.find(s => s.ticker === q);
        if (match) {
          selectStockForChart(match.ticker);
          switchView('view-inicio');
          searchInput.value = '';
          searchInput.blur();
        } else {
          switchView('view-acoes');
          const acoesSearch = document.getElementById('acoes-search-input');
          if (acoesSearch) {
            acoesSearch.value = q;
            state.acoesSearch = q.toLowerCase();
            renderAcoesTable();
          }
          searchInput.value = '';
          searchInput.blur();
        }
      }
    });
  }

  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      }
    });

    const btnVsCode = document.getElementById('btn-vscode-export');
    if (btnVsCode) btnVsCode.addEventListener('click', () => openVsCodeModal());

    const btnNotif = document.getElementById('btn-header-notifications');
    if (btnNotif) btnNotif.addEventListener('click', () => openNotificationsModal());
  }

  function openAssetDetailModal(ticker) {
    const modal = document.getElementById('asset-detail-modal');
    if (!modal) return;

    const stock = TwoByData.getStocks().find(s => s.ticker === ticker) ||
                  TwoByData.getEtfs().find(e => e.ticker === ticker) ||
                  TwoByData.getFiis().find(f => f.ticker === ticker) ||
                  TwoByData.getStocks()[0];

    const titleEl = document.getElementById('modal-asset-title');
    const bodyEl = document.getElementById('modal-asset-body');

    if (titleEl) {
      titleEl.innerHTML = `<span style="color:var(--accent-cyan);">${stock.ticker}</span> — ${stock.name || stock.company}`;
    }

    if (bodyEl) {
      const isPos = stock.change >= 0;
      bodyEl.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px;">
          <div>
            <div style="font-size:28px;font-weight:800;" class="tabular-nums">R$ ${stock.price.toFixed(2)}</div>
            <div class="${isPos ? 'positive' : 'negative'}" style="font-weight:700;font-size:13px;">
              ${isPos ? '▲ +' : '▼ '}${stock.change.toFixed(2)}%
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px;color:var(--text-muted);">Setor / Segmento</div>
            <div style="font-size:13px;font-weight:600;">${stock.sector || stock.category || 'Mercado B3'}</div>
          </div>
        </div>

        <div style="height:240px;margin-bottom:20px;position:relative;">
          <canvas id="modal-asset-candlestick-canvas" style="width:100%;height:100%;display:block;"></canvas>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;background-color:var(--bg-surface);padding:12px;border-radius:var(--radius-md);">
          <div>
            <div style="font-size:10px;color:var(--text-muted);">MÁXIMA</div>
            <div class="tabular-nums" style="font-weight:600;">R$ ${(stock.high || stock.price * 1.02).toFixed(2)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-muted);">MÍNIMA</div>
            <div class="tabular-nums" style="font-weight:600;">R$ ${(stock.low || stock.price * 0.98).toFixed(2)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-muted);">P/L</div>
            <div class="tabular-nums" style="font-weight:600;">${stock.pe ? stock.pe.toFixed(1) : '12.4'}</div>
          </div>
          <div>
            <div style="font-size:10px;color:var(--text-muted);">DY (12M)</div>
            <div class="tabular-nums" style="font-weight:600;color:var(--bull-green);">${stock.dy ? stock.dy.toFixed(1) + '%' : (stock.dy12m ? stock.dy12m.toFixed(1) + '%' : '6.5%')}</div>
          </div>
        </div>

        <div style="margin-bottom:20px;font-size:13px;color:var(--text-secondary);line-height:1.5;">
          ${stock.summary || stock.description || 'Ativo listado e negociado na B3 com liquidez de mercado.'}
        </div>

        <div style="display:flex;gap:12px;">
          <button class="btn-primary" style="flex:1;justify-content:center;padding:12px;" id="modal-btn-buy-asset">
            Negociar ${stock.ticker}
          </button>
          <button class="btn-secondary" style="padding:12px;" id="modal-btn-close-asset">
            Fechar
          </button>
        </div>
      `;

      bodyEl.querySelector('#modal-btn-buy-asset').addEventListener('click', () => {
        modal.classList.remove('active');
        openNovaOrdemModal(stock.ticker);
      });

      bodyEl.querySelector('#modal-btn-close-asset').addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.classList.add('active');

    setTimeout(() => {
      const modalCandles = TwoByData.getStockHistory(stock.ticker, '1D');
      TwoByCharts.renderCandlestick('modal-asset-candlestick-canvas', modalCandles);
    }, 100);
  }

  function openNewsModal(newsItem) {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = newsItem.title;
    document.getElementById('generic-modal-body').innerHTML = `
      <div style="display:flex;gap:10px;font-size:12px;color:var(--text-muted);margin-bottom:16px;">
        <span style="color:var(--accent-cyan);font-weight:700;">${newsItem.source}</span>
        <span>·</span>
        <span>${newsItem.category}</span>
        <span>·</span>
        <span>${newsItem.time} (${newsItem.date})</span>
      </div>
      <p style="font-size:14px;color:var(--text-primary);line-height:1.7;margin-bottom:16px;">
        ${newsItem.summary}
      </p>
      <div style="border-top:1px solid var(--border-subtle);padding-top:14px;display:flex;justify-content:flex-end;">
        <button class="btn-primary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Entendido
        </button>
      </div>
    `;
    modal.classList.add('active');
  }

  function openDepositModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = 'Depositar Recursos na Conta';
    document.getElementById('generic-modal-body').innerHTML = `
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">
        Adicione saldo simulado à conta de Matheus Peniche para negociar na B3:
      </p>
      <div class="form-group">
        <label class="form-label">Valor do Depósito (R$)</label>
        <input type="number" class="input-custom tabular-nums" id="deposit-amount-input" value="1000" min="10" step="100">
      </div>
      <div style="display:flex;gap:8px;margin-bottom:20px;">
        <button class="btn-secondary" style="flex:1;" onclick="document.getElementById('deposit-amount-input').value = 500">+ R$ 500</button>
        <button class="btn-secondary" style="flex:1;" onclick="document.getElementById('deposit-amount-input').value = 1000">+ R$ 1.000</button>
        <button class="btn-secondary" style="flex:1;" onclick="document.getElementById('deposit-amount-input').value = 5000">+ R$ 5.000</button>
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;padding:12px;" id="btn-confirm-deposit">
        Confirmar Depósito
      </button>
    `;

    document.getElementById('btn-confirm-deposit').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('deposit-amount-input').value) || 0;
      if (val > 0) {
        TwoByData.getPortfolio().availableBalance += val;
        TwoByData.getPortfolio().totalValue += val;
        modal.classList.remove('active');
        showToast(`Depósito de R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} creditado!`, 'success');
        initContaView();
        renderCarteiraPage();
        updateSimulatorEstimates();
      }
    });

    modal.classList.add('active');
  }

  function openWithdrawModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    const bal = TwoByData.getPortfolio().availableBalance;
    document.getElementById('generic-modal-title').textContent = 'Resgate de Recursos via PIX';
    document.getElementById('generic-modal-body').innerHTML = `
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">
        Saldo disponível para resgate: <strong style="color:var(--accent-cyan);">R$ ${bal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
      </p>
      <div class="form-group">
        <label class="form-label">Valor do Saque (R$)</label>
        <input type="number" class="input-custom tabular-nums" id="withdraw-amount-input" value="${Math.min(500, bal)}" max="${bal}" min="10">
      </div>
      <div class="form-group">
        <label class="form-label">Chave PIX de Destino</label>
        <input type="text" class="input-custom" value="${state.userProfile.email}" readonly style="opacity:0.8;">
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;padding:12px;" id="btn-confirm-withdraw">
        Solicitar Resgate
      </button>
    `;

    document.getElementById('btn-confirm-withdraw').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('withdraw-amount-input').value) || 0;
      if (val > 0 && val <= TwoByData.getPortfolio().availableBalance) {
        TwoByData.getPortfolio().availableBalance -= val;
        TwoByData.getPortfolio().totalValue -= val;
        modal.classList.remove('active');
        showToast(`Resgate de R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} concluído via PIX.`, 'success');
        initContaView();
        renderCarteiraPage();
        updateSimulatorEstimates();
      } else {
        showToast('Valor de resgate inválido ou maior que o saldo disponível.', 'error');
      }
    });

    modal.classList.add('active');
  }

  function openNotificationsModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = 'Notificações & Alertas B3';
    document.getElementById('generic-modal-body').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="padding:10px;background:var(--bg-surface);border-radius:var(--radius-md);border-left:3px solid var(--bull-green);">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
            <span>Execução de Ordem</span>
            <span>10:14</span>
          </div>
          <div style="font-size:13px;font-weight:600;margin-top:2px;">Compra de 50x PETR4 a R$ 32,18 executada com sucesso.</div>
        </div>
        <div style="padding:10px;background:var(--bg-surface);border-radius:var(--radius-md);border-left:3px solid var(--accent-blue);">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
            <span>Proventos de FII</span>
            <span>08:30</span>
          </div>
          <div style="font-size:13px;font-weight:600;margin-top:2px;">MXRF11 creditou R$ 12,00 em rendimentos isentos de IR na sua conta.</div>
        </div>
      </div>
      <div style="margin-top:16px;text-align:right;">
        <button class="btn-secondary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Fechar
        </button>
      </div>
    `;
    modal.classList.add('active');
  }

  function openVsCodeModal() {
    const modal = document.getElementById('generic-modal');
    if (!modal) return;

    document.getElementById('generic-modal-title').textContent = 'Código & Repositório TWO BY';
    document.getElementById('generic-modal-body').innerHTML = `
      <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">
        Baixe todos os arquivos do projeto prontos para colocar no seu repositório GitHub ou abrir no VS Code / Arc Browser:
      </p>
      
      <div style="display:flex;gap:10px;margin-bottom:16px;">
        <a href="./two-by-projeto-completo.zip" download="two-by-projeto-completo.zip" class="btn-primary" style="flex:1;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span style="font-weight:700;">Baixar Projeto Completo (.ZIP)</span>
        </a>
      </div>

      <div style="background:var(--bg-input);padding:12px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:11.5px;margin-bottom:16px;color:var(--text-secondary);line-height:1.6;">
        <span style="color:var(--accent-cyan);font-weight:700;"># Comandos para enviar ao seu GitHub:</span><br>
        git remote add origin https://github.com/SEU_USUARIO/two-by.git<br>
        git branch -M main<br>
        git push -u origin main
      </div>

      <div style="display:flex;justify-content:flex-end;">
        <button class="btn-secondary" onclick="document.getElementById('generic-modal').classList.remove('active')">
          Fechar
        </button>
      </div>
    `;
    modal.classList.add('active');
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-weight:700;">${type === 'success' ? '✓' : '⚠'}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3800);
  }

  function refreshActiveCharts() {
    if (state.currentView === 'view-inicio') {
      renderIndicesCards();
      renderStockChart(state.selectedStock, state.selectedTimeframe);
      renderDonutPortfolio();
      renderDesempenhoArea(state.desempenhoPeriod);
    } else if (state.currentView === 'view-mercados') {
      renderMercadosPage();
    } else if (state.currentView === 'view-analises') {
      renderAnalisesChart();
    }
  }

  window.TwoByApp = {
    switchView,
    openAssetDetailModal,
    openNewsModal,
    selectStockForChart,
    showToast,
    setUserAvatar
  };
})();
