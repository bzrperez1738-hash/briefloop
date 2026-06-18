export default function Terms({ onHome }) {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --bg:#0e0f0d; --border:rgba(255,255,255,0.07); --text:#e8e6df; --muted:#7a7870; --teal:#1D9E75; --serif:'DM Serif Display',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif; }
    html, body { background:var(--bg); color:var(--text); font-family:var(--sans); }
    .nav { display:flex; align-items:center; padding:0 3rem; height:60px; border-bottom:1px solid var(--border); background:var(--bg); }
    .nav-logo { font-family:var(--serif); font-size:20px; cursor:pointer; }
    .nav-logo em { color:var(--teal); font-style:normal; }
    .doc { max-width:720px; margin:0 auto; padding:4rem 2rem 6rem; }
    .doc-title { font-family:var(--serif); font-size:42px; letter-spacing:-.5px; margin-bottom:.5rem; }
    .doc-date { font-size:13px; color:var(--muted); margin-bottom:3rem; padding-bottom:2rem; border-bottom:1px solid var(--border); }
    .doc h2 { font-family:var(--serif); font-size:22px; margin:2.5rem 0 .75rem; }
    .doc p { font-size:14px; color:var(--muted); line-height:1.8; margin-bottom:1rem; }
    .doc a { color:var(--teal); }
  `;
  return (
    <>
      <style>{css}</style>
      <nav className="nav"><div className="nav-logo" onClick={onHome}>Brief<em>Loop</em></div></nav>
      <div className="doc">
        <div className="doc-title">Terms of Service</div>
        <div className="doc-date">Last updated: June 2026</div>
        <h2>1. Acceptance of Terms</h2>
        <p>By using BriefLoop you agree to these Terms. If you do not agree, please do not use the service.</p>
        <h2>2. Description of Service</h2>
        <p>BriefLoop is an AI-powered tool that processes meeting transcripts to generate summaries, action items, and follow-up emails.</p>
        <h2>3. Account Registration</h2>
        <p>You are responsible for maintaining the confidentiality of your account and all activity under it.</p>
        <h2>4. Subscription and Payment</h2>
        <p>Paid plans are billed monthly and renew automatically. Payments are processed by Stripe. We do not store card details.</p>
        <h2>5. Free Trial</h2>
        <p>New users receive 10 free meeting credits. No credit card required. One free trial per account.</p>
        <h2>6. Cancellation and Refunds</h2>
        <p>Cancel anytime. Cancellation takes effect at end of billing period. 14-day money-back guarantee for first-time subscribers.</p>
        <h2>7. Your Content</h2>
        <p>You own your transcripts. You grant BriefLoop a limited license to process them solely to provide the service.</p>
        <h2>8. AI-Generated Content</h2>
        <p>AI output may contain errors. You are responsible for reviewing all generated content before acting on it.</p>
        <h2>9. Limitation of Liability</h2>
        <p>BriefLoop is provided as-is. We are not liable for indirect or consequential damages from use of the service.</p>
        <h2>10. Contact</h2>
        <p>Questions? Email <a href="mailto:legal@briefloop.io">legal@briefloop.io</a></p>
      </div>
    </>
  );
}
