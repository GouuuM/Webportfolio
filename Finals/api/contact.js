// POST api/contact  { email, message }  =>  { ok: true }
// Sends the portfolio contact form straight to Gmail via Resend.
// Requires RESEND_API_KEY env var. Never expose the key to the browser.
const TO = 'tres.gutentag@gmail.com';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ error: 'Mail not configured' });
  const body = req.body || {};
  const email = String(body.email || '').trim().slice(0, 120);
  const message = String(body.message || '').trim().slice(0, 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (message.length < 3) return res.status(400).json({ error: 'Message too short' });
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: [TO],
        reply_to: email,
        subject: `Portfolio inquiry from ${email}`,
        text: `${message}\n\n— sent via the portfolio contact form (reply-to: ${email})`,
      }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      console.error('Resend upstream', r.status, t.slice(0, 300));
      return res.status(502).json({ error: 'Mail provider error' });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Mail request failed' });
  }
};
