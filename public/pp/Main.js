__dcDefine("Nav", function (DCLogic) {

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { open: false, sOpen: false, q: '', sel: 0 };
    this.mx = -100; this.my = -100; this.cx = -100; this.cy = -100;
    this.curRef = (el) => { this.cur = el; };
    this.inRef = (el) => { this.inEl = el; if (el) setTimeout(() => { try { el.focus(); } catch (_) {} }, 30); };
    this.toggle = () => this.setState({ open: !this.state.open });
    this.openSearch = () => this.setState({ sOpen: true, open: false, q: '', sel: 0 });
    this.closeSearch = () => this.setState({ sOpen: false });
    this.typed = (e) => this.setState({ q: e.target.value || '', sel: 0 });
    this.keys = (e) => {
      const n = (this.lastResults || []).length;
      if (e.key === 'Escape') { e.preventDefault(); this.closeSearch(); }
      else if (e.key === 'ArrowDown' && n) { e.preventDefault(); this.setState({ sel: (this.state.sel + 1) % n }); }
      else if (e.key === 'ArrowUp' && n) { e.preventDefault(); this.setState({ sel: (this.state.sel + n - 1) % n }); }
      else if (e.key === 'Enter' && n) {
        e.preventDefault();
        const box = this.inEl && this.inEl.closest('[role=dialog]');
        const links = box ? box.querySelectorAll('a.hov-row') : [];
        if (links[this.state.sel]) links[this.state.sel].click();
      }
    };
    this.index = this.buildIndex();
  }
  buildIndex() {
    const I = [];
    const add = (type, title, d, href, page, kw) => I.push({ type, title, d, href, page, hay: (title + ' ' + d + ' ' + (kw || '') + ' ' + type).toLowerCase() });
    [['Home', 'Reach that moves. Narratives that hold. Dhaka digital marketing and political PR studio.', 'Main.dc.html', 'homepage start'],
     ['Services', 'Nine sharp services. One accountable team.', 'Services.dc.html', 'what we do offer'],
     ['Work', 'The work, in the open. Campaigns, brand systems, social, paid media and film.', 'Work.dc.html', 'portfolio projects'],
     ['Case studies', 'Work that measured up. Real, citable results.', 'Results.dc.html', 'results metrics outcomes'],
     ['Election readiness', 'Win the perception first. 90-day election playbook, 24h crisis SLA.', 'Election.dc.html', 'politics candidate campaign vote constituency'],
     ['Insights', 'Notes from the studio. 121 articles across 10 categories.', 'Insights.dc.html', 'blog articles'],
     ['About the studio', 'A Bangladesh studio built for integrated work. Founded 2024.', 'Studio.dc.html', 'about team pulse group credentials'],
     ['Contact', 'Talk to a human in under an hour. WhatsApp, brief, or call.', 'Contact.dc.html', 'email phone whatsapp brief form address'],
     ['Book a call', 'Pick a time that works. Free consultation on Cal.com.', 'Book.dc.html', 'schedule meeting calendar consultation cal.com'],
     ['Pricing', 'Starting rates for every service, billed in BDT.', 'Pricing.dc.html', 'cost price fee budget taka bdt retainer'],
     ['Press', 'Boilerplate, brand assets and a direct line for journalists.', 'Press.dc.html', 'media journalist logo brand kit'],
     ['Guides', 'Step-by-step HowTo playbooks.', 'Guides.dc.html', 'howto tutorial playbook'],
     ['Glossary', 'Words we use — marketing, PR, paid media, SEO, analytics.', 'Glossary.dc.html', 'terms definitions'],
     ['Compare', 'Decision matrices for common marketing decisions.', 'Compare.dc.html', 'versus vs comparison'],
     ['Locations', 'Across Bangladesh. Dhaka HQ, 9 cities.', 'Locations.dc.html', 'cities map coverage'],
     ['Industries', 'Verticals we know — ten sectors.', 'Industries.dc.html', 'sectors verticals']
    ].forEach((p) => add('PAGE', p[0], p[1], p[2], p[0], p[3]));
    [['Political PR & Image Building', 'Candidate image building, crisis management, election campaigns, narrative engineering.', 'Election.dc.html', 'Election'],
     ['Social Media Management', 'Facebook, Instagram, YouTube, TikTok — full platform management.', 'Services.dc.html', 'Services'],
     ['Content Production', 'Video, photo, motion graphics, drone shoots.', 'Services.dc.html', 'Services'],
     ['Paid Ads & Campaigns', 'Meta, Google, YouTube — ROAS-focused paid media.', 'Pricing.dc.html', 'Pricing'],
     ['Hospitality Marketing', "Resorts, hotels and restaurants — Cox's Bazar to Sylhet.", 'Services.dc.html', 'Services'],
     ['Brand Building & Design', 'Logo, identity, packaging, brand guidelines, positioning.', 'Services.dc.html', 'Services'],
     ['SEO & Website Development', 'Local, technical and on-page SEO, conversion-focused websites.', 'Services.dc.html', 'Services'],
     ['Analytics & Performance Reporting', 'GA4, GTM, Meta Pixel, Looker Studio, monthly ROI reports.', 'Services.dc.html', 'Services'],
     ['Influencer & KOL Marketing', 'Discovery, contracting, campaign management, disclosure compliance.', 'Services.dc.html', 'Services']
    ].forEach((s) => add('SERVICE', s[0], s[1], s[2], s[3]));
    [['How to run a Facebook ad campaign for a Bangladesh constituency election', 'Audience build, compliance and budget pacing.'],
     ['Set up Meta Conversions API for a Bangladesh e-commerce site', 'Server-side tracking on Next.js, Shopify or WooCommerce.'],
     ['Add IndexNow to your publish pipeline', 'Notify Bing, Yandex and other engines when a page goes live.']
    ].forEach((g) => add('GUIDE', g[0], g[1], 'Guides.dc.html', 'Guides'));
    [['Integrated Agency vs In-house Team', 'Cost, speed, skill range, accountability and brand control.'],
     ['Meta Ads vs Google Ads', 'Reach and creator culture against intent-driven search.'],
     ['Boosting vs Ads Manager', 'When a boosted post is enough for a political campaign.']
    ].forEach((c) => add('COMPARE', c[0], c[1], 'Compare.dc.html', 'Compare'));
    [['Engagement Rate', 'Engagements divided by reach.'], ['Narrative Engineering', 'A campaign message built as a story voters can retell.'],
     ['Opposition Research', 'An opponent’s record from public, verifiable sources.'], ['Meta Conversions API (CAPI)', 'Server-to-server conversion events with Meta.'],
     ['ROAS (Return on Ad Spend)', 'Revenue for each unit of ad spend.'], ['CTR (Click-Through Rate)', 'Clicks as a share of impressions.'],
     ['Boosted Post', 'Paying to extend a post’s reach.'], ['Ad Authorization', 'Meta’s check before political ads.'],
     ['“Paid for by” Disclaimer', 'The label naming who funded a political ad.'], ['Special Ad Category', 'Meta’s restricted class for political ads.'],
     ['Constituency Targeting', 'Paid reach focused on one electoral seat.'], ['Answer Block', 'A quotable 40–60 word answer for AI engines.'],
     ['AEO (Answer Engine Optimization)', 'Structuring pages so answer engines cite them.'], ['GEO (Generative Engine Optimization)', 'Content generative AI can ground answers in.']
    ].forEach((t) => add('GLOSSARY', t[0], t[1], 'Glossary.dc.html', 'Glossary'));
    ['Dhaka', 'Chattogram', 'Sylhet', 'Khulna', 'Rajshahi', "Cox's Bazar", 'Gazipur', 'Narayanganj', 'Comilla'].forEach((c) => add('CITY', c, 'Local context and active engagements in ' + c + '.', 'Locations.dc.html', 'Locations', c === 'Chattogram' ? 'chittagong' : (c === 'Comilla' ? 'cumilla' : '')));
    ['Real Estate', 'E-commerce', 'Restaurants & Food', 'Healthcare', 'Education', 'NGO & Development', 'Government & Public Sector', 'RMG & Garments', 'Hospitality', 'Fintech'].forEach((x) => add('INDUSTRY', x, 'How we market in ' + x + '.', 'Industries.dc.html', 'Industries'));
    return I;
  }
  componentDidMount() {
    this.onMove = (e) => {
      this.mx = e.clientX; this.my = e.clientY;
      if (!this.cur) return;
      this.cur.classList.add('on');
      const t = e.target && e.target.closest ? e.target.closest('a,button,canvas') : null;
      if (t) this.cur.classList.add('big'); else this.cur.classList.remove('big');
    };
    this.onLeave = () => { if (this.cur) this.cur.classList.remove('on'); };
    window.addEventListener('pointermove', this.onMove, { passive: true });
    document.addEventListener('pointerleave', this.onLeave);
    const loop = () => {
      if (this.dead) return;
      this.cx += (this.mx - this.cx) * 0.18; this.cy += (this.my - this.cy) * 0.18;
      if (this.cur) this.cur.style.transform = 'translate3d(' + this.cx.toFixed(1) + 'px,' + this.cy.toFixed(1) + 'px,0)';
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() {
    this.dead = true; cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
    document.removeEventListener('pointerleave', this.onLeave);
  }
  renderVals() {
    const active = this.props.active ?? 'home';
    const raw = [
      ['services', 'Services', 'Services.dc.html'], ['work', 'Work', 'Work.dc.html'], ['results', 'Results', 'Results.dc.html'],
      ['election', 'Election', 'Election.dc.html'], ['insights', 'Insights', 'Insights.dc.html'],
      ['studio', 'Studio', 'Studio.dc.html'], ['contact', 'Contact', 'Contact.dc.html']
    ];
    const links = raw.map((r) => ({ label: r[1], href: r[2], current: r[0] === active ? 'page' : undefined, color: r[0] === active ? '#4BE38F' : '#F2F0EA' }));
    const open = this.state.open;
    const { sOpen, q, sel } = this.state;
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const colors = { PAGE: '#F2F0EA', SERVICE: '#DE2A22', GUIDE: '#4BE38F', COMPARE: '#4BE38F', GLOSSARY: '#FCB400', CITY: '#9EA39B', INDUSTRY: '#9EA39B' };
    let found = [];
    if (words.length) {
      found = this.index.map((it) => {
        let score = 0;
        for (const w of words) {
          if (!it.hay.includes(w)) return null;
          const t = it.title.toLowerCase();
          score += t.startsWith(w) ? 6 : (t.includes(w) ? 3 : 1);
        }
        if (it.type === 'PAGE') score += 1;
        return { it, score };
      }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 12).map((x) => x.it);
    }
    this.lastResults = found;
    const results = found.map((it, i) => ({ ...it, c: colors[it.type], bg: i === sel ? 'rgba(242,240,234,0.06)' : 'transparent' }));
    const suggest = ['Election', 'Pricing', 'Paid ads', 'Hospitality', 'SEO', 'ROAS', "Cox's Bazar", 'Book a call'].map((label) => ({ label, pick: () => this.setState({ q: label, sel: 0 }) }));
    const pages = this.index.filter((x) => x.type === 'PAGE').slice(1, 10).map((p) => ({ title: p.title, href: p.href }));
    return {
      links, open, toggle: this.toggle, curRef: this.curRef, icon: open ? 'M6 6l12 12M18 6L6 18' : 'M4 8h16M4 16h16',
      sOpen, q, openSearch: this.openSearch, closeSearch: this.closeSearch, typed: this.typed, keys: this.keys, inRef: this.inRef,
      results, hasResults: results.length > 0, noResults: words.length > 0 && results.length === 0, showSuggest: words.length === 0,
      suggest, pages, countLabel: words.length ? results.length + ' RESULTS' : '', lineColor: words.length ? '#DE2A22' : 'rgba(242,240,234,0.2)'
    };
  }
}

return Component;
});
__dcDefine("Footer", function (DCLogic) {

class Component extends DCLogic {
  renderVals() {
    const L = (label, href) => {
      const parts = href.split('#'), id = parts[1];
      if (!id) return { label, href };
      return { label, href, click: (e) => {
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        else { window.__ppScroll = id; try { sessionStorage.setItem('pp-scroll', id); } catch (_) {} }
      } };
    };
    const cols = [
      { title: 'Services', links: [L('Political PR', 'Election.dc.html'), L('Social Media', 'Services.dc.html#svc-02'), L('Content Production', 'Services.dc.html#svc-03'), L('Paid Ads', 'Pricing.dc.html'), L('Hospitality', 'Services.dc.html#svc-05'), L('All services →', 'Services.dc.html'), L('Pricing', 'Pricing.dc.html')] },
      { title: 'Studio', links: [L('About', 'Studio.dc.html'), L('Work', 'Work.dc.html'), L('Results', 'Results.dc.html'), L('Insights', 'Insights.dc.html'), L('Press', 'Press.dc.html'), L('Contact', 'Contact.dc.html'), L('Book a call', 'Book.dc.html')] },
      { title: 'Resources', links: [L('Election readiness', 'Election.dc.html'), L('Guides', 'Guides.dc.html'), L('Glossary', 'Glossary.dc.html'), L('Compare', 'Compare.dc.html'), L('Locations', 'Locations.dc.html'), L('Industries', 'Industries.dc.html')] },
      { title: 'Social', links: [L('Facebook', 'https://web.facebook.com/publicpulse.agency'), L('Instagram', 'https://www.instagram.com/publicpulse_agency/'), L('WhatsApp', 'https://wa.me/message/TBIM4KYTCFPEI1')] }
    ];
    const base = [{ c: '#F2F0EA', s: '0' }, { c: 'transparent', s: '2px #4BE38F' }, { c: '#DE2A22', s: '0' }];
    const talk = base.concat(base);
    return { cols, talk };
  }
}

return Component;
});
__dcDefine("Main", function (DCLogic) {

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { open: 0, k: 0 };
    this.rot = -0.6; this.vel = 0; this.tilt = 0.5; this.drag = null; this.lastDx = 0;
    this.cvRef = (el) => { this.cv = el; if (el && !this.raf && !this.dead) this.boot(); };
    this.statsRef = (el) => { this.statsEl = el; };
    this.onDown = (e) => { this.drag = { x: e.clientX, y: e.clientY, r: this.rot, t: this.tilt }; this.lastDx = 0; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} };
    this.onMove = (e) => {
      if (!this.drag) return;
      const dx = e.clientX - this.drag.x, dy = e.clientY - this.drag.y;
      this.vel = (dx - this.lastDx) * 0.006; this.lastDx = dx;
      this.rot = this.drag.r + dx * 0.006;
      this.tilt = Math.max(0.05, Math.min(0.95, this.drag.t + dy * 0.004));
    };
    this.onUp = () => { this.drag = null; };
  }
  componentDidMount() {
    if (this.cv && !this.raf) this.boot();
    if (typeof IntersectionObserver !== 'undefined' && this.statsEl) {
      this.io = new IntersectionObserver((en) => {
        if (en[0] && en[0].isIntersecting) { this.io.disconnect(); this.count(); }
      }, { threshold: 0.3 });
      this.io.observe(this.statsEl);
    } else { this.setState({ k: 1 }); }
  }
  componentWillUnmount() { this.dead = true; if (this.raf) cancelAnimationFrame(this.raf); if (this.io) this.io.disconnect(); }
  count() {
    const t0 = performance.now();
    const step = (now) => {
      if (this.dead) return;
      const p = Math.min(1, (now - t0) / 1600);
      this.setState({ k: 1 - Math.pow(1 - p, 3) });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  boot() {
    const D = Math.PI / 180;
    const toV = (lat, lon) => [Math.cos(lat * D) * Math.cos(lon * D), Math.sin(lat * D), Math.cos(lat * D) * Math.sin(lon * D)];
    const blobs = [[48,-100,20,32],[32,-96,11,20],[62,-140,9,26],[60,-100,10,30],[19,-100,8,10],[12,-86,6,6],[72,-42,9,16],[-6,-62,15,18],[-24,-58,13,11],[-42,-68,10,5],[50,10,11,18],[60,22,8,18],[42,-4,5,6],[64,14,6,8],[12,15,14,24],[-10,25,14,12],[-26,25,9,10],[26,14,9,24],[56,90,14,50],[40,100,12,28],[32,70,9,18],[25,45,9,12],[21,78,10,8],[24,90,3,3],[14,102,7,5],[-3,115,5,15],[-24,134,10,17],[36,138,6,4],[37,127.6,2.6,1.4],[66,170,6,15],[-40,174,5,3],[8,-73,5,6]];
    const isLand = (lat, lon) => {
      for (const b of blobs) {
        let dl = lon - b[1]; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
        const a = (lat - b[0]) / b[2], c = dl / b[3];
        if (a * a + c * c < 1) return true;
      }
      return false;
    };
    const N = 2600, pts = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
      const v = [Math.cos(th) * r, y, Math.sin(th) * r];
      const lat = Math.asin(y) / D, lon = Math.atan2(v[2], v[0]) / D;
      const land = isLand(lat, lon);
      if (land || i % 3 === 0) {
        let dl = lon - 90.4; const near = land && Math.abs(lat - 23.8) < 7 && Math.abs(dl) < 9;
        pts.push({ v, land, near });
      }
    }
    this.pts = pts;
    this.dhaka = toV(23.81, 90.41);
    this.targets = [toV(40.71, -74.0), toV(34.05, -118.24), toV(41.88, -87.63), toV(29.76, -95.37), toV(47.61, -122.33)];
    const slerp = (p, q, t) => {
      const d = Math.max(-1, Math.min(1, p[0]*q[0] + p[1]*q[1] + p[2]*q[2]));
      const w = Math.acos(d), s = Math.sin(w);
      const a = Math.sin((1 - t) * w) / s, b = Math.sin(t * w) / s;
      return [a*p[0] + b*q[0], a*p[1] + b*q[1], a*p[2] + b*q[2]];
    };
    this.seoul = toV(37.57, 126.98);
    const mk = (q, lift, kind) => {
      const out = [];
      for (let i = 0; i <= 64; i++) {
        const t = i / 64, v = slerp(this.dhaka, q, t), h = 1 + lift * Math.sin(Math.PI * t);
        out.push([v[0]*h, v[1]*h, v[2]*h]);
      }
      return { pts: out, kind };
    };
    this.arcs = this.targets.map((q) => mk(q, 0.28, 'us')).concat([mk(this.seoul, 0.16, 'kr')]);
    const loop = () => {
      if (this.dead) return;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  draw() {
    const cv = this.cv; if (!cv) return;
    const ctx = cv.getContext('2d');
    const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const red = this.props.red ?? '#DE2A22', green = this.props.green ?? '#4BE38F';
    const t = performance.now() / 1000;
    if (!this.drag) { this.rot += 0.0022 + this.vel; this.vel *= 0.95; }
    const ca = Math.cos(this.rot), sa = Math.sin(this.rot), cb = Math.cos(this.tilt), sb = Math.sin(this.tilt);
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.39;
    const P = (v) => {
      const X = v[0]*ca + v[2]*sa, Z = -v[0]*sa + v[2]*ca, Y = v[1];
      const Y2 = Y*cb - Z*sb, Z2 = Y*sb + Z*cb;
      const hid = Z2 < 0 && (X*X + Y2*Y2) < 1;
      return { x: cx + X*R, y: cy - Y2*R, z: Z2, hid };
    };
    const g = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.3);
    g.addColorStop(0, 'rgba(222,42,34,0.16)'); g.addColorStop(1, 'rgba(222,42,34,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const body = ctx.createRadialGradient(cx - R*0.35, cy - R*0.4, R*0.1, cx, cy, R);
    body.addColorStop(0, '#1A1D1A'); body.addColorStop(1, '#0C0E0C');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(242,240,234,0.14)'; ctx.stroke();
    for (const p of this.pts) {
      const q = P(p.v); if (q.z < 0) continue;
      const s = p.land ? 2.1 : 1.1;
      ctx.globalAlpha = p.land ? 0.25 + 0.75 * q.z : 0.12 * q.z;
      ctx.fillStyle = p.near ? red : '#E6E8E2';
      ctx.fillRect(q.x - s/2, q.y - s/2, s, s);
    }
    ctx.globalAlpha = 1;
    this.arcs.forEach((arc, i) => {
      const pr = arc.pts.map(P), kr = arc.kind === 'kr', col = kr ? red : green;
      ctx.lineWidth = 1;
      for (let k = 1; k < pr.length; k++) {
        const a = pr[k-1], b = pr[k]; if (a.hid || b.hid) continue;
        ctx.strokeStyle = kr ? 'rgba(222,42,34,0.4)' : 'rgba(75,227,143,0.22)';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const u = (t * 0.28 + i * 0.2) % 1, tail = 0.22;
      ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      for (let k = 1; k < pr.length; k++) {
        const tk = k / (pr.length - 1); if (tk > u || tk < u - tail) continue;
        const a = pr[k-1], b = pr[k]; if (a.hid || b.hid) continue;
        ctx.globalAlpha = 1 - (u - tk) / tail;
        ctx.strokeStyle = col;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const e = pr[pr.length - 1];
      if (!e.hid && !kr) {
        const ph = (t * 0.9 + i * 0.3) % 1;
        ctx.beginPath(); ctx.arc(e.x, e.y, 3 + ph * 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(75,227,143,' + (0.6 * (1 - ph)).toFixed(3) + ')'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, Math.PI * 2); ctx.fillStyle = green; ctx.fill();
      }
    });
    const kr = P(this.seoul);
    if (!kr.hid) {
      const ph = (t * 0.8) % 1;
      ctx.beginPath(); ctx.arc(kr.x, kr.y, 4 + ph * 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(222,42,34,' + (0.7 * (1 - ph)).toFixed(3) + ')'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(kr.x, kr.y, 4.5, 0, Math.PI * 2); ctx.fillStyle = red; ctx.fill();
      ctx.beginPath(); ctx.arc(kr.x, kr.y, 1.8, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.font = '700 11px JetBrains Mono, monospace'; ctx.fillStyle = '#F2F0EA'; ctx.fillText('SEOUL', kr.x + 10, kr.y + 4);
    }
    const us = P(this.targets[0]);
    ctx.font = '600 11px JetBrains Mono, monospace';
    if (!us.hid) {
      ctx.beginPath(); ctx.arc(us.x, us.y, 6, 0, Math.PI * 2); ctx.fillStyle = green; ctx.fill();
      ctx.beginPath(); ctx.arc(us.x, us.y, 2.2, 0, Math.PI * 2); ctx.fillStyle = '#0B0C0B'; ctx.fill();
      ctx.font = '800 13px Archivo, sans-serif'; ctx.fillStyle = '#F2F0EA'; ctx.fillText('USA', us.x + 12, us.y + 4);
    }
    const d = P(this.dhaka);
    if (!d.hid) {
      for (let r = 0; r < 2; r++) {
        const ph = (t * 0.7 + r * 0.5) % 1;
        ctx.beginPath(); ctx.arc(d.x, d.y, 5 + ph * 30, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(222,42,34,' + (0.8 * (1 - ph)).toFixed(3) + ')'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(d.x, d.y, 6, 0, Math.PI * 2); ctx.fillStyle = red; ctx.fill();
      ctx.beginPath(); ctx.arc(d.x, d.y, 2.4, 0, Math.PI * 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.font = '800 13px Archivo, sans-serif'; ctx.fillStyle = '#F2F0EA'; ctx.fillText('DHAKA', d.x + 12, d.y + 4);
    }
  }
  renderVals() {
    const red = this.props.red ?? '#DE2A22';
    const green = this.props.green ?? '#4BE38F';
    const svc = [
      ['Political PR & Image Building', 'Candidate image building, crisis management, election campaigns, and narrative engineering.', ['Candidate image building', 'Crisis management', 'Election campaigns', 'Narrative engineering']],
      ['Social Media Management', 'Facebook, Instagram, YouTube, TikTok — full platform management for Bangladeshi brands.', ['Facebook', 'Instagram', 'YouTube', 'TikTok']],
      ['Content Production', 'Video, photo, motion graphics, drone shoots — strategy-driven content shot in Bangladesh.', ['Video', 'Photo', 'Motion graphics', 'Drone shoots']],
      ['Paid Ads & Campaigns', 'Meta, Google, YouTube — ROAS-focused paid media for Bangladesh.', ['Meta', 'Google', 'YouTube']],
      ['Hospitality Marketing', "Resorts, hotels and restaurants — Cox's Bazar to Sylhet, Dhaka to Chittagong.", ['Resorts', 'Hotels', 'Restaurants']],
      ['Brand Building & Design', 'Logo, identity, packaging, brand guidelines and competitor positioning.', ['Logo', 'Identity', 'Packaging', 'Brand guidelines', 'Competitor positioning']],
      ['SEO & Website Development', 'Local SEO, technical SEO, on-page SEO and conversion-focused website builds.', ['Local SEO', 'Technical SEO', 'On-page SEO', 'Website builds']],
      ['Analytics & Performance Reporting', 'GA4, GTM, Meta Pixel setup, Looker Studio dashboards, monthly ROI reports.', ['GA4', 'GTM', 'Meta Pixel', 'Looker Studio', 'Monthly ROI reports']],
      ['Influencer & KOL Marketing', 'Discovery, contracting, campaign management and disclosure compliance.', ['Discovery', 'Contracting', 'Campaign management', 'Disclosure compliance']]
    ];
    const services = svc.map((s, i) => {
      const open = this.state.open === i;
      return {
        num: String(i + 1).padStart(2, '0'), title: s[0], desc: s[1], tags: s[2], open,
        chipBg: open ? red : 'transparent', chipFg: open ? '#FFFFFF' : '#0B0C0B',
        rot: open ? 'rotate(45deg)' : 'none', shift: open ? 'translateX(12px)' : 'none',
        toggle: () => this.setState({ open: open ? -1 : i })
      };
    });
    const names = svc.map((s) => s[0]);
    const marquee = names.concat(names);
    let ecg = 'M0 80';
    for (let k = 0; k < 4; k++) {
      const o = k * 360;
      ecg += ' L' + (o + 110) + ' 80 L' + (o + 128) + ' 70 L' + (o + 146) + ' 80 L' + (o + 176) + ' 80 L' + (o + 188) + ' 14 L' + (o + 202) + ' 132 L' + (o + 216) + ' 56 L' + (o + 228) + ' 80 L' + (o + 262) + ' 80 L' + (o + 290) + ' 66 L' + (o + 318) + ' 80 L' + (o + 360) + ' 80';
    }
    const facts = [
      { k: 'Founded', v: '2024 · Dhaka' }, { k: 'Services', v: '9 in-house' },
      { k: 'Billing', v: 'BDT · registered BD entity' }, { k: 'Languages', v: 'English + Bangla' }
    ];
    const steps = [
      { num: '01', title: 'Listen', desc: 'A 30-minute strategy call. We review your channels, what is working, and what you have already tried.', bg: '#151815', fg: '#F2F0EA', top: '110px' },
      { num: '02', title: 'Plan', desc: 'A quarterly plan with named owners, a calendar, a budget, and one KPI we are accountable for.', bg: '#EEF0EC', fg: '#0B0C0B', top: '140px' },
      { num: '03', title: 'Make', desc: 'Every discipline works from one brief and one weekly stand-up.', bg: red, fg: '#FFFFFF', top: '170px' },
      { num: '04', title: 'Sharpen', desc: 'A monthly review: what to double down on, what to stop. No vanity dashboards.', bg: green, fg: '#0B0C0B', top: '200px' }
    ];
    const k = this.state.k;
    const c = (n) => String(Math.round(n * k));
    const stats = [
      { n: c(9), label: 'Services in-house', color: '#F2F0EA' },
      { n: c(9), label: 'Cities covered', color: red },
      { n: c(10), label: 'Industries served', color: '#F2F0EA' },
      { n: c(2), label: 'Languages (EN + বাংলা)', color: green }
    ];
    const results = [
      { n: '3 → 1', label: 'Vendor consolidation', color: '#F2F0EA' },
      { n: '2×', label: 'Decision speed', color: green },
      { n: '1', label: 'Weekly report, one team', color: red }
    ];
    const words = "We don't hand off between three agencies. Strategy, creative, paid media and analytics work together — and report in one weekly report.".split(' ');
    const statement = words.map((t) => ({ t, color: /^(three|agencies\.|one|weekly)$/.test(t) ? red : '#F2F0EA' }));
    return { red, green, services, marquee, ecg, facts, steps, stats, results, statement,
      cvRef: this.cvRef, statsRef: this.statsRef, onDown: this.onDown, onMove: this.onMove, onUp: this.onUp };
  }
}

return Component;
});
__dcMount("Main");
