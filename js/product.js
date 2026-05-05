/* ═══════════════════════════════════════════════════════════════
   PAANTHERA — Product Detail Page JS
   ═══════════════════════════════════════════════════════════════ */

function categoryLabel(cat) {
  const map = { polyester: 'Polyester Jerseys', cotton: 'Cotton T-Shirts', shorts: 'Shorts', trousers: 'Trousers' };
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

  // Page title
  document.title = `${product.name} | Paanthera`;

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
          ? `<div class="product-img-wrap"><img src="${product.image}" alt="${product.name}" class="product-img-photo" loading="eager"></div>`
          : `<div class="product-img-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>${categoryLabel(product.category)} — ${product.shortName}</span>
        </div>`}
        <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-wa product-img-cta" style="display:none">
          <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          Inquire on WhatsApp
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
          <h3>Commercial Details</h3>
          <div class="moq-badge-lg">
            <div>
              <div class="moq-label">Minimum Order Quantity</div>
              <div class="moq-num">${product.moq}<span style="font-size:1rem;color:var(--grey)"> pcs</span></div>
            </div>
          </div>
          <h4 style="font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--grey);margin-bottom:12px">Customization Options</h4>
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

        <!-- Desktop WA CTA -->
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px">
          <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-wa" style="flex:1;min-width:220px;justify-content:center">
            <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor;flex-shrink:0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Inquire on WhatsApp
          </a>
          <a href="catalog.html" class="btn btn-outline" style="justify-content:center">← Back to Catalog</a>
        </div>
      </div>
    </div>

    <!-- Mobile sticky CTA -->
    <div class="product-cta-block">
      <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-wa">
        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
        Inquire on WhatsApp
      </a>
      <a href="catalog.html" class="btn btn-outline">← Catalog</a>
    </div>`;

  document.getElementById('product-content').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', renderProductPage);
