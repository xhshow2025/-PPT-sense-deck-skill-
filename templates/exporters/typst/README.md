# Typst Exporter

Typst is a sidecar exporter, not the main interactive PPT runtime.

Use Typst for:

- high-quality PDF handouts
- print-first lecture notes
- worksheets
- static executive briefs
- formula-heavy pages
- SVG/PNG assets for insertion into an HTML deck

Do not use Typst as the main runtime when the deck needs:

- gesture-controlled navigation
- presenter mode
- Canvas FX
- slide lifecycle animation
- browser-window synchronization
- interactive components

Recommended flow:

```text
content-ir.json -> Typst template -> PDF/SVG/PNG handout or asset
content-ir.json -> HTML runtime -> live presentation
```

If the user asks for "PPT", default to HTML runtime. If they ask for printable/exportable material, add Typst as an optional export path.
