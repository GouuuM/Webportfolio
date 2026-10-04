'use strict';
/* ---------- CHATBOT (rule-based, all about Toni) ---------- */
const bubble = document.getElementById('chatBubble');
const panel = document.getElementById('chatPanel');
const msgs = document.getElementById('chatMsgs');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatClose = document.getElementById('chatClose');
const chips = document.getElementById('chatChips');
let greeted = false;
let lastQ = '', streak = 0;
const EGGS = [
  "WHISTLE! <i>*tweet tweet!*</i> That's the THIRD time you've asked me that! Running secret drills without your manager?! I refuse a fourth lap — ask me something else!",
  "Okay, three laps of the SAME question! My memory muscles are strong but my patience muscles are cramping! New question. Now. Please.",
  "Hey hey hey — deja vu! Third time on this one! Were you even listening, or too busy staring at my clipboard? Something ELSE, please!",
  "STOP THE CLOCK! Three-peat detected! You clearly love that topic — scroll up, the answer's still right there. Next question!"
];

// Gou Matsuoka mode: Iwatobi's energetic team manager. Supportive, organized,
// slightly teasing, swimming metaphors everywhere, and yes — she notices muscles.
// Every rule has multiple replies so Gou never sounds like a robot.
// short words (hi, yo, ty…) match on word boundaries so "which" doesn't trigger "hi"
// symbol keys (c#, .net…) match literally since \b doesn't work around symbols
function hit(s, k) {
  if (/[^a-z0-9]/.test(k)) return s.includes(k);
  if (k.length <= 3) {
    try { return new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(s); }
    catch { return s.includes(k); }
  }
  return s.includes(k);
}
const RULES = [
  { k: ['hello', 'hi', 'hey', 'yo', 'sup', 'kumusta', 'good morning', 'good afternoon', 'good evening'], a: [
    "Hey hey! Gou here — Toni's manager! Whistle ready, clipboard ready! Ask me about his skills, projects, school, or contact!",
    "Hi! Gou Matsuoka reporting for duty! Dive in — what do you wanna know about Toni?",
    "Yo! Gou here! Let's warm up those curiosity muscles — skills? projects? contact? Pick your stroke!"
  ]},
  { k: ['who are you', 'your name', 'about you', 'about yourself', 'tell me about yourself', 'introduce yourself'], a: [
    "Me? I'm Gou — well, an AI playing Gou Matsuoka, Toni's whistle-happy manager from Free!! I live in this little chat bubble, guarding his portfolio and judging… I mean, admiring everyone's muscles. Ask me about HIM!",
    "I'm Gou! Technically a chatbot doing her best Gou Matsuoka impression — energetic manager, clipboard included. My whole job is bragging about Toni. Try me: skills? projects? contact?",
    "Gou Matsuoka, reporting! I'm an AI assistant roleplaying as Iwatobi's manager — organized, loud, and here solely to hype Toni up. What do you wanna know about him?"
  ]},
  { k: ['about toni', 'who is toni', 'introduce toni', 'tell me about toni', 'tell me about him', 'biography', 'about him', 'who is he'], a: [
    "Toni Rose Susa? 4th-year BSIT at Philippine Christian University, aspiring web & software developer. His freestyle? Accessible, modern websites with clean layouts!",
    "Toni's my star swimmer — er, developer! 4th-year BSIT at PCU, building clean, accessible websites. I've got his whole training log memorized, ask away!",
    "Toni Rose Susa, 4th-year BSIT, future web & software dev! Great form, great discipline — I manage his portfolio like a relay team!"
  ]},
  { k: ['designer', 'design tools', 'canva', 'figma', 'photoshop', 'premiere pro', 'interfaces', 'websites design', 'media layouts', 'social graphics', 'figma design', 'figma tool'], a: [
    "Designer lane! Toni does interfaces, websites, media layouts and social graphics — armed with Canva, Figma, Photoshop and Premiere Pro. Clean, clear, creative!",
    "Design files? Canva for speed, Figma for UI (see his TravelEase mobile booking prototype in Projects!), Photoshop + Premiere for media. Beautiful form!",
    "His designer stroke: clarity + creativity! Interfaces and social graphics in Canva/Figma, polished media in Photoshop/Premiere. Check the Skills section!"
  ]},
  { k: ['frontend', 'front-end', 'html', 'css', 'javascript', 'sass', 'tailwind', 'bootstrap', 'responsive', 'vs code'], a: [
    "Frontend freestyle! HTML, CSS, JavaScript, Sass — plus Tailwind and Bootstrap, built in VS Code. This very portfolio is the proof: responsive, single dark Riot+Lover theme, zero frameworks!",
    "Frontend muscles? RIPPED! Semantic HTML, CSS systems, vanilla JS, Sass, Tailwind, Bootstrap. Flip the Inspiration cards — all hand-built interactivity!",
    "His frontend event: responsive layouts, smooth interactions, maintainable code. HTML/CSS/JS + Sass/Tailwind/Bootstrap. See this site + the Skills section!"
  ]},
  { k: ['backend', 'back-end', 'java', 'c#', 'csharp', '.net', 'php', 'python', 'sql', 'eclipse', 'netbeans', 'ssms', 'sqlite', 'server', 'database'], a: [
    "Backend breaststroke! Java, C#, PHP, Python, SQL — with Eclipse, NetBeans, SSMS and SQLite. That's what powers S.W.I.F.T (Java) and ByteLodge (C#/.NET + SQL)!",
    "Server-side stamina! Java + C# + PHP + Python with SQL databases — console systems, booking logic, enrollment flows. See PROJECT-S.W.I.F.T and ByteLodge in Projects!",
    "His backend lap: solid logic + databases! Java, C#, PHP, Python, SQL across Eclipse/NetBeans/SSMS/SQLite. Group-built systems, real data handling!"
  ]},
  { k: ['skill', 'tech', 'stack', 'tools', 'language', 'what can he do', 'what does he know', 'what does he do', 'experience', 'experienced', 'expert', 'good at', 'abilities', 'capable', 'knowledge', 'coding', 'programming', 'develop'], a: [
    "Let me check my clipboard! Designer: Canva, Figma, Photoshop, Premiere Pro. Frontend: HTML, CSS, JavaScript, Sass + Tailwind, Bootstrap. Backend: Java, C#, PHP, Python, SQL + Eclipse, NetBeans, SSMS, SQLite. Those tech muscles are RIPPED!",
    "His training menu: design (Canva, Figma, Photoshop, Premiere), frontend (HTML, CSS, JS, Sass, Tailwind, Bootstrap), backend (Java, C#, PHP, Python, SQL). Beautiful stroke on every lap!",
    "Skills? Oh, I've drilled him well! Interfaces and websites with Canva/Figma, interactive frontends in HTML/CSS/JS, plus Java/C#/PHP/Python/SQL on the backend. Fantastic muscle definition!"
  ]},
  { k: ['s.w.i.f.t', 'swift', 'school system', 'school management', 'enrollment'], a: [
    "PROJECT-S.W.I.F.T? My files say: a Java console school management system — Toni's group project! Student records, enrollment flow, the works. Full code: github.com/GouuuM/PROJECT-S.W.I.F.T",
    "S.W.I.F.T stands tall! Group-built Java console app for running a school system — records, enrollment, data handling. Peek at github.com/GouuuM/PROJECT-S.W.I.F.T",
    "Ah, the S.W.I.F.T files! Java, console-based, school management — built with his relay team. github.com/GouuuM/PROJECT-S.W.I.F.T — go star it!"
  ]},
  { k: ['byte', 'bytelodge', 'hotel', 'reservation', 'hotel-reservation', 'joseherga'], a: [
    "ByteLodge? That's his group project C# hotel reservation system — room booking flow, availability checks, reservation management with the team! Code: github.com/joseherga/Hotel-Reservation",
    "Hotel project on record! ByteLodge, group-built in C#/.NET with SQL — booking, validation, data handling. Peek at github.com/joseherga/Hotel-Reservation",
    "ByteLodge files! C#, .NET, SQL — rooms, availability, reservations, all validated with his relay team. github.com/joseherga/Hotel-Reservation — go star it!"
  ]},
  { k: ['travelease', 'travel', 'mobile booking', 'hci', 'booking system', 'prototype', 'figma file'], a: [
    "TravelEase? His group project mobile booking UI in Figma — HCI final with the team! Search + booking flow with clean mobile layouts. Design file on Figma — link in the Projects section!",
    "The Figma one! TravelEase mobile booking prototype, group-built — search, book, prototype interactions. Open the Figma link from Projects to click through it!",
    "TravelEase heat! Figma-designed mobile booking system — search screens, booking flow, polished mobile UI for the HCI final. Link's in Projects, dive in!"
  ]},
  { k: ['portfolio', 'website', 'this site', 'personal site', 'webportfolio'], a: [
    "This very site! His Portfolio UI/UX — HTML, CSS, vanilla JS, single merged dark theme, flip cards and all. Code: github.com/GouuuM/Webportfolio",
    "The portfolio? That's this page! Hand-built with HTML/CSS/JS — responsive layout, dual themes, zero frameworks. github.com/GouuuM/Webportfolio",
    "Portfolio UI/UX — Toni's personal site, built from scratch to practice semantic HTML and CSS systems. You're looking at it! Code at github.com/GouuuM/Webportfolio"
  ]},
  { k: ['project', 'work', 'built', 'what has he built', 'what has he done', 'what did he build', 'what did he make', 'made', 'created', 'done', 'showcase', 'worked on', 'work on'], a: [
    "Four races on record! PROJECT-S.W.I.F.T — Java school management (github.com/GouuuM/PROJECT-S.W.I.F.T). This portfolio (github.com/GouuuM/Webportfolio). ByteLodge C# hotel reservation (github.com/joseherga/Hotel-Reservation). Plus TravelEase mobile booking UI in Figma — link in Projects!",
    "His meet results: S.W.I.F.T (Java school system), this portfolio site, ByteLodge hotel system in C#, and TravelEase Figma mobile booking prototype. Check the Projects section — go cheer him on!",
    "Project files, coming right up! Java school system, themed portfolio, C# hotel reservation, and a Figma mobile booking UI. All linked in Projects — excellent times in every event!"
  ]},
  { k: ['education', 'school', 'study', 'degree', 'pcu', 'university', 'college', 'mmmhs', 'high school', 'course', 'where does he study', 'where did he study', 'what did he study', 'major', 'studying', 'graduate', 'schooling', 'academic'], a: [
    "His training history! BSIT at Philippine Christian University (2023–Present): Software Development, Database Systems, Web Programming. Before that, ICT Strand at Mariano Marcos Memorial High School (2017–2019) — that's where the HTML spark caught fire!",
    "School records! Currently 4th-year BSIT at PCU — software dev, databases, web programming. He started in the ICT Strand at MMMHS learning HTML basics. From kickboard to freestyle!",
    "Education lap by lap: PCU, BSIT 2023 to now, all the big strokes — dev, databases, web programming. Foundation built at Mariano Marcos Memorial High School's ICT Strand. Textbook progression!"
  ]},
  { k: ['recognition', 'oop', 'object oriented', 'object-oriented', 'coi', 'informatics'], a: [
    "That OOP Recognition? Awarded for Object Oriented Programming — Second Term A.Y. 2025–2026, College of Informatics, PCU — given April 30, 2025! Framed in the Certificates section!",
    "OOP honors! Excellence in Object Oriented Programming at COI-PCU. Proof his class-and-object muscles are competition-ready!",
    "The Recognition cert = OOP mastery! Second Term, COI, PCU. Check it in Certificates & Milestones!"
  ]},
  { k: ['jpcs', 'jcps', 'junior philippine computer society', 'membership', 'member'], a: [
    "JPCS-PCU? Toni's a bona fide Junior Philippine Computer Society National member via the recognized PCU chapter — full benefits for A.Y. 2024–2025! Cert's in the Certificates section!",
    "Membership files! JPCS National through JPCS-PCU, a recognized Philippine Computer Society chapter. Official member perks, A.Y. 2024–2025!",
    "The JPCS cert proves it — enrolled at PCU + card-carrying JPCS member. Team player, certified!"
  ]},
  { k: ['emerald', 'league', 'league of legends', '65 lp', 'rank', 'lol'], a: [
    "Emerald 1 at 65 LP! Ground out through reviewed games — KDA tracking, VOD review after losses, team shot-calling. Same loop he brings to code!",
    "LoL files! Emerald 1, 65 LP — earned, not given! Review, iterate, climb — athlete mentality, developer discipline!",
    "65 LP of pure grind! Emerald 1 via measure-review-iterate. Manager-approved perseverance!"
  ]},
  { k: ['worlds', 'fifth trophy', 'faker', 't1', 'esports'], a: [
    "Worlds 2024 — The Fifth Trophy Is for You! Faker lifted T1's fifth and dedicated it to the fans. Toni's reminder that perseverance pays off — video's in Certificates & Milestones!",
    "Faker files! A decade of near-misses turned legend at Worlds 2024. Toni studies that teamwork like I study swim splits!",
    "The fifth trophy moment! T1, Faker, the fans — pure perseverance fuel. Watch the clip in his Certificates section!"
  ]},
  { k: ['certificate', 'certificates', 'certification', 'milestone', 'milestones', 'achievement', 'award', 'accomplishment', 'gaming', 'gamer', 'compete', 'competition', 'proud of'], a: [
    "Certificates & Milestones! OOP Recognition (COI-PCU, April 2025) + JPCS-PCU bona fide membership (A.Y. 2024–2025) — plus Emerald 1 at 65 LP and Worlds 2024 study like game tape!",
    "Medal count: two certificates on display, Emerald 1 rank earned through grind and review, Worlds 2024 teamwork study. A true relay anchor mentality!",
    "Check the Certificates section! Recognition + JPCS certs up top, then Emerald 1 and Worlds 2024 esports milestones. Strategy, teamwork, perseverance!"
  ]},
  { k: ['taylor swift', 'taylor', 'swiftie', 'blank space', 'lover', '1989', 'midnights', 'reputation', 'folklore', 'ttpd', 'eras'], a: [
    "Taylor Swift! The storyteller — Reputation, Folklore, Midnights eras keep Toni alive through late-night code. Flip her card — all three eras rotate on one track!",
    "Miss Swift? Toni's coding fuel — dramatic eras, sharp lyrics. Check her Inspiration card above!",
    "Taylor! Storytelling queen — Folklore for focus, 1989 for celebration. Her pink title glows in the dark theme!"
  ]},
  { k: ['paramore', 'hayley', 'misery business', 'riot', 'after laughter', 'still into you'], a: [
    "Paramore! Hayley Williams and co. — pure adrenaline for long sessions. Misery Business mode: ON. Their card's on the site!",
    "Paramore goes hard! Riot! energy pushes Toni through the toughest bugs. Dark mode is their era here!",
    "P-More! High-octane rock for debugging marathons. Still Into You on repeat, allegedly!"
  ]},
  { k: ['mcr', 'my chemical romance', 'black parade', 'gerard', 'na na na', 'danger days'], a: [
    "My Chemical Romance! Theatrical, dramatic — Welcome to the Black Parade energy when he's polishing designs. Their card flips too!",
    "MCR! Danger Days drama for design days. Na Na Na on full blast, probably!",
    "My Chem! Black Parade vibes that spark his creativity. Check their Inspiration card!"
  ]},
  { k: ['music', 'artist', 'song', 'inspiration', 'hobby', 'interest', 'listen', 'favorite', 'favourite', 'playlist', 'band'], a: [
    "His playlist is elite! Taylor Swift for storytelling, Paramore for full-sprint coding energy, MCR for dramatic design flair. Flip the Inspiration cards — every artist spins three albums on one track!",
    "Warm-up music matters! Taylor's eras, Paramore's fire, MCR's theater — that's what fuels his late-night sessions. Taste AND muscles!",
    "Off the blocks: Taylor Swift (lyrics!), Paramore (adrenaline!), MCR (drama!). Try flipping those cards — each one plays its own anthem. No wonder his designs have rhythm!"
  ]},
  { k: ['contact', 'email', 'mail', 'reach', 'hire', 'intern', 'collab', 'github', 'linkedin', 'social', 'how do i reach', 'how can i contact', 'how to contact', 'how to reach', 'get in touch', 'talk to', 'message him', 'phone', 'number'], a: [
    "Recruitment office is OPEN! Email tres.gutentag@gmail.com, GitHub github.com/GouuuM, LinkedIn /in/toni-rose-susa-5b7a26214. He's hunting for internships and collabs — use the contact form below and he'll dive right in!",
    "Want him on your relay team? tres.gutentag@gmail.com, github.com/GouuuM, LinkedIn in/toni-rose-susa-5b7a26214. Open to internships! Send a message — I promise he answers faster than my whistle!",
    "Contact sheet! Email: tres.gutentag@gmail.com. GitHub: github.com/GouuuM. LinkedIn: Toni Rose Susa. Internships and collabs welcome — drop a line in the form below!"
  ]},
  { k: ['where', 'location', 'philippines', 'manila', 'from', 'live', 'based', 'country', 'city', 'where is he'], a: [
    "Home pool: the Philippines! He trains at Philippine Christian University.",
    "He's based in the Philippines, swimming out of PCU!"
  ]},
  { k: ['year', 'old', 'age', '25', '4th', 'fourth', 'student', 'grade', 'level', 'senior', 'how old is he', 'years old'], a: [
    "He's 25! A 4th-year BSIT student in his senior season!",
    "25 years old — 4th-year, final lap before graduation!",
    "Toni's 25! Old enough to know better, young enough for all-nighters!"
  ]},
  { k: ['resume', 'cv'], a: [
    "No downloadable resume on the site yet — but his GitHub (github.com/GouuuM) plus this portfolio are his race videos! Email him and he'll send one over, manager's promise!",
    "Resume's still in the locker room, but github.com/GouuuM shows everything. Email him and he'll forward his CV in no time!"
  ]},
  { k: ['muscle'], a: [
    "MUSCLES?! Where?! ...Oh, you mean Toni's coding muscles. Yes. Magnificent definition. 10/10. Anyway — what else about him?",
    "Did someone say muscles?! *whips out judging clipboard* Toni's keyboard muscles score very high. Anything else you need?"
  ]},
  { k: ['thank', 'salamat', 'ty', 'thanks', 'thank you', 'appreciated'], a: [
    "Anytime! That's what managers are for! Anything else about Toni?",
    "Of course! Happy to help — now go make a splash!",
    "You got it! Come back if you need more Toni intel!"
  ]},
  { k: ['bye', 'goodbye', 'see you'], a: [
    "Bye! See you at the pool — and go hire Toni!",
    "Later! Remember: hydrate, stretch, and email Toni!",
    "Ja ne! Good luck — Toni's waiting for your message!"
  ]},
  { k: ['help', 'what can you', 'options', 'what can i ask', 'what do you know'], a: [
    "Here's my clipboard: try Skills? / Projects? / Education? / Contact? — or ask about music, certificates, internships. I know EVERYTHING about my swimmer!",
    "I can dish on his skills, projects, school, gaming, music taste, and contact info. Pick an event!"
  ]}
];
const FALLBACKS = [
  "Hmm, that one's out of my lane! I only track Toni — try skills, projects, education, music, or contact info!",
  "Splash... missed the wall on that one! Ask me about Toni's skills, projects, school, or how to reach him!",
  "My clipboard doesn't cover that! But Toni's skills? projects? contact? I've got PAGES on those!"
];

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}
function botReply(q) {
  const s = q.toLowerCase();
  let best = null, bestScore = 0;
  for (const r of RULES) {
    let score = 0;
    for (const k of r.k) {
      if (hit(s, k)) score += k.length > 6 ? 2 : 1; // full phrases outrank single words
    }
    if (score > bestScore) { bestScore = score; best = r; }
  }
  const pool = best ? best.a : FALLBACKS;
  return pool[Math.floor(Math.random() * pool.length)];
}
const chatHist = [];
const stripHtml = s => String(s).replace(/<[^>]*>/g, '');
const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const linkify = s => String(s)
  .replace(/github\.com\/\S+/g, m => `<a href="https://${m}" target="_blank" rel="noopener">${m}</a>`)
  .replace(/tres\.gutentag@gmail\.com/g, '<a href="mailto:tres.gutentag@gmail.com">tres.gutentag@gmail.com</a>');
async function remoteReply(q) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch('api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q, history: chatHist.slice(-6) }),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json();
    const out = typeof j.reply === 'string' ? j.reply.trim() : '';
    return out || null;
  } catch { clearTimeout(t); return null; }
}
function answer(q) {
  // repeat-question joke: same exact question 3x in a row → Gou calls you out (then still answers)
  const norm = q.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[!?.]+$/g, '');
  if (norm === lastQ) { streak++; } else { streak = 1; lastQ = norm; }
  const egged = streak >= 3;
  if (egged) { streak = 0; } // reset so it re-fires every 3 repeats
  const typing = document.createElement('div');
  typing.className = 'msg bot typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  chatHist.push({ role: 'user', text: String(q).slice(0, 500) });
  const finish = html => {
    typing.remove();
    addMsg(html, 'bot');
    chatHist.push({ role: 'bot', text: stripHtml(html).slice(0, 500) });
  };
  (async () => {
    if (!egged) {
      const remote = await remoteReply(q); // live AI; null when offline/unconfigured
      if (remote) { finish(linkify(escapeHtml(remote))); return; }
    }
    setTimeout(() => finish(linkify(egged ? EGGS[Math.floor(Math.random() * EGGS.length)] : botReply(q))), reduced ? 50 : 500);
  })();
}
function openChat() {
  panel.hidden = false;
  bubble.setAttribute('aria-expanded', 'true');
  bubble.querySelector('.chat-ping')?.remove();
  if (!greeted) {
    greeted = true;
    addMsg("Hi! I'm <b>Gou</b> — Toni's manager! Ask me anything about him: skills, projects, school, music, contact. I'll even judge his muscles if you ask nicely.", 'bot');
  }
  setTimeout(() => chatInput.focus(), 50);
}
function closeChat() {
  panel.hidden = true;
  bubble.setAttribute('aria-expanded', 'false');
  bubble.focus();
}
bubble?.addEventListener('click', () => (panel.hidden ? openChat() : closeChat()));
chatClose?.addEventListener('click', closeChat);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !panel.hidden) closeChat();
});
chatForm?.addEventListener('submit', e => {
  e.preventDefault();
  const v = chatInput.value.trim();
  if (!v) return;
  addMsg(v.replace(/</g, '&lt;'), 'user');
  chatInput.value = '';
  answer(v);
});
chips?.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  addMsg(b.textContent, 'user');
  answer(b.textContent);
});
