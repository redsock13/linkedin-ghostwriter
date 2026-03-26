"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";

const POSTS = [
  {
    name: "Thomas Renard",
    role: "Directeur Commercial · SaaS B2B",
    avatar: "TR",
    color: "#2563eb",
    content: "J'ai réalisé que mes meilleurs clients venaient tous d'une seule chose : la confiance.\n\nPas les features. Pas le prix. La confiance.\n\nVoici comment je la construis en 90 jours avec un nouveau prospect ↓",
    likes: 847,
    comments: 63,
  },
  {
    name: "Marie-Claire Dubois",
    role: "Consultante RH · Cabinet indépendant",
    avatar: "MD",
    color: "#7c3aed",
    content: "On m'a dit que le marché du recrutement allait être détruit par l'IA.\n\nJ'ai décidé d'en faire mon avantage compétitif.\n\n6 mois plus tard, mes honoraires ont augmenté de 40%.\n\nVoici ce que j'ai fait concrètement :",
    likes: 1243,
    comments: 89,
  },
  {
    name: "Julien Moreau",
    role: "Fondateur · Startup Fintech",
    avatar: "JM",
    color: "#059669",
    content: "Notre startup a failli mourir en janvier.\n\nOn avait 3 mois de runway. Pas de croissance. Une équipe désemparée.\n\nAujourd'hui on est rentables.\n\nCe que j'aurais aimé savoir à l'époque :",
    likes: 2891,
    comments: 214,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Vous répondez à 5 questions",
    desc: "Votre secteur, vos valeurs, vos sujets d'expertise, votre style de communication. 15 minutes, une seule fois.",
  },
  {
    number: "02",
    title: "On analyse votre voix",
    desc: "Notre IA étudie vos anciens posts, vos interviews, vos emails. Elle apprend à écrire exactement comme vous.",
  },
  {
    number: "03",
    title: "Vous recevez 8 posts par mois",
    desc: "Le 1er de chaque mois. Format copy-paste. Prêts à publier. Vous changez ce que vous voulez, ou vous postez direct.",
  },
];

const FEATURES = [
  { icon: "✦", title: "Votre style, pas le nôtre", desc: "Chaque post est calibré sur votre façon de parler. Jamais générique." },
  { icon: "◆", title: "Hooks qui accrochent", desc: "Les 2 premières lignes font tout. On les optimise pour stopper le scroll." },
  { icon: "●", title: "8 posts par mois", desc: "Fréquence idéale pour l'algorithme LinkedIn. Ni trop, ni trop peu." },
  { icon: "▲", title: "Sujets stratégiques", desc: "On choisit les angles qui font grandir votre autorité dans votre niche." },
  { icon: "★", title: "Livraison le 1er du mois", desc: "Un Google Doc propre, tout est prêt. Vous copiez, vous collez, c'est tout." },
  { icon: "⬡", title: "Résiliable à tout moment", desc: "Pas d'engagement. Vous restez parce que ça marche, pas parce que vous êtes piégé." },
];

export default function Home() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const [activePost, setActivePost] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePost((p) => (p + 1) % POSTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ background: "#000", color: "#f5f5f7", minHeight: "100vh" }}>

      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 48px",
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Ghost<span style={{ color: "#0a66c2" }}>In</span>
        </span>
        <div style={{ display: "flex", gap: 32, fontSize: 14, color: "#6e6e73" }}>
          <a href="#comment" style={{ color: "inherit", textDecoration: "none" }}>Comment ça marche</a>
          <a href="#exemples" style={{ color: "inherit", textDecoration: "none" }}>Exemples</a>
          <a href="#tarif" style={{ color: "inherit", textDecoration: "none" }}>Tarif</a>
        </div>
        <a
          href="#contact"
          style={{
            background: "#fff", color: "#000", padding: "8px 20px",
            borderRadius: 999, fontSize: 14, fontWeight: 600,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
        >
          Démarrer
        </a>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>

        {/* Gradient background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(10,102,194,0.15) 0%, transparent 70%)",
        }} />

        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 860 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(10,102,194,0.12)", border: "1px solid rgba(10,102,194,0.3)",
              borderRadius: 999, padding: "6px 16px", fontSize: 13, color: "#5b9bd5",
              marginBottom: 32, fontWeight: 500,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a66c2", display: "inline-block" }} />
            Conçu pour les pros qui n'ont pas le temps
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: "clamp(48px, 7vw, 88px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 24,
            }}
          >
            Votre LinkedIn.<br />
            <span style={{
              background: "linear-gradient(135deg, #0a66c2, #5b9bd5, #fff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Sans y toucher.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: 20, color: "#86868b", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.6 }}
          >
            8 posts LinkedIn par mois rédigés dans votre style exact.
            Vous copiez, vous collez, vous publiez.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="#contact"
              style={{
                background: "#fff", color: "#000",
                padding: "16px 36px", borderRadius: 999,
                fontSize: 16, fontWeight: 600, textDecoration: "none",
                transition: "transform 0.2s, opacity 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Démarrer — 199€/mois
            </a>
            <a
              href="#exemples"
              style={{
                background: "transparent", color: "#fff",
                padding: "16px 36px", borderRadius: 999,
                fontSize: 16, fontWeight: 500, textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Voir des exemples ↓
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 24, fontSize: 13, color: "#6e6e73" }}
          >
            Sans engagement · Résiliable à tout moment
          </motion.p>
        </motion.div>

        {/* Floating posts preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ position: "relative", zIndex: 1, marginTop: 80, width: "100%", maxWidth: 420 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePost}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: POSTS[activePost].color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, color: "white",
                }}>
                  {POSTS[activePost].avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{POSTS[activePost].name}</div>
                  <div style={{ fontSize: 12, color: "#6e6e73" }}>{POSTS[activePost].role}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d1d6", whiteSpace: "pre-line" }}>
                {POSTS[activePost].content}
              </p>
              <div style={{ display: "flex", gap: 24, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#6e6e73" }}>
                <span>👍 {POSTS[activePost].likes.toLocaleString()}</span>
                <span>💬 {POSTS[activePost].comments} commentaires</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {POSTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePost(i)}
                style={{
                  width: i === activePost ? 24 : 8, height: 8,
                  borderRadius: 4, border: "none", cursor: "pointer",
                  background: i === activePost ? "#0a66c2" : "#333",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <AnimatedSection>
        <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, textAlign: "center" }}>
            {[
              { value: "8 posts", label: "livrés chaque mois" },
              { value: "199€", label: "par mois, tout inclus" },
              { value: "48h", label: "pour démarrer" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "24px 0", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-1px" }}>{s.value}</div>
                <div style={{ fontSize: 14, color: "#6e6e73", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* HOW IT WORKS */}
      <section id="comment" style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ color: "#0a66c2", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Comment ça marche</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 80, maxWidth: 600, lineHeight: 1.1 }}>
              Simple comme bonjour.<br />Puissant comme une agence.
            </h2>
          </AnimatedSection>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {STEPS.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div style={{
                  display: "grid", gridTemplateColumns: "80px 1fr",
                  gap: 32, padding: "40px 0",
                  borderBottom: i < STEPS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <div style={{ fontSize: 48, fontWeight: 700, color: "rgba(255,255,255,0.08)", letterSpacing: "-2px", lineHeight: 1 }}>
                    {step.number}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>{step.title}</h3>
                    <p style={{ fontSize: 16, color: "#86868b", lineHeight: 1.7, maxWidth: 500 }}>{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section id="exemples" style={{ padding: "120px 24px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ color: "#0a66c2", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Exemples de posts</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16, lineHeight: 1.1 }}>
              Écrits pour convertir.<br />Calibrés sur vous.
            </h2>
            <p style={{ color: "#86868b", fontSize: 18, marginBottom: 64 }}>Chaque post est unique, dans votre voix, sur vos sujets.</p>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {POSTS.map((post, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div style={{
                  background: "#111", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: 24,
                  transition: "border-color 0.3s, transform 0.3s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(10,102,194,0.4)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%", background: post.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0,
                    }}>{post.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{post.name}</div>
                      <div style={{ fontSize: 12, color: "#6e6e73" }}>{post.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "#d1d1d6", whiteSpace: "pre-line" }}>{post.content}</p>
                  <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#6e6e73" }}>
                    <span>👍 {post.likes.toLocaleString()}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <AnimatedSection>
            <p style={{ color: "#0a66c2", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Ce qui est inclus</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 64, lineHeight: 1.1 }}>
              Tout ce dont vous<br />avez besoin.
            </h2>
          </AnimatedSection>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {FEATURES.map((f, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div style={{ background: "#000", padding: "40px 32px" }}>
                  <div style={{ fontSize: 24, marginBottom: 16, color: "#0a66c2" }}>{f.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarif" style={{ padding: "120px 24px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <AnimatedSection>
            <p style={{ color: "#0a66c2", fontSize: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Tarif</p>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, letterSpacing: "-1.5px", marginBottom: 16, lineHeight: 1.1 }}>Un seul plan.<br />Simple.</h2>
            <p style={{ color: "#86868b", fontSize: 18, marginBottom: 64 }}>Pas de paliers, pas de surprises.</p>

            <div style={{
              background: "#111", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24, padding: "48px 40px",
              boxShadow: "0 0 80px rgba(10,102,194,0.08)",
            }}>
              <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-2px" }}>199€</div>
              <div style={{ color: "#86868b", fontSize: 16, marginBottom: 40 }}>par mois · sans engagement</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40, textAlign: "left" }}>
                {[
                  "8 posts LinkedIn par mois",
                  "Rédigés dans votre style exact",
                  "Hooks optimisés pour l'algorithme",
                  "Livrés le 1er du mois",
                  "Révisions illimitées",
                  "Résiliable à tout moment",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 16 }}>
                    <span style={{ color: "#0a66c2", fontWeight: 700 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                style={{
                  display: "block", background: "#0a66c2", color: "white",
                  padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 600,
                  textDecoration: "none", textAlign: "center",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Démarrer maintenant
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" style={{ padding: "120px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <AnimatedSection>
            <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, letterSpacing: "-2px", marginBottom: 24, lineHeight: 1.05 }}>
              Prêt à exister sur<br />LinkedIn ?
            </h2>
            <p style={{ color: "#86868b", fontSize: 18, marginBottom: 48 }}>
              Laissez votre email. On vous répond sous 24h avec un questionnaire de 5 questions.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: "rgba(10,102,194,0.1)", border: "1px solid rgba(10,102,194,0.3)",
                  borderRadius: 16, padding: "32px", fontSize: 18,
                }}
              >
                ✓ Reçu ! On vous contacte sous 24h. 🎉
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                style={{ display: "flex", gap: 12, maxWidth: 440, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}
              >
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1, minWidth: 240,
                    background: "#1c1c1e", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12, padding: "16px 20px",
                    color: "#fff", fontSize: 16, outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#fff", color: "#000",
                    padding: "16px 28px", borderRadius: 12,
                    fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Démarrer
                </button>
              </form>
            )}

            <p style={{ marginTop: 20, fontSize: 13, color: "#6e6e73" }}>
              Ou écrivez directement à{" "}
              <a href="mailto:contact@mindforge-ia.com" style={{ color: "#0a66c2", textDecoration: "none" }}>
                contact@mindforge-ia.com
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Ghost<span style={{ color: "#0a66c2" }}>In</span></span>
        <span style={{ fontSize: 13, color: "#6e6e73" }}>© 2026 GhostIn · Par <a href="https://zmimer.dev" style={{ color: "#0a66c2", textDecoration: "none" }}>Safwane</a></span>
        <a href="mailto:contact@mindforge-ia.com" style={{ fontSize: 13, color: "#6e6e73", textDecoration: "none" }}>contact@mindforge-ia.com</a>
      </footer>

    </main>
  );
}
