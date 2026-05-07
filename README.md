# 鲸格PPT
<img width="1672" height="941" alt="ChatGPT Image 2026年5月7日 15_49_46" src="https://github.com/user-attachments/assets/863060de-f22d-4e00-b669-3e38e1602bc6" />

鲸格PPT 是一个用于生成高质量浏览器原生演示文稿的 Codex Skill。它以静态 HTML/CSS/JS 为主要产物，通过内容 IR、主题系统、完整 Deck 模板、单页布局、动画运行时、演讲者模式、可编辑模式、手势控制和导出辅助，帮助 AI 从一个主题、资料、文章、PPT 模板或业务需求出发，生成可演示、可修改、可部署的 PPT/Slides/Keynote 风格作品。

这个仓库是完整版 Skill，包含完整模板库和重素材示例，适合本地使用、二次开发、发布为开源 Skill，或作为轻量版/20MB 导入版的上游资源。

## 核心能力

- 从短主题或长资料生成结构完整的演示文稿。
- 使用 `content-ir.json` 作为内容、结构、资产和功能开关的中间表示。
- 先选模板、再填内容，避免从空白 CSS 重造 PPT。
- 支持商务汇报、技术分享、融资路演、市场研究、课程培训、小红书九宫格、短剧出海、产品发布、品牌叙事、电影质感、赛博朋克、纸片拼贴、北欧绘本等场景。
- 支持静态 HTML Deck、演讲者模式、键盘/触摸导航、可编辑模式、Canvas FX、可选手势翻页。
- 支持图文并茂工作流，包括电影级背景图、PNG/WebP 组件、小配图批量生成、SVG/CSS/Canvas 回退。
- 支持 HTML、PDF、Typst handout 等导出辅助。

## 适用场景

当用户提出以下需求时，适合使用鲸格PPT：

- 做一份 PPT、slides、演示稿、汇报材料、keynote 风格页面。
- 根据一个主题自动研究、梳理观点并生成成套演示。
- 把文章、会议记录、产品资料、行业报告或碎片笔记变成 PPT。
- 美化或重建已有 PPT/模板。
- 生成浏览器可运行的 HTML PPT。
- 需要电影质感、图文并茂、品牌感、故事感、绘本风、赛博朋克、纸片拼贴等强视觉风格。
- 需要演讲者备注、动画、导出、可编辑 HTML 或手势控制。

## 工作流总览

鲸格PPT 遵循“先理解、再选模板、最后生成”的流程：

1. 读取 `templates/index.json`。
2. 检测当前环境能力：文件写入、浏览器预览、图片生成、图片理解、透明图/抠图、导出能力等。
3. 根据用户输入生成或更新 `content-ir.json`。
4. 读取相关目录：
   - `templates/full-decks/deck-catalog.json`
   - `templates/themes/theme-catalog.json`
   - `templates/single-page-layouts/layout-catalog.json`
   - `templates/animations/animation-catalog.json`
5. 选择最接近的完整 Deck 模板。
6. 选择合适主题和单页布局。
7. 如需视觉资产，先生成或收集图片，再写 HTML。
8. 写出静态 Deck：`index.html`、`styles.css`、`deck.js`、`content-ir.json`。
9. 接入演讲者模式、编辑模式、动画生命周期、可选手势控制。
10. 通过本地 HTTP 服务预览并验证导航、响应式、控制台、素材路径和导出路径。

```

## 主要目录说明

### `SKILL.md`

Skill 的核心执行说明。Codex 根据 frontmatter 的 `name` 和 `description` 判断何时触发，触发后读取正文中的工作流、模板选择规则、图片策略、验证要求和特殊风格约束。

### `templates/index.json`

模板库入口文件。它指向主题、完整 Deck、单页布局、动画、schema、runtime、features 和 exporters，是生成任何 Deck 前应优先读取的索引。

### `templates/content-ir/`

内容 IR 示例。鲸格PPT 不直接从原始文本跳到 HTML，而是先把主题、受众、风格、功能开关、素材计划、幻灯片角色、可见内容和演讲者备注写入 `content-ir.json`。

### `templates/schemas/`

IR 和模板元数据 schema。复杂任务建议使用 schema 校验，确保生成的内容结构可被 HTML、导出器和后续编辑流程复用。

### `templates/themes/`

主题 CSS 和主题目录。主题主要负责色彩、字体、排版节奏、卡片系统、背景语言和组件质感。

### `templates/full-decks/`

完整可运行 Deck 模板。用户需求匹配某个典型场景时，应优先复制最接近的完整 Deck，再替换内容，而不是从零搭结构。

### `templates/single-page-layouts/`

单页布局库。用于补齐完整 Deck 不覆盖的长尾页面，例如 agenda、timeline、KPI dashboard、architecture、quote、code、risk board 等。

### `templates/animations/`

CSS 动画与 Canvas FX。动画必须跟随 slide lifecycle，进入页面时启动，离开页面时停止，不能全局无休止运行。

### `templates/runtime/`

HTML Deck 的运行时辅助，包括 slide lifecycle、Canvas FX runtime、编辑模式。

### `templates/features/`

可选功能，例如手势控制。手势能力必须是可选项，不能成为基础导航的硬依赖。

### `templates/exporters/`

导出辅助说明，覆盖 HTML、PDF、Typst 等路径。

## 内置主题

完整版当前包含以下主题：

- `apple-bento-glass`：AI、产品策略、新品类、精品商业 Deck。
- `executive-clean`：董事会、战略汇报、投资人更新、周报。
- `semantic-dark`：技术分享、架构讲解、AI 系统、开发者演示。
- `xhs-editorial`：小红书图文、社交媒体 carousel、消费教育内容。
- `cyber-neon`：Demo Day、产品展示、RGB 硬件、赛博发布会。
- `warm-paper`：课程、讲义、故事、文化主题。
- `nordic-childrens-picture-book`：北欧儿童绘本风、怀旧幽默故事。
- `史诗级`：历史文化叙事、昭君出塞、国风电影感展示。
- `neon-noir-city`：赛博朋克城市、AI 未来生活、2098 叙事。

主题选择建议：

- AI / 产品 / 策略 / 新品类：`apple-bento-glass`
- 投资人 / 管理层 / 董事会：`executive-clean`
- 技术分享 / 架构图 / 系统解释：`semantic-dark`
- 小红书图文 / 社交传播：`xhs-editorial`
- 北欧童话 / 绘本 / 怀旧幽默：`nordic-childrens-picture-book`
- 纸片拼贴 / 创意技术流程：`碎纸片`
- 赛博朋克 / 未来城市 / 2098 生活方式：`neon-noir-city`
- 电影海报感 / 历史人物故事 / 国风叙事：`电影质感`

## 完整 Deck 模板

完整版包含 19 类主线 Deck：

- `pitch-deck`：融资路演、商业 pitch。
- `weekly-report`：周报、业务复盘、项目进展。
- `xhs-9-card`：小红书九宫格、社交 carousel。
- `product-launch`：新品发布、功能发布。
- `technical-talk`：技术分享、架构演讲。
- `courseware`：课程、培训、讲义。
- `executive-strategy`：管理层战略汇报。
- `market-research`：市场研究、行业分析。
- `ai-industry-report`：AI 行业报告、趋势研究。
- `startup-roadshow`：创业展示、Demo Day。
- `sales-proposal`：销售方案、客户提案。
- `training-workshop`：内部培训、工作坊。
- `demo-day`：产品 Demo、硬件发布、RGB 键盘展示。
- `brand-story`：品牌故事、品牌 campaign。
- `ai-short-drama-overseas`：AI 短剧出海、内容生产、市场策略。
- `nordic-childrens-picture-book`：北欧童话绘本风 PPT。
- `电影质感`：电影感、昭君出塞、历史文化叙事、MediaPipe 手势 Deck。
- `碎纸片`：纸片拼贴、paper craft lab、AI 游戏生产线。
- `赛博朋克`：赛博朋克、未来城市、2098 生活方式。

## 单页布局

单页布局用于补充完整 Deck，包括：

- `cover-bento-glass`
- `agenda`
- `section-divider`
- `comparison-2col`
- `comparison-3col`
- `timeline`
- `kpi-dashboard`
- `quote`
- `code`
- `architecture`
- `qa`
- `thanks`
- `risk-board`
- `market-signal`
- `semantic-compare`
- `ai-production-loop`
- `roadmap-90-day`

`layout-catalog.json` 中还保留一些 planned 布局语义，后续可继续扩展。

## 动画与 Canvas FX

动画分两类：

- CSS animations：适合文字入场、卡片 stagger、柔和缩放、线条绘制、指标 count-up、渐变移动等。
- Canvas FX：适合 particles、matrix rain、fluid waves、network nodes、data stream、waveform 等程序化背景。

生命周期规则：

- Reveal.js Deck 监听 `Reveal.on("slidechanged", ...)`。
- 内置 runtime 派发和监听 `deck:slidechange`。
- Canvas FX 必须提供 `start()` 和 `stop()`。
- 动画只在当前 slide 激活时运行。

## 图片与视觉资产策略

鲸格PPT 对视觉资产采用分层策略：

1. `cinematic-images`：电影级背景、人物场景、文化叙事、品牌大片、情绪型 Deck。
2. `png-components`：商务、产品、策略、培训、科技类 Deck 中的透明 PNG/WebP 组件，例如玻璃盾牌、机器人、徽章、设备、数据卡片、纸片、霓虹招牌等。
3. `svg-css-fallback`：没有图片生成能力时，用于图表、图标、线框、结构图和正式回退。
4. `hybrid`：少量主视觉图片 + SVG/CSS 图解 + PNG 组件混合。

重要原则：

- 用户要求图文并茂、插图、电影质感、绘本、产品视觉、品牌感、海报感时，若环境支持图片生成，应主动使用真实图片生成能力。
- SVG 不应冒充用户明确要求的插图。SVG 适合图标、图解、线框和 fallback。
- 所有生成或收集的素材应放到 Deck 输出目录，例如 `assets/backgrounds/`、`assets/spot/`、`assets/decor/`。
- Deck 中引用本地相对路径，不依赖临时目录、桌面、下载目录或远程热链。

## Spot Illustration Pipeline

对于图文并茂但不是每页都需要海报大图的 Deck，推荐批量生成小配图：

- 10-15 页 Deck 默认生成 6-12 个小 PNG/WebP。
- 前三页试样默认生成 2-4 个小配图。
- 小配图应对应观点、卡片、关键词、机制或用户声音。
- 非封面/章节页的小配图通常占 slide 宽度的 18%-32%。
- 统一艺术方向，避免把无关装饰散落到页面上。
- 在 `content-ir.json` 的 `assets.spotIllustrations` 中记录用途、路径、风格、放置位置和尺寸限制。

## 前三页视觉试样

视觉重的 Deck 应先锁定前三页：

1. 生成封面和后两页的图片 brief。
2. 生成或收集主视觉和 2-4 个小配图。
3. 放入真实布局中检查。
4. 确认文字可读、图片不过大、风格统一。
5. 在 `content-ir.json` 的 `assets.firstThreeSlideTrial` 中记录结果。
6. 通过后再扩展全 Deck。

## 可编辑 Deck 契约

生成的 Deck 默认应可编辑：

- 文本不要烘焙进 Canvas、SVG path 或图片。
- `content-ir.json` 是可编辑源头。
- 重要文本和重复内容块使用 `data-editable`、`data-field` 或清晰语义选择器。
- 布局区域使用 `data-layout`、`data-role` 或 CSS custom properties。
- 默认可接入 `templates/runtime/edit-mode.js`。
- `E` 切换编辑模式，`S` 切换演讲者模式。
- 导出 PDF/PNG 时尽量导出当前编辑状态，但不破坏原 HTML 和 IR。

## 演讲者模式

严肃演讲 Deck 应包含：

- 当前页标题。
- 下一页标题。
- 演讲者备注。
- 计时器。

备注放在 `<aside class="notes">`，不应出现在观众视图中。

## 手势控制

手势控制是可选能力，不是硬依赖：

- feature flag：`off`、`motion-lite`、`mediapipe-hand`
- 默认 `off`
- `G` 切换手势模式
- 只有用户开启时才请求摄像头权限
- 视频帧应在浏览器本地处理，不上传
- 键盘和触摸导航必须始终可用

`电影质感` 模板包含 MediaPipe 手势依赖：

```html
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
```

复制该模板时不要移除手势栈，但必须保留键盘导航作为 fallback。

## 输入模式

### 短主题模式

当用户只给一句主题，例如“做一份 AI短剧出海风起时 PPT”，不要把它当作足够内容。应先推断受众和场景，必要时搜索当前资料，提炼论点、市场信号、矛盾、机会、风险和推荐结构，再生成 `content-ir.json`。

### 源材料模式

当用户提供文章、笔记、资料、表格或文档时，以用户材料为主，只在事实具有时效性或不稳定时进行核验。

### 已有 PPT / 模板模式

当用户提供 `.pptx`、HTML Deck、品牌规范或截图时，应明确保留级别：

- 模板保留美化：保留母版、品牌、顺序和核心布局，只优化层级、间距、图标、图表、备注和素材。
- 模板生产：抽取布局、字体、颜色、组件语法和安全区，生成新页面。
- HTML-first rebuild：无法原生编辑 PPT 时，以 PPT 为视觉参考重建 HTML Deck。
- Native `.pptx` 输出：如果有可用 PPT 工具，直接编辑或生成 PPTX 并渲染检查。



## 验证清单

交付前建议检查：

- `node --check deck.js`
- 通过本地 HTTP 服务打开，而不是只双击文件。
- 测试上一页/下一页导航。
- 测试 `S` 演讲者模式。
- 测试移动端或窄视口，确认文字不溢出。
- 控制台无错误。
- `content-ir.json` 中引用的图片真实存在。
- 图文 Deck 的 `assets/backgrounds/`、`assets/spot/` 或 `assets/decor/` 符合 IR 记录。
- 前三页视觉试样通过可读性、尺寸和风格一致性检查。
- 小配图不超过声明的 `maxSlideWidth`，除非是封面或章节页。
- SVG 只用于图表、图标、线框、模板框架或明确 fallback。
- 开启手势时，摄像头权限只在用户切换后请求。
- 如需 Typst/PDF，单独生成并检查导出结果。

## 特殊风格约束

### 北欧儿童绘本风

- 优先使用 `templates/full-decks/nordic-childrens-picture-book/`。
- 需要厚黑手绘线、薄荷绿、芥末黄、奶油纸、珊瑚、天蓝、淡紫等色彩。
- 不使用 3D 字、挤压字、厚重阴影或写实渐变。
- 文本与插图要分区，避免重叠。
- CSS doodle 只是 fallback，最终用户 Deck 应优先使用生成或手绘背景/小插图。

### 电影质感

- 优先使用 `templates/full-decks/电影质感/`。
- 适合历史人物、国风文化、电影海报感、戏剧性故事。
- 需要统一镜头语言、光照、服化道、颗粒感和色彩温度。
- 封面/章节页可用 full-bleed 主视觉，正文页更适合小场景、道具、纹理、路线标记或象征物。

### 碎纸片

- 优先使用 `templates/full-decks/碎纸片/`。
- 适合纸片拼贴、paper craft lab、AI 游戏生产线、创意技术流程。
- 保留透明纸片资产、深色工程板、奶油纸卡、橙色高亮和模块化流程块。

### 赛博朋克

- 优先使用 `templates/full-decks/赛博朋克/`。
- 搭配 `templates/themes/neon-noir-city.css`。
- 适合未来城市、AI 未来生活、2098 叙事、霓虹 noir。
- 保留 `assets/components/` 和 `assets/template-frames/`。


## 维护建议

- 新增主题时，同步更新 `templates/themes/theme-catalog.json`。
- 新增完整 Deck 时，同步更新 `templates/full-decks/deck-catalog.json`，并确保示例可运行。
- 新增单页布局时，同步更新 `templates/single-page-layouts/layout-catalog.json`，HTML 内应保留真实示例内容。
- 新增动画时，同步更新 `templates/animations/animation-catalog.json`，并确认生命周期可控。
- 修改 IR 字段时，同步更新 `templates/schemas/content-ir.schema.json` 和 `templates/content-ir/content-ir.example.json`。
- 视觉资产应放在对应模板或生成 Deck 的 `assets/` 目录下，不要引用临时目录。
- 发布前检查 README、SKILL.md、catalog 和实际文件是否一致。

