'use strict';
/* ---------- CONTACT FORM (direct send via API) ---------- */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async e => {
  e.preventDefault();
  const emailEl = document.getElementById('cfEmail');
  const msgEl = document.getElementById('cfMsg');
  const btn = form.querySelector('button[type="submit"]');
  const email = emailEl.value.trim();
  const msg = msgEl.value.trim();
  let status = document.getElementById('cfStatus');
  if (!status) { status = document.createElement('p'); status.id = 'cfStatus'; status.className = 'section-sub'; form.appendChild(status); }
  btn.disabled = true;
  const old = btn.textContent;
  btn.textContent = 'Sending…';
  status.textContent = '';
  try {
    const r = await fetch('api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message: msg }),
    });
    if (!r.ok) throw new Error('send failed');
    emailEl.value = '';
    msgEl.value = '';
    status.textContent = 'Message sent! Toni will get back to you soon.';
    btn.textContent = 'Sent ✓';
    setTimeout(() => { btn.textContent = old; }, 3000);
  } catch {
    status.textContent = 'Could not send — please email tres.gutentag@gmail.com directly.';
    btn.textContent = old;
  } finally {
    btn.disabled = false;
  }
});
