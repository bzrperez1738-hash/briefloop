const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0e0f0d; --bg2:#161714; --bg3:#1e1f1c;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --text:#e8e6df; --muted:#7a7870;
    --teal:#1D9E75; --teal-dim:rgba(29,158,117,0.12); --teal-glow:rgba(29,158,117,0.25);
    --serif:'DM Serif Display',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
    --radius:10px; --radius-lg:16px;
  }
  html, body { background:var(--bg); color:var(--text); font-family:var(--sans); scroll-behavior:smooth; }

  /* NAV */
  .nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 3rem; height:60px;
    background:rgba(14,15,13,0.85); backdrop-filter:blur(12px);
    border-bottom:1px solid var(--border);
  }
  .nav-logo { font-family:var(--serif); font-size:20px; }
  .nav-logo em { color:var(--teal); font-style:normal; }
  .nav-links { display:flex; align-items:center; gap:2rem; }
  .nav-link { font-size:13px; color:var(--muted); text-decoration:none; cursor:pointer; transition:color .15s; }
  .nav-link:hover { color:var(--text); }
  .nav-cta {
    font-size:13px; font-weight:500; padding:7px 18px; border-radius:100px;
    background:var(--teal); color:#fff; border:none; cursor:pointer;
    font-family:var(--sans); transition:opacity .15s; text-decoration:none;
  }
  .nav-cta:hover { opacity:.88; }

  /* HERO */
  .hero {
    min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; text-align:center; padding:8rem 2rem 6rem;
    position:relative; overflow:hidden;
  }
  .hero-glow {
    position:absolute; top:20%; left:50%; transform:translateX(-50%);
    width:600px; height:600px; border-radius:50%;
    background:radial-gradient(circle, rgba(29,158,117,0.08) 0%, transparent 70%);
    pointer-events:none;
  }
  .hero-badge {
    display:inline-flex; align-items:center; gap:6px;
    background:var(--teal-dim); border:1px solid var(--teal-glow);
    color:var(--teal); font-size:12px; font-weight:500;
    padding:5px 14px; border-radius:100px; margin-bottom:1.5rem;
  }
  .hero-badge-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  .hero h1 {
    font-family:var(--serif); font-size:clamp(42px,6vw,72px);
    line-height:1.05; letter-spacing:-2px; margin-bottom:1.5rem;
    max-width:800px;
  }
  .hero h1 em { color:var(--teal); font-style:italic; }
  .hero-sub {
    font-size:clamp(16px,2vw,19px); color:var(--muted); line-height:1.7;
    max-width:520px; margin-bottom:2.5rem;
  }
  .hero-ctas { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
  .btn-primary {
    padding:13px 28px; border-radius:100px; background:var(--teal); color:#fff;
    font-size:15px; font-weight:500; border:none; cursor:pointer;
    font-family:var(--sans); transition:opacity .15s; text-decoration:none;
    display:inline-block;
  }
  .btn-primary:hover { opacity:.88; }
  .btn-secondary {
    padding:13px 28px; border-radius:100px; background:transparent; color:var(--text);
    font-size:15px; font-weight:500; border:1px solid var(--border2); cursor:pointer;
    font-family:var(--sans); transition:background .15s; text-decoration:none;
    display:inline-block;
  }
  .btn-secondary:hover { background:var(--bg2); }
  .hero-note { font-size:12px; color:var(--muted); margin-top:1rem; }

  /* DEMO PREVIEW */
  .demo-wrap {
    max-width:900px; margin:0 auto; padding:0 2rem 6rem;
  }
  .demo-box {
    background:var(--bg2); border:1px solid var(--border2); border-radius:var(--radius-lg);
    overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,.4);
  }
  .demo-bar {
    padding:10px 16px; background:var(--bg3); border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:8px;
  }
  .demo-dot { width:10px; height:10px; border-radius:50%; }
  .demo-title { font-size:12px; color:var(--muted); margin-left:8px; }
  .demo-cols { display:grid; grid-template-columns:1fr 1fr; }
  .demo-col { padding:1.25rem; }
  .demo-col:first-child { border-right:1px solid var(--border); }
  .demo-label { font-size:10px; font-weight:500; letter-spacing:.8px; text-transform:uppercase; color:var(--muted); margin-bottom:.75rem; }
  .demo-text { font-size:12px; color:var(--muted); line-height:1.7; font-family:monospace; }
  .demo-hl { background:rgba(29,158,117,.15); color:#9FE1CB; border-radius:3px; padding:0 2px; }
  .demo-task { display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; }
  .demo-check { width:14px; height:14px; border-radius:50%; border:1.5px solid var(--teal); flex-shrink:0; margin-top:2px; }
  .demo-task-text { font-size:12px; color:var(--text); line-height:1.4; }
  .demo-pill { display:inline-block; font-size:10px; font-weight:500; padding:1px 7px; border-radius:100px; margin-left:4px; }
  .demo-pill-blue { background:rgba(56,138,221,.15); color:#85B7EB; }
  .demo-pill-amber { background:rgba(212,148,58,.12); color:#d4943a; }
  .demo-pill-red { background:rgba(194,91,91,.12); color:#c25b5b; }

  /* STATS */
  .stats { padding:4rem 2rem; display:flex; justify-content:center; gap:4rem; flex-wrap:wrap; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--bg2); }
  .stat-item { text-align:center; }
  .stat-num { font-family:var(--serif); font-size:42px; color:var(--teal); line-height:1; margin-bottom:4px; }
  .stat-label { font-size:13px; color:var(--muted); }

  /* HOW IT WORKS */
  .section { padding:6rem 2rem; max-width:900px; margin:0 auto; }
  .section-badge { display:inline-block; font-size:11px; font-weight:500; letter-spacing:.8px; text-transform:uppercase; color:var(--teal); margin-bottom:1rem; }
  .section-title { font-family:var(--serif); font-size:clamp(28px,4vw,42px); line-height:1.1; letter-spacing:-.5px; margin-bottom:.75rem; }
  .section-title em { color:var(--teal); font-style:italic; }
  .section-sub { font-size:15px; color:var(--muted); line-height:1.7; max-width:480px; margin-bottom:3rem; }

  .steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .step-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; }
  .step-num { width:32px; height:32px; border-radius:50%; background:var(--teal-dim); border:1px solid var(--teal-glow); color:var(--teal); font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; }
  .step-title { font-size:15px; font-weight:500; margin-bottom:.5rem; }
  .step-desc { font-size:13px; color:var(--muted); line-height:1.6; }

  /* FEATURES */
  .features-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
  .feature-card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; display:flex; gap:1rem; }
  .feature-icon { font-size:22px; flex-shrink:0; }
  .feature-title { font-size:15px; font-weight:500; margin-bottom:.4rem; }
  .feature-desc { font-size:13px; color:var(--muted); line-height:1.6; }

  /* TESTIMONIALS */
  .testimonials-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
  .testimonial { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.5rem; }
  .testimonial-text { font-size:14px; color:var(--text); line-height:1.7; font-style:italic; margin-bottom:1rem; }
  .testimonial-author { display:flex; align-items:center; gap:10px; }
  .testimonial-avatar { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; flex-shrink:0; }
  .testimonial-name { font-size:13px; font-weight:500; }
  .testimonial-role { font-size:12px; color:var(--muted); }

  /* PRICING */
  .pricing-section { padding:6rem 2rem; background:var(--bg2); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .pricing-inner { max-width:900px; margin:0 auto; }
  .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:3rem; }
  .plan-card { background:var(--bg); border:1px solid var(--border2); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; gap:1rem; transition:border-color .2s; }
  .plan-card:hover { border-color:rgba(255,255,255,.2); }
  .plan-card.featured { border:2px solid var(--teal); position:relative; }
  .featured-badge { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:var(--teal); color:#fff; font-size:11px; font-weight:500; padding:2px 12px; border-radius:100px; white-space:nowrap; }
  .plan-name { font-size:12px; font-weight:500; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
  .plan-price { font-family:var(--serif); font-size:42px; line-height:1; }
  .plan-price sup { font-family:var(--sans); font-size:18px; vertical-align:super; }
  .plan-price sub { font-family:var(--sans); font-size:14px; color:var(--muted); font-weight:400; }
  .plan-desc { font-size:13px; color:var(--muted); padding-bottom:1rem; border-bottom:1px solid var(--border); line-height:1.5; }
  .plan-features { display:flex; flex-direction:column; gap:8px; flex:1; }
  .plan-feature { display:flex; gap:8px; font-size:13px; color:var(--text); }
  .feature-check { color:var(--teal); flex-shrink:0; }
  .plan-cta { width:100%; padding:10px; border-radius:var(--radius); font-size:14px; font-weight:500; border:1px solid var(--border2); background:var(--bg2); color:var(--text); cursor:pointer; font-family:var(--sans); transition:all .15s; margin-top:auto; }
  .plan-cta:hover { background:var(--bg3); }
  .plan-cta.primary { background:var(--teal); border-color:var(--teal); color:#fff; }
  .plan-cta.primary:hover { opacity:.88; }

  /* CTA SECTION */
  .cta-section { padding:8rem 2rem; text-align:center; }
  .cta-title { font-family:var(--serif); font-size:clamp(32px,5vw,56px); letter-spacing:-1px; margin-bottom:1rem; }
  .cta-title em { color:var(--teal); font-style:italic; }
  .cta-sub { font-size:16px; color:var(--muted); margin-bottom:2rem; }

  /* FOOTER */
  .footer { padding:2rem 3rem; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .footer-logo { font-family:var(--serif); font-size:16px; }
  .footer-logo em { color:var(--teal); font-style:normal; }
  .footer-links { display:flex; gap:1.5rem; }
  .footer-link { font-size:12px; color:var(--muted); text-decoration:none; cursor:pointer; }
  .footer-copy { font-size:12px; color:var(--muted); }
`;

export default function Landing({ onGetStarted }) {
  const STRIPE_LINKS = {
    solo:     "https://buy.stripe.com/test_REPLACE_SOLO",
    team:     "https://buy.stripe.com/test_REPLACE_TEAM",
    business: "https://buy.stripe.com/test_REPLACE_BUSINESS",
  };

  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">Brief<em>Loop</em></div>
        <div className="nav-links">
          <a className="nav-link" href="#how">How it works</a>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#pricing">Pricing</a>
        </div>
        <button className="nav-cta" onClick={onGetStarted}>Get started free</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge"><div className="hero-badge-dot" />AI-powered · No setup required</div>
        <h1>Your meetings,<br /><em>finally actionable</em></h1>
        <p className="hero-sub">Paste any meeting transcript. BriefLoop instantly extracts every action item, writes a summary, and drafts your follow-up email — in seconds.</p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={onGetStarted}>Start for free →</button>
          <a className="btn-secondary" href="#how">See how it works</a>
        </div>
        <div className="hero-note">No credit card required · 10 free meetings</div>
      </section>

      {/* DEMO */}
      <div className="demo-wrap">
        <div className="demo-box">
          <div className="demo-bar">
            <div className="demo-dot" style={{background:"#ff5f57"}} />
            <div className="demo-dot" style={{background:"#febc2e"}} />
            <div className="demo-dot" style={{background:"#28c840"}} />
            <div className="demo-title">BriefLoop — Q2 Product Sync</div>
          </div>
          <div className="demo-cols">
            <div className="demo-col">
              <div className="demo-label">Raw transcript</div>
              <div className="demo-text">
                [09:04] Marcus: I just need to finish the <span className="demo-hl">mobile breakpoints by Friday</span> and hand off to Dev.<br /><br />
                [09:06] Priya: <span className="demo-hl">Sarah</span>, can you get <span className="demo-hl">legal sign-off</span> on the data sharing copy <span className="demo-hl">before end of month</span>?<br /><br />
                [09:11] Priya: <span className="demo-hl">Marcus</span>, can you <span className="demo-hl">set up staging for QA</span> — we're testing <span className="demo-hl">Monday</span>.
              </div>
            </div>
            <div className="demo-col">
              <div className="demo-label">BriefLoop output</div>
              <div className="demo-task">
                <div className="demo-check" />
                <div className="demo-task-text">Finish mobile breakpoints <span className="demo-pill demo-pill-blue">Marcus</span><span className="demo-pill demo-pill-amber">Fri</span></div>
              </div>
              <div className="demo-task">
                <div className="demo-check" />
                <div className="demo-task-text">Get legal sign-off on data sharing copy <span className="demo-pill demo-pill-blue">Sarah</span><span className="demo-pill demo-pill-amber">May 31</span></div>
              </div>
              <div className="demo-task">
                <div className="demo-check" />
                <div className="demo-task-text">Set up staging environment <span className="demo-pill demo-pill-blue">Marcus</span><span className="demo-pill demo-pill-red">Blocks QA</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-item"><div className="stat-num">4,800+</div><div className="stat-label">meetings processed</div></div>
        <div className="stat-item"><div className="stat-num">97%</div><div className="stat-label">action item accuracy</div></div>
        <div className="stat-item"><div className="stat-num">3 min</div><div className="stat-label">saved per meeting</div></div>
        <div className="stat-item"><div className="stat-num">$0</div><div className="stat-label">to get started</div></div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-badge">How it works</div>
        <div className="section-title">Three steps,<br /><em>thirty seconds</em></div>
        <div className="section-sub">No setup, no integrations required to start. Just paste and go.</div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <div className="step-title">Paste your transcript</div>
            <div className="step-desc">Drop in a Zoom transcript, rough notes, or anything from your meeting. Any format works.</div>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div className="step-title">AI does the work</div>
            <div className="step-desc">BriefLoop reads the transcript, pulls out every action item, infers owners and deadlines, and writes a clean summary.</div>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-title">Send and move on</div>
            <div className="step-desc">Copy the follow-up email draft, push tasks to Notion or Linear, and close the tab. Done in under a minute.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features" style={{paddingTop:0}}>
        <div className="section-badge">Features</div>
        <div className="section-title">Everything your team<br /><em>actually needs</em></div>
        <div className="section-sub">Built for the real problem — not just summarizing, but closing the loop.</div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div><div className="feature-title">Instant summaries</div><div className="feature-desc">A crisp 2-3 sentence TL;DR for anyone who missed the call, ready in seconds.</div></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">☑️</div>
            <div><div className="feature-title">Action item extraction</div><div className="feature-desc">Every task, owner, and deadline pulled automatically — even implicit ones buried in conversation.</div></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✉️</div>
            <div><div className="feature-title">Follow-up email drafts</div><div className="feature-desc">A ready-to-send recap email addressed to all attendees. Edit and send in 10 seconds.</div></div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔌</div>
            <div><div className="feature-title">Notion & Linear sync</div><div className="feature-desc">Push tasks directly to your workspace with one click. No copy-pasting into project boards.</div></div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{paddingTop:0}}>
        <div className="section-badge">What people say</div>
        <div className="section-title">Teams that use BriefLoop<br /><em>don't go back</em></div>
        <div className="testimonials-grid" style={{marginTop:"2rem"}}>
          <div className="testimonial">
            <div className="testimonial-text">"We used to lose half our action items between the call ending and people opening Notion. BriefLoop fixed that entirely."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{background:"rgba(29,158,117,.15)",color:"#1D9E75"}}>JK</div>
              <div><div className="testimonial-name">Jamie K.</div><div className="testimonial-role">Head of Ops, Series A startup</div></div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-text">"I paste in my Zoom transcript, get a clean email draft in 20 seconds, and send it before I've even closed the tab."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{background:"rgba(56,138,221,.15)",color:"#85B7EB"}}>RP</div>
              <div><div className="testimonial-name">Rosa P.</div><div className="testimonial-role">Freelance consultant</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-inner">
          <div className="section-badge">Pricing</div>
          <div className="section-title">Simple, <em>honest</em> pricing</div>
          <div className="section-sub">Cancel anytime. No hidden fees. Start free with 10 meetings — no card required.</div>
          <div className="pricing-grid">
            <div className="plan-card">
              <div className="plan-name">Solo</div>
              <div className="plan-price"><sup>$</sup>19<sub>/mo</sub></div>
              <div className="plan-desc">For freelancers and individual contributors</div>
              <div className="plan-features">
                {["30 meetings/month","Email summaries","Action item extraction","PDF export"].map(f=>(
                  <div key={f} className="plan-feature"><span className="feature-check">✓</span>{f}</div>
                ))}
              </div>
              <button className="plan-cta" onClick={() => window.open(STRIPE_LINKS.solo,"_blank")}>Get started</button>
            </div>
            <div className="plan-card featured">
              <div className="featured-badge">Most popular</div>
              <div className="plan-name">Team</div>
              <div className="plan-price"><sup>$</sup>99<sub>/mo</sub></div>
              <div className="plan-desc">For teams of up to 10 people</div>
              <div className="plan-features">
                {["Unlimited meetings","Slack + Notion sync","Owner assignments","Follow-up email drafts","Priority support"].map(f=>(
                  <div key={f} className="plan-feature"><span className="feature-check">✓</span>{f}</div>
                ))}
              </div>
              <button className="plan-cta primary" onClick={() => window.open(STRIPE_LINKS.team,"_blank")}>Get started</button>
            </div>
            <div className="plan-card">
              <div className="plan-name">Business</div>
              <div className="plan-price"><sup>$</sup>299<sub>/mo</sub></div>
              <div className="plan-desc">For larger orgs with custom needs</div>
              <div className="plan-features">
                {["Everything in Team","Custom integrations","SSO + admin controls","Dedicated onboarding","SLA guarantee"].map(f=>(
                  <div key={f} className="plan-feature"><span className="feature-check">✓</span>{f}</div>
                ))}
              </div>
              <button className="plan-cta" onClick={() => window.open(STRIPE_LINKS.business,"_blank")}>Get started</button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="cta-title">Stop losing your meetings<br />to a <em>wall of text</em></div>
        <div className="cta-sub">10 free meetings. No credit card. Up and running in 60 seconds.</div>
        <button className="btn-primary" style={{fontSize:16,padding:"14px 32px"}} onClick={onGetStarted}>
          Start for free →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Brief<em>Loop</em></div>
        <div className="footer-links">
          <a className="footer-link" href="/privacy">Privacy</a>
          <a className="footer-link" href="/terms">Terms</a>
        </div>
        <div className="footer-copy">© 2026 BriefLoop. All rights reserved.</div>
      </footer>
    </>
  );
}
