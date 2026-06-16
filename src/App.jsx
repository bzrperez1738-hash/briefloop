import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0e0f0d; --bg2:#161714; --bg3:#1e1f1c;
    --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.12);
    --text:#e8e6df; --muted:#7a7870;
    --teal:#1D9E75; --teal-dim:rgba(29,158,117,0.12); --teal-glow:rgba(29,158,117,0.25);
    --red:#c25b5b; --serif:'DM Serif Display',Georgia,serif;
    --sans:'DM Sans',system-ui,sans-serif; --mono:'DM Mono',monospace;
    --radius:10px; --radius-lg:16px;
  }
  html,body,#root { height:100%; background:var(--bg); color:var(--text); font-family:var(--sans); }

  /* AUTH PAGE */
  .auth-page {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:var(--bg); padding:2rem;
  }
  .auth-card {
    width:100%; max-width:400px; background:var(--bg2);
    border:1px solid var(--border2); border-radius:var(--radius-lg); padding:2.5rem;
  }
  .auth-logo { font-family:var(--serif); font-size:24px; margin-bottom:.5rem; }
  .auth-logo em { color:var(--teal); font-style:normal; }
  .auth-sub { font-size:14px; color:var(--muted); margin-bottom:2rem; line-height:1.5; }
  .auth-tabs { display:flex; border-bottom:1px solid var(--border); margin-bottom:1.5rem; }
  .auth-tab {
    flex:1; padding:8px; font-size:13px; font-weight:500; background:none;
    border:none; color:var(--muted); cursor:pointer; font-family:var(--sans);
    border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s;
  }
  .auth-tab.active { color:var(--teal); border-bottom-color:var(--teal); }
  .auth-field { margin-bottom:1rem; }
  .auth-label { font-size:11px; font-weight:500; letter-spacing:.6px; text-transform:uppercase; color:var(--muted); margin-bottom:.4rem; display:block; }
  .auth-input {
    width:100%; padding:10px 14px; background:var(--bg3); border:1px solid var(--border2);
    border-radius:var(--radius); color:var(--text); font-family:var(--sans); font-size:14px;
    outline:none; transition:border-color .15s;
  }
  .auth-input:focus { border-color:var(--teal); }
  .auth-btn {
    width:100%; padding:11px; border-radius:var(--radius); background:var(--teal);
    color:#fff; font-size:14px; font-weight:500; border:none; cursor:pointer;
    font-family:var(--sans); transition:opacity .15s; margin-top:.5rem;
  }
  .auth-btn:hover { opacity:.88; }
  .auth-btn:disabled { opacity:.5; cursor:not-allowed; }
  .auth-error { font-size:13px; color:var(--red); margin-top:.75rem; text-align:center; }
  .auth-success { font-size:13px; color:var(--teal); margin-top:.75rem; text-align:center; }

  /* APP */
  .app { display:grid; grid-template-rows:56px 1fr; height:100vh; overflow:hidden; }
  .topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:0 2rem; border-bottom:1px solid var(--border); background:var(--bg);
  }
  .logo { font-family:var(--serif); font-size:20px; letter-spacing:-.3px; cursor:pointer; }
  .logo em { color:var(--teal); font-style:normal; }
  .nav-right { display:flex; align-items:center; gap:1rem; }
  .nav-link {
    font-size:13px; color:var(--muted); background:none; border:none;
    cursor:pointer; font-family:var(--sans); padding:4px 8px;
  }
  .nav-link:hover { color:var(--text); }
  .upgrade-btn {
    font-size:12px; font-weight:500; padding:6px 14px; border-radius:100px;
    background:var(--teal); color:#fff; border:none; cursor:pointer;
    font-family:var(--sans); transition:opacity .15s;
  }
  .upgrade-btn:hover { opacity:.88; }
  .user-pill {
    font-size:12px; color:var(--muted); background:var(--bg3);
    border:1px solid var(--border); border-radius:100px; padding:4px 12px;
  }

  .main { display:grid; grid-template-columns:260px 1fr; overflow:hidden; }
  .sidebar {
    background:var(--bg2); border-right:1px solid var(--border);
    display:flex; flex-direction:column; overflow:hidden;
  }
  .sidebar-head { padding:1.25rem 1.25rem 1rem; border-bottom:1px solid var(--border); }
  .new-btn {
    width:100%; padding:9px 14px; border-radius:var(--radius);
    background:var(--teal); color:#fff; font-size:13px; font-weight:500;
    border:none; cursor:pointer; display:flex; align-items:center; gap:8px;
    font-family:var(--sans); transition:opacity .15s;
  }
  .new-btn:hover { opacity:.88; }
  .sidebar-label {
    padding:.75rem 1.25rem .4rem; font-size:10px; font-weight:500;
    letter-spacing:.8px; text-transform:uppercase; color:var(--muted);
  }
  .sidebar-list { flex:1; overflow-y:auto; padding-bottom:1rem; }
  .meeting-item {
    margin:2px 8px; padding:10px 12px; border-radius:var(--radius);
    cursor:pointer; transition:background .1s; border:1px solid transparent;
  }
  .meeting-item:hover { background:var(--bg3); }
  .meeting-item.active { background:var(--teal-dim); border-color:var(--teal-glow); }
  .mi-title { font-size:13px; font-weight:500; color:var(--text); margin-bottom:3px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mi-meta { font-size:11px; color:var(--muted); display:flex; gap:8px; }
  .mi-count { background:var(--teal-dim); color:var(--teal); font-size:10px; font-weight:500; padding:1px 6px; border-radius:100px; }
  .stats-bar { padding:.75rem 1.25rem; border-top:1px solid var(--border); display:flex; gap:1.5rem; }
  .stat { font-size:11px; color:var(--muted); }
  .stat strong { color:var(--text); font-weight:500; }

  .workspace { display:flex; flex-direction:column; overflow:hidden; }
  .empty-state {
    flex:1; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:.75rem; padding:3rem;
  }
  .empty-orb {
    width:72px; height:72px; border-radius:50%; border:1px solid var(--border2);
    display:flex; align-items:center; justify-content:center; margin-bottom:.5rem;
    color:var(--teal); animation:pulse 3s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
  .empty-title { font-family:var(--serif); font-size:26px; }
  .empty-sub { font-size:14px; color:var(--muted); text-align:center; max-width:340px; line-height:1.6; }
  .start-btn {
    margin-top:.5rem; padding:10px 24px; border-radius:100px;
    background:var(--teal); color:#fff; font-size:14px; font-weight:500;
    border:none; cursor:pointer; font-family:var(--sans); transition:opacity .15s;
  }
  .start-btn:hover { opacity:.88; }

  .input-panel { flex:1; display:flex; flex-direction:column; padding:2rem 2.5rem; overflow-y:auto; gap:1.5rem; }
  .input-title { font-family:var(--serif); font-size:28px; letter-spacing:-.3px; }
  .input-title em { color:var(--teal); font-style:italic; }
  .field-label { font-size:11px; font-weight:500; letter-spacing:.7px; text-transform:uppercase; color:var(--muted); margin-bottom:.5rem; }
  .text-input {
    width:100%; padding:10px 14px; background:var(--bg2); border:1px solid var(--border2);
    border-radius:var(--radius); color:var(--text); font-family:var(--sans); font-size:14px;
    transition:border-color .15s; outline:none;
  }
  .text-input:focus { border-color:var(--teal); }
  .text-input::placeholder { color:var(--muted); }
  .textarea-wrap { position:relative; }
  .transcript-area {
    width:100%; min-height:220px; padding:14px 16px; background:var(--bg2);
    border:1px solid var(--border2); border-radius:var(--radius); color:var(--text);
    font-family:var(--mono); font-size:12.5px; line-height:1.7; resize:vertical; outline:none;
    transition:border-color .15s;
  }
  .transcript-area:focus { border-color:var(--teal); }
  .transcript-area::placeholder { color:var(--muted); font-family:var(--sans); font-size:13px; }
  .sample-btn {
    position:absolute; top:10px; right:12px; font-size:11px; font-weight:500;
    color:var(--teal); background:var(--teal-dim); border:1px solid var(--teal-glow);
    border-radius:100px; padding:3px 10px; cursor:pointer; font-family:var(--sans);
  }
  .process-btn {
    align-self:flex-start; padding:11px 28px; border-radius:100px; background:var(--teal);
    color:#fff; font-size:14px; font-weight:500; border:none; cursor:pointer;
    font-family:var(--sans); display:flex; align-items:center; gap:10px; transition:opacity .15s;
  }
  .process-btn:hover:not(:disabled) { opacity:.88; }
  .process-btn:disabled { opacity:.5; cursor:not-allowed; }
  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .results-panel { flex:1; overflow-y:auto; padding:2rem 2.5rem; display:flex; flex-direction:column; gap:1.5rem; }
  .results-header { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
  .results-title { font-family:var(--serif); font-size:22px; }
  .results-meta { font-size:12px; color:var(--muted); margin-top:4px; }
  .action-btns { display:flex; gap:8px; flex-shrink:0; flex-wrap:wrap; }
  .action-btn {
    padding:7px 14px; border-radius:100px; font-size:12px; font-weight:500;
    border:1px solid var(--border2); background:var(--bg2); color:var(--text);
    cursor:pointer; font-family:var(--sans); display:flex; align-items:center;
    gap:6px; transition:background .15s;
  }
  .action-btn:hover { background:var(--bg3); }
  .action-btn.teal { background:var(--teal-dim); border-color:var(--teal-glow); color:var(--teal); }

  .card { background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
  .card-head { padding:12px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .card-head-left { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:500; color:var(--muted); letter-spacing:.4px; }
  .card-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); }
  .card-body { padding:14px 16px; }
  .summary-text { font-size:14px; line-height:1.75; color:var(--text); }

  .task-item { display:flex; align-items:flex-start; gap:12px; padding:11px 0; border-bottom:1px solid var(--border); }
  .task-item:last-child { border-bottom:none; }
  .task-check {
    width:18px; height:18px; border-radius:50%; border:1.5px solid var(--teal);
    flex-shrink:0; margin-top:2px; cursor:pointer; transition:background .15s;
    display:flex; align-items:center; justify-content:center;
  }
  .task-check.done { background:var(--teal); }
  .task-check.done::after { content:'✓'; font-size:10px; color:#fff; }
  .task-body { flex:1; min-width:0; }
  .task-text { font-size:13.5px; color:var(--text); line-height:1.4; margin-bottom:5px; }
  .task-text.done { text-decoration:line-through; color:var(--muted); }
  .task-pills { display:flex; gap:6px; flex-wrap:wrap; }
  .pill { font-size:11px; font-weight:500; padding:2px 9px; border-radius:100px; }
  .pill-owner { background:rgba(56,138,221,.15); color:#85B7EB; border:1px solid rgba(56,138,221,.2); }
  .pill-date  { background:rgba(212,148,58,.12); color:#d4943a; border:1px solid rgba(212,148,58,.2); }
  .pill-urgent{ background:rgba(194,91,91,.12); color:#c25b5b; border:1px solid rgba(194,91,91,.2); }
  .pill-open  { background:var(--bg3); color:var(--muted); border:1px solid var(--border2); }

  .email-block { background:var(--bg3); border-radius:var(--radius); padding:14px 16px; font-size:13px; line-height:1.7; color:var(--text); }
  .email-field { color:var(--muted); margin-bottom:5px; font-size:12px; }
  .email-field span { color:var(--text); font-weight:500; }
  .email-body { margin-top:10px; padding-top:10px; border-top:1px solid var(--border); white-space:pre-wrap; }

  .processing-state { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; }
  .proc-ring { width:52px; height:52px; border-radius:50%; border:2px solid var(--border2); border-top-color:var(--teal); animation:spin .9s linear infinite; }
  .proc-title { font-family:var(--serif); font-size:20px; }
  .proc-sub { font-size:13px; color:var(--muted); }
  .proc-steps { display:flex; flex-direction:column; gap:6px; margin-top:.5rem; }
  .proc-step { font-size:12px; color:var(--muted); display:flex; align-items:center; gap:8px; transition:color .3s; }
  .proc-step.active { color:var(--teal); }
  .proc-step.done { color:var(--text); }
  .proc-step-dot { width:6px; height:6px; border-radius:50%; background:var(--border2); flex-shrink:0; transition:background .3s; }
  .proc-step.active .proc-step-dot { background:var(--teal); animation:pulse 1s ease-in-out infinite; }
  .proc-step.done .proc-step-dot { background:var(--teal); }

  .toast {
    position:fixed; bottom:1.5rem; right:1.5rem; z-index:999;
    background:var(--bg3); border:1px solid var(--border2); border-radius:var(--radius);
    padding:10px 16px; font-size:13px; color:var(--text);
    animation:slideUp .25s ease; display:flex; align-items:center; gap:8px;
  }
  .toast.success { border-color:var(--teal-glow); }
  .toast.error { border-color:rgba(194,91,91,.3); }
  @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:4px; }

  /* PRICING */
  .pricing-page { flex:1; overflow-y:auto; padding:3rem 2.5rem; display:flex; flex-direction:column; align-items:center; gap:2.5rem; }
  .pricing-title { font-family:var(--serif); font-size:36px; letter-spacing:-.5px; margin-bottom:.5rem; text-align:center; }
  .pricing-title em { color:var(--teal); font-style:italic; }
  .pricing-sub { font-size:15px; color:var(--muted); line-height:1.6; text-align:center; }
  .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; width:100%; max-width:780px; }
  .plan-card { background:var(--bg2); border:1px solid var(--border2); border-radius:var(--radius-lg); padding:1.5rem; display:flex; flex-direction:column; gap:1rem; transition:border-color .2s; }
  .plan-card:hover { border-color:rgba(255,255,255,.2); }
  .plan-card.featured { border:2px solid var(--teal); position:relative; }
  .featured-badge { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:var(--teal); color:#fff; font-size:11px; font-weight:500; padding:2px 12px; border-radius:100px; white-space:nowrap; }
  .plan-name { font-size:12px; font-weight:500; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; }
  .plan-price { font-family:var(--serif); font-size:40px; line-height:1; }
  .plan-price sup { font-family:var(--sans); font-size:18px; vertical-align:super; }
  .plan-price sub { font-family:var(--sans); font-size:14px; color:var(--muted); font-weight:400; }
  .plan-desc { font-size:13px; color:var(--muted); line-height:1.5; padding-bottom:1rem; border-bottom:1px solid var(--border); }
  .plan-features { display:flex; flex-direction:column; gap:8px; flex:1; }
  .plan-feature { display:flex; align-items:flex-start; gap:8px; font-size:13px; color:var(--text); }
  .feature-check { color:var(--teal); flex-shrink:0; }
  .plan-cta { width:100%; padding:10px; border-radius:var(--radius); font-size:14px; font-weight:500; border:1px solid var(--border2); background:var(--bg3); color:var(--text); cursor:pointer; font-family:var(--sans); transition:all .15s; margin-top:auto; }
  .plan-cta:hover { background:var(--bg2); }
  .plan-cta.primary { background:var(--teal); border-color:var(--teal); color:#fff; }
  .plan-cta.primary:hover { opacity:.88; }
  .pricing-note { font-size:12px; color:var(--muted); text-align:center; }
`;

const PLANS_LINKS = {
  solo:     "https://buy.stripe.com/test_REPLACE_SOLO",
  team:     "https://buy.stripe.com/test_REPLACE_TEAM",
  business: "https://buy.stripe.com/test_REPLACE_BUSINESS",
};

const SAMPLE_TRANSCRIPT = `[09:02] Priya: Okay let's get started. So the main thing today — we need to figure out the Q2 launch plan for the dashboard redesign.

[09:04] Marcus: Yeah, the design is basically done. I just need to finish the mobile breakpoints by Friday and then hand off to Dev.

[09:06] Priya: Perfect. Sarah, can you make sure legal has signed off on the new data sharing copy before end of month?

[09:07] Sarah: On it. I'll ping them today. Also — someone needs to write the release notes. That's always the thing that gets forgotten.

[09:09] Dev: I can take that. I'll have a draft release notes doc ready by next Wednesday.

[09:11] Priya: Amazing. Marcus, one more thing — can you set up the staging environment for QA this week? We're planning to start testing Monday.

[09:13] Marcus: Yeah that's doable. I'll block off Thursday afternoon for it.

[09:14] Priya: Great. Let's also schedule a 30-min check-in next week — Priya to send the invite. Anything else?

[09:15] Sarah: Nope, I think that covers it.
[09:15] Priya: Cool. Thanks everyone.`;

const SYSTEM_PROMPT = `You are BriefLoop, an AI that processes meeting transcripts and extracts structured information.
Given a meeting transcript, return ONLY valid JSON with this exact structure:
{
  "summary": "2-3 sentence plain-English summary of the meeting",
  "attendees": ["Name1", "Name2"],
  "duration": "estimated duration string e.g. '38 min'",
  "actionItems": [
    { "id": "task_001", "title": "Clear actionable task", "owner": "Name or null", "deadline": "Human-readable date or null", "priority": "urgent|high|medium|low", "flag": "Short flag or null" }
  ],
  "followUpEmail": {
    "to": "comma-separated emails",
    "subject": "Subject line",
    "body": "Full email body"
  }
}
Return ONLY the JSON object, no markdown, no preamble.`;

const PROC_STEPS = ["Reading transcript","Identifying speakers","Extracting action items","Inferring owners & deadlines","Writing summary","Drafting follow-up email"];

function formatDate() {
  return new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

function TaskItem({ task }) {
  const [done, setDone] = useState(false);
  return (
    <div className="task-item">
      <div className={`task-check ${done?"done":""}`} onClick={() => setDone(d=>!d)} />
      <div className="task-body">
        <div className={`task-text ${done?"done":""}`}>{task.title}</div>
        <div className="task-pills">
          {task.owner    && <span className="pill pill-owner">{task.owner}</span>}
          {task.deadline && <span className="pill pill-date">{task.deadline}</span>}
          {task.flag && task.priority==="urgent" && <span className="pill pill-urgent">{task.flag}</span>}
          {!task.owner   && <span className="pill pill-open">Unassigned</span>}
        </div>
      </div>
    </div>
  );
}

function ProcessingState({ step }) {
  return (
    <div className="processing-state">
      <div className="proc-ring" />
      <div className="proc-title">Processing meeting…</div>
      <div className="proc-sub">The AI is reading your transcript</div>
      <div className="proc-steps">
        {PROC_STEPS.map((s,i) => (
          <div key={i} className={`proc-step ${i<step?"done":i===step?"active":""}`}>
            <div className="proc-step-dot"/>{s}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{type==="success"?"✓":"!"} {msg}</div>;
}

function PricingPage() {
  return (
    <div className="pricing-page">
      <div>
        <div className="pricing-title">Simple, <em>honest</em> pricing</div>
        <div className="pricing-sub">Cancel anytime. No hidden fees. 14-day free trial.</div>
      </div>
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
          <button className="plan-cta" onClick={() => window.open(PLANS_LINKS.solo,"_blank")}>Get started</button>
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
          <button className="plan-cta primary" onClick={() => window.open(PLANS_LINKS.team,"_blank")}>Get started</button>
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
          <button className="plan-cta" onClick={() => window.open(PLANS_LINKS.business,"_blank")}>Get started</button>
        </div>
      </div>
      <div className="pricing-note">All plans include a 14-day free trial. No credit card required to start.</div>
    </div>
  );
}

/* ── AUTH PAGE ── */
function AuthPage({ onAuth }) {
  const [tab, setTab]         = useState("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    setError(""); setSuccess(""); setLoading(true);
    if (tab === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth(data.user);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Account created! Check your email to confirm, then log in.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Brief<em>Loop</em></div>
        <div className="auth-sub">Turn meeting transcripts into action items, summaries, and follow-up emails — instantly.</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Log in</button>
          <button className={`auth-tab ${tab==="signup"?"active":""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>Sign up</button>
        </div>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input className="auth-input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <button className="auth-btn" onClick={handle} disabled={loading || !email || !password}>
          {loading ? "Please wait…" : tab==="login" ? "Log in" : "Create account"}
        </button>
        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function BriefLoop() {
  const [user, setUser]             = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [meetings, setMeetings]     = useState([]);
  const [active, setActive]         = useState(null);
  const [view, setView]             = useState("empty");
  const [procStep, setProcStep]     = useState(0);
  const [toast, setToast]           = useState(null);
  const [title, setTitle]           = useState("");
  const [transcript, setTranscript] = useState("");

  /* Check if already logged in */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoadingAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  /* Load meetings from Supabase when user logs in */
  useEffect(() => {
    if (!user) return;
    supabase.from("meetings").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setMeetings(data.map(m => ({
          id: m.id, title: m.title, date: new Date(m.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),
          transcript: m.transcript, summary: m.summary, attendees: m.attendees,
          duration: m.duration, actionItems: m.action_items, followUpEmail: m.follow_up_email,
        })));
      });
  }, [user]);

  const activeData = meetings.find(m => m.id === active) || null;

  const startNew = () => { setActive(null); setTitle(""); setTranscript(""); setView("input"); };
  const loadSample = () => { setTitle("Q2 Product Sync"); setTranscript(SAMPLE_TRANSCRIPT); };
  const selectMeeting = (id) => { setActive(id); setView("results"); };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setMeetings([]); setActive(null); setView("empty");
  };

  const process = useCallback(async () => {
    if (!transcript.trim()) return;
    setView("processing"); setProcStep(0);
    const stepInterval = setInterval(() => setProcStep(s => Math.min(s+1, PROC_STEPS.length-1)), 600);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role:"user", content:`Meeting title: ${title||"Untitled meeting"}\n\nTranscript:\n${transcript}` }],
        }),
      });
      clearInterval(stepInterval);
      setProcStep(PROC_STEPS.length-1);
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const raw = data.content?.map(b=>b.text||"").join("")||"";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      const meetingTitle = title || parsed.attendees?.slice(0,2).join(" & ")+" sync" || "Meeting recap";

      /* Save to Supabase */
      const { data: saved } = await supabase.from("meetings").insert({
        user_id: user.id, title: meetingTitle, transcript,
        summary: parsed.summary, attendees: parsed.attendees,
        duration: parsed.duration, action_items: parsed.actionItems,
        follow_up_email: parsed.followUpEmail,
      }).select().single();

      const meeting = {
        id: saved.id, title: meetingTitle,
        date: formatDate(), transcript, ...parsed,
      };
      setMeetings(ms => [meeting, ...ms]);
      setActive(meeting.id);
      setView("results");
    } catch (err) {
      clearInterval(stepInterval);
      console.error(err);
      setToast({ msg:"Processing failed — check your API connection.", type:"error" });
      setView("input");
    }
  }, [transcript, title, user]);

  const copyEmail = () => {
    if (!activeData?.followUpEmail) return;
    navigator.clipboard.writeText(`Subject: ${activeData.followUpEmail.subject}\n\n${activeData.followUpEmail.body}`)
      .then(() => setToast({ msg:"Email copied to clipboard", type:"success" }));
  };

  const copySummary = () => {
    if (!activeData) return;
    const lines = [`# ${activeData.title} — ${activeData.date}`,"",activeData.summary,"","## Action items",
      ...(activeData.actionItems||[]).map(t=>`- [ ] ${t.title}${t.owner?` (${t.owner})`:""}`),
    ].join("\n");
    navigator.clipboard.writeText(lines).then(() => setToast({ msg:"Summary copied as Markdown", type:"success" }));
  };

  if (loadingAuth) return <div style={{height:"100vh",background:"#0e0f0d"}} />;
  if (!user) return <><style>{css}</style><AuthPage onAuth={setUser} /></>;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="topbar">
          <div className="logo" onClick={() => setView("empty")}>Brief<em>Loop</em></div>
          <div className="nav-right">
            <button className="nav-link" onClick={() => setView("pricing")}>Pricing</button>
            <span className="user-pill">{user.email}</span>
            <button className="nav-link" onClick={signOut}>Sign out</button>
            <button className="upgrade-btn" onClick={() => setView("pricing")}>Upgrade</button>
          </div>
        </header>

        <div className="main">
          <aside className="sidebar">
            <div className="sidebar-head">
              <button className="new-btn" onClick={startNew}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                New meeting
              </button>
            </div>
            {meetings.length > 0 && (
              <>
                <div className="sidebar-label">Recent</div>
                <div className="sidebar-list">
                  {meetings.map(m => (
                    <div key={m.id} className={`meeting-item ${active===m.id?"active":""}`} onClick={() => selectMeeting(m.id)}>
                      <div className="mi-title">{m.title}</div>
                      <div className="mi-meta">
                        <span>{m.date}</span>
                        {m.actionItems?.length>0 && <span className="mi-count">{m.actionItems.length} tasks</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="stats-bar">
                  <div className="stat"><strong>{meetings.length}</strong> meetings</div>
                  <div className="stat"><strong>{meetings.reduce((n,m)=>n+(m.actionItems?.length||0),0)}</strong> tasks</div>
                </div>
              </>
            )}
          </aside>

          <main className="workspace">
            {view==="empty" && (
              <div className="empty-state">
                <div className="empty-orb">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="empty-title">Ready to loop</div>
                <div className="empty-sub">Paste a meeting transcript and BriefLoop will extract every action item, write a summary, and draft your follow-up email — in seconds.</div>
                <button className="start-btn" onClick={startNew}>Process your first meeting</button>
              </div>
            )}

            {view==="pricing" && <PricingPage />}

            {view==="input" && (
              <div className="input-panel">
                <div className="input-title">New <em>meeting</em></div>
                <div>
                  <div className="field-label">Meeting title (optional)</div>
                  <input className="text-input" placeholder="e.g. Q2 product sync, Sprint retro…" value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                <div>
                  <div className="field-label">Transcript or notes</div>
                  <div className="textarea-wrap">
                    <textarea className="transcript-area" placeholder="Paste your meeting transcript here…" value={transcript} onChange={e=>setTranscript(e.target.value)} />
                    {!transcript && <button className="sample-btn" onClick={loadSample}>Load sample</button>}
                  </div>
                </div>
                <button className="process-btn" onClick={process} disabled={!transcript.trim()}>
                  Process meeting →
                </button>
              </div>
            )}

            {view==="processing" && <ProcessingState step={procStep} />}

            {view==="results" && activeData && (
              <div className="results-panel">
                <div className="results-header">
                  <div>
                    <div className="results-title">{activeData.title}</div>
                    <div className="results-meta">
                      {activeData.date}
                      {activeData.duration?` · ${activeData.duration}`:""}
                      {activeData.attendees?.length?` · ${activeData.attendees.join(", ")}`:""}
                    </div>
                  </div>
                  <div className="action-btns">
                    <button className="action-btn" onClick={copySummary}>Copy summary</button>
                    <button className="action-btn teal" onClick={copyEmail}>Copy email</button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><div className="card-head-left"><div className="card-dot"/>Summary</div></div>
                  <div className="card-body"><div className="summary-text">{activeData.summary}</div></div>
                </div>
                <div className="card">
                  <div className="card-head">
                    <div className="card-head-left"><div className="card-dot"/>Action items</div>
                    <span style={{fontSize:11,background:"var(--teal-dim)",color:"var(--teal)",padding:"2px 8px",borderRadius:"100px",border:"1px solid var(--teal-glow)"}}>{activeData.actionItems?.length} items</span>
                  </div>
                  <div className="card-body">
                    {(activeData.actionItems||[]).map(task=><TaskItem key={task.id} task={task}/>)}
                  </div>
                </div>
                {activeData.followUpEmail && (
                  <div className="card">
                    <div className="card-head">
                      <div className="card-head-left"><div className="card-dot"/>Follow-up email draft</div>
                      <span style={{fontSize:11,color:"var(--muted)"}}>Ready to send</span>
                    </div>
                    <div className="card-body">
                      <div className="email-block">
                        <div className="email-field"><span>To:</span> {activeData.followUpEmail.to}</div>
                        <div className="email-field"><span>Subject:</span> {activeData.followUpEmail.subject}</div>
                        <div className="email-body">{activeData.followUpEmail.body}</div>
                      </div>
                    </div>
                  </div>
                )}
                <button className="action-btn" style={{alignSelf:"flex-start",marginTop:".5rem"}} onClick={startNew}>
                  + Process another meeting
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </>
  );
}
