export default function Privacy({ onHome }) {
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
        <div className="doc-title">Privacy Policy</div>
        <div className="doc-date">Last updated: June 2026</div>
        <h2>1. Information We Collect</h2>
        <p>We collect your email, meeting transcripts you submit, and payment info processed by Stripe. We never store card details.</p>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to provide the service, process transcripts with AI, send account emails, and improve BriefLoop.</p>
        <h2>3. Meeting Transcript Data</h2>
        <p>Your transcripts are confidential. We do not sell or share them, and do not use them to train AI models without your consent.</p>
        <h2>4. Data Sharing</h2>
        <p>We share data only with: Anthropic (AI processing), Supabase (database), Stripe (payments), and Vercel (hosting).</p>
        <h2>5. Data Retention</h2>
        <p>We keep your data while your account is active. Email privacy@getbriefloop.com to delete your account and all data within 30 days.</p>
        <h2>6. Security</h2>
        <p>All data is encrypted in transit (HTTPS) and at rest. We take reasonable measures to protect your information.</p>
        <h2>7. Contact</h2>
        <p>Questions? Email privacy@getbriefloop.com</p>
      </div>
    </>
  );
}
