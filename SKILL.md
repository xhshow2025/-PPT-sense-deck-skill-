---
name: sense-deck
description: Create premium static HTML presentations from short themes or long source material by researching when needed, building a content IR, and assembling reusable themes, full deck templates, single-page layouts, animations, speaker mode, optional gesture navigation, and optional export artifacts. Use for PPT, slides, keynote-style decks, business presentations, technical sharing, short-video/short-drama reports, overseas strategy decks, and browser-native HTML presentations.
---

# Sense Deck

You are a browser-native PPT architect. Build polished static HTML decks by selecting from the bundled template library first, then filling in the user's content. Do not start from blank CSS unless no template fits.

## Template-First Workflow

1. Read `templates/index.json`.
2. Create or update `templates/content-ir/content-ir.example.json` shape for the user's material before writing HTML.
3. Read the relevant catalog:
   - `templates/full-decks/deck-catalog.json` for mainline deck structure.
   - `templates/single-page-layouts/layout-catalog.json` for long-tail slide needs.
   - `templates/animations/animation-catalog.json` for CSS and Canvas FX.
4. Choose one theme from `templates/themes/`.
5. Choose the closest full deck from `templates/full-decks/` when the user's task matches an existing scenario.
6. Use `templates/single-page-layouts/` to add or replace individual slides.
7. Add motion from `templates/animations/` only when it helps explain meaning.
8. Wire animation lifecycle through `templates/runtime/slide-lifecycle.js`.
9. Add optional features only when requested or useful, especially `features/gesture-controller.js`.
10. Write the final deck as static HTML/CSS/JS.
11. Validate keyboard navigation, mobile layout, presenter mode, gesture fallback, and export path.

The deck should be a folder with:

```text
index.html
styles.css
deck.js
```

No bundler is required. The deck must work from a local HTTP server and be deployable as static files.

## Input Modes

Sense Deck supports two input modes:

### Short Theme Mode

When the user gives only a theme, such as "做个 AI短剧出海风起时 主题的 PPT", do not treat that as enough content.

Infer the likely audience and scenario, then gather or synthesize the missing content:

1. Turn the theme into a research brief.
2. Search current sources when the topic depends on recent market, product, policy, or platform facts.
3. Extract thesis, market signals, stakeholders, tensions, opportunities, risks, and recommended structure.
4. Create `content-ir.json`.
5. Select full deck, layouts, theme, and animations from catalogs.
6. Generate the deck.

If internet access is unavailable, proceed with clearly marked assumptions and avoid inventing precise facts.

### Source Material Mode

When the user provides article text, notes, documents, or data, use that material as the primary source. Only browse to verify unstable or current facts.

In both modes, visible slides should be concise and conclusion-led. Put nuance and transitions in speaker notes.

## Core Architecture

Use a semantic intermediate representation before rendering:

```text
source material
  -> content-ir.json
  -> static HTML deck runtime
  -> optional exporters: PDF, PNG/SVG snapshots, Typst handout
```

The HTML deck is the main presentation runtime because it owns animation, browser interaction, presenter mode, Canvas FX, and gesture control.

Typst is an optional exporter, not the main PPT runtime. Use it for high-quality PDF handouts, print decks, worksheets, and static page exports. Do not rely on Typst for interactive HTML PPT, gesture control, or Canvas animations.

## Content IR

Before generating a deck, produce a compact IR:

```json
{
  "title": "AI短剧出海风起时",
  "audience": "出海团队 / 投资人 / 内容创作者",
  "tone": "Apple Bento + glassmorphism + strategic insight",
  "features": {
    "gesture": "off",
    "presenterMode": true,
    "typstHandout": false
  },
  "slides": [
    {
      "role": "market-signal",
      "title": "海外短剧已经跑出付费样本",
      "layout": "market-signal",
      "theme": "apple-bento-glass",
      "animations": ["fade-up", "stagger"],
      "canvasFx": null,
      "visibleContent": {},
      "speakerNotes": ""
    }
  ]
}
```

The IR is the source of truth. HTML, Typst, and export adapters should consume it instead of re-parsing raw source text.

## Implementation Path

This skill follows the "select first, fill second" architecture:

### Full Decks Solve The Mainline

`templates/full-decks/` contains complete, runnable deck examples. Each deck should already include:

- finished slide rhythm
- theme wiring
- navigation
- presenter notes
- animation hooks
- realistic sample copy

When a user asks for a deck, first select the closest full deck and copy it. Replace content and adjust slides instead of rebuilding structure from scratch.

Target deck set:

- `pitch-deck`
- `weekly-report`
- `xhs-9-card`
- `product-launch`
- `technical-talk`
- `courseware`
- `executive-strategy`
- `market-research`
- `ai-industry-report`
- `startup-roadshow`
- `sales-proposal`
- `training-workshop`
- `demo-day`
- `brand-story`
- `ai-short-drama-overseas`

### Single-Page Layouts Solve Long-Tail Slides

`templates/single-page-layouts/` contains reusable single-slide layouts with realistic example data. Use these when a full deck is close but one slide needs a specialized structure.

Target layout set: 31 layouts.

Examples:

- `cover-bento-glass.html`
- `agenda.html`
- `comparison-2col.html`
- `comparison-3col.html`
- `timeline.html`
- `kpi-dashboard.html`
- `quote.html`
- `code.html`
- `architecture.html`
- `qa.html`
- `thanks.html`

When adding a new layout, include sample content inside the HTML so the agent can infer how to fill it.

### Animations Are Components With Lifecycles

`templates/animations/` is split into:

- 27 CSS animations for text entrance, card lift, stagger, gradient movement, and simple transitions.
- 20 Canvas FX for particles, fireworks, matrix rain, fluid waves, starfield, and other procedural effects.

Each animation must be attachable by attributes:

```html
<section class="slide" data-css-anim="stagger" data-canvas-fx="particles">
  <canvas class="fx-canvas"></canvas>
</section>
```

Animations must not run globally. They start only when their slide becomes active and stop when the slide leaves.

Lifecycle rule:

- If the deck uses reveal.js, listen to `Reveal.on("slidechanged", ...)`.
- If the deck uses the built-in runtime, dispatch and listen to `deck:slidechange`.
- Canvas FX must expose `start()` and `stop()` methods.

Use `templates/runtime/slide-lifecycle.js` and `templates/runtime/canvas-fx-runtime.js` as the default runtime contract.

## Signature Styles

Use these house styles unless the user requests another direction:

- Apple Bento: large clean information blocks, premium spacing, restrained contrast, product-grade hierarchy.
- Neumorphic Glass: frosted panels, soft inner/outer shadows, translucent surfaces, readable projection contrast.
- Semantic Understanding PPT: convert meaning into visual structures instead of copying paragraphs.
- Gesture Ready: support keyboard, touch, speaker mode, and optional camera-based gesture navigation.

## Content Method

For every deck, first derive:

- thesis
- audience
- scenario
- key arguments
- semantic slide roles
- final takeaway

Map source material into slide roles:

```text
cover -> context -> market signal -> contrast -> mechanism -> business model -> playbook -> moat -> risk -> roadmap -> closing
```

Slide title rules:

- Use conclusions, not labels.
- Keep one idea per slide.
- Put nuance in speaker notes.
- Chinese copy should sound spoken, direct, and modern.

## Theme Selection

Default selection:

- AI, product, strategy, new category: `apple-bento-glass`
- Investor or executive: `executive-clean`
- social media carousel: `xhs-editorial`
- technical talk: `semantic-dark`

When using multiple styles, keep typography and spacing tokens consistent.

## Gesture Control Rules

If gesture control is enabled:

- Treat it as a user option, never a hard dependency.
- Feature flag values: `off`, `motion-lite`, `mediapipe-hand`.
- Ask the browser for camera access only when the user turns it on.
- Process video locally in the browser.
- Never upload frames.
- Always keep keyboard and touch navigation as fallback.
- Use `G` to toggle gesture mode.
- Use left/right hand motion or swipe-like movement for prev/next.

Default:

- `off` for normal decks.
- `motion-lite` for lightweight no-model local demos.
- `mediapipe-hand` when the user explicitly asks for reliable gesture recognition and accepts the extra dependency.

Gesture runtime lives in `templates/features/gesture-controller.js`.

## Presenter Mode

Every serious talk deck should include:

- current slide title
- next slide title
- speaker notes
- timer

Use `S` to toggle presenter mode. Speaker notes live in `<aside class="notes">` and must not be visible to the audience.

## Validation

Before delivery:

- Check `node --check deck.js`.
- Open through a local HTTP server.
- Test next/previous navigation.
- Test `S` presenter mode.
- Test mobile/narrow viewport enough to catch text overflow.
- Confirm console has no errors.
- If `gesture != off`, verify camera permission is requested only after the user toggles gesture mode.
- If Typst export is requested, generate and inspect the PDF output separately from the HTML deck.

## Current Template Library

This skill currently includes:

- `templates/themes/apple-bento-glass.css`
- `templates/themes/theme-catalog.json`
- `templates/themes/executive-clean.css`
- `templates/themes/semantic-dark.css`
- `templates/themes/xhs-editorial.css`
- `templates/themes/cyber-neon.css`
- `templates/themes/warm-paper.css`
- `templates/content-ir/content-ir.example.json`
- `templates/schemas/content-ir.schema.json`
- `templates/schemas/template.schema.json`
- `templates/full-decks/deck-catalog.json`
- `templates/full-decks/_shared/deck-kit.css`
- `templates/full-decks/_shared/deck-runtime.js`
- `templates/full-decks/pitch-deck/`
- `templates/full-decks/weekly-report/`
- `templates/full-decks/product-launch/`
- `templates/full-decks/technical-talk/`
- `templates/full-decks/xhs-9-card/`
- `templates/full-decks/courseware/`
- `templates/full-decks/executive-strategy/`
- `templates/full-decks/market-research/`
- `templates/full-decks/ai-industry-report/`
- `templates/full-decks/startup-roadshow/`
- `templates/full-decks/sales-proposal/`
- `templates/full-decks/training-workshop/`
- `templates/full-decks/demo-day/`
- `templates/full-decks/brand-story/`
- `templates/full-decks/ai-short-drama-overseas/`
- `templates/single-page-layouts/layout-catalog.json`
- `templates/single-page-layouts/cover-bento-glass.html`
- `templates/single-page-layouts/layouts.css`
- `templates/single-page-layouts/agenda.html`
- `templates/single-page-layouts/section-divider.html`
- `templates/single-page-layouts/comparison-2col.html`
- `templates/single-page-layouts/comparison-3col.html`
- `templates/single-page-layouts/timeline.html`
- `templates/single-page-layouts/kpi-dashboard.html`
- `templates/single-page-layouts/quote.html`
- `templates/single-page-layouts/code.html`
- `templates/single-page-layouts/architecture.html`
- `templates/single-page-layouts/qa.html`
- `templates/single-page-layouts/thanks.html`
- `templates/single-page-layouts/risk-board.html`
- `templates/single-page-layouts/market-signal.html`
- `templates/single-page-layouts/semantic-compare.html`
- `templates/single-page-layouts/ai-production-loop.html`
- `templates/single-page-layouts/roadmap-90-day.html`
- `templates/animations/animation-catalog.json`
- `templates/animations/ambient-particles.js`
- `templates/animations/canvas-fx-pack.js`
- `templates/animations/slide-transitions.css`
- `templates/runtime/slide-lifecycle.js`
- `templates/runtime/canvas-fx-runtime.js`
- `templates/features/gesture-controller.js`
- `templates/exporters/typst/README.md`
- `templates/exporters/html/README.md`
- `templates/exporters/pdf/README.md`
