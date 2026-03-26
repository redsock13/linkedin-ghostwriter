"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── SCRAMBLE ── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function scramble(el: HTMLElement, target: string, ms = 1000) {
  const frames = Math.round(ms / 30), obj = { f: 0 };
  const run = () => {
    el.textContent = target.split("").map((c, i) =>
      c === " " ? " " : obj.f / frames > i / target.length ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join("");
    if (obj.f++ < frames) requestAnimationFrame(run); else el.textContent = target;
  };
  run();
}

/* ── TYPING EFFECT ── */
function TypeWriter({ texts }: { texts: string[] }) {
  const [cur, setCur] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const target = texts[cur];
    const speed = del ? 40 : 80;
    const t = setTimeout(() => {
      if (!del) {
        if (txt.length < target.length) setTxt(target.slice(0, txt.length + 1));
        else setTimeout(() => setDel(true), 1800);
      } else {
        if (txt.length > 0) setTxt(txt.slice(0, -1));
        else { setDel(false); setCur((c) => (c + 1) % texts.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [txt, del, cur, texts]);
  return (
    <span style={{ color: "#60a5fa" }}>
      {txt}<span className="type-cursor" style={{ color: "#0057ff" }}>|</span>
    </span>
  );
}

/* ── PARTICLE CANVAS ── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const mouse = { x: W / 2, y: H / 2 };
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5, pulse: Math.random() * Math.PI * 2,
    }));
    let raf: number, t = 0;
    const draw = () => {
      t += .012;
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
        if (d < 180) { p.vx += dx / d * .012; p.vy += dy / d * .012; }
        p.vx *= .98; p.vy *= .98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,87,255,${.13 * (1 - d / 130)})`; ctx.lineWidth = .6; ctx.stroke();
        }
      }));
      pts.forEach(p => {
        const g = Math.sin(t + p.pulse) * .5 + .5;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 7);
        grad.addColorStop(0, `rgba(0,87,255,${.25 * g})`); grad.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 7, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "#0057ff";
        ctx.globalAlpha = .6 + g * .4; ctx.fill(); ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ── MAGNETIC BTN ── */
function MagBtn({ children, href, primary, big }: { children: React.ReactNode; href: string; primary?: boolean; big?: boolean }) {
  const r = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const b = r.current!.getBoundingClientRect();
    gsap.to(r.current, { x: (e.clientX - b.left - b.width / 2) * .28, y: (e.clientY - b.top - b.height / 2) * .28, duration: .3, ease: "power2.out" });
  };
  const onLeave = () => gsap.to(r.current, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.4)" });
  return (
    <a ref={r} href={href} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
      padding: big ? "17px 44px" : "13px 28px", borderRadius: 999,
      fontSize: big ? 17 : 15, fontWeight: 600,
      background: primary ? "linear-gradient(135deg,#0057ff,#0ea5e9)" : "rgba(0,87,255,.07)",
      color: primary ? "#fff" : "#60a5fa",
      border: primary ? "none" : "1px solid rgba(0,87,255,.2)",
      boxShadow: primary ? "0 8px 32px rgba(0,87,255,.35), inset 0 1px 0 rgba(255,255,255,.12)" : "none",
      transition: "box-shadow .25s", flexShrink: 0,
    }}>
      {children}
    </a>
  );
}

/* ── TILT CARD ── */
function TiltCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const r = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const b = r.current!.getBoundingClientRect();
    gsap.to(r.current, { rotateX: (e.clientY - b.top - b.height / 2) / b.height * 14, rotateY: -(e.clientX - b.left - b.width / 2) / b.width * 14, duration: .35, ease: "power2.out", transformPerspective: 900 });
  };
  const onLeave = () => gsap.to(r.current, { rotateX: 0, rotateY: 0, duration: .8, ease: "elastic.out(1,.35)" });
  return <div ref={r} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transformStyle: "preserve-3d", ...style }}>{children}</div>;
}

/* ── COUNTER ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const r = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2.5, ease: "power3.out", scrollTrigger: { trigger: r.current, start: "top 85%", once: true }, onUpdate: () => { if (r.current) r.current.textContent = Math.round(o.v) + suffix; } });
  }, [to, suffix]);
  return <span ref={r}>0{suffix}</span>;
}

/* ────────── PAGE ────────── */
export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  /* Cursor */
  useEffect(() => {
    const dot = document.getElementById("cur"), ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;
    const fn = (e: MouseEvent) => { gsap.to(dot, { x: e.clientX, y: e.clientY, duration: .04 }); gsap.to(ring, { x: e.clientX, y: e.clientY, duration: .14 }); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* Spotlight */
  useEffect(() => {
    const el = document.getElementById("spt");
    if (!el) return;
    const fn = (e: MouseEvent) => { el.style.setProperty("--x", e.clientX + "px"); el.style.setProperty("--y", e.clientY + "px"); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* Lenis */
  useEffect(() => {
    import("lenis").then(m => {
      const lenis = new m.default({ lerp: .09, smoothWheel: true });
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }).catch(() => {});
  }, []);

  /* Hero scramble */
  useEffect(() => {
    const el = document.getElementById("sc");
    if (el) setTimeout(() => scramble(el, "GhostIn", 900), 700);
  }, []);

  /* GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero */
      gsap.set([".hn", ".hb", ".ht1", ".ht2", ".hs", ".hbtns", ".hcard", ".hb2", ".hb3", ".hstat"], { opacity: 0 });
      gsap.set([".ht1", ".ht2"], { y: 60 });
      gsap.set([".hb", ".hs", ".hbtns", ".hstat"], { y: 24 });
      gsap.set(".hcard", { y: 70, rotateX: 8 });
      gsap.set(".hb2", { x: 20, y: -10 });
      gsap.set(".hb3", { x: -20, y: 10 });

      gsap.timeline({ delay: .1 })
        .to(".hn", { opacity: 1, duration: .5 })
        .to(".hb", { opacity: 1, y: 0, duration: .6, ease: "power3.out" }, "-=.2")
        .to(".ht1", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=.3")
        .to(".ht2", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=.7")
        .to(".hs", { opacity: 1, y: 0, duration: .8, ease: "power3.out" }, "-=.5")
        .to(".hbtns", { opacity: 1, y: 0, duration: .7, ease: "power3.out" }, "-=.4")
        .to(".hstat", { opacity: 1, y: 0, stagger: .08, duration: .6, ease: "power3.out" }, "-=.4")
        .to(".hcard", { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: "power3.out" }, "-=.5")
        .to(".hb2", { opacity: 1, x: 0, y: 0, duration: .6, ease: "back.out(1.7)" }, "-=.3")
        .to(".hb3", { opacity: 1, x: 0, y: 0, duration: .6, ease: "back.out(1.7)" }, "-=.4");

      /* Scroll */
      gsap.utils.toArray<HTMLElement>(".sr").forEach(el => {
        gsap.set(el, { opacity: 0, y: 44 });
        gsap.to(el, { opacity: 1, y: 0, duration: .85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".src").forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 50, scale: .97 });
        gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: .75, ease: "power3.out", delay: (i % 3) * .09, scrollTrigger: { trigger: el, start: "top 82%", once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const BG = { background: "linear-gradient(135deg,#0057ff,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" as const };
  const ROLES = ["CEO", "VP of Sales", "Founder", "Executive Coach", "CMO", "Consultant", "Angel Investor", "Head of Growth"];
  const POSTS = [
    { tag: "Leadership", text: "3 decisions I wish I'd made 5 years earlier as a VP of Sales — and why most leaders avoid them.", likes: "2.1k", comments: "318", name: "Mark D.", title: "VP Sales · Series B Startup" },
    { tag: "Founder", text: "Why 90% of founders fail on LinkedIn — and the one shift that changed everything for me.", likes: "4.7k", comments: "562", name: "Sarah L.", title: "Founder · B2B SaaS · New York" },
    { tag: "Growth", text: "I closed 3 new clients in 30 days without cold outreach. Here's exactly what I did.", likes: "8.3k", comments: "1.2k", name: "Thomas B.", title: "CEO · VC-backed SaaS" },
  ];

  return (
    <>
      <div id="cur" /><div id="cur-ring" /><div id="spt" /><div className="scanline" />

      {/* Aurora BG */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div className="a1" style={{ position: "absolute", top: "-10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,87,255,.16) 0%,transparent 65%)", filter: "blur(70px)" }} />
        <div className="a2" style={{ position: "absolute", top: "30%", left: "-8%", width: 550, height: 550, borderRadius: "50%", background: "radial-gradient(circle,rgba(14,165,233,.12) 0%,transparent 65%)", filter: "blur(80px)" }} />
        <div className="a3" style={{ position: "absolute", bottom: "5%", right: "20%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(56,189,248,.1) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <div className="dot-grid" />
      </div>

      <div ref={root} style={{ position: "relative", zIndex: 2 }}>

        {/* NAV */}
        <nav className="hn" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px,4vw,48px)", height: 62, background: "rgba(4,4,10,.85)", backdropFilter: "blur(24px) saturate(180%)", borderBottom: "1px solid rgba(0,87,255,.08)" }}>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px" }}>
            Ghost<span style={BG}>In</span>
          </span>
          <div className="nav-links" style={{ display: "flex", gap: 32, fontSize: 14, color: "#475569" }}>
            {["Comment ça marche", "Exemples", "Tarif"].map((n, i) => (
              <a key={i} href={`#s${i}`} style={{ color: "inherit", textDecoration: "none" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#60a5fa")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#475569")}>{n}</a>
            ))}
          </div>
          <MagBtn href="#contact" primary>Start →</MagBtn>
        </nav>

        {/* HERO */}
        <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <ParticleCanvas />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,87,255,.05) 0%,transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>

            {/* Badge */}
            <div className="hb" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,87,255,.08)", border: "1px solid rgba(0,87,255,.18)", borderRadius: 999, padding: "7px 18px", fontSize: 13, color: "#60a5fa", marginBottom: 36, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, background: "#0057ff", borderRadius: "50%", boxShadow: "0 0 10px #0057ff", display: "inline-block" }} className="pulse" />
              8 posts/month · $399/mo · Cancel anytime
            </div>

            {/* Title */}
            <div style={{ maxWidth: 880, marginBottom: 24 }}>
              <h1 className="ht1" style={{ fontSize: "clamp(50px,8vw,100px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1.0, marginBottom: 6 }}>
                Your voice on LinkedIn.
              </h1>
              <h1 className="ht2" style={{ fontSize: "clamp(50px,8vw,100px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 1.02 }}>
                <span id="sc" style={{ ...BG, backgroundSize: "200% auto" }} className="shimmer">·····</span>{" "}
                par <span style={BG}>Ghost<span style={{ color: "#38bdf8" }}>In</span></span>
              </h1>
            </div>

            {/* Typewriter */}
            <div className="hs" style={{ fontSize: "clamp(17px,2.2vw,22px)", color: "#475569", maxWidth: 580, lineHeight: 1.65, marginBottom: 16 }}>
              You are{" "}<TypeWriter texts={ROLES.map(r => `${r} on LinkedIn`)} />.
            </div>
            <p className="hs" style={{ fontSize: 16, color: "#475569", maxWidth: 520, lineHeight: 1.65, marginBottom: 48 }}>
              We write. You post. Your audience grows.{" "}
              <span style={{ color: "#60a5fa", fontWeight: 500 }}>Without ever losing your authentic voice.</span>
            </p>

            {/* Buttons */}
            <div className="hbtns hero-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
              <MagBtn href="#contact" primary big>Start this month — $399 →</MagBtn>
              <MagBtn href="#s1" big={false}>Voir des exemples de posts</MagBtn>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}>
              {[
                { v: "+", to: 340, s: "%", l: "d'impressions en moyenne" },
                { v: "", to: 8, s: " posts", l: "par mois garantis" },
                { v: "", to: 48, s: "h", l: "premier post livré" },
              ].map((s, i) => (
                <div key={i} className="hstat" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 120 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", ...BG }}>
                    {s.v}<Counter to={s.to} suffix={s.s} />
                  </div>
                  <div style={{ fontSize: 13, color: "#475569" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Hero card */}
            <TiltCard className="hcard" style={{ width: "100%", maxWidth: 560, position: "relative" }}>
              <div style={{ background: "rgba(255,255,255,.06)", backdropFilter: "blur(24px)", borderRadius: 20, padding: "0 0 20px", boxShadow: "0 32px 100px rgba(0,87,255,.15), 0 4px 20px rgba(0,0,0,.2)", border: "1px solid rgba(0,87,255,.12)", overflow: "hidden" }}>
                <div style={{ height: 3, background: "linear-gradient(90deg,#0057ff,#0ea5e9,#38bdf8)" }} />
                <div style={{ padding: "20px 24px 0" }}>
                  {/* LinkedIn post style */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#0057ff,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>T</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>Thomas Beaumont</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>CEO · Startup SaaS B2B · 12k abonnés</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "rgba(0,87,255,.1)", color: "#60a5fa", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, border: "1px solid rgba(0,87,255,.15)" }}>GhostIn ✓</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 16, textAlign: "left" }}>
                    I closed <strong style={{ color: "#f0f4ff" }}>3 new clients</strong> in 30 days without cold outreach.<br /><br />
                    No cold email. No ads. Just <strong style={{ color: "#60a5fa" }}>LinkedIn.</strong><br /><br />
                    Here&apos;s exactly what I did ↓
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,.06)", fontSize: 13, color: "#475569" }}>
                    <span>👍 2 143 réactions</span>
                    <span>💬 394 commentaires</span>
                    <span>🔁 521 partages</span>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="hb2 fl" style={{ position: "absolute", top: -16, right: -14, background: "rgba(4,4,10,.95)", borderRadius: 12, padding: "9px 14px", boxShadow: "0 8px 32px rgba(0,87,255,.2)", border: "1px solid rgba(0,87,255,.15)", display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 18 }}>✍️</span>
                <div><div style={{ fontWeight: 700, fontSize: 12 }}>Post rédigé</div><div style={{ fontSize: 10, color: "#475569" }}>Dans votre style</div></div>
              </div>
              <div className="hb3 fl2" style={{ position: "absolute", bottom: -14, left: -14, background: "linear-gradient(135deg,#0057ff,#0ea5e9)", borderRadius: 12, padding: "9px 14px", boxShadow: "0 8px 32px rgba(0,87,255,.35)", display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 18 }}>🚀</span>
                <div><div style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>$399/month</div><div style={{ fontSize: 10, color: "rgba(255,255,255,.65)" }}>8 posts guaranteed</div></div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* MARQUEE 1 */}
        <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "1px solid rgba(0,87,255,.07)", borderBottom: "1px solid rgba(0,87,255,.07)", background: "rgba(0,0,0,.3)" }}>
          <div className="mq">
            {[...Array(2)].flatMap(() => ROLES.map((r, i) => (
              <div key={`${r}${i}`} style={{ display: "flex", alignItems: "center", gap: 20, paddingRight: 40, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{r}</span>
                <span style={{ color: "#1e293b", fontSize: 8 }}>◆</span>
              </div>
            )))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="s0" style={{ padding: "80px 24px 100px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,87,255,.07)", border: "1px solid rgba(0,87,255,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>Comment ça marche</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08 }}>
                You talk.<br /><span style={BG}>We write. You shine.</span>
              </h2>
            </div>
            {[
              { n: "01", e: "🎙️", t: "30-min onboarding call", d: "On apprend votre style, vos opinions, vos sujets de prédilection. Une interview et on a tout ce qu'il nous faut." },
              { n: "02", e: "✍️", t: "8 posts / month", d: "Written in advance. In your voice. Each post is unique, engaging, and authentically you." },
              { n: "03", e: "✅", t: "You approve, you post", d: "Review and post whenever you want. No pressure. You stay in full control." },
            ].map((s, i) => (
              <div key={i} className="sr" style={{ display: "grid", gridTemplateColumns: "68px 1fr", gap: 24, padding: "32px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,.04)" : "none", alignItems: "flex-start" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(0,87,255,.08)", border: "1px solid rgba(0,87,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{s.e}</div>
                <div>
                  <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 700, letterSpacing: 2, marginBottom: 7, textTransform: "uppercase" }}>Étape {s.n}</div>
                  <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 8, letterSpacing: "-.3px" }}>{s.t}</h3>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, maxWidth: 480 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXAMPLE POSTS */}
        <section id="s1" style={{ padding: "60px 24px 100px", background: "rgba(0,0,0,.3)", borderTop: "1px solid rgba(0,87,255,.06)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,87,255,.07)", border: "1px solid rgba(0,87,255,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>Exemples de posts</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08 }}>
                Des vrais résultats.<br /><span style={BG}>Des vraies personnes.</span>
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 16 }}>
              {POSTS.map((p, i) => (
                <TiltCard key={i} className="src post-card" style={{ cursor: "none" }}>
                  <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(0,87,255,.1)", borderRadius: 18, padding: "0 0 18px", overflow: "hidden", transition: "border-color .25s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,87,255,.3)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,87,255,.1)")}>
                    <div style={{ height: 3, background: "linear-gradient(90deg,#0057ff,#0ea5e9)" }} />
                    <div style={{ padding: "18px 20px 0" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,hsl(${i * 80},70%,40%),hsl(${i * 80 + 40},70%,55%))`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                          {p.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "#475569" }}>{p.title}</div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(0,87,255,.06)", color: "#60a5fa", fontSize: 10, fontWeight: 700, borderRadius: 6, padding: "3px 8px", display: "inline-block", marginBottom: 10 }}>{p.tag}</div>
                      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, marginBottom: 14 }}>{p.text}</p>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#334155", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.05)" }}>
                        <span>👍 {p.likes}</span><span>💬 {p.comments}</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE 2 — Inversé */}
        <div style={{ overflow: "hidden", padding: "18px 0", background: "rgba(0,0,0,.4)", borderTop: "1px solid rgba(0,87,255,.06)" }}>
          <div className="mq2">
            {[...Array(2)].flatMap(() => ["Notoriété", "Crédibilité", "Leads entrants", "Influence", "Visibilité", "Engagement", "Autorité", "Réseau"].map((r, i) => (
              <div key={`${r}${i}`} style={{ display: "flex", alignItems: "center", gap: 20, paddingRight: 40, whiteSpace: "nowrap" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1e3a5f" }}>{r}</span>
                <span style={{ color: "#1e293b", fontSize: 8 }}>◆</span>
              </div>
            )))}
          </div>
        </div>

        {/* PRICING */}
        <section id="s2" style={{ padding: "96px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="sr" style={{ marginBottom: 56, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,87,255,.07)", border: "1px solid rgba(0,87,255,.15)", borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#60a5fa", fontWeight: 500, marginBottom: 16 }}>Tarif</div>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,54px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08 }}>
                Simple.<br /><span style={BG}>Transparent. Récurrent.</span>
              </h2>
            </div>

            <div className="pricing-grid sr" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Card 1 */}
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(0,87,255,.1)", borderRadius: 22, padding: "40px 36px" }}>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>Monthly</div>
                <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-3px", ...BG, lineHeight: 1 }}>$399</div>
                <div style={{ fontSize: 13, color: "#334155", marginBottom: 32 }}>per month · no contract</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 36 }}>
                  {["8 LinkedIn posts/month", "Written in your exact voice", "30-min onboarding call", "Unlimited revisions", "Delivered 5 days before you post", "Cancel anytime"].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14 }}>
                      <div style={{ width: 21, height: 21, borderRadius: "50%", background: "linear-gradient(135deg,#0057ff,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                      </div>
                      <span style={{ color: "#94a3b8" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <MagBtn href="#contact" primary>Start this month →</MagBtn>
              </div>

              {/* Card 2 — highlighted */}
              <div style={{ padding: 2, borderRadius: 24, background: "linear-gradient(135deg,#0057ff,#0ea5e9,#38bdf8,#0057ff)", backgroundSize: "300%", animation: "gb 4s ease infinite" }}>
                <div style={{ background: "#04040a", borderRadius: 22, padding: "40px 36px", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: "#475569" }}>Quarterly</span>
                    <span style={{ background: "rgba(0,87,255,.1)", color: "#60a5fa", fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "3px 10px", border: "1px solid rgba(0,87,255,.2)" }}>- 10%</span>
                  </div>
                  <div style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-3px", ...BG, lineHeight: 1 }}>$349</div>
                  <div style={{ fontSize: 13, color: "#334155", marginBottom: 32 }}>per month · 3-month commitment</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 36 }}>
                    {["Everything in monthly", "10 posts/month instead of 8", "Monthly performance analysis", "Editorial strategy included", "Priority delivery", "Direct WhatsApp support"].map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 11, alignItems: "center", fontSize: 14 }}>
                        <div style={{ width: 21, height: 21, borderRadius: "50%", background: "linear-gradient(135deg,#0057ff,#0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>✓</span>
                        </div>
                        <span style={{ color: "#94a3b8" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <MagBtn href="#contact" primary>Best value →</MagBtn>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" style={{ padding: "72px 24px 112px", background: "rgba(0,0,0,.3)", borderTop: "1px solid rgba(0,87,255,.06)" }}>
          <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
            <div className="sr">
              <h2 style={{ fontSize: "clamp(28px,4.5vw,56px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 14 }}>
                Your next post<br /><span style={BG}>is already written.</span>
              </h2>
              <p style={{ color: "#475569", fontSize: 17, marginBottom: 44, lineHeight: 1.65 }}>
                Drop your email. We reply within the hour.
              </p>
              {sent ? (
                <div style={{ background: "rgba(0,87,255,.07)", border: "1px solid rgba(0,87,255,.18)", borderRadius: 16, padding: "28px", fontSize: 18, color: "#60a5fa", fontWeight: 600 }}>
                  ✓ Got it! We&apos;ll reach out within the hour. 🚀
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
                  style={{ display: "flex", gap: 9, maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                  <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                    style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(0,87,255,.15)", borderRadius: 12, padding: "14px 18px", color: "#f0f4ff", fontSize: 15, outline: "none", fontFamily: "inherit" }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(0,87,255,.5)"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 4px rgba(0,87,255,.08)"; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(0,87,255,.15)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }} />
                  <button type="submit" style={{ background: "linear-gradient(135deg,#0057ff,#0ea5e9)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, border: "none", cursor: "none", fontFamily: "inherit", boxShadow: "0 8px 24px rgba(0,87,255,.35)" }}>
                    Start →
                  </button>
                </form>
              )}
              <p style={{ marginTop: 16, fontSize: 13, color: "#334155" }}>
                Or email us at{" "}
                <a href="mailto:contact@mindforge-ia.com" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 500 }}>contact@mindforge-ia.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: "24px clamp(20px,4vw,48px)", borderTop: "1px solid rgba(0,87,255,.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, background: "rgba(0,0,0,.5)" }}>
          <span style={{ fontWeight: 900, fontSize: 17 }}>Ghost<span style={BG}>In</span></span>
          <span style={{ fontSize: 13, color: "#334155" }}>© 2026 · GhostIn</span>
          <a href="mailto:contact@mindforge-ia.com" style={{ fontSize: 13, color: "#334155", textDecoration: "none" }}>contact@mindforge-ia.com</a>
        </footer>
      </div>
    </>
  );
}
