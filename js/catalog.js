/* ═══════════════════════════════════════════════════════════════
   PAANTHERA — Catalog JS (Filter + Render)
   ═══════════════════════════════════════════════════════════════ */

let activeCategory   = 'all';
let activeSubcat     = 'all';
let activeCollar     = 'all';
let activeSleeve     = 'all';

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    if (p.hidden) return false;                    // hidden products
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (activeSubcat   !== 'all' && p.subcategory !== activeSubcat) return false;
    if (activeCollar   !== 'all' && p.collar !== activeCollar) return false;
    if (activeSleeve   !== 'all' && p.sleeve !== activeSleeve) return false;
    return true;
  });
}

const VISIBLE_PRODUCTS = PRODUCTS.filter(p => !p.hidden);

function renderCatalog() {
  const grid  = document.getElementById('catalog-grid');
  const count = document.getElementById('catalog-count');
  if (!grid) return;

  const filtered = getFilteredProducts();
  count && (count.innerHTML = `Showing <strong>${filtered.length}</strong> of ${VISIBLE_PRODUCTS.length} products`);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No products found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => buildProductCard(p)).join('');
  reObserveFadeUps();
}

function updateSubFilters() {
  const subFilterBar = document.getElementById('sub-filters');
  if (!subFilterBar) return;

  // Reset sub-filters when category changes
  activeSubcat = 'all';
  activeCollar = 'all';
  activeSleeve = 'all';

  // Define available sub-filters per category
  let subCatOpts = [];
  let collarOpts = [];
  let sleeveOpts = [];

  if (activeCategory === 'shirts') {
    collarOpts = [
      { val: 'all', label: 'All Collars' },
      { val: 'button-down', label: 'Button-Down' }
    ];
    sleeveOpts = [
      { val: 'all', label: 'All Sleeves' },
      { val: 'half', label: 'Half Sleeve' },
      { val: 'full', label: 'Full Sleeve' }
    ];
  } else if (activeCategory === 'polyester' || activeCategory === 'all') {
    subCatOpts = [
      { val: 'all', label: 'All Types' },
      { val: 'sublimation', label: 'Sublimation' },
      { val: 'plain', label: 'Plain' }
    ];
    collarOpts = [
      { val: 'all', label: 'All Collars' },
      { val: 'round-neck', label: 'Round Neck' },
      { val: 'polo-collar', label: 'Polo Collar' },
      { val: 'v-neck', label: 'V-Neck' }
    ];
    sleeveOpts = [
      { val: 'all', label: 'All Sleeves' },
      { val: 'half', label: 'Half Sleeve' },
      { val: 'full', label: 'Full Sleeve' }
    ];
  } else if (activeCategory === 'cotton') {
    collarOpts = [
      { val: 'all', label: 'All Collars' },
      { val: 'round-neck', label: 'Round Neck' },
      { val: 'polo-collar', label: 'Polo Collar' }
    ];
    sleeveOpts = [
      { val: 'all', label: 'All Sleeves' },
      { val: 'half', label: 'Half Sleeve' },
      { val: 'full', label: 'Full Sleeve' }
    ];
  } else if (activeCategory === 'oversized') {
    collarOpts = [
      { val: 'all', label: 'All Collars' },
      { val: 'round-neck', label: 'Round Neck' }
    ];
  } else if (activeCategory === 'tanktop') {
    // No sub-filters needed for tank tops
  } else if (activeCategory === 'shorts') {
    subCatOpts = [
      { val: 'all', label: 'All Types' },
      { val: 'sublimation', label: 'Sublimation' },
      { val: 'gym', label: 'Gym' },
      { val: 'casual', label: 'Casual' }
    ];
  }

  let html = '';

  if (subCatOpts.length) {
    html += `<span class="sub-filter-label">Type</span>`;
    html += subCatOpts.map(o => `
      <button class="sub-filter-btn ${activeSubcat === o.val ? 'active' : ''}"
        data-type="subcat" data-val="${o.val}">${o.label}</button>`).join('');
  }
  if (collarOpts.length) {
    if (html) html += `<span class="sub-filter-sep" style="width:1px;height:20px;background:var(--border);display:inline-block;margin:0 8px;vertical-align:middle"></span>`;
    html += `<span class="sub-filter-label">Collar</span>`;
    html += collarOpts.map(o => `
      <button class="sub-filter-btn ${activeCollar === o.val ? 'active' : ''}"
        data-type="collar" data-val="${o.val}">${o.label}</button>`).join('');
  }
  if (sleeveOpts.length) {
    if (html) html += `<span class="sub-filter-sep" style="width:1px;height:20px;background:var(--border);display:inline-block;margin:0 8px;vertical-align:middle"></span>`;
    html += `<span class="sub-filter-label">Sleeve</span>`;
    html += sleeveOpts.map(o => `
      <button class="sub-filter-btn ${activeSleeve === o.val ? 'active' : ''}"
        data-type="sleeve" data-val="${o.val}">${o.label}</button>`).join('');
  }

  const inner = subFilterBar.querySelector('.sub-filters-inner');
  if (inner) inner.innerHTML = html || '<span class="sub-filter-label" style="color:var(--grey2)">No sub-filters for this category</span>';

  // Attach events
  subFilterBar.querySelectorAll('.sub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const val  = btn.dataset.val;

      if (type === 'subcat') activeSubcat = val;
      if (type === 'collar') activeCollar = val;
      if (type === 'sleeve') activeSleeve = val;

      // Update active state
      subFilterBar.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderCatalog();
    });
  });
}

function updateTabCounts() {
  // Count badges removed — no-op
}

function initCatalog() {
  const filterBar = document.getElementById('filter-tabs');
  if (!filterBar) return;

  // Update counts on all tabs
  updateTabCounts();

  // Category tab click
  filterBar.querySelectorAll('[data-cat-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCategory = tab.dataset.catTab;
      filterBar.querySelectorAll('[data-cat-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateSubFilters();
      renderCatalog();
    });
  });

  // Init sub-filters
  updateSubFilters();

  // Initial render
  renderCatalog();
}

document.addEventListener('DOMContentLoaded', initCatalog);
