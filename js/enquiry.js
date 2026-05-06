/**
 * Paanthera — Enquiry Form Handler
 * Submits form data to Google Sheets via Apps Script Web App
 *
 * SETUP: Paste your Apps Script Web App URL below
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Replace with your Google Apps Script Web App URL
// See setup/google-sheet-script.js for instructions
// ─────────────────────────────────────────────────────────────────────────────
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz2bTRvtxoMdMHbWIPjbbUOkNmJqavXESRbeRqyJX0OyDD-eecLD7ItkBAnZZMLiBLa/exec';

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT LIST for dropdown
// ─────────────────────────────────────────────────────────────────────────────
const ENQUIRY_PRODUCTS = [
  { value: '', label: 'Select a product (optional)' },
  { value: 'General Inquiry', label: 'General Inquiry — All Products' },
  { value: '— Polyester Jerseys —', label: '── Polyester Jerseys ──', disabled: true },
  { value: 'Round Neck Poly Sublimation Gym Full Sleeve', label: 'Round Neck Poly Sublimation Gym Full Sleeve' },
  { value: 'Round Neck Poly Sublimation Gym Half Sleeve', label: 'Round Neck Poly Sublimation Gym Half Sleeve' },
  { value: 'Round Neck Poly Sublimation Jersey Half Sleeve', label: 'Round Neck Poly Sublimation Jersey Half Sleeve' },
  { value: 'Collar Poly Sublimation Sports Half Sleeve', label: 'Collar Poly Sublimation Sports Half Sleeve' },
  { value: 'Collar Poly Sublimation Sports Half Sleeve II', label: 'Collar Poly Sublimation Sports Half Sleeve II' },
  { value: 'V-Neck Poly Sublimation Jersey Half Sleeve', label: 'V-Neck Poly Sublimation Jersey Half Sleeve' },
  { value: 'Round Neck Polyester Half Sleeve Plain', label: 'Round Neck Polyester Half Sleeve Plain' },
  { value: 'Round Neck Half Sleeve Gym Poly Plain', label: 'Round Neck Half Sleeve Gym Poly Plain' },
  { value: 'Round Neck Poly Full Sleeve Plain Gym', label: 'Round Neck Poly Full Sleeve Plain Gym' },
  { value: 'V-Neck Poly Jersey Half Sleeve', label: 'V-Neck Poly Jersey Half Sleeve' },
  { value: 'Polyester Half Sleeve Round Neck Jersey (Deep Green)', label: 'Polyester Half Sleeve Round Neck Jersey (Deep Green)' },
  { value: 'Collar Sports Wear Half Sleeve', label: 'Collar Sports Wear Half Sleeve' },
  { value: 'Collar Sports Wear Half Sleeve II', label: 'Collar Sports Wear Half Sleeve II' },
  { value: 'Collar Sports Wear Half Sleeve III', label: 'Collar Sports Wear Half Sleeve III' },
  { value: '— Cotton T-Shirts —', label: '── Cotton T-Shirts ──', disabled: true },
  { value: 'Cotton Half Sleeve T-Shirt Round Neck', label: 'Cotton Half Sleeve T-Shirt Round Neck' },
  { value: 'Cotton T-Shirt Round Neck Full Sleeve', label: 'Cotton T-Shirt Round Neck Full Sleeve' },
  { value: 'Round Neck Cotton T-Shirt Casual Half Sleeve', label: 'Round Neck Cotton T-Shirt Casual Half Sleeve' },
  { value: 'Cotton Collar Half Sleeve T-Shirt', label: 'Cotton Collar Half Sleeve T-Shirt' },
  { value: 'Cotton Casual Full Sleeve (CCSF)', label: 'Cotton Casual Full Sleeve (CCSF)' },
  { value: 'Cotton Casual Full Sleeve – Olive Green', label: 'Cotton Casual Full Sleeve – Olive Green' },
  { value: '— Shorts —', label: '── Shorts ──', disabled: true },
  { value: 'Cotton Shorts Gym', label: 'Cotton Shorts Gym' },
  { value: 'Cotton Shorts Plain', label: 'Cotton Shorts Plain' },
  { value: 'Poly Sublimation Sports Shorts', label: 'Poly Sublimation Sports Shorts' },
  { value: '— Trousers —', label: '── Trousers ──', disabled: true },
  { value: 'Cotton Casual Trouser (CCT)', label: 'Cotton Casual Trouser (CCT)' },
  { value: 'Cotton Polyester Sports Trouser (CPST)', label: 'Cotton Polyester Sports Trouser (CPST)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Build the product dropdown HTML
// ─────────────────────────────────────────────────────────────────────────────
function buildProductDropdown(selectedValue) {
  return ENQUIRY_PRODUCTS.map(p => {
    if (p.disabled) return `<option disabled>${p.label}</option>`;
    const sel = selectedValue && p.value === selectedValue ? ' selected' : '';
    return `<option value="${p.value}"${sel}>${p.label}</option>`;
  }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Render enquiry form HTML into a container element
// ─────────────────────────────────────────────────────────────────────────────
function renderEnquiryForm(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { productName = '', sourcePage = window.location.pathname } = options;

  container.innerHTML = `
    <form id="paanthera-enquiry-form" class="enq-form" novalidate>
      <input type="hidden" name="sourcePage" value="${sourcePage}">
      <input type="hidden" name="preselectedProduct" value="${productName}">

      <div class="enq-row enq-row-2">
        <!-- Full Name -->
        <div class="enq-field">
          <label class="enq-label" for="enq-fullname">Full Name <span class="enq-req">*</span></label>
          <input class="enq-input" type="text" id="enq-fullname" name="fullName"
            placeholder="e.g. Rajesh Sharma" autocomplete="name" required>
          <span class="enq-error" id="err-fullname"></span>
        </div>

        <!-- Company -->
        <div class="enq-field">
          <label class="enq-label" for="enq-company">Company / Organisation <span class="enq-req">*</span></label>
          <input class="enq-input" type="text" id="enq-company" name="company"
            placeholder="e.g. SportZone Wholesale" autocomplete="organization" required>
          <span class="enq-error" id="err-company"></span>
        </div>
      </div>

      <div class="enq-row enq-row-2">
        <!-- Phone -->
        <div class="enq-field">
          <label class="enq-label" for="enq-phone">Contact Number <span class="enq-req">*</span></label>
          <div class="enq-phone-wrap">
            <select class="enq-select enq-code" id="enq-code" name="countryCode" aria-label="Country code">
              <option value="+91">🇮🇳 +91</option>
              <option value="+27">🇿🇦 +27</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+234">🇳🇬 +234</option>
              <option value="+263">🇿🇼 +263</option>
              <option value="+267">🇧🇼 +267</option>
              <option value="+260">🇿🇲 +260</option>
              <option value="+255">🇹🇿 +255</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+64">🇳🇿 +64</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+other">Other</option>
            </select>
            <input class="enq-input enq-phone-num" type="tel" id="enq-phone" name="phoneNum"
              placeholder="73874 27007" autocomplete="tel-national" required>
          </div>
          <span class="enq-error" id="err-phone"></span>
        </div>

        <!-- Email -->
        <div class="enq-field">
          <label class="enq-label" for="enq-email">Email Address <span class="enq-req">*</span></label>
          <input class="enq-input" type="email" id="enq-email" name="email"
            placeholder="you@company.com" autocomplete="email" required>
          <span class="enq-error" id="err-email"></span>
        </div>
      </div>

      <div class="enq-row enq-row-2">
        <!-- Country -->
        <div class="enq-field">
          <label class="enq-label" for="enq-country">Country <span class="enq-req">*</span></label>
          <input class="enq-input" type="text" id="enq-country" name="country"
            placeholder="e.g. South Africa" autocomplete="country-name" required>
          <span class="enq-error" id="err-country"></span>
        </div>

        <!-- City -->
        <div class="enq-field">
          <label class="enq-label" for="enq-city">City / Location</label>
          <input class="enq-input" type="text" id="enq-city" name="city"
            placeholder="e.g. Johannesburg" autocomplete="address-level2">
        </div>
      </div>

      <div class="enq-row enq-row-2">
        <!-- Product -->
        <div class="enq-field">
          <label class="enq-label" for="enq-product">Product of Interest</label>
          <select class="enq-input enq-select" id="enq-product" name="product">
            ${buildProductDropdown(productName)}
          </select>
        </div>

        <!-- Quantity -->
        <div class="enq-field">
          <label class="enq-label" for="enq-quantity">Quantity Required</label>
          <select class="enq-input enq-select" id="enq-quantity" name="quantity">
            <option value="">Select quantity range</option>
            <option value="500–1000 pcs">500 – 1,000 pieces</option>
            <option value="500–1000 pcs">500 – 1,000 pieces</option>
            <option value="1000–5000 pcs">1,000 – 5,000 pieces</option>
            <option value="5000+ pcs">5,000+ pieces</option>
            <option value="Not decided yet">Not decided yet</option>
          </select>
        </div>
      </div>

      <div class="enq-row enq-row-2">
        <!-- Customisation -->
        <div class="enq-field">
          <label class="enq-label" for="enq-custom">Customisation Required?</label>
          <select class="enq-input enq-select" id="enq-custom" name="customisation">
            <option value="">Select an option</option>
            <option value="Yes — logo, colours &amp; labels">Yes — logo, colours &amp; labels</option>
            <option value="Yes — logo only">Yes — logo only</option>
            <option value="No — standard product">No — standard product</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>

        <!-- How heard -->
        <div class="enq-field">
          <label class="enq-label" for="enq-heard">How Did You Hear About Us?</label>
          <select class="enq-input enq-select" id="enq-heard" name="howHeard">
            <option value="">Select source</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Google Search">Google Search</option>
            <option value="Trade Fair / Exhibition">Trade Fair / Exhibition</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <!-- Message -->
      <div class="enq-field">
        <label class="enq-label" for="enq-message">Message / Requirements <span class="enq-req">*</span></label>
        <textarea class="enq-input enq-textarea" id="enq-message" name="message"
          placeholder="Tell us about your requirements — product types, quantities, delivery location, customisation details, or any questions..."
          rows="5" required></textarea>
        <span class="enq-error" id="err-message"></span>
      </div>

      <!-- Submit -->
      <div class="enq-submit-row">
        <button type="submit" class="enq-btn" id="enq-submit-btn">
          <span class="enq-btn-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Send Enquiry
          </span>
          <span class="enq-btn-loading" style="display:none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            Sending…
          </span>
        </button>
        <p class="enq-privacy">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Your information is kept strictly confidential
        </p>
      </div>

      <!-- Status messages -->
      <div id="enq-success" class="enq-status enq-success" style="display:none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <div>
          <strong>Enquiry Received!</strong>
          <p>Thank you — our team will respond within 24 hours. For urgent queries, <a href="#" data-wa-general>message us on WhatsApp</a>.</p>
        </div>
      </div>
      <div id="enq-error" class="enq-status enq-error-box" style="display:none">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <div>
          <strong>Submission Failed</strong>
          <p>Please try again or <a href="#" data-wa-general>send us a WhatsApp message</a> directly.</p>
        </div>
      </div>
    </form>
  `;

  initEnquiryForm(containerId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialise form validation and submission
// ─────────────────────────────────────────────────────────────────────────────
function initEnquiryForm(containerId) {
  const form = document.getElementById('paanthera-enquiry-form');
  if (!form) return;

  // Re-bind WhatsApp links inside form
  if (typeof bindWhatsApp === 'function') bindWhatsApp();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateEnquiryForm(form)) return;

    const btn       = document.getElementById('enq-submit-btn');
    const btnText   = btn.querySelector('.enq-btn-text');
    const btnLoad   = btn.querySelector('.enq-btn-loading');
    const successEl = document.getElementById('enq-success');
    const errorEl   = document.getElementById('enq-error');

    // Loading state
    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'flex';
    successEl.style.display = 'none';
    errorEl.style.display   = 'none';

    const code = form.querySelector('[name="countryCode"]')?.value || '';
    const num  = form.querySelector('[name="phoneNum"]')?.value || '';

    const payload = {
      fullName:      form.querySelector('[name="fullName"]')?.value.trim(),
      company:       form.querySelector('[name="company"]')?.value.trim(),
      phone:         `${code} ${num}`.trim(),
      email:         form.querySelector('[name="email"]')?.value.trim(),
      country:       form.querySelector('[name="country"]')?.value.trim(),
      city:          form.querySelector('[name="city"]')?.value.trim(),
      product:       form.querySelector('[name="product"]')?.value,
      quantity:      form.querySelector('[name="quantity"]')?.value,
      customisation: form.querySelector('[name="customisation"]')?.value,
      howHeard:      form.querySelector('[name="howHeard"]')?.value,
      message:       form.querySelector('[name="message"]')?.value.trim(),
      sourcePage:    form.querySelector('[name="sourcePage"]')?.value,
    };

    try {
      let submitted = false;

      // Try Google Sheets if URL is configured
      if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        const res = await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if (json.status === 'success') submitted = true;
      }

      // Fallback: mailto link (opens email client)
      if (!submitted) {
        const body = encodeURIComponent(
          `Full Name: ${payload.fullName}\n` +
          `Company: ${payload.company}\n` +
          `Phone: ${payload.phone}\n` +
          `Email: ${payload.email}\n` +
          `Country: ${payload.country}\n` +
          `City: ${payload.city}\n` +
          `Product: ${payload.product}\n` +
          `Quantity: ${payload.quantity}\n` +
          `Customisation: ${payload.customisation}\n` +
          `How Heard: ${payload.howHeard}\n\n` +
          `Message:\n${payload.message}`
        );
        window.location.href = `mailto:deepak.mixmedia@gmail.com?subject=Paanthera Enquiry — ${payload.fullName}&body=${body}`;
        submitted = true;
      }

      if (submitted) {
        form.reset();
        successEl.style.display = 'flex';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        // Re-bind WA links
        if (typeof bindWhatsApp === 'function') bindWhatsApp();
      }

    } catch (err) {
      errorEl.style.display = 'flex';
      console.error('Enquiry submission error:', err);
    } finally {
      btn.disabled = false;
      btnText.style.display = 'flex';
      btnLoad.style.display = 'none';
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Client-side validation
// ─────────────────────────────────────────────────────────────────────────────
function validateEnquiryForm(form) {
  let valid = true;

  const rules = [
    { id: 'enq-fullname', errId: 'err-fullname', msg: 'Please enter your full name' },
    { id: 'enq-company',  errId: 'err-company',  msg: 'Please enter your company name' },
    { id: 'enq-phone',    errId: 'err-phone',    msg: 'Please enter your contact number' },
    { id: 'enq-email',    errId: 'err-email',    msg: 'Please enter a valid email address', type: 'email' },
    { id: 'enq-country',  errId: 'err-country',  msg: 'Please enter your country' },
    { id: 'enq-message',  errId: 'err-message',  msg: 'Please add a message or your requirements' },
  ];

  rules.forEach(rule => {
    const field = document.getElementById(rule.id);
    const errEl = document.getElementById(rule.errId);
    if (!field || !errEl) return;

    let fieldValid = field.value.trim().length > 0;
    if (rule.type === 'email') {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    }

    if (!fieldValid) {
      errEl.textContent = rule.msg;
      field.classList.add('enq-invalid');
      valid = false;
    } else {
      errEl.textContent = '';
      field.classList.remove('enq-invalid');
    }
  });

  return valid;
}
