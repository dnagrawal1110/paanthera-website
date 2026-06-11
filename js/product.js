/* ═══════════════════════════════════════════════════════════════
   PAANTHERA — Product Detail Page JS
   ═══════════════════════════════════════════════════════════════ */

function categoryLabel(cat) {
  const map = { polyester: 'Polyester Jerseys', cotton: 'Cotton T-Shirts', oversized: 'Oversized T-Shirts', tanktop: 'Tank Tops', shirts: 'Cotton Shirts', shorts: 'Shorts', trousers: 'Trousers' };
  return map[cat] || cat;
}

function renderProductPage() {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const product = id ? getProductById(id) : null;

  if (!product) {
    document.getElementById('product-content').innerHTML = `
      <div style="padding:80px 40px;text-align:center">
        <h2 style="font-family:var(--font-serif);font-size:2rem;margin-bottom:16px">Product not found</h2>
        <p style="color:var(--grey);margin-bottom:32px">The product you're looking for doesn't exist or has been removed.</p>
        <a href="catalog.html" class="btn btn-primary">Browse All Products</a>
      </div>`;
    return;
  }

  // Build WhatsApp message
  const collar = product.collar ? product.collar.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) : null;
  const sleeve = product.sleeve ? product.sleeve.charAt(0).toUpperCase() + product.sleeve.slice(1) + ' Sleeve' : null;
  const waMsg  = `Hi Paanthera! I'm interested in the *${product.name}*.\n\nProduct: ${product.name}\nMaterial: ${product.material}\n${collar ? 'Collar: ' + collar + '\n' : ''}${sleeve ? 'Sleeve: ' + sleeve + '\n' : ''}\nCould you please share pricing, availability, and customization details? Thank you!`;
  const waLink = buildWALink(waMsg);

  // ── Dynamic SEO ─────────────────────────────────────────────
  const pageUrl  = `https://paanthera.com/product.html?id=${product.id}`;
  const pageTitle = `${product.name} | Paanthera`;
  const pageDesc  = `${product.description.slice(0,155).replace(/"/g,"'")}…`;
  const pageImg   = product.image || 'https://pub-c157d1d153874174bc99b77d00766615.r2.dev/logos/PaantheraLogo.png';

  document.title = pageTitle;
  const setMeta = (id, val) => { const el = document.getElementById(id); if (el) el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', val); };
  setMeta('seo-canonical',  pageUrl);
  setMeta('seo-og-url',     pageUrl);
  setMeta('seo-og-title',   pageTitle);
  setMeta('seo-og-desc',    pageDesc);
  setMeta('seo-og-img',     pageImg);
  setMeta('seo-og-img-alt', product.name);
  setMeta('seo-tw-title',   pageTitle);
  setMeta('seo-tw-desc',    pageDesc);
  setMeta('seo-tw-img',     pageImg);

  // Product JSON-LD
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": pageImg,
        "brand": { "@type": "Brand", "name": "Paanthera" },
        "material": product.material,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": { "@type": "Organization", "name": "Paanthera" }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",    "item": "https://paanthera.com/" },
          { "@type": "ListItem", "position": 2, "name": "Catalog", "item": "https://paanthera.com/catalog.html" },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": pageUrl }
        ]
      }
    ]
  };
  const ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.textContent = JSON.stringify(ld);
  document.head.appendChild(ldScript);

  // Specs
  const specItems = [
    { label: 'Material', val: product.material },
    { label: 'Fit Type', val: product.fit },
    ...(collar ? [{ label: 'Collar Style', val: collar }] : []),
    ...(sleeve ? [{ label: 'Sleeve Type', val: sleeve }] : []),
    { label: 'Colour', val: product.color },
    { label: 'Origin', val: 'India' }
  ];

  const html = `
    <div class="product-detail-layout">
      <!-- Image Column -->
      <div class="product-image-col">
        ${product.image
          ? `<div class="product-img-wrap"><img src="${product.image}" alt="${product.name} — Buy Bulk from Paanthera, India" class="product-img-photo" loading="eager"></div>`
          : `<div class="product-img-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>${categoryLabel(product.category)} — ${product.shortName}</span>
        </div>`}
        <a href="enquiry.html?product=${encodeURIComponent(product.id)}" class="btn btn-gold product-img-cta" style="display:none">
          Send Enquiry
        </a>
      </div>

      <!-- Info Column -->
      <div class="product-info-col">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" aria-label="breadcrumb">
          <a href="index.html">Home</a>
          <span class="breadcrumb-sep">›</span>
          <a href="catalog.html">Catalog</a>
          <span class="breadcrumb-sep">›</span>
          <a href="catalog.html?cat=${product.category}">${categoryLabel(product.category)}</a>
          <span class="breadcrumb-sep">›</span>
          <span class="current">${product.shortName}</span>
        </nav>

        <!-- Category tag + Title -->
        <div class="subheading" style="margin-bottom:12px">${categoryLabel(product.category)}</div>
        <h1 class="product-title">${product.name}</h1>

        <!-- Enquire Now CTA (below title) -->
        <div style="margin-bottom:28px">
          <a href="enquiry.html?product=${encodeURIComponent(product.id)}" class="btn btn-gold" style="display:inline-flex;gap:10px;align-items:center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Enquire Now
          </a>
        </div>

        <!-- Spec Grid -->
        <div class="spec-grid">
          ${specItems.map(s => `
            <div class="spec-item">
              <div class="spec-item-label">${s.label}</div>
              <div class="spec-item-val">${s.val}</div>
            </div>`).join('')}
        </div>

        <!-- Features -->
        <div class="detail-section">
          <h3>Product Features</h3>
          <ul class="features-list">
            ${product.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <!-- Description -->
        <div class="detail-section">
          <h3>Product Description</h3>
          <p class="product-desc">${product.description}</p>
        </div>

        <!-- Commercial Details -->
        <div class="detail-section">
          <h3>Customization Options</h3>
          <ul class="customization-list">
            ${product.customizations.map(c => `<li>${c}</li>`).join('')}
          </ul>
        </div>

        <!-- Sizes -->
        <div class="detail-section">
          <h3>Size & Fit</h3>
          <div style="margin-bottom:8px">
            <span style="font-size:0.78rem;color:var(--grey)">Fit: </span>
            <span style="font-size:0.88rem;color:var(--white);font-weight:500">${product.fit}</span>
          </div>
          <div class="sizes-grid">
            ${product.sizes.map(s => `<div class="size-chip">${s}</div>`).join('')}
          </div>
          <p class="custom-size-note">Custom sizes available on request</p>
        </div>

        <!-- Industry Use -->
        <div class="detail-section">
          <h3>Industry Use</h3>
          <div class="industry-grid">
            <div class="industry-item">
              <div class="industry-item-title">Clubs</div>
              <p>${product.industryUse.clubs}</p>
            </div>
            <div class="industry-item">
              <div class="industry-item-title">Teams</div>
              <p>${product.industryUse.teams}</p>
            </div>
            <div class="industry-item">
              <div class="industry-item-title">Resellers</div>
              <p>${product.industryUse.resellers}</p>
            </div>
          </div>
        </div>

        <!-- Desktop CTA -->
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
          <a href="enquiry.html?product=${encodeURIComponent(product.id)}" class="btn btn-gold" style="flex:1;min-width:220px;justify-content:center">
            Send Enquiry
          </a>
          <a href="catalog.html" class="btn btn-outline" style="justify-content:center">← Back to Catalog</a>
        </div>
      </div>
    </div>

    <!-- Mobile sticky CTA -->
    <div class="product-cta-block">
      <a href="enquiry.html?product=${encodeURIComponent(product.id)}" class="btn btn-gold">
        Send Enquiry
      </a>
      <a href="catalog.html" class="btn btn-outline">← Catalog</a>
    </div>`;

  document.getElementById('product-content').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProductPage);
