/**
 * TWO BY - Motor Gráfico Profissional em Canvas HTML5 Puro
 * Arquivo: js/charts.js
 * Descrição: Renderização de alta precisão para Candlesticks, Sparklines,
 * Donut Charts e Curvas Comparativas no novo Tema Azul B3.
 */

const TwoByCharts = (function () {
  'use strict';

  // Configurações de cores baseadas no Tema Azul B3
  const THEME = {
    bullish: '#00E396',
    bearish: '#FF4560',
    blue: '#0066FF',
    blueHover: '#1A75FF',
    cyan: '#00C2FF',
    white: '#FFFFFF',
    gridDark: 'rgba(56, 120, 210, 0.10)',
    gridLight: 'rgba(0, 80, 200, 0.08)',
    textMutedDark: '#8E9EB5',
    textMutedLight: '#64748B',
    crosshairDark: 'rgba(0, 194, 255, 0.55)',
    cardBg: '#081120'
  };

  // Ajusta resolução para telas Retina/High-DPI
  function setupCanvas(canvas) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const displayWidth = rect.width > 0 ? rect.width : canvas.width || 600;
    const displayHeight = rect.height > 0 ? rect.height : canvas.height || 350;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
    return { ctx, width: displayWidth, height: displayHeight, dpr };
  }

  // Formatação de Número compacto
  function formatCompact(val) {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
    return String(val);
  }

  /**
   * 1. GRÁFICO PRINCIPAL DE CANDLESTICKS + VOLUME
   */
  function renderCandlestick(canvasId, candles, options = {}) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!canvas || !candles || candles.length === 0) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const padding = { top: 20, right: 65, bottom: 40, left: 10 };
    const chartHeight = height - padding.top - padding.bottom;
    const volumeHeight = chartHeight * 0.22;
    const priceHeight = chartHeight * 0.74;
    const chartWidth = width - padding.left - padding.right;

    // Achar máximas e mínimas de preço
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    // Margem no eixo Y para os preços
    const pricePadding = (maxPrice - minPrice) * 0.08 || 0.5;
    const yMin = minPrice - pricePadding;
    const yMax = maxPrice + pricePadding;
    const yRange = yMax - yMin;

    // Fundo limpo
    ctx.clearRect(0, 0, width, height);

    // Linhas de Grade de Preço (Horizontal)
    const isDark = !document.body.classList.contains('light-theme');
    const gridColor = isDark ? THEME.gridDark : THEME.gridLight;
    const textColor = isDark ? THEME.textMutedDark : THEME.textMutedLight;

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '11px "JetBrains Mono", monospace, sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';

    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const priceVal = yMin + (yRange / gridSteps) * (gridSteps - i);
      const y = padding.top + (priceHeight / gridSteps) * i;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillText(priceVal.toFixed(2), width - padding.right + 8, y + 4);
    }

    // Linha divisória para volume
    const volTopY = padding.top + priceHeight + (chartHeight * 0.04);
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.moveTo(padding.left, volTopY);
    ctx.lineTo(width - padding.right, volTopY);
    ctx.stroke();

    // Largura de cada candle
    const candleWidth = chartWidth / candles.length;
    const barWidth = Math.max(3, candleWidth * 0.65);

    // Desenhar Candlesticks & Volumes
    candles.forEach((c, i) => {
      const xCenter = padding.left + i * candleWidth + candleWidth / 2;
      const isBull = c.close >= c.open;
      const color = isBull ? THEME.bullish : THEME.bearish;

      const yOpen = padding.top + (1 - (c.open - yMin) / yRange) * priceHeight;
      const yClose = padding.top + (1 - (c.close - yMin) / yRange) * priceHeight;
      const yHigh = padding.top + (1 - (c.high - yMin) / yRange) * priceHeight;
      const yLow = padding.top + (1 - (c.low - yMin) / yRange) * priceHeight;

      // Pavio (Wick)
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.moveTo(xCenter, yHigh);
      ctx.lineTo(xCenter, yLow);
      ctx.stroke();

      // Corpo (Body)
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

      ctx.fillStyle = color;
      ctx.fillRect(xCenter - barWidth / 2, bodyTop, barWidth, bodyHeight);

      // Barra de Volume
      const vRatio = c.volume / (maxVolume || 1);
      const vBarHeight = Math.max(2, vRatio * volumeHeight);
      const vY = height - padding.bottom - vBarHeight;

      ctx.fillStyle = isBull ? 'rgba(0, 227, 150, 0.35)' : 'rgba(255, 69, 96, 0.35)';
      ctx.fillRect(xCenter - barWidth / 2, vY, barWidth, vBarHeight);

      // Rótulos de tempo no eixo X
      if (i % Math.ceil(candles.length / 7) === 0 || i === candles.length - 1) {
        ctx.fillStyle = textColor;
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.time || '', xCenter, height - padding.bottom + 16);
      }
    });

    // Linha de Preço Atual (Último candle)
    const lastCandle = candles[candles.length - 1];
    if (lastCandle) {
      const lastY = padding.top + (1 - (lastCandle.close - yMin) / yRange) * priceHeight;
      const isLastBull = lastCandle.close >= lastCandle.open;
      const lastColor = isLastBull ? THEME.bullish : THEME.bearish;

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = lastColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding.left, lastY);
      ctx.lineTo(width - padding.right, lastY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tag de Preço no Eixo
      ctx.fillStyle = lastColor;
      const badgeW = 54;
      const badgeH = 18;
      ctx.fillRect(width - padding.right + 2, lastY - badgeH / 2, badgeW, badgeH);

      ctx.fillStyle = '#030712';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(lastCandle.close.toFixed(2), width - padding.right + 8, lastY + 4);
    }

    // Gerenciamento de Interatividade / Hover Crosshair
    if (!canvas._hasHoverSetup) {
      canvas._hasHoverSetup = true;

      const handlePointer = (e) => {
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;

        if (mx < padding.left || mx > width - padding.right || my < padding.top || my > height - padding.bottom) {
          renderCandlestick(canvas, canvas._candlesData, options);
          hideChartTooltip();
          return;
        }

        renderCandlestick(canvas, canvas._candlesData, options);
        const { ctx: currentCtx } = setupCanvas(canvas);

        const currentCandles = canvas._candlesData || candles;
        const cWidth = (width - padding.left - padding.right) / currentCandles.length;
        const idx = Math.min(currentCandles.length - 1, Math.max(0, Math.floor((mx - padding.left) / cWidth)));
        const candle = currentCandles[idx];
        const xCross = padding.left + idx * cWidth + cWidth / 2;

        // Desenhar mira (Crosshair) em tom azul elétrico
        currentCtx.strokeStyle = THEME.crosshairDark;
        currentCtx.lineWidth = 1;
        currentCtx.setLineDash([3, 3]);

        currentCtx.beginPath();
        currentCtx.moveTo(xCross, padding.top);
        currentCtx.lineTo(xCross, height - padding.bottom);
        currentCtx.moveTo(padding.left, my);
        currentCtx.lineTo(width - padding.right, my);
        currentCtx.stroke();
        currentCtx.setLineDash([]);

        // Mostrar Tooltip Flutuante
        showChartTooltip(e.clientX, e.clientY, candle);
      };

      canvas.addEventListener('mousemove', handlePointer);
      canvas.addEventListener('mouseleave', () => {
        renderCandlestick(canvas, canvas._candlesData, options);
        hideChartTooltip();
      });
    }

    canvas._candlesData = candles;
  }

  // Tooltip Helper
  function showChartTooltip(x, y, candle) {
    let tip = document.getElementById('chart-interactive-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'chart-interactive-tooltip';
      tip.className = 'chart-tooltip-floating';
      document.body.appendChild(tip);
    }

    const isBull = candle.close >= candle.open;
    const diff = (candle.close - candle.open);
    const diffPercent = ((diff / candle.open) * 100).toFixed(2);
    const sign = diff >= 0 ? '+' : '';

    tip.innerHTML = `
      <div class="tooltip-header">
        <span class="tooltip-time">${candle.time || 'Pregão'}</span>
        <span class="tooltip-badge ${isBull ? 'positive' : 'negative'}">${sign}${diffPercent}%</span>
      </div>
      <div class="tooltip-grid">
        <div><span class="muted">Abertura:</span> <strong>R$ ${candle.open.toFixed(2)}</strong></div>
        <div><span class="muted">Máxima:</span> <strong>R$ ${candle.high.toFixed(2)}</strong></div>
        <div><span class="muted">Mínima:</span> <strong>R$ ${candle.low.toFixed(2)}</strong></div>
        <div><span class="muted">Fechamento:</span> <strong>R$ ${candle.close.toFixed(2)}</strong></div>
        <div style="grid-column: span 2;"><span class="muted">Volume:</span> <strong>${formatCompact(candle.volume)} ações</strong></div>
      </div>
    `;

    tip.style.display = 'block';
    tip.style.left = (x + 15) + 'px';
    tip.style.top = (y - 40) + 'px';
  }

  function hideChartTooltip() {
    const tip = document.getElementById('chart-interactive-tooltip');
    if (tip) tip.style.display = 'none';
  }

  /**
   * 2. MINI GRÁFICO (SPARKLINE)
   */
  function renderSparkline(canvasId, points, isPositive = true) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!canvas || !points || points.length === 0) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = (max - min) || 1;
    const pad = 4;
    const drawHeight = height - pad * 2;
    const drawWidth = width - pad * 2;

    ctx.clearRect(0, 0, width, height);

    const color = isPositive ? THEME.bullish : THEME.bearish;
    const fillColor = isPositive ? 'rgba(0, 227, 150, 0.15)' : 'rgba(255, 69, 96, 0.15)';

    // Coordenadas
    const coords = points.map((val, idx) => {
      const x = pad + (idx / (points.length - 1)) * drawWidth;
      const y = pad + (1 - (val - min) / range) * drawHeight;
      return { x, y };
    });

    // Caminho da linha
    ctx.beginPath();
    coords.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else {
        const prev = coords[i - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Preenchimento com gradiente suave
    ctx.lineTo(coords[coords.length - 1].x, height);
    ctx.lineTo(coords[0].x, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad, 0, height);
    grad.addColorStop(0, fillColor);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  /**
   * 3. GRÁFICO DE ROSCA / DONUT (ALOCAÇÃO DE ATIVOS)
   */
  function renderDonut(canvasId, slices, centerTotal) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!canvas || !slices) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;
    const innerRadius = radius * 0.68;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;
    const totalPercentage = Object.values(slices).reduce((acc, s) => acc + s.percentage, 0);

    Object.values(slices).forEach(slice => {
      const sliceAngle = (slice.percentage / totalPercentage) * (Math.PI * 2);
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = slice.color;
      ctx.fill();

      // Borda sutil de separação entre fatias
      ctx.strokeStyle = '#081120';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      startAngle = endAngle;
    });

    if (centerTotal) {
      const isDark = !document.body.classList.contains('light-theme');
      ctx.fillStyle = isDark ? '#FFFFFF' : '#0A1120';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerTotal, centerX, centerY);
    }
  }

  /**
   * 4. GRÁFICO DE ÁREA INTERATIVO (DESEMPENHO DA CARTEIRA)
   */
  function renderArea(canvasId, dataPoints, options = {}) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!canvas || !dataPoints || dataPoints.length === 0) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const padding = { top: 15, right: 20, bottom: 25, left: 20 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const values = dataPoints.map(d => d.value);
    const min = Math.min(...values) * 0.98;
    const max = Math.max(...values) * 1.02;
    const range = (max - min) || 1;

    ctx.clearRect(0, 0, width, height);

    const isDark = !document.body.classList.contains('light-theme');
    const strokeColor = options.color || THEME.blue;
    const textColor = isDark ? THEME.textMutedDark : THEME.textMutedLight;

    const coords = dataPoints.map((d, i) => {
      const x = padding.left + (i / (dataPoints.length - 1)) * chartW;
      const y = padding.top + (1 - (d.value - min) / range) * chartH;
      return { x, y, ...d };
    });

    // Linha curva
    ctx.beginPath();
    coords.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else {
        const prev = coords[i - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Área sob a curva com tom azul degradê suave
    ctx.lineTo(coords[coords.length - 1].x, height - padding.bottom);
    ctx.lineTo(coords[0].x, height - padding.bottom);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    grad.addColorStop(0, 'rgba(0, 102, 255, 0.28)');
    grad.addColorStop(1, 'rgba(0, 102, 255, 0.00)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Rótulos de data no eixo X
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    coords.forEach(pt => {
      ctx.fillText(pt.date, pt.x, height - 6);
    });
  }

  /**
   * 5. GRÁFICO COMPARATIVO DE ATIVOS (% NORMALIZADO)
   */
  function renderComparison(canvasId, seriesList) {
    const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!canvas || !seriesList || seriesList.length === 0) return;

    const setup = setupCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height } = setup;

    const pad = { top: 20, right: 50, bottom: 30, left: 20 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    let minPct = -2;
    let maxPct = 12;

    seriesList.forEach(s => {
      s.data.forEach(p => {
        if (p.pct < minPct) minPct = p.pct;
        if (p.pct > maxPct) maxPct = p.pct;
      });
    });

    const range = (maxPct - minPct) || 10;
    const isDark = !document.body.classList.contains('light-theme');
    const gridColor = isDark ? THEME.gridDark : THEME.gridLight;
    const textColor = isDark ? THEME.textMutedDark : THEME.textMutedLight;

    // Grade horizontal
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';

    [0, 25, 50, 75, 100].forEach(p => {
      const y = pad.top + (p / 100) * chartH;
      const pctVal = maxPct - (p / 100) * range;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(width - pad.right, y);
      ctx.stroke();
      ctx.fillText((pctVal >= 0 ? '+' : '') + pctVal.toFixed(1) + '%', width - pad.right + 6, y + 4);
    });

    // Linha do 0%
    const zeroY = pad.top + (1 - (0 - minPct) / range) * chartH;
    ctx.strokeStyle = 'rgba(0, 194, 255, 0.25)';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(width - pad.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Desenhar cada série
    seriesList.forEach(series => {
      const coords = series.data.map((d, i) => {
        const x = pad.left + (i / (series.data.length - 1)) * chartW;
        const y = pad.top + (1 - (d.pct - minPct) / range) * chartH;
        return { x, y };
      });

      ctx.beginPath();
      coords.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });

      ctx.strokeStyle = series.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  return {
    renderCandlestick,
    renderSparkline,
    renderDonut,
    renderArea,
    renderComparison,
    THEME
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TwoByCharts;
}
