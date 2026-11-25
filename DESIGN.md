# JXLab Design System

**Source:** Local app (`http://localhost:3000`) — Next.js 15 / React 19 / Tailwind CSS 4 / Framer Motion / Lenis  
**Intended production URL:** `https://jxlab.ai` (DNS did not resolve at capture time; analysis from running local build + source)  
**Capture context:** Desktop viewport inspection, Nov 25 2026. Mobile layout inferred from responsive classes; hover/animation states from code.  
**Brand metaphor:** Scroll-driven “day-to-night agentic lab” — dawn sky → CRT terminal canopy → sunset agent pipeline → twilight showcase → midnight neural meadow → underground compute vault.

---

## 1. Brand & Visual Direction

| Role | Value | Notes |
|------|-------|-------|
| Positioning | Agentic AI & Software Engineering Studio | Developer-forward, production-grade, playful systems metaphors |
| Mood | Atmospheric, tactile, CRT/circuit nostalgia + warm sunset | Dark `color-scheme`; cream surfaces for “paper” UI |
| Emblem | Rounded square `#1E1712` plate, cream “J” stroke, amber “X”, amber node | `JxEmblem` |
| Signature accents | Amber CTAs + teal/cyan phosphor | Dual-accent system (warm action / cool tech) |

**Observed fidelity:** Hero brand name dominates first viewport; sky atmosphere is the dominant visual plane (not an inset card). Cream cards appear only for interactive/content containers (solutions, FAQ, auth).

---

## 2. Design Tokens

### 2.1 Color (extracted from `@theme` + CSS)

| Token | Hex | Semantic use |
|-------|-----|--------------|
| `cream` | `#FBF5E8` | Primary light text on dark; cream surfaces |
| `cream-deep` | `#F2E7D0` | Cream card gradient end / pill fills |
| `cream-border` | `#E2D2B7` | Cream borders |
| `ink` | `#1E1712` | Text on cream; emblem fill |
| `ink-muted` | `#5C4B3E` | Secondary text on cream |
| `amber` | `#E88B2E` | Primary CTA, selection, active nav |
| `amber-hover` | `#D4761B` | Token hover (buttons often use `#F29A42`) |
| `amber-soft` | `#F6B96D` | Highlights, mono eyebrows, phosphor amber |
| `tan` / `tan-hover` | `#C59560` / `#B2814B` | Auth form focus / secondary cream buttons |
| `soil` / `soil-deep` | `#1E140D` / `#140D08` | Deep earth (tokenized; footer uses near-black soil grain) |
| Page base | `#130911` | `html/body` background / midnight sky end |
| Selection | bg `#E88B2E` / text `#1B120A` | Global text selection |

**Extended (component-level, not all in `@theme`):**

| Hex | Role |
|-----|------|
| `#7CE5DB` / `#70D6CE` | CRT phosphor teal, circuit strokes, fiber accents |
| `#5BBF99` | Status “alive” dots |
| `#FFCF7A` | Active ant/agent highlight, nav active text |
| `#0B1E21` | Terminal section / CRT base |
| `#062834` → `#041D27` | Auth portal teal abyss |
| Sky stops | `#4f3f7c` → `#a47a9c` → `#f2a27a` → `#e47646` → `#8b393c` → `#411735` → `#230e1c` → `#130911` |

### 2.2 Typography

| Role | Family | Weights | Usage |
|------|--------|---------|-------|
| Display | **Space Grotesk** (`--font-display`) | 500–700 | Brand H1, section H2/H3 |
| Body | **Plus Jakarta Sans** (`--font-sans`) | 400–700 | UI copy, cards, nav |
| Mono | **JetBrains Mono** (`--font-mono`) | 400–700 | Terminal, eyebrows, status ribbon, handles |

**Type scale (observed):**

- Hero H1: `clamp(4.4rem, 16vw, 10.5rem)`, `leading-[0.88]`, `tracking-[-0.045em]`, cream
- Section H2: `text-3xl` → `sm:text-5xl`, bold, cream
- Body: `text-base` / `sm:text-lg` or `sm:text-xl`
- Eyebrows: mono `text-xs`, `tracking-widest`, amber-soft
- Specs / labels: mono `11px`–`xs`

### 2.3 Radius, elevation, surfaces

| Pattern | Spec |
|---------|------|
| Pills / CTAs | `rounded-full` |
| Cards / modals | `rounded-2xl` (CTA vault `rounded-[2rem]`) |
| Inputs | `rounded-xl` |
| Emblem | `rx≈10` on 40×40 |
| Cream card | Gradient `#fdf8ee→#f7edd9`, border `#e2d2b7`, multi-layer soft shadow + top inset highlight |
| Glass chrome | `backdrop-blur-md/lg`, cream borders at ~15–30% opacity on dark fills (`#1B1310` / `#19120E`) |
| CRT shell | Teal border ~30% opacity, deep inset glow, scanlines + roll bar + phosphor text-shadow |

### 2.4 Spacing & layout

| Token / pattern | Value |
|-----------------|-------|
| Content max | Hero/nav `max-w-5xl`; solutions/builds/footer `max-w-6xl`; FAQ `max-w-3xl`; auth `max-w-md` |
| Page gutters | `px-4` / `sm:px-6` (hero `px-5` / `sm:px-8`) |
| Section vertical | ~`py-24`–`sm:py-32` solutions; FAQ `pt-14 pb-28` |
| Scroll margin | `scroll-mt-20` on anchored sections |
| Touch targets | Primary controls `min-h-[44px]`–`[48px]`; FAQ rows `min-h-[60px]` |

*Spacing above is from Tailwind classes (exact CSS rem depends on theme defaults), not measured pixels.*

---

## 3. Information Architecture & Journeys

### Pages / routes

| Route | Purpose |
|-------|---------|
| `/` | Single-page marketing story (5 acts) |
| `/login` | Client Portal — account + project scoping |
| `/register` | Redirects → `/login` with `next` / track / project params |
| `/privacy`, `/terms` | Legal |

### Homepage section order (UX narrative)

1. **Launchpad (Hero)** — brand-first dawn sky
2. **CRT Terminal (About)** — interactive typewriter + CLI
3. **Agent Pipeline (Solutions)** — scroll-scrubbed convoy + cream track cards + modal deep-dive
4. **Flagship Builds** — drone flyover + 2×2 showcase + tech marquee
5. **FAQ** — cream accordion (first item open)
6. **Agent Crew (Team)** — interactive neural field + agent bus
7. **Deploy Core (CTA) + Footer** — vault CTA, social fiber bus, legal

### Primary conversion path

`Start a project` / CTA vault → `/register` → `/login` (signup or **Scope a Project** brief) → `/api/inquiry`  
Secondary: `Client Portal` → `/login?mode=signin`

---

## 4. Chrome & Navigation Patterns

### Navbar

- Fixed, pill container; transparent at top → compact dark glass after ~45% viewport scroll
- Auto-hide on scroll down past mid-page; reappear on scroll up / focus; stays visible while mobile menu open
- Desktop: About / Solutions / FAQ / Team + amber **Client Portal**
- Active section: amber tint + ring (`IntersectionObserver`, rootMargin `-25% / -45%`)
- Mobile: hamburger → slide-down dark drawer (`md` breakpoint)

### Status ribbon

- Fixed top-right (xl+): mono pill, ping amber dot — `AGENTIC AI STUDIO · SHIPPING 2026`
- `pointer-events-none`

### Section rail

- Fixed right mid (lg+): vertical dots; active = tall amber bar with glow; hover cream tooltip labels (Launchpad, CRT Terminal, Agent Pipeline, …)

### Intro overlay (component exists)

- Full-screen dusk gradient, emblem + `INITIALIZING JXLAB` + progress bar (~1.1s), skip on Esc/Enter/Space/scroll/click  
- *Not currently mounted on `page.tsx` in the inspected build*

---

## 5. Component Inventory

### Atmosphere (`SkyBackdrop`)

- Fixed full-bleed scroll-progress sky (8-stop RGB lerp)
- Bézier sun/moon, 50 twinkling stars, 120s cloud strip drift, night/day cloud sprites
- Fades toward team/underground

### Hero

- Full `100svh`, centered stack: terminal eyebrow pill → giant **JXLab** → cream subline pill → dual CTAs
- Parallax: content down / skyline up on scroll
- Bottom SVG: server-rack / circuit horizon silhouette (teal traces, amber LEDs)

### Terminal About

- CRT window (traffic lights, `JXLAB SYSTEM v1.0`, scanlines, phosphor text)
- 85 chars/s typewriter; amber highlights on key phrases
- Specs row + ASCII “AGENTIC AI CORE”
- Live CLI: input + quick cmds (`projects`, `stack`, `bridgeai`, `jxai`, `contact`, `clear`, `help`)

### Solutions (`DepotSolutions` + `SolutionModal`)

- Mono eyebrow + headline + description
- Decorative scroll pipeline: PLANNER / CODER / VERIFIER pods + AGENT BUS, policy gates, gear rotation, code-token “leaves”
- Two groups: Core Capabilities (6) / Specialized Tracks (4)
- Cream cards: slug tag, timeline, title, shortDesc, stack chips, **Explore solution**
- Modal: springs from click origin; prev/next; Esc/arrows; body scroll lock; hash `#solution-{slug}`

### Builds (`BuildsMarquee`)

- Agent drone flyover + code-shard “feather drops” revealing cards
- 2×2 cream showcase with custom mono preview banners (Bridge / JXAI / JXUI / Bidnix)
- Repo / Live Demo / Request Private Demo CTAs
- Constant-speed tech marquee (~70px/s), pause on hover/focus, edge mask fade

### FAQ

- Cream accordion; Plus rotates to × when open; first item default-expanded
- Motion ease `[0.22, 1, 0.36, 1]`

### Team (`AntTrailTeam`)

- Interactive canvas: fiber field + Lissajous sparks (pointer/touch)
- Articulated agent bots on path with tripod gait; click bot or `@handle` pills to inspect member
- Cream/dark detail panel for selected member

### Underground footer

- Soil grain + teal/amber dotted texture
- Central compute vault CTA (`rounded-[2rem]`, teal border glow)
- Mirrored fiber conduits with path-tangent nano-bots
- Social icons on fiber bus; legal bar with Privacy / Terms

### Auth (`KoiAuthPortal`)

- Deep teal radial abyss + pixel agent swarm canvas
- Centered cream card: emblem, tablist **Client Account | Scope a Project**
- Account: Google (placeholder), email/password, show/hide, create / sign in
- Scope: track select, timeline chips (2–4 / 4–8 / retainer), brief textarea, submit
- Validation + status messages; form focus rings tan

---

## 6. Motion System

| Motion | Behavior | Reduced motion |
|--------|----------|----------------|
| Lenis smooth scroll | duration `1.15`, exponential ease | Disabled |
| Section enter | opacity + y≈28, 0.6s easeOut, once | Still animates unless component checks |
| Hero parallax | scroll-linked transforms | Continues (no reduced gate on transforms) |
| CRT typewriter | 85 cps | Instant full text |
| CRT scan/flicker | continuous | Animations killed via CSS |
| Pipeline convoy / gates / gears | scroll-scrubbed | Transforms still apply |
| Marquee | linear infinite @ 70px/s | Stopped |
| Cloud / stars / leaves / lamps | CSS keyframes | Stopped |
| Ant gait / antennae | CSS + `--gait`; paused when offscreen | Antennae stopped; stride CSS paused by default until driven |
| Modal spring | scale from origin, back.out-like | Present |
| Nav hide/show | y translate 0.3s | Present |

**Implementation stack:** Framer Motion + Lenis + CSS keyframes + canvas RAF loops.

---

## 7. Interaction & Accessibility Notes

**Strengths observed**

- Named landmarks: primary nav, section progress, dialog modal, FAQ regions
- Focus-visible amber/cream outlines on key controls
- `aria-expanded` / `aria-controls` on FAQ; `aria-current` on nav/rail
- Escape closes mobile menu & solution modal; arrow keys cycle solutions
- Password visibility toggle; form validation copy
- Prefer-reduced-motion respected for many decorative animations and Lenis

**Gaps / risks**

- Many “Explore solution” buttons share identical accessible names (need per-card names)
- Decorative canvases / SVG often `aria-hidden` (good) but team bus relies on extra handle buttons for discovery
- Auth Google OAuth is stub messaging only
- Live domain `jxlab.ai` unresolved at audit time — production visual QA pending
- Mobile rail/ribbon hidden; mobile drawer patterns exist but not screenshot-verified here
- Hero subline uses dark ink on cream pill over bright sky (legible); secondary CTA uses dark border on translucent cream (works on peach sky, may need check deeper in scroll)

---

## 8. Responsive Behavior (from classes)

| Breakpoint | Behavior |
|------------|----------|
| Default | Stacked CTAs full-width; 1-col builds; hamburger nav; no rail/ribbon |
| `sm` | Larger type, row CTAs, richer skyline height |
| `md` | Desktop nav + Client Portal; builds 2-col |
| `lg` | Section rail; fiber conduit bays |
| `xl` | Status ribbon |

---

## 9. Image / Asset Treatment

- No photographic hero — procedural sky, canvas clouds, SVG silhouettes
- Icons: Lucide (`ArrowRight`, `Terminal`, `Menu`, etc.) + custom SVG emblem/bots/drone
- Auth background: 1/5-res pixel agent swarm (not photographic)
- OG image: generated via `opengraph-image.tsx`

---

## 10. Implementation Guidance (recreate / extend)

1. Keep **amber = action**, **teal = systems/CRT**, **cream = readable content surfaces** on dark atmospheric base.
2. Prefer **full-bleed scroll sky** over card-in-hero layouts; brand wordmark must remain the loudest hero signal.
3. Section rhythm: mono eyebrow pill → display H2 → one supporting sentence → one interactive metaphor → content.
4. Interactive metaphors should teach the product (pipeline, CRT, agent bus) rather than generic illustrations.
5. Stack: Next App Router + Tailwind v4 `@theme` tokens + Framer Motion + Lenis; content centralized in `src/data/jxlabConfig.ts`.
6. Always wire `prefers-reduced-motion` for new canvas/CSS loops.
7. When adding cards, pair cream surface with ink text; don’t place dense cream card grids in the first viewport.

---

## 11. Unresolved / Not Captured

- Production DNS / CDN branding scrape (Firecrawl failed: hostname `jxlab.ai`)
- True mobile screenshots and touch gesture QA
- Hover/focus pixel states beyond code intent
- Whether `IntroOverlay` will be re-enabled
- Exact pixel measurements of shadows/spacing (class-based estimates only)
- Privacy/terms page visual audit (out of primary marketing scope)

---

## 12. Quick Reference — CTA Copy

| Location | Label | Target |
|----------|-------|--------|
| Hero primary | Start a project | `/register` |
| Hero secondary | What is JXLab? | `#about` |
| Nav | Client Portal | `/login?mode=signin` |
| Solutions cards | Explore solution | modal + hash |
| Footer vault | Start a project | `/register` |
| Auth | Create account / Sign in / Scope submit | local UX + inquiry API |
