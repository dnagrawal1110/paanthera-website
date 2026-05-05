/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║   PAANTHERA — Google Sheets Enquiry Form Integration                ║
 * ║   Copy this entire file and paste into Google Apps Script           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * HOW TO SET UP (5 minutes):
 *
 * 1. Go to https://script.google.com
 * 2. Click "New Project"
 * 3. Delete any existing code in the editor
 * 4. Paste ALL of this code
 * 5. Click "Save" (Ctrl+S), name it "Paanthera Enquiry Handler"
 * 6. Click "Deploy" → "New Deployment"
 * 7. Set Type = "Web app"
 * 8. Execute as = "Me"
 * 9. Who has access = "Anyone"
 * 10. Click "Deploy" → Copy the Web App URL
 * 11. Open website/js/enquiry.js
 * 12. Replace GOOGLE_SHEET_URL value with the URL you copied
 *
 * Your enquiry data will auto-save to a Google Sheet named "Paanthera Enquiries"
 * You can export it as Excel (.xlsx) anytime from Google Sheets → File → Download
 */

// ── CONFIG ──────────────────────────────────────────────────────────────
const SHEET_NAME       = 'Paanthera Enquiries';
const NOTIFICATION_EMAIL = 'deepak.mixmedia@gmail.com'; // Change to your email

// ── COLUMN HEADERS (must match field names in enquiry.js) ────────────────
const HEADERS = [
  'Timestamp',
  'Full Name',
  'Company / Organisation',
  'Contact Number',
  'Email Address',
  'Country',
  'City',
  'Product of Interest',
  'Quantity Required',
  'Customisation Required',
  'How Did You Hear',
  'Message',
  'Source Page',
];

// ────────────────────────────────────────────────────────────────────────
// Handle GET requests (keep-alive / CORS preflight)
// ────────────────────────────────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Paanthera Enquiry API is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ────────────────────────────────────────────────────────────────────────
// Handle POST requests from the website enquiry form
// ────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Build the row in header order
    const row = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.fullName        || '',
      data.company         || '',
      data.phone           || '',
      data.email           || '',
      data.country         || '',
      data.city            || '',
      data.product         || '',
      data.quantity        || '',
      data.customisation   || '',
      data.howHeard        || '',
      data.message         || '',
      data.sourcePage      || '',
    ];

    sheet.appendRow(row);

    // Auto-resize columns on first few rows
    if (sheet.getLastRow() < 5) sheet.autoResizeColumns(1, HEADERS.length);

    // Email notification
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Enquiry received' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ────────────────────────────────────────────────────────────────────────
// Get existing sheet or create it with headers
// ────────────────────────────────────────────────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headerRow = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRow.setValues([HEADERS]);
    headerRow.setFontWeight('bold');
    headerRow.setBackground('#C8102E');
    headerRow.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// ────────────────────────────────────────────────────────────────────────
// Send email notification to the team for every new enquiry
// ────────────────────────────────────────────────────────────────────────
function sendNotificationEmail(data) {
  try {
    const subject = `New Paanthera Enquiry — ${data.fullName || 'Unknown'} (${data.country || 'Unknown'})`;
    const body = `
New enquiry received on Paanthera website.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full Name:    ${data.fullName || '—'}
Company:      ${data.company || '—'}
Phone:        ${data.phone || '—'}
Email:        ${data.email || '—'}
Country:      ${data.country || '—'}
City:         ${data.city || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Product:      ${data.product || '—'}
Quantity:     ${data.quantity || '—'}
Customisation:${data.customisation || '—'}
How They Heard:${data.howHeard || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || '—'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: ${data.sourcePage || 'Website'}
Time:   ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply directly to this email or reach out on WhatsApp to follow up.

— Paanthera Automated Notification
    `.trim();

    MailApp.sendEmail({
      to:      NOTIFICATION_EMAIL,
      subject: subject,
      body:    body,
    });
  } catch (err) {
    // Silent fail — don't block form submission if email fails
    console.log('Email notification failed:', err.message);
  }
}
