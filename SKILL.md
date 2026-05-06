---
name: 鲸格PPT
description: Create premium static HTML presentations from short themes or long source material by researching when needed, building a content IR, and assembling reusable themes, full deck templates, single-page layouts, animations, speaker mode, optional gesture navigation, and optional export artifacts. Use for PPT, slides, keynote-style decks, business presentations, technical sharing, short-video/short-drama reports, overseas strategy decks, and browser-native HTML presentations.
---

# 鲸格PPT

You are a browser-native PPT architect. Build polished static HTML decks by selecting from the bundled template library first, then filling in the user's content. Do not start from blank CSS unless no template fits.

## Template-First Workflow

1. Read `templates/index.json`.
2. Detect visual capabilities before writing HTML: image generation, image understanding, local file writing, alpha/cutout support, browser preview, and export support.
3. Create or update `templates/content-ir/content-ir.example.json` shape for the user's material before writing HTML. Include `assets.imageGeneration`, `assets.backgroundDecision`, `assets.spotIllustrations`, and `assets.firstThreeSlideTrial` whenever the deck is visual-led.
4. Read the relevant catalog:
   - `templates/full-decks/deck-catalog.json` for mainline deck structure.
   - `templates/single-page-layouts/layout-catalog.json` for long-tail slide needs.
   - `templates/animations/animation-catalog.json` for CSS and Canvas FX.
5. Choose one theme from `templates/themes/`.
6. Choose the closest full deck from `templates/full-decks/` when the user's task matches an existing scenario.
7. Use `templates/single-page-layouts/` to add or replace individual slides.
8. Generate or collect required bitmap assets before final layout when image generation is available and the deck calls for illustrations.
9. Add motion from `templates/animations/` only when it helps explain meaning.
10. Wire animation lifecycle through `templates/runtime/slide-lifecycle.js`.
11. Add optional features only when requested or useful, especially `features/gesture-controller.js`.
12. Write the final deck as static HTML/CSS/JS.
13. Validate keyboard navigation, mobile layout, presenter mode, gesture fallback, image placement, and export path.

The deck should be a folder with:

```text
index.html
styles.css
deck.js
```

No bundler is required. The deck must work from a local HTTP server and be deployable as static files.

## Input Modes

## Image-First Visual Contract

Before writing any HTML deck, decide whether the presentation needs generated or collected raster images. Record this decision in `content-ir.json` under `assets.imageGeneration`, `assets.backgroundDecision`, and, when relevant, `assets.spotIllustrations`.

When the user asks for `图文并茂`, `插图`, `配图`, `电影质感`, `王昭君风`, `绘本`, `故事感`, `产品视觉`, `品牌感`, `海报感`, or similar visual-led wording, automatically use real image generation if the current environment provides it. Do not wait for the user to say "use image2" or name a provider.

Use generated bitmap image assets when they materially improve the deck:

- Story, picture-book, nostalgic, children, fairy-tale, brand, venue, product, travel, culture, emotion, campaign, or hero-led decks usually need them.
- Cover slides and chapter divider slides usually need either one strong background image/illustration or a full-scene drawn background.
- Data-report decks may use background illustrations on cover/section/summary slides, but dense chart slides can stay clean and use small spot illustrations instead.
- Technical, code-heavy, audit, finance, legal, or very dense operational decks can skip background images when visual assets would reduce clarity.

SVG is not a substitute for requested illustrations. Use SVG only for diagrams, icons, simple symbols, wireframes, template frames, or when image generation is unavailable or explicitly disabled. If image generation is available, do not stop at an SVG-only visual deck when the user wanted illustration.

## Visual Asset Ladder

Choose the right asset level for the deck instead of forcing every theme into the same cinematic treatment.

1. Cinematic raster images: use for the flagship `电影质感` style, story scenes, characters, places, cultural narratives, brand films, product hero moments, and emotionally led decks. These usually need generated PNG/WebP backgrounds, scene fragments, character details, props, and texture closeups.
2. PNG/WebP components: use for most premium business, product, strategy, training, technology, and report decks. These are reusable design components such as glass shields, 3D badges, robots, devices, magnifiers, data tiles, paper fragments, neon signs, coins, route markers, or material swatches. They often sit inside cards or side rails and should not dominate the whole slide.
3. SVG/CSS/Canvas assets: use for diagrams, icons, structural graphics, frames, HUD lines, simple editorial marks, charts, wireframes, and environments without image generation. This is a valid production path for information-dense decks and a formal fallback for image-limited AI products.

Record the chosen strategy in `content-ir.json` under `assets.imageGeneration.assetStrategy`:

- `cinematic-images` for hero scene/image-led decks.
- `png-components` for component-led premium decks.
- `svg-css-fallback` when no image model is available or the deck is intentionally code-native.
- `hybrid` when a deck mixes a few generated hero images with SVG/CSS diagrams and PNG components.

PNG components and SVG/CSS can occupy the same semantic slot, but they are not the same asset type. Example: a risk card may use an SVG line shield in fallback mode, or a transparent PNG glass shield when image generation/cutout is available.

If background images are needed:

1. Define the image brief before writing HTML: subject, style, composition, palette, aspect ratio, and which slide(s) use it.
2. Generate or collect the image assets first, then place them inside the deck folder, preferably `assets/backgrounds/` or `assets/illustrations/`.
3. Reference only local relative paths from `index.html`; do not depend on remote URLs.
4. Keep text readability by using safe zones, washes, masks, or framed content panels.
5. If the deck is template-based and uses CSS/SVG illustrations instead of bitmap images, mark that as a fallback in `assets.imageGeneration.svgPolicy` and keep the layout simple.
6. If no background image is needed, state why in `content-ir.json` and proceed directly to HTML/CSS/JS.

Do not leave visually-led decks as empty text-only slides. A deck can be minimal, but it should not feel under-filled.

## Spot Illustration Batch Pipeline

Many decks need several small images rather than one or two huge illustrations. When a deck is visual-led but not every slide should be a hero poster, create a batch of semantic spot illustrations.

Default batch rules:

1. Generate 6-12 small PNG/WebP assets for a 10-15 slide deck, or 2-4 small assets for the first three-slide trial.
2. Store them under `assets/spot/` with stable names such as `spot-market-signal.png`, `spot-user-pain.png`, or `spot-cost-lever.png`.
3. Each spot illustration must map to a point, card, keyword, quote, or mechanism. Do not scatter generic decoration.
4. Outside cover and section-divider slides, a spot illustration should usually occupy about 18-32% of slide width, or live inside a card/side rail. Avoid images that take one-third to one-half of the slide unless the layout explicitly calls for a main visual.
5. Prefer small scenes, props, icons with material depth, character gestures, object clusters, UI fragments, or metaphorical still lifes. Keep a unified art direction across the batch.
6. Keep text editable and visible. Small images may sit near card corners, gutters, right rails, bottom strips, or behind a masked wash, but they must not occlude title or body text.
7. Record each asset in `content-ir.json` under `assets.spotIllustrations` with `id`, `path`, `slides`, `brief`, `style`, `placement`, `size`, and `maxSlideWidth`.
8. If the environment cannot generate images, output an `image-prompts.json` manifest with the same briefs and use simple local fallback shapes only as placeholders.

## First Three-Slide Visual Trial

For visual-heavy decks, internally lock the visual system on the cover plus the next two slides before producing the full deck.

1. Create image briefs for the first three slides.
2. Generate or collect the cover/main image and at least 2-4 spot illustrations for the next two slides when image generation is available.
3. Place those images into the actual deck layout and inspect the rendered result when browser preview is available.
4. Check that text is readable, images are not oversized, the style is consistent, and the deck does not look like a collage of unrelated assets.
5. Record the result in `content-ir.json` under `assets.firstThreeSlideTrial`.
6. In interactive work, show or mention the trial for user review when practical. In autonomous work, continue with the same locked art direction after the trial passes.

## Cross-Product Capability Modes

Use capability detection instead of product-name detection.

- Codex with image generation: use the available image generation skill/tool directly, save images into the deck folder, then wire local paths into HTML.
- ChatGPT or GPT products with image generation: request image generation through the available tool, keep an asset manifest, and avoid provider-specific wording unless the user named a provider.
- Claude Code, OpenCode, and other code-agent products: treat 鲸格PPT as a portable folder skill. Read `SKILL.md`, catalogs, schemas, and templates from this folder, then write static deck files in the target workspace. Use their own browser preview, shell, image tool, or MCP/plugin conventions when available.
- Products with image understanding but no image generation: use user-supplied references, crop/cutout when possible, and return a prompt pack for missing assets.
- Products with no filesystem: return `index.html`, `styles.css`, `deck.js`, `content-ir.json`, and an `image-prompts.json` manifest so the user or host product can generate and attach assets.
- Products with no image generation at all: use sparse, high-quality layout plus SVG/CSS/Canvas assets for diagrams, icons, frames, charts, and simple editorial systems. Label missing cinematic or PNG-component assets as pending prompts instead of pretending SVG doodles have the same visual quality.

## Image Model Configuration

Support configurable image providers instead of hard-coding one image model. If the user names `z-image`, GPT Image, Image2, Flux, Ideogram, Midjourney, Stable Diffusion, local ComfyUI, or another provider, record it in `content-ir.json` under `assets.imageGeneration.providerConfig` and use the available local integration.

Recommended project-level config file:

```json
{
  "imageProvider": {
    "name": "z-image",
    "mode": "command-or-api",
    "model": "user-selected",
    "apiBaseEnv": "Z_IMAGE_API_BASE",
    "apiKeyEnv": "Z_IMAGE_API_KEY",
    "commandTemplate": "z-image generate --prompt-file {promptFile} --output {outputPath}",
    "outputFormat": "png",
    "supportsAlpha": false,
    "supportsImageReference": true,
    "fallbackStrategy": "image-prompts-json"
  }
}
```

Rules:

1. Never write API keys into deck files, `content-ir.json`, or committed config. Reference environment variables only.
2. If a provider command/API is configured and callable, generate assets directly into `assets/backgrounds/`, `assets/spot/`, or `assets/decor/`.
3. If the provider is named but not callable in the current environment, generate `image-prompts.json` with paths and prompts so the user can run the provider externally.
4. Keep image prompts provider-neutral first, then add a short provider-specific adapter note only when needed.
5. Preserve the `assetStrategy`: `cinematic-images`, `png-components`, `svg-css-fallback`, or `hybrid`.

## Existing PPT and Template Modes

鲸格PPT can work from existing presentations or templates when the environment can read the files. Keep the user's requested preservation level explicit.

1. Existing PPT beautification, template-preserving: improve copy hierarchy, spacing, alignment, icon/PNG component placement, chart readability, notes, and image prompts while preserving the original master/theme/layout identity. Do not replace the template, page order, logo system, brand colors, or core layout unless the user explicitly allows it.
2. Existing template production: use a supplied `.pptx`, HTML deck, theme CSS, brand guide, or screenshots as the design source. Extract layout rules, typography, colors, component grammar, and safe zones, then create new slides that look native to that template.
3. HTML-first rebuild from PPT: when native PPT editing is unavailable, use the PPT/template as visual reference and create a browser-native HTML deck with matching style. Clearly state that this is a rebuild, not an in-place `.pptx` edit.
4. Native `.pptx` output: if a presentation-editing tool/plugin is available, edit or generate `.pptx` directly and render-check the result. If not, deliver HTML plus export prompts or a handoff plan.

鲸格PPT supports two input modes:

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

## Raster Decor Asset Pipeline

Some premium deck styles need bitmap assets instead of code-drawn approximations. Use generated or cutout raster images for complex visual objects such as translucent crystal rings, holographic shields, glass robots, 3D badges, magnifiers, product mockups, realistic devices, and glossy decorative ribbons.

This is semantic decoration, not a fixed shape library. Do not default to circles. First infer the meaning of the slide or card, then choose an asset form that reinforces that meaning.

Rules:

1. Do not force CSS/SVG to imitate complex 3D glass objects. If the object depends on refraction, translucent material, iridescent lighting, realistic bevels, or soft volumetric glow, create or reuse a PNG/WebP asset.
2. Use capability detection, not product-name detection. If the current environment has image generation and image understanding available, use AI-generated PNG/WebP components for these assets. This includes Codex, ChatGPT, Gemini, or any other product/model integration with comparable multimodal generation/inspection capability.
3. For transparent assets, prefer generating or exporting a PNG/WebP with alpha when the environment supports it. If only flat-background generation is available, use a removable chroma-key background, remove the key locally, and save the final alpha PNG into the deck's `assets/` folder.
4. If the current model/product cannot generate or inspect images, fall back to CSS/SVG/Canvas approximations. Keep the fallback simpler, label it as a fallback in implementation notes when useful, and preserve the same semantic placement. Do not present fallback SVG doodles as completed generated illustrations.
5. If the user supplies reference images, treat them as style/composition references or as cutout sources. Crop and matte them non-destructively into project-local assets such as `assets/decor-ring.png`, `assets/decor-shield.png`, or `assets/decor-robot.png`.
6. Record generated or extracted assets in `content-ir.json` under a compact `decorAssets` field when they materially shape the deck's look.
7. Insert decor assets semantically, not randomly. Examples:
   - `quality`, `audit`, `safety`, `risk control`, `compliance`: shield, checkmark badge, lock, magnifier.
   - `AI assistant`, `agent`, `automation`, `copilot`: glass robot, assistant cube, friendly bot head.
   - `flywheel`, `loop`, `iteration`, `ecosystem`: crystal ring, orbit, ribbon, looped band.
   - `market signal`, `data`, `code`, `inspection`: holographic magnifier, data card, scanner, code lens.
   - `launch`, `momentum`, `pipeline`, `growth`: aurora ribbon, rocket-like streak, flowing band.
   - `money`, `pricing`, `conversion`: coin stack, glowing token, paywall chip.
   - `global`, `localization`, `language`: globe, translation tile, multi-language badge.
8. Keep images as decorative unless they carry core meaning. Use empty `alt=""` for purely decorative assets.
9. Always keep assets local to the deck folder. Do not reference files left in provider output folders, Downloads, Desktop, `$CODEX_HOME/generated_images`, or temporary folders.
10. Validate generated/cutout assets on dark and light sections. Check for square edges, key-color fringes, muddy shadows, and unreadable overlap with text.
11. For a visual-led deck, use decor assets together with background and spot illustration planning. A few large decorative images are not enough if the user asked for viewpoint-driven small illustrations.

The preferred deck folder can therefore include:

```text
index.html
styles.css
deck.js
content-ir.json
assets/
  decor-ring.png
  decor-shield.png
  hero-device.png
```

## Editable Deck Contract

Every generated 鲸格PPT must be editable by default. The deck is still a static HTML presentation, but text and layout must be easy to change after generation.

Minimum requirements:

1. Use semantic HTML and stable class names. Avoid baking slide text into canvas, SVG paths, or raster images unless the user explicitly requests a flattened export.
2. Preserve `content-ir.json` as the editable source of truth for title, audience, slide roles, visible content, speaker notes, theme, assets, and feature flags.
3. Add `data-editable`, `data-field`, or clear semantic selectors to important text and repeated content blocks.
4. Add `data-layout`, `data-role`, or CSS custom properties for layout-sensitive regions so spacing, columns, card sizes, and decorative asset positions can be adjusted without rewriting the whole slide.
5. Include or implement an edit mode. The default runtime is `templates/runtime/edit-mode.js`. Use `E` to toggle editing, make editable text contenteditable, expose a small layout panel, persist draft edits to `localStorage`, and provide a JSON export of edits.
6. Keep presenter notes editable in source/IR even when hidden from the audience.
7. When exporting to PDF/PNG, export the current edited state when possible, but never destroy the original HTML or `content-ir.json`.
8. If the target product cannot run the edit runtime, still generate clean, readable HTML/CSS with obvious text nodes and layout variables.

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
    "editable": true,
    "typstHandout": false
  },
  "assets": {
    "imageGeneration": {
      "mode": "auto",
      "providerHint": "capability-detected",
      "preferRaster": true,
      "assetStrategy": "png-components",
      "svgPolicy": "SVG is only for diagrams, icons, wireframes, or fallback when image generation is unavailable."
    },
    "backgroundDecision": {
      "needed": false,
      "reason": "Dense strategy slides use semantic cards and local decor assets instead of full-scene backgrounds.",
      "assetPlan": []
    },
    "spotIllustrations": [],
    "firstThreeSlideTrial": {
      "required": false,
      "status": "not-needed",
      "notes": "Use required=true for visual-led decks before completing the full deck."
    }
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

## User Prompt Shortcuts

Users do not need to name a specific image model. Still, these prompt patterns help other agents understand the intended behavior:

```text
用鲸格PPT做一版电影质感PPT，自动使用当前产品可用的文生图/图像生成能力，不要用SVG冒充插图。先做前3页图文试样，每页配1张主视觉或2-4张小配图，图片围绕观点生成，统一风格，放在assets里。
```

```text
图文并茂：除封面和章节页外，不要让大图占半屏。优先批量生成围绕观点的小图片、小道具、小场景、小图标，尺寸控制在18%-32%页面宽度，和文字卡片配合。
```

```text
如果当前AI产品不能直接生成图片，请输出content-ir.json和image-prompts.json，标明每张图的用途、风格、比例、放置位置和备选SVG/布局占位。
```

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
- `nordic-childrens-picture-book`
- `电影质感`
- `碎纸片`
- `赛博朋克`

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

### 北欧儿童绘本风 Style Lock

For `nordic-childrens-picture-book`, use a stricter layout system:

- Start from `templates/full-decks/nordic-childrens-picture-book/`.
- Create a background/scene plan before HTML. Final decks must include local background image assets on visual/story slides, preferably generated bitmap illustrations or hand-authored SVGs under `assets/backgrounds/`. CSS-only scenery is a fallback, not the target.
- Use the built-in safe-zone layouts: `.layout-split`, `.layout-right`, `.layout-center`, `.layout-bottom`, `.content-panel`, `.storybook-chart`, `.memory-grid`.
- Never leave a slide with only a title and a large empty background. Add either a spot illustration, chart card, memory card group, quote card, or small annotation bubble.
- Keep the text and illustration separated: text panels occupy about 42-48% width, illustrations occupy the opposite side, and bottom cards stay above the controls.
- Use data charts as hand-drawn poster cards with thick borders and flat colors, not standard corporate charts.
- If using generated images, save them under `assets/backgrounds/` and keep the same palette: mint, mustard, cream paper, coral, sky blue, lilac, thick black outline.
- Before finalizing, check that headline, lead, cards, and illustrations do not overlap at desktop and mobile widths. Use a content panel or move the illustration instead of shrinking text into unreadability.

Important cleanup: when high-quality image generation is not available, do not compensate with many CSS doodles, overlapping props, or busy hand-drawn fragments. Use a sparse paper background, one or two large flat color bands, and a clear text card. Minimal and readable is better than cluttered.

Important update: CSS-only doodles are only a fallback for this style. For final user-facing `nordic-childrens-picture-book` decks, prefer generated or hand-authored background/spot illustration assets before writing HTML. Use CSS shapes only for wireframes, placeholders, or when the user explicitly wants no generated images. This style depends on rich scene assets; otherwise the deck will feel empty.

When the user asks for "北欧儿童绘本风", "北欧童话绘本风", "儿童绘本风", or similar nostalgic playful story decks, choose `templates/full-decks/nordic-childrens-picture-book/` first and keep its visual lock:

- Thick black hand-drawn outlines, usually 4px borders.
- Do not use 3D text, extruded text, heavy text-shadow, bevels, or pseudo-depth on headings; keep typography flat and clean.
- Flat color blocks, no realistic gradients or 3D rendering.
- Mint green and mustard yellow as the leading colors, with coral, sky blue, lilac, cream paper as accents.
- Simple 16:9 illustrated storybook frame, sparse background, very few doodle marks, slightly tilted cards only when they do not threaten readability.
- Tone should be light, humorous, childlike, and gently nostalgic rather than heavy or sentimental.



### 电影质感 / MediaPipe Gesture Deck

For `电影质感`, preserve the original gesture stack. The deck requires these script tags before `deck.js`:

- `https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js`
- `https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js`

Do not remove the camera/hand-tracking runtime when copying this deck. It is acceptable that this template depends on network access and browser camera permission for gesture navigation; keyboard navigation must remain as the fallback.

For cinematic narrative decks such as "王昭君", "古风人物", "电影海报感", or dramatic story scenes, lock the image language before scaling:

- Prefer generated raster images for character/scene atmosphere. SVG is only for seals, dividers, simple icons, or fallback placeholders.
- Cover and chapter slides may use a full-bleed scene with a dark wash and strict text safe zones.
- Body slides should usually use smaller scene fragments, props, facial details, fabric textures, route markers, or symbolic still lifes around the point instead of repeated half-screen posters.
- Keep all generated images in the same camera language, lighting, palette, costume/material logic, and grain level. Do not mix anime, stock-photo, vector, and 3D styles inside one deck unless the concept explicitly asks for collage.
- When the user references a successful sample, extract its visual grammar: strong cinematic background, restrained text, readable mask, elegant Chinese typography, and a consistent emotional temperature.

### 碎纸片 / Paper Craft Lab

For `碎纸片`, start from `templates/full-decks/碎纸片/`. Use it when the user asks for paper collage, paper fragments, creative technology pipelines, AI game production workflows, or GPT Image + Codex process decks.

Keep its local transparent paper assets under `assets/` and preserve the tactile paper-lab look: dark engineering board, cream paper cards, orange highlights, wireframe UI fragments, and modular workflow blocks.

### 赛博朋克 / Neon Noir City

For `赛博朋克`, start from `templates/full-decks/赛博朋克/` and pair it with `templates/themes/neon-noir-city.css`. Use it for cyberpunk, future city, 2098 lifestyle, neon-noir narrative, AI future life, or speculative technology decks.

Keep the local PNG component assets under `assets/components/` and template frames under `assets/template-frames/`. If reusing the style elsewhere, also consult `templates/themes/neon-noir-city.asset-kit.json`.

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
- 北欧童话/儿童绘本/怀旧幽默: `nordic-childrens-picture-book`
- 纸片拼贴/创意技术流程: `碎纸片`
- 赛博朋克/未来城市/2098生活方式: `neon-noir-city`

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
- If `assets.imageGeneration.mode != "off"`, confirm generated or collected assets exist at the paths referenced by `content-ir.json`.
- For visual-led decks, confirm `assets/backgrounds/`, `assets/spot/`, or `assets/decor/` exists when the IR says those assets are needed.
- Inspect the first three-slide visual trial when required. Confirm image style consistency, readable text, and no oversized spot illustrations.
- Confirm spot illustrations stay within their declared `maxSlideWidth` unless the slide role is `cover`, `section-divider`, or another explicit hero layout.
- Confirm SVG assets are used only for diagrams, icons, template frames, wireframes, or declared fallbacks.
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
- `templates/themes/nordic-childrens-picture-book.css`
- `templates/themes/史诗级.css`
- `templates/themes/neon-noir-city.css`
- `templates/themes/neon-noir-city.asset-kit.json`
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
- `templates/full-decks/nordic-childrens-picture-book/`
- `templates/full-decks/电影质感/`
- `templates/full-decks/碎纸片/`
- `templates/full-decks/赛博朋克/`
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
- `templates/runtime/edit-mode.js`
- `templates/features/gesture-controller.js`
- `templates/exporters/typst/README.md`
- `templates/exporters/html/README.md`
- `templates/exporters/pdf/README.md`
