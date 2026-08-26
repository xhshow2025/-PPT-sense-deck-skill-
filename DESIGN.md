# Sense Deck Default Editorial Design System

## 1. Atmosphere & Identity

The default Sense Deck should feel like a considered editorial report laid out on warm archival paper, with cinematic stills used as evidence rather than decoration. Its signature is the contrast between oversized Chinese serif headlines, disciplined micro-metadata, thin oxblood rules, and low-key film imagery arranged in a precise information grid. This system is the fallback when a user has not requested another visual direction; explicitly requested or scenario-matched bundled styles remain authoritative.

## 2. Color

### Palette

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--ecp-paper` | `#F1EEE4` | Main slide background |
| Canvas/deep | `--ecp-paper-deep` | `#E4DED0` | Secondary paper panels and mobile surround |
| Surface | `--ecp-surface` | `#F7F4EB` | Cards and diagram fields |
| Text/primary | `--ecp-ink` | `#141311` | Headlines and body copy |
| Text/secondary | `--ecp-ink-soft` | `#49443C` | Explanatory copy |
| Text/tertiary | `--ecp-muted` | `#746D61` | Captions and metadata |
| Rule/default | `--ecp-rule` | `#B8B0A1` | Dividers and frames |
| Rule/subtle | `--ecp-rule-soft` | `#D3CCBF` | Interior grid lines |
| Accent/primary | `--ecp-oxblood` | `#7A2F2B` | Numbers, bullets, short rules, focus |
| Accent/soft | `--ecp-oxblood-soft` | `#D8C1BA` | Quiet highlighted fields |
| Image/night | `--ecp-night` | `#171816` | Base behind real cinematic imagery and image captions |
| Image/night-soft | `--ecp-night-soft` | `#2B2B27` | Contact sheets and dark image groups |
| Image/text | `--ecp-photo-ink` | `#F3EEE4` | Captions over imagery |

### Rules

- Paper, ink, and oxblood carry the whole composition. Do not add unrelated brand colors in fallback mode.
- Oxblood is scarce: use it for one or two hierarchy signals per slide, not for large backgrounds.
- Cinematic imagery stays neutral-to-warm, low saturation, and low-key; it must preserve deep blacks and one motivated warm light source.
- Every color used by the default theme must resolve to a token in this table.

## 3. Typography

### Font Stacks

- Editorial serif: `"Songti SC", "STSong", "Source Han Serif SC", "Noto Serif CJK SC", serif`
- Metadata sans: `"Arial Narrow", "Helvetica Neue", "PingFang SC", sans-serif`

### Scale

| Level | Token | Size | Weight | Line height | Tracking | Usage |
|---|---|---:|---:|---:|---:|---|
| Display | `--ecp-type-display` | `clamp(72px, 7.4vw, 132px)` | 500 | 0.94 | -0.035em | Cover and thesis titles |
| H1 | `--ecp-type-h1` | `clamp(58px, 5.8vw, 104px)` | 500 | 0.98 | -0.025em | Slide conclusions |
| H2 | `--ecp-type-h2` | `clamp(34px, 3.2vw, 56px)` | 500 | 1.08 | -0.015em | Section titles |
| H3 | `--ecp-type-h3` | `clamp(22px, 1.8vw, 30px)` | 500 | 1.2 | 0 | Card titles |
| Lead | `--ecp-type-lead` | `clamp(22px, 2vw, 34px)` | 400 | 1.38 | 0 | Subtitle or argument |
| Body | `--ecp-type-body` | `clamp(16px, 1.15vw, 21px)` | 400 | 1.6 | 0 | Explanatory copy |
| Caption | `--ecp-type-caption` | `clamp(12px, 0.85vw, 15px)` | 500 | 1.45 | 0.02em | Captions and labels |
| Overline | `--ecp-type-overline` | `clamp(11px, 0.7vw, 13px)` | 600 | 1.2 | 0.16em | English metadata |

### Rules

- Chinese serif type owns titles, arguments, numbers, and quotes; metadata sans is reserved for small English labels and controls.
- Titles should wrap intentionally to one or two lines. Reduce the display token before allowing a third line.
- Use full-width Chinese punctuation and spoken, conclusion-led copy.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|---|---:|---|
| `--ecp-space-1` | 4px | Hairline offsets |
| `--ecp-space-2` | 8px | Tight label groups |
| `--ecp-space-3` | 12px | Caption rhythm |
| `--ecp-space-4` | 16px | Compact card padding |
| `--ecp-space-5` | 20px | Grid gutter |
| `--ecp-space-6` | 24px | Standard card padding |
| `--ecp-space-8` | 32px | Module spacing |
| `--ecp-space-10` | 40px | Section spacing |
| `--ecp-space-12` | 48px | Major separation |
| `--ecp-space-14` | 56px | Slide vertical safe area |
| `--ecp-space-16` | 64px | Slide horizontal safe area |
| `--ecp-space-20` | 80px | Cover whitespace |

### Grid

- Desktop slide: 16:9, 12 columns, 20px gutters, 64px horizontal safe area, 56px vertical safe area.
- Tablet: preserve the 16:9 stage and scale it to fit the viewport.
- Narrow/mobile preview: switch to a vertical reading flow at 900px; keep at least 20px side padding and place controls in normal flow above the active slide so they never cover content.
- Use asymmetric 5/7, 4/8, or 7/5 splits. Reserve symmetry for process comparisons or photo grids.

## 5. Components

### Editorial Page Frame

- **Structure**: `.slide` plus `.ecp-masthead`, `.ecp-page-no`, and `.ecp-corner` markers.
- **Spacing**: safe-area tokens and 20px gutters.
- **States**: active/inactive slide.
- **Accessibility**: page number is supplementary; slide title remains in the heading outline.
- **Motion**: opacity and 16px vertical translation only.

### Editorial Heading

- **Structure**: overline, H1/H2, short oxblood rule, lead.
- **Variants**: cover, standard, compact.
- **Spacing**: `--ecp-space-3`, `--ecp-space-5`, `--ecp-space-8`.
- **Accessibility**: maintain logical heading order and sufficient contrast.

### Numbered Fact Row

- **Structure**: two-digit number, title, one-line explanation, optional image/evidence cell.
- **Variants**: list, workflow, diagnosis.
- **Depth**: rules only; no cards or shadows.

### Cinematic Still

- **Structure**: `<figure>` with local `<img>` or `<picture>`, optional overlay caption, fixed aspect ratio.
- **Variants**: hero 16:9, strip 2.35:1, tile 4:3, contact sheet.
- **Imagery**: low-key light, neutral white balance, local warm practical, restrained saturation, clear subject/background hierarchy.
- **Capability routes**: use a generated local image when high-quality generation and inspection are callable; use a supplied local image when the user provides one; otherwise use an empty upload slot.
- **Upload slot**: warm surface, thin dashed rule, fixed aspect ratio, and one concise instruction covering subject, ratio, and crop direction. Never substitute CSS scenery, SVG pseudo-photography, generic generated art, or a broken remote image.
- **Accessibility**: meaningful images have concise alt text; decorative mood frames use empty alt text.

### Diagram Field

- **Structure**: square-corner panels, thin rules, oxblood nodes, arrows, compact labels.
- **Variants**: process, cycle, architecture, floor plan, timeline.
- **Depth**: borders-only.

### Quote Footer

- **Structure**: bracket corners, one decisive sentence, optional metadata line, circular system mark.
- **Spacing**: at least `--ecp-space-8` above and below.
- **Motion**: subtle fade only.

### Deck Controls

- **Structure**: previous, counter, next, speaker buttons.
- **States**: default, hover, active, focus-visible, disabled.
- **Accessibility**: real buttons with `aria-label`; keyboard and touch remain available.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|---|---:|---|---|
| Micro | 140ms | ease-out | Button feedback |
| Standard | 280ms | ease-in-out | Control state changes |
| Slide | 520ms | cubic-bezier(0.16, 1, 0.3, 1) | Slide and content entry |
| Stagger | 80ms increments | same as Slide | Rows, stills, diagram nodes |

- Animate only `transform`, `opacity`, and a short focus-color transition.
- Do not animate layout, background position, or continuous ambient effects in the default theme.
- Respect `prefers-reduced-motion` and reveal all content immediately when enabled.

## 7. Depth & Surface

The default theme uses a **borders-only** strategy. Paper fields are separated by thin rules and modest tonal shifts. There are no box shadows, glass blur, glossy gradients, pill cards, or large rounded containers. Photography supplies depth; the interface stays flat and editorial.
