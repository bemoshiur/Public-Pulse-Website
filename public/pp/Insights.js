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
__dcDefine("Insights", function (DCLogic) {

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { t: 'All' }; }
  renderVals() {
    const labels = ['All', 'Paid media', 'SEO', 'Hospitality marketing', 'Brand building'];
    const topics = labels.map((l) => {
      const on = this.state.t === l;
      return { label: l, on, bg: on ? '#F2F0EA' : 'transparent', fg: on ? '#0B0C0B' : '#F2F0EA', bd: on ? '#F2F0EA' : 'rgba(242,240,234,0.2)', pick: () => this.setState({ t: l }) };
    });
    const guides = [
      { t: 'How to run a Facebook ad campaign for a Bangladesh constituency election', d: 'Audience build, compliance and budget pacing for a constituency-targeted Meta campaign.', time: '2h30m', c: '#DE2A22' },
      { t: 'Set up Meta Conversions API for a Bangladesh e-commerce site', d: 'Recover lost conversion signal with server-side tracking on Next.js, Shopify or WooCommerce.', time: '1h', c: '#4BE38F' },
      { t: 'Add IndexNow to your publish pipeline', d: 'Notify Bing, Yandex and other engines the moment a page goes live.', time: '30m', c: '#F2F0EA' }
    ];
    const compares = [
      { t: 'Integrated Agency vs In-house Marketing Team', d: 'Cost, speed, skill range, accountability and brand control for a Bangladesh brand.' },
      { t: 'Facebook / Meta Ads vs Google Ads (Search + YouTube)', d: 'Reach and creator culture against intent-driven search: cost, audience, creative needs.' },
      { t: 'Boosting vs Ads Manager', d: 'When a boosted post is enough for a political campaign, and when you need Ads Manager.' }
    ];
    return { topics, guides, compares };
  }
}

return Component;
});
__dcMount("Insights");
