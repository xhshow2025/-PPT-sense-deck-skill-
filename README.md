<img width="1672" height="941" alt="ChatGPT Image 2026年5月7日 15_49_46" src="https://github.com/user-attachments/assets/d8efd376-4916-430a-9d41-6059554d1851" /><img width="1672" height="941" alt="image" src="https://github.com/user-attachments/assets/e0aa1e56-9fe5-47a9-b8a7-91ca06d71165" /># 鲸格PPT




鲸格PPT is a Codex skill for creating polished browser-native presentation decks from themes, source material, and reusable HTML/CSS/JS templates.

## What Is Included

- Template-first workflow via `templates/index.json`
- Full deck templates under `templates/full-decks/`
- Theme catalog under `templates/themes/`
- Single-page layouts under `templates/single-page-layouts/`
- Animation, runtime, edit-mode, gesture, and export helper files
- Image-first guidance for generated backgrounds, small spot illustrations, and first-three-slide visual trials in `docs/image-generation-guide.md`

## Image Generation

For visual-led decks, 鲸格PPT should automatically choose the right asset strategy: cinematic raster images for story/hero decks, PNG/WebP components for most premium business decks, and SVG/CSS/Canvas as a formal fallback or information-graphic path when no image model is available. See `docs/image-generation-guide.md` for prompt examples and non-Codex fallback modes.

## Visibility

This repository can be published as an open-source skill when the GitHub push succeeds.
