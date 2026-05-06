# 鲸格PPT

鲸格PPT is a Codex skill for creating polished browser-native presentation decks from themes, source material, and reusable HTML/CSS/JS templates.

## What Is Included

- Template-first workflow via `templates/index.json`
- Full deck templates under `templates/full-decks/`
- Theme catalog under `templates/themes/`
- Single-page layouts under `templates/single-page-layouts/`
- Animation, runtime, edit-mode, gesture, and export helper files
- Image-first guidance for generated backgrounds, small spot illustrations, and first-three-slide visual trials in `docs/image-generation-guide.md`

## Image Generation

For visual-led decks, 鲸格PPT should automatically use the current product's available image generation capability, save local PNG/WebP assets into the deck folder, and avoid using SVG as a substitute for requested illustrations. See `docs/image-generation-guide.md` for prompt examples and non-Codex fallback modes.

## Visibility

This repository can be published as an open-source skill when the GitHub push succeeds.
