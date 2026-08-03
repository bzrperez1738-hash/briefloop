import { useState, useCallback, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { STRIPE_LINKS as PLANS_LINKS, openCheckout } from "./stripeLinks";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const FREE_MEETING_LIMIT = 10;

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
  .auth-forgot {
    background:none; border:none; padding:0; margin-top:.5rem; cursor:pointer;
    font-family:var(--sans); font-size:12px; color:var(--muted); text-align:right;
    display:block; margin-left:auto; transition:color .15s;
  }
  .auth-forgot:hover { color:var(--teal); }
  .auth-forgot:disabled { opacity:.5; cursor:not-allowed; }

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
  /* FILE UPLOAD */
  .upload-zone {
    border:2px dashed var(--border2); border-radius:var(--radius); padding:2rem;
    text-align:center; cursor:pointer; transition:border-color .15s, background .15s;
    margin-top:.5rem;
  }
  .upload-zone:hover, .upload-zone.dragover { border-color:var(--teal); background:var(--teal-dim); }
  .upload-icon { font-size:28px; margin-bottom:.5rem; }
  .upload-text { font-size:13px; color:var(--muted); line-height:1.5; }
  .upload-text strong { color:var(--teal); }
  .upload-input { display:none; }

  /* INPUT TABS */
  .input-tabs { display:flex; gap:8px; margin-bottom:-.5rem; }
  .input-tab {
    padding:6px 16px; border-radius:100px; font-size:12px; font-weight:500;
    border:1px solid var(--border2); background:transparent; color:var(--muted);
    cursor:pointer; font-family:var(--sans); transition:all .15s;
  }
  .input-tab.active { background:var(--teal-dim); border-color:var(--teal-glow); color:var(--teal); }

  /* REMINDERS */
  .reminder-card { background:var(--bg2); border:1px solid var(--teal-glow); border-radius:var(--radius-lg); padding:1.25rem; }
  .reminder-title { font-size:13px; font-weight:500; color:var(--text); margin-bottom:.4rem; }
  .reminder-sub { font-size:12px; color:var(--muted); margin-bottom:1rem; line-height:1.5; }
  .reminder-tasks { display:flex; flex-direction:column; gap:6px; margin-bottom:1rem; }
  .reminder-task { display:flex; align-items:center; gap:8px; font-size:12.5px; }
  .reminder-task input[type=email] {
    flex:1; padding:5px 10px; background:var(--bg3); border:1px solid var(--border2);
    border-radius:var(--radius); color:var(--text); font-family:var(--sans); font-size:12px;
    outline:none; transition:border-color .15s;
  }
  .reminder-task input[type=email]:focus { border-color:var(--teal); }
  .reminder-task input[type=email]::placeholder { color:var(--muted); }
  .reminder-task-label { font-size:12px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
  .reminder-btn {
    width:100%; padding:8px; border-radius:var(--radius); background:var(--teal);
    color:#fff; font-size:13px; font-weight:500; border:none; cursor:pointer;
    font-family:var(--sans); transition:opacity .15s;
  }
  .reminder-btn:hover { opacity:.88; }
  .reminder-btn:disabled { opacity:.5; cursor:not-allowed; }


  /* PAYWALL */
  .paywall {
    flex:1; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:1rem; padding:3rem; text-align:center;
  }
  .paywall-icon { font-size:40px; margin-bottom:.5rem; }
  .paywall-title { font-family:var(--serif); font-size:28px; letter-spacing:-.3px; }
  .paywall-title em { color:var(--teal); font-style:italic; }
  .paywall-sub { font-size:15px; color:var(--muted); max-width:400px; line-height:1.6; margin-bottom:.5rem; }
  .paywall-plans { display:grid; grid-template-columns:1fr 1fr; gap:12px; width:100%; max-width:500px; margin:1rem 0; }
  .paywall-plan {
    background:var(--bg2); border:1px solid var(--border2); border-radius:var(--radius-lg);
    padding:1.25rem; cursor:pointer; transition:border-color .15s; text-align:left;
  }
  .paywall-plan:hover { border-color:var(--border2); background:var(--bg3); }
  .paywall-plan.featured { border:2px solid var(--teal); }
  .paywall-plan-name { font-size:11px; font-weight:500; color:var(--muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:6px; }
  .paywall-plan-price { font-family:var(--serif); font-size:28px; line-height:1; margin-bottom:4px; }
  .paywall-plan-price sub { font-family:var(--sans); font-size:12px; color:var(--muted); }
  .paywall-plan-desc { font-size:12px; color:var(--muted); line-height:1.4; }
  .paywall-note { font-size:12px; color:var(--muted); }

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

  /* RESPONSIVE */
  .topbar-left { display:flex; align-items:center; gap:.6rem; }
  .menu-btn {
    display:none; align-items:center; justify-content:center; background:none;
    border:none; color:var(--text); cursor:pointer; padding:4px; margin-left:-4px;
  }
  .sidebar-backdrop { display:none; }

  @media (max-width: 768px) {
    .app { height:100dvh; }
    .topbar { padding:0 1rem; }
    .menu-btn { display:flex; }
    .nav-right { gap:.5rem; }
    .user-pill { display:none; }
    .hide-mobile { display:none; }
    .upgrade-btn { padding:6px 12px; }

    .main { grid-template-columns:1fr; }
    .sidebar {
      position:fixed; top:56px; left:0; bottom:0; width:82%; max-width:300px; z-index:50;
      transform:translateX(-100%); transition:transform .25s ease;
      border-right:1px solid var(--border2);
    }
    .sidebar.open { transform:translateX(0); box-shadow:0 0 40px rgba(0,0,0,.5); }
    .sidebar-backdrop.show {
      display:block; position:fixed; inset:56px 0 0 0;
      background:rgba(0,0,0,.5); z-index:40;
    }

    .input-panel { padding:1.5rem 1.25rem; gap:1rem; }
    .input-title { font-size:24px; }
    .results-panel { padding:1.5rem 1.25rem; }
    .results-header { flex-direction:column; }
    .empty-state { padding:2.5rem 1.5rem; }
    .empty-title { font-size:22px; }
    .pricing-page { padding:2.5rem 1.25rem; }
    .pricing-title { font-size:28px; }
    .pricing-grid { grid-template-columns:1fr; max-width:400px; }
  }
`;


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


/* ── VTT/SRT TRANSCRIPT PARSER ── */
function parseTranscriptFile(text, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  if (ext === 'vtt') {
    // Parse WebVTT (Zoom, Google Meet)
    const lines = text.split('\n');
    const result = [];
    let current = '';
    for (const line of lines) {
      if (line.includes('-->')) continue;
      if (line.trim() === '' || line.match(/^\d+$/) || line === 'WEBVTT') {
        if (current.trim()) result.push(current.trim());
        current = '';
      } else {
        current += (current ? ' ' : '') + line.trim();
      }
    }
    if (current.trim()) result.push(current.trim());
    return result.join('\n');
  }
  
  if (ext === 'srt') {
    // Parse SRT subtitles
    return text
      .replace(/\d+\n/g, '')
      .replace(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  // Plain text - return as-is
  return text;
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
          <button className="plan-cta" onClick={() => openCheckout(PLANS_LINKS.solo)}>Get started</button>
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
          <button className="plan-cta primary" onClick={() => openCheckout(PLANS_LINKS.team)}>Get started</button>
        </div>
        <div className="plan-card">
          <div className="plan-name">Business</div>
          <div className="plan-price"><sup>$</sup>149<sub>/mo</sub></div>
          <div className="plan-desc">For larger orgs with custom needs</div>
          <div className="plan-features">
            {["Everything in Team","Custom integrations","SSO + admin controls","Dedicated onboarding","SLA guarantee"].map(f=>(
              <div key={f} className="plan-feature"><span className="feature-check">✓</span>{f}</div>
            ))}
          </div>
          <button className="plan-cta" onClick={() => openCheckout(PLANS_LINKS.business)}>Get started</button>
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

  const handleForgot = async () => {
    setError(""); setSuccess("");
    if (!email) { setError("Enter your email above first, then tap “Forgot password?”"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) setError(error.message);
    else setSuccess("Password reset link sent — check your email.");
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
        {tab==="login" && (
          <button type="button" className="auth-forgot" onClick={handleForgot} disabled={loading}>Forgot password?</button>
        )}
        <button className="auth-btn" onClick={handle} disabled={loading || !email || !password}>
          {loading ? "Please wait…" : tab==="login" ? "Log in" : "Create account"}
        </button>
        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </div>
    </div>
  );
}

/* ── RESET PASSWORD ── */
function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);

  const handle = async () => {
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    await supabase.auth.signOut();
    setDone(true);
  };

  const goToLogin = () => { window.location.href = "/"; };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Brief<em>Loop</em></div>
        {done ? (
          <>
            <div className="auth-sub">Your password has been updated. You can now log in with your new password.</div>
            <button className="auth-btn" onClick={goToLogin}>Continue to log in</button>
          </>
        ) : (
          <>
            <div className="auth-sub">Choose a new password for your account.</div>
            <div className="auth-field">
              <label className="auth-label">New password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            <button className="auth-btn" onClick={handle} disabled={loading || !password || !confirm}>
              {loading ? "Please wait…" : "Update password"}
            </button>
            {error && <div className="auth-error">{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}

function PaywallPage() {
  return (
    <div className="paywall">
      <div className="paywall-icon">🔒</div>
      <div className="paywall-title">You've used your <em>10 free</em> meetings</div>
      <div className="paywall-sub">You've gotten a feel for BriefLoop. Ready to stop losing action items for good? Pick a plan and keep going.</div>
      <div className="paywall-plans">
        <div className="paywall-plan" onClick={() => openCheckout(PLANS_LINKS.solo)}>
          <div className="paywall-plan-name">Solo</div>
          <div className="paywall-plan-price">$19<sub>/mo</sub></div>
          <div className="paywall-plan-desc">30 meetings/month. Perfect for freelancers.</div>
        </div>
        <div className="paywall-plan featured" onClick={() => openCheckout(PLANS_LINKS.team)}>
          <div className="paywall-plan-name">⭐ Team — Most popular</div>
          <div className="paywall-plan-price">$99<sub>/mo</sub></div>
          <div className="paywall-plan-desc">Unlimited meetings. Notion + Slack sync. Up to 10 people.</div>
        </div>
      </div>
      <div className="paywall-note">Questions? Email us at hello@getbriefloop.com</div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function BriefLoop() {
  const [user, setUser]             = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [recovery, setRecovery]     = useState(() => window.location.pathname === "/reset-password");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meetings, setMeetings]     = useState([]);
  const [active, setActive]         = useState(null);
  const [view, setView]             = useState("empty");
  const [procStep, setProcStep]     = useState(0);
  const [toast, setToast]           = useState(null);
  const [title, setTitle]           = useState("");
  const [transcript, setTranscript] = useState("");
  const [inputTab, setInputTab]     = useState("paste");
  const [dragover, setDragover]     = useState(false);
  const [reminderEmails, setReminderEmails] = useState({});
  const [reminderSent, setReminderSent]     = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);

  /* Check if already logged in */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoadingAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
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

  const startNew = () => { setActive(null); setTitle(""); setTranscript(""); setView("input"); setSidebarOpen(false); };
  const loadSample = () => { setTitle("Q2 Product Sync"); setTranscript(SAMPLE_TRANSCRIPT); };
  const selectMeeting = (id) => { setActive(id); setView("results"); setSidebarOpen(false); };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setMeetings([]); setActive(null); setView("empty");
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const parsed = parseTranscriptFile(e.target.result, file.name);
      setTranscript(parsed);
      if (!title) setTitle(file.name.replace(/\.(vtt|srt|txt)$/i, '').replace(/_/g, ' '));
    };
    reader.readAsText(file);
  };

  const sendReminders = async () => {
    if (!activeData?.actionItems) return;
    setReminderLoading(true);
    // Build reminder messages for each task with an email
    const tasks = activeData.actionItems.filter(t => reminderEmails[t.id]);
    // Use Claude to draft personalized reminder emails
    const reminderList = tasks.map(t =>
      `Task: "${t.title}" → Owner email: ${reminderEmails[t.id]}${t.deadline ? ` → Due: ${t.deadline}` : ''}`
    ).join('\n');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate short, friendly reminder email bodies for these action items from meeting "${activeData.title}":\n${reminderList}\n\nReturn JSON array: [{"email":"...","subject":"...","body":"..."}]` }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
        }),
      });
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const reminders = JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,"").trim());
      // Open mailto links for each reminder
      reminders.forEach((r, i) => {
        setTimeout(() => {
          window.open(`mailto:${r.email}?subject=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`, '_blank');
        }, i * 500);
      });
      setReminderSent(true);
      setToast({ msg:`${reminders.length} reminder${reminders.length>1?'s':''} drafted!`, type:"success" });
    } catch(err) {
      setToast({ msg:"Failed to draft reminders", type:"error" });
    }
    setReminderLoading(false);
  };

  const process = useCallback(async () => {
    if (!transcript.trim()) return;

    // Check free meeting limit
    if (meetings.length >= FREE_MEETING_LIMIT) {
      setView("paywall");
      return;
    }

    setView("processing"); setProcStep(0);
    const stepInterval = setInterval(() => setProcStep(s => Math.min(s+1, PROC_STEPS.length-1)), 600);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nMeeting title: " + (title||"Untitled meeting") + "\n\nTranscript:\n" + transcript }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1500 },
        }),
      });
      clearInterval(stepInterval);
      setProcStep(PROC_STEPS.length-1);
      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
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

  if (recovery) return <><style>{css}</style><ResetPasswordPage /></>;
  if (loadingAuth) return <div style={{height:"100vh",background:"#0e0f0d"}} />;
  if (!user) return <><style>{css}</style><AuthPage onAuth={setUser} /></>;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
            <div className="logo" onClick={() => { setView("empty"); setSidebarOpen(false); }}>Brief<em>Loop</em></div>
          </div>
          <div className="nav-right">
            <button className="nav-link hide-mobile" onClick={() => { setView("pricing"); setSidebarOpen(false); }}>Pricing</button>
            <span className="user-pill">{user.email}</span>
            <button className="nav-link" onClick={signOut}>Sign out</button>
            <button className="upgrade-btn" onClick={() => { setView("pricing"); setSidebarOpen(false); }}>Upgrade</button>
          </div>
        </header>

        <div className="main">
          <div className={`sidebar-backdrop ${sidebarOpen?"show":""}`} onClick={() => setSidebarOpen(false)} />
          <aside className={`sidebar ${sidebarOpen?"open":""}`}>
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
                {meetings.length < FREE_MEETING_LIMIT && (
                  <div style={{padding:".5rem 1.25rem .75rem",fontSize:"11px",color:"var(--muted)"}}>
                    <span style={{color:"var(--teal)",fontWeight:500}}>{FREE_MEETING_LIMIT - meetings.length}</span> free meetings left
                  </div>
                )}
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
            {view==="paywall" && <PaywallPage />}

            {view==="input" && (
              <div className="input-panel">
                <div className="input-title">New <em>meeting</em></div>
                <div>
                  <div className="field-label">Meeting title (optional)</div>
                  <input className="text-input" placeholder="e.g. Q2 product sync, Sprint retro…" value={title} onChange={e=>setTitle(e.target.value)} />
                </div>
                <div>
                  <div className="input-tabs">
                    <button className={`input-tab ${inputTab==="paste"?"active":""}`} onClick={() => setInputTab("paste")}>Paste transcript</button>
                    <button className={`input-tab ${inputTab==="upload"?"active":""}`} onClick={() => setInputTab("upload")}>Upload file</button>
                  </div>
                  <div className="field-label" style={{marginTop:"1rem"}}>
                    {inputTab==="paste" ? "Transcript or notes" : "Upload .vtt, .srt, or .txt file"}
                  </div>
                  {inputTab==="paste" ? (
                    <div className="textarea-wrap">
                      <textarea className="transcript-area" placeholder="Paste your Zoom, Google Meet, or Teams transcript here…" value={transcript} onChange={e=>setTranscript(e.target.value)} />
                      {!transcript && <button className="sample-btn" onClick={loadSample}>Load sample</button>}
                    </div>
                  ) : (
                    <div
                      className={`upload-zone ${dragover?"dragover":""}`}
                      onClick={() => document.getElementById("file-upload").click()}
                      onDragOver={e => { e.preventDefault(); setDragover(true); }}
                      onDragLeave={() => setDragover(false)}
                      onDrop={e => {
                        e.preventDefault(); setDragover(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileUpload(file);
                      }}
                    >
                      <input id="file-upload" className="upload-input" type="file" accept=".vtt,.srt,.txt" onChange={e => e.target.files[0] && handleFileUpload(e.target.files[0])} />
                      <div className="upload-icon">📄</div>
                      <div className="upload-text">
                        <strong>Click to upload</strong> or drag and drop<br/>
                        Zoom .vtt · Google Meet .vtt · Teams .txt · Any .srt
                      </div>
                      {transcript && <div style={{marginTop:"1rem",fontSize:"12px",color:"var(--teal)"}}>✓ File loaded — {transcript.split("\n").length} lines</div>}
                    </div>
                  )}
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
                {activeData.actionItems?.some(t => t.owner) && !reminderSent && (
                  <div className="reminder-card">
                    <div className="reminder-title">📧 Send accountability reminders</div>
                    <div className="reminder-sub">Enter email addresses for action item owners and BriefLoop will draft personalized reminder emails for each one.</div>
                    <div className="reminder-tasks">
                      {(activeData.actionItems||[]).filter(t => t.owner).map(task => (
                        <div key={task.id} className="reminder-task">
                          <span className="reminder-task-label">{task.owner}</span>
                          <input
                            type="email"
                            placeholder={`${task.owner?.toLowerCase().replace(' ','')}@company.com`}
                            value={reminderEmails[task.id]||""}
                            onChange={e => setReminderEmails(prev => ({...prev, [task.id]: e.target.value}))}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      className="reminder-btn"
                      onClick={sendReminders}
                      disabled={reminderLoading || !Object.values(reminderEmails).some(e => e.trim())}
                    >
                      {reminderLoading ? "Drafting reminders…" : "Draft reminder emails →"}
                    </button>
                  </div>
                )}
                {reminderSent && (
                  <div style={{fontSize:"13px",color:"var(--teal)",padding:".75rem 1rem",background:"var(--teal-dim)",borderRadius:"var(--radius)",border:"1px solid var(--teal-glow)"}}>
                    ✓ Reminder emails drafted and opened in your email client!
                  </div>
                )}
                <button className="action-btn" style={{alignSelf:"flex-start",marginTop:".5rem"}} onClick={() => { startNew(); setReminderEmails({}); setReminderSent(false); }}>
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
