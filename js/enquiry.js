/**
 * Paanthera — Enquiry Form Handler
 */

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz2bTRvtxoMdMHbWIPjbbUOkNmJqavXESRbeRqyJX0OyDD-eecLD7ItkBAnZZMLiBLa/exec';

// ─────────────────────────────────────────────────────────────────────────────
// Country codes
// ─────────────────────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgium' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina' },
  { code: '+56',  flag: '🇨🇱', name: 'Chile' },
  { code: '+other', flag: '🌍', name: 'Other' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Render the enquiry form
// ─────────────────────────────────────────────────────────────────────────────
function renderEnquiryForm(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { productName = '', sourcePage = window.location.pathname } = options;

  const codeOptions = COUNTRY_CODES.map(c =>
    `<option value="${c.code}"${c.code === '+27' ? ' selected' : ''}>${c.flag} ${c.code} ${c.name}</option>`
  ).join('');

  container.innerHTML = `
    <form id="paanthera-enquiry-form" class="enq-form" novalidate>
      <input type="hidden" name="sourcePage" value="${sourcePage}">
      <input type="hidden" name="preselectedProduct" value="${productName}">

      <!-- Full Name -->
      <div class="enq-field">
        <label class="enq-label" for="enq-fullname">Full Name <span class="enq-req">*</span></label>
        <input class="enq-input" type="text" id="enq-fullname" name="fullName"
          placeholder="e.g. John Smith" autocomplete="name" required>
        <span class="enq-error" id="err-fullname"></span>
      </div>

      <!-- Email -->
      <div class="enq-field">
        <label class="enq-label" for="enq-email">Email Address <span class="enq-req">*</span></label>
        <input class="enq-input" type="email" id="enq-email" name="email"
          placeholder="you@company.com" autocomplete="email" required>
        <span class="enq-error" id="err-email"></span>
      </div>

      <!-- Contact Number -->
      <div class="enq-field">
        <label class="enq-label" for="enq-phone">Contact Number <span class="enq-req">*</span></label>
        <div class="enq-phone-wrap">
          <select class="enq-input enq-select enq-code" id="enq-code" name="countryCode" aria-label="Country code">
            ${codeOptions}
          </select>
          <input class="enq-input enq-phone-num" type="tel" id="enq-phone" name="phoneNum"
            placeholder="71 234 5678" autocomplete="tel-national" required>
        </div>
        <span class="enq-error" id="err-phone"></span>
      </div>

      <!-- Message / Requirement -->
      <div class="enq-field">
        <label class="enq-label" for="enq-message">Message / Requirement <span class="enq-req">*</span></label>
        <textarea class="enq-input enq-textarea" id="enq-message" name="message"
          placeholder="Tell us about your requirements — product, quantity, customisation, delivery location…"
          rows="5" required></textarea>
        <span class="enq-error" id="err-message"></span>
      </div>

      <!-- Consent checkbox -->
      <div style="margin-top:8px">
        <label style="display:flex;align-items:flex-start;gap:12px;cursor:pointer;user-select:none">
          <input type="checkbox" id="enq-consent" name="consent"
            style="margin-top:3px;width:16px;height:16px;flex-shrink:0;accent-color:var(--gold);cursor:pointer">
          <span style="font-size:0.82rem;color:var(--grey);line-height:1.55">
            I am okay with Paanthera contacting me regarding this enquiry
          </span>
        </label>
      </div>

      <!-- Submit -->
      <div class="enq-submit-row" style="margin-top:20px">
        <button type="submit" class="enq-btn" id="enq-submit-btn" disabled
          style="opacity:0.45;cursor:not-allowed;transition:opacity 0.2s">
          <span class="enq-btn-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            Enquire Now
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

      <!-- Inline error/status (hidden by default) -->
      <div id="enq-error" class="enq-status enq-error-box" style="display:none;margin-top:16px">
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
// Success popup
// ─────────────────────────────────────────────────────────────────────────────
function showEnquirySuccessPopup() {
  // Remove existing if any
  const existing = document.getElementById('enq-success-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'enq-success-popup';
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-modal', 'true');
  popup.innerHTML = `
    <div id="enq-success-backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);z-index:9999"></div>
    <div style="position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:24px">
      <div style="background:var(--dark);border:1px solid var(--border);border-top:3px solid var(--gold);border-radius:20px;padding:48px 40px;max-width:480px;width:100%;text-align:center;position:relative">
        <!-- Gold checkmark -->
        <div style="width:64px;height:64px;border-radius:50%;background:rgba(201,169,110,0.1);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <h2 style="font-family:var(--font-serif);font-size:1.7rem;color:var(--white);line-height:1.2;margin-bottom:16px">
          Thank you for choosing<br><em style="color:var(--gold)">PAANTHERA</em>
        </h2>
        <p style="font-size:0.95rem;color:var(--grey);line-height:1.75;margin-bottom:32px">
          Your enquiry has been received successfully.<br>
          Our team will connect with you shortly to assist you further.
        </p>
        <button onclick="document.getElementById('enq-success-popup').remove()" class="btn btn-gold" style="min-width:160px;justify-content:center">
          Close
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Close on backdrop click
  document.getElementById('enq-success-backdrop').addEventListener('click', () => popup.remove());
  // Close on Escape
  const escHandler = (e) => { if (e.key === 'Escape') { popup.remove(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);
}

// ─────────────────────────────────────────────────────────────────────────────
// Init: validation, consent toggle, submission
// ─────────────────────────────────────────────────────────────────────────────
function initEnquiryForm(containerId) {
  const form = document.getElementById('paanthera-enquiry-form');
  if (!form) return;

  if (typeof bindWhatsApp === 'function') bindWhatsApp();

  // Consent checkbox enables/disables submit button
  const consentBox = document.getElementById('enq-consent');
  const submitBtn  = document.getElementById('enq-submit-btn');

  consentBox.addEventListener('change', () => {
    submitBtn.disabled = !consentBox.checked;
    submitBtn.style.opacity  = consentBox.checked ? '1'           : '0.45';
    submitBtn.style.cursor   = consentBox.checked ? 'pointer'     : 'not-allowed';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;
    if (!validateEnquiryForm(form)) return;

    const btnText = submitBtn.querySelector('.enq-btn-text');
    const btnLoad = submitBtn.querySelector('.enq-btn-loading');
    const errorEl = document.getElementById('enq-error');

    submitBtn.disabled   = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'flex';
    errorEl.style.display = 'none';

    const code = form.querySelector('[name="countryCode"]')?.value || '';
    const num  = form.querySelector('[name="phoneNum"]')?.value || '';

    const payload = {
      fullName:   form.querySelector('[name="fullName"]')?.value.trim(),
      phone:      `${code} ${num}`.trim(),
      email:      form.querySelector('[name="email"]')?.value.trim(),
      message:    form.querySelector('[name="message"]')?.value.trim(),
      product:    form.querySelector('[name="preselectedProduct"]')?.value || 'General Enquiry',
      sourcePage: form.querySelector('[name="sourcePage"]')?.value,
      timestamp:  new Date().toISOString(),
    };

    try {
      let submitted = false;

      if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        submitted = true;
      }

      if (!submitted) {
        const body = encodeURIComponent(
          `Full Name: ${payload.fullName}\nPhone: ${payload.phone}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`
        );
        window.location.href = `mailto:deepak.mixmedia@gmail.com?subject=Paanthera Enquiry — ${payload.fullName}&body=${body}`;
        submitted = true;
      }

      if (submitted) {
        form.reset();
        // Reset consent button state
        consentBox.checked    = false;
        submitBtn.disabled    = true;
        submitBtn.style.opacity = '0.45';
        submitBtn.style.cursor  = 'not-allowed';
        if (typeof bindWhatsApp === 'function') bindWhatsApp();
        showEnquirySuccessPopup();
      }

    } catch (err) {
      errorEl.style.display = 'flex';
      console.error('Enquiry submission error:', err);
    } finally {
      submitBtn.disabled    = false;
      btnText.style.display = 'flex';
      btnLoad.style.display = 'none';
      // Re-enforce consent state after finally re-enables button
      submitBtn.disabled    = !consentBox.checked;
      submitBtn.style.opacity = consentBox.checked ? '1' : '0.45';
      submitBtn.style.cursor  = consentBox.checked ? 'pointer' : 'not-allowed';
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────
function validateEnquiryForm(form) {
  let valid = true;

  const rules = [
    { id: 'enq-fullname', errId: 'err-fullname', msg: 'Please enter your full name' },
    { id: 'enq-email',    errId: 'err-email',    msg: 'Please enter a valid email address', type: 'email' },
    { id: 'enq-phone',    errId: 'err-phone',    msg: 'Please enter your contact number' },
    { id: 'enq-message',  errId: 'err-message',  msg: 'Please describe your requirements' },
  ];

  rules.forEach(rule => {
    const field = document.getElementById(rule.id);
    const errEl = document.getElementById(rule.errId);
    if (!field || !errEl) return;

    let fieldValid = field.value.trim().length > 0;
    if (rule.type === 'email') fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

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
