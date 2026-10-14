// Skills Through Time — interactive timeline (no dependencies)
// Hover or drag across the plot to travel back in time; hover a row or legend chip for details.
(function () {
  const root = document.getElementById('skillTimeline');
  if (!root) return;

  const GROUPS = {
    found: { label: 'Foundation', color: '#a3a3dc' },
    data:  { label: 'Data & ML',  color: '#9b5de5' },
    ai:    { label: 'AI & NLP',   color: '#00e5ff' },
    new:   { label: 'New focus',  color: '#f72585' }
  };

  const SKILLS = [
    { name: 'Project Management',  start: 2011, group: 'found', ctx: 'Consulting, startups, Grafeno6 and Binóculos. PMI Project of the Year 2024.' },
    { name: 'Business Analysis',   start: 2011, group: 'found', ctx: 'Requirements, stakeholder alignment and turning business needs into data products.' },
    { name: 'Process Mapping',     start: 2011, group: 'found', ctx: 'Process redesign for teams and startups, including ASTEPS and Quoda.' },
    { name: 'Business Intelligence', start: 2017, group: 'data', ctx: 'CRM data architecture and sales intelligence dashboards (Binóculos).' },
    { name: 'Data Analysis',       start: 2017, group: 'data',  ctx: 'Churn analysis, market research and customer profiling.' },
    { name: 'Data Science',        start: 2020, group: 'data',  ctx: 'Clustering, segmentation and predictive modelling.' },
    { name: 'Machine Learning',    start: 2020, group: 'data',  ctx: 'XGBoost, clustering and LightGBM ensembles. Kaggle top 25%.' },
    { name: 'Data Engineering',    start: 2021, group: 'data',  ctx: 'ETL pipelines that cut data preparation from one month to under an hour.' },
    { name: 'MLOps',               start: 2023, group: 'data',  ctx: 'Deploying, monitoring and maintaining ML pipelines.' },
    { name: 'NLP & LLMs',          start: 2024, group: 'ai',    ctx: 'NER, PII detection and LLM-powered features for translation software.' },
    { name: 'Multi-Agent Systems', start: 2025, group: 'new',   ctx: 'Multi-agent LLM system for automated quality evaluation.' },
    { name: 'LLM Evaluation',      start: 2025, group: 'new',   ctx: 'Benchmarking LLMs on quality, speed and cost (BLEU, chrF++, COMET).' },
    { name: 'AI Security',         start: 2025, group: 'new',   ctx: 'Prompt injection defences for production LLM pipelines.' }
  ];

  function roleFor(y) {
    if (y >= 2026) return 'NLP Engineer';
    if (y === 2025) return 'Data Specialist → NLP Engineer';
    if (y >= 2021) return 'Data Specialist';
    if (y === 2020) return 'Business Development · Product Marketing · Data Specialist';
    if (y === 2019) return 'Business Development & Channel Partner Manager';
    if (y >= 2017) return 'Business Analyst & PM · founded Arrow Data Specialists';
    return 'Project management & business analysis';
  }

  const MIN = SKILLS.reduce((m, s) => Math.min(m, s.start), Infinity);
  const today = new Date();
  const NOW = today.getFullYear() + today.getMonth() / 12;
  const NOW_YEAR = today.getFullYear();
  const pct = t => ((t - MIN) / (NOW - MIN)) * 100;
  const yearsOf = s => Math.max(0, NOW_YEAR - s.start);

  // ---------- Build DOM ----------
  root.innerHTML = `
    <div class="stl-readout" aria-live="polite">
      <span class="stl-year"></span>
      <span class="stl-meta"><span class="stl-role"></span><span class="stl-count"></span></span>
    </div>
    <div class="stl-legend"></div>
    <div class="stl-plot">
      <div class="stl-rows"></div>
      <div class="stl-scrub"></div>
    </div>
    <div class="stl-axis"></div>
    <p class="stl-hint">Hover or drag across the timeline to travel through time · ← → keys work too</p>
    <div class="stl-tip" role="tooltip"></div>
    <ul class="sr-only"></ul>`;

  const $ = sel => root.querySelector(sel);
  const rowsEl = $('.stl-rows'), legendEl = $('.stl-legend'), axisEl = $('.stl-axis');
  const scrubEl = $('.stl-scrub'), tipEl = $('.stl-tip');
  const yearEl = $('.stl-year'), roleEl = $('.stl-role'), countEl = $('.stl-count');

  Object.entries(GROUPS).forEach(([key, g]) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'stl-chip';
    chip.dataset.group = key;
    chip.style.setProperty('--c', g.color);
    chip.textContent = g.label;
    legendEl.appendChild(chip);
  });

  const rows = SKILLS.map((s, i) => {
    const row = document.createElement('div');
    row.className = 'stl-row' + (i > 0 && SKILLS[i - 1].group !== s.group ? ' stl-gap' : '');
    row.dataset.group = s.group;
    row.style.setProperty('--c', GROUPS[s.group].color);
    row.innerHTML = `<span class="stl-label">${s.name}</span>
      <div class="stl-track"><div class="stl-bar"><span class="stl-head"></span></div></div>`;
    rowsEl.appendChild(row);
    return { s, row, bar: row.querySelector('.stl-bar') };
  });

  const ticks = [];
  for (let y = MIN; y <= NOW_YEAR; y += 3) ticks.push(y);
  if (NOW_YEAR - ticks[ticks.length - 1] >= 2) ticks.push(NOW_YEAR);
  ticks.forEach(y => {
    const t = document.createElement('span');
    t.className = 'stl-tick';
    t.style.left = pct(y) + '%';
    t.textContent = y;
    axisEl.appendChild(t);
  });

  $('.sr-only').innerHTML = SKILLS.map(s =>
    `<li>${s.name}: since ${s.start}${yearsOf(s) ? ` (about ${yearsOf(s)} years)` : ''}. ${s.ctx}</li>`).join('');

  // ---------- Render a moment in time ----------
  let current = NOW;
  function render(t) {
    current = t;
    const y = Math.min(Math.floor(t), NOW_YEAR);
    let active = 0;
    const fresh = [];
    rows.forEach(({ s, row, bar }) => {
      const on = s.start <= t;
      const end = Math.max(s.start, Math.min(t, NOW));
      bar.style.left = pct(s.start) + '%';
      bar.style.width = (on ? pct(end) - pct(s.start) : 0) + '%';
      row.classList.toggle('is-future', !on);
      if (on) active++;
      if (s.start === y) fresh.push(s.name);
    });
    scrubEl.style.setProperty('--p', pct(t) / 100);
    yearEl.textContent = y;
    roleEl.textContent = roleFor(y);
    countEl.textContent = `${active} skill${active === 1 ? '' : 's'}` +
      (fresh.length ? ` · new: ${fresh.join(', ')}` : '');
  }

  // ---------- Highlighting ----------
  function highlight(match) {
    root.classList.toggle('has-hot', !!match);
    rows.forEach(r => r.row.classList.toggle('is-hot', !!match && match(r)));
  }

  legendEl.addEventListener('pointerover', e => {
    const g = e.target.closest('.stl-chip')?.dataset.group;
    if (g) highlight(r => r.s.group === g);
  });
  legendEl.addEventListener('focusin', e => {
    const g = e.target.dataset.group;
    if (g) highlight(r => r.s.group === g);
  });
  legendEl.addEventListener('pointerleave', () => highlight(null));
  legendEl.addEventListener('focusout', () => highlight(null));

  // ---------- Tooltip ----------
  function showTip(r, e) {
    const g = GROUPS[r.s.group];
    const yrs = yearsOf(r.s);
    tipEl.style.setProperty('--c', g.color);
    tipEl.innerHTML = `<strong>${r.s.name}</strong>
      <span class="stl-since">Since ${r.s.start} · ${yrs >= 1 && r.s.group !== 'new' ? `~${yrs} yrs` : 'new focus'}</span>
      <span>${r.s.ctx}</span>`;
    tipEl.classList.add('show');
    moveTip(e);
  }
  function moveTip(e) {
    const box = root.getBoundingClientRect();
    const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
    let x = e.clientX - box.left + 16, y = e.clientY - box.top + 16;
    if (x + w > box.width - 8) x = e.clientX - box.left - w - 16;
    if (y + h > box.height - 8) y = e.clientY - box.top - h - 12;
    tipEl.style.transform = `translate(${Math.max(8, x)}px, ${y}px)`;
  }
  function hideTip() { tipEl.classList.remove('show'); }

  // ---------- Pointer scrubbing ----------
  const trackBox = () => rows[0].row.querySelector('.stl-track').getBoundingClientRect();
  let hotRow = null;

  rowsEl.addEventListener('pointermove', e => {
    const r = trackBox();
    if (e.clientX >= r.left) {
      root.classList.add('scrubbing');
      const t = MIN + ((e.clientX - r.left) / r.width) * (NOW - MIN);
      render(Math.max(MIN, Math.min(NOW, t)));
    }
    const rowEl = e.target.closest('.stl-row');
    const r2 = rowEl && rows.find(x => x.row === rowEl);
    if (r2 !== hotRow) {
      hotRow = r2 || null;
      highlight(hotRow ? x => x === hotRow : null);
      hotRow ? showTip(hotRow, e) : hideTip();
    } else if (hotRow) moveTip(e);
  });

  rowsEl.addEventListener('pointerleave', () => {
    hotRow = null;
    highlight(null);
    hideTip();
    root.classList.remove('scrubbing');
    render(NOW);
  });

  // ---------- Keyboard ----------
  root.addEventListener('keydown', e => {
    let y = Math.floor(current);
    if (e.key === 'ArrowLeft') y = Math.max(MIN, y - 1);
    else if (e.key === 'ArrowRight') y = Math.min(NOW_YEAR, y + 1);
    else if (e.key === 'Home') y = MIN;
    else if (e.key === 'End' || e.key === 'Escape') { render(NOW); e.preventDefault(); return; }
    else return;
    e.preventDefault();
    render(y >= NOW_YEAR ? NOW : y + 0.999);
  });

  // ---------- Intro animation: bars grow in when scrolled into view ----------
  render(MIN);
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    rows.forEach((r, i) => { r.bar.style.transitionDelay = i * 70 + 'ms'; });
    requestAnimationFrame(() => { if (!root.classList.contains('scrubbing')) render(NOW); });
    setTimeout(() => rows.forEach(r => { r.bar.style.transitionDelay = ''; }), 1800);
  }, { threshold: 0.3 });
  io.observe(root);
})();
