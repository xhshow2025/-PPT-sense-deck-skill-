# 鲸格PPT 图像生成使用说明

这份说明用于避免两类常见问题：模型用 SVG 冒充插图，或者生成几张过大的图把版面挤乱。鲸格PPT现在默认按“能力检测”工作：当前 AI 产品只要有文生图/图像生成能力，就应该自动生成本地 PNG/WebP 资产，并写进 `content-ir.json`。

## SVG、CSS 和 PNG 组件怎么分工

它们不是同一种东西，但可以服务同一个版面位置。

- SVG/CSS/Canvas：代码生成的矢量或程序化资产，适合图标、结构图、流程图、HUD线框、印章、模板框、轻装饰和无图像模型的产品。它是正式 fallback，也适合信息密度高的主题。
- PNG/WebP 组件：图片资产，适合玻璃徽章、3D物件、机器人、设备、纸片、霓虹牌、道具、质感纹理、人物局部等高级视觉组件。它通常放在卡片、侧栏、角标或小场景里。
- 电影质感图片：适合人物、场景、文化叙事、品牌片、产品 hero、情绪强的封面和章节页。它是鲸格PPT的核心主打之一，但不是所有主题都必须走全屏电影图。

建议在 `content-ir.json` 的 `assets.imageGeneration.assetStrategy` 里明确选择：

- `cinematic-images`：电影质感、故事、人物、场景类 deck。
- `png-components`：多数商业、产品、策略、培训、技术分享 deck。
- `svg-css-fallback`：无图片模型环境，或本来就适合信息图/代码原生视觉。
- `hybrid`：少量主视觉 + PNG组件 + SVG/CSS信息图混合。

例子：同一个“风险控制”卡片，SVG fallback 可以是线框盾牌，PNG 组件可以是透明玻璃盾牌。语义位置一样，但视觉质感不是一回事。

## 最推荐的提示词

```text
用鲸格PPT做一版电影质感PPT，自动使用当前产品可用的文生图/图像生成能力，不要用SVG冒充插图。先做前3页图文试样，每页配1张主视觉或2-4张小配图，图片围绕观点生成，统一风格，放在assets里。
```

```text
图文并茂：除封面和章节页外，不要让大图占半屏。优先批量生成围绕观点的小图片、小道具、小场景、小图标，尺寸控制在18%-32%页面宽度，和文字卡片配合。文本保持可编辑。
```

```text
我想要类似“王昭君/电影感”的效果：先锁定前三页视觉语言，保持同一镜头、光线、色调、材质和情绪；正文页多用小场景、小道具、人物局部和象征物围绕观点，不要每页都做半屏大图。
```

## Codex / GPT-5.5 + 图像能力

- 不需要用户手动写具体模型名。说“自动使用可用文生图能力”即可。
- 生成的图片应保存到 deck 文件夹，例如 `assets/backgrounds/`、`assets/spot/`、`assets/decor/`。
- `content-ir.json` 里应记录 `assets.imageGeneration`、`assets.spotIllustrations`、`assets.firstThreeSlideTrial`。
- SVG 只用于图标、结构图、线框、印章、分隔符、模板框，不应作为最终插图替代品。

## Claude Code / OpenCode / 非 Codex 产品

鲸格PPT可以按“文件夹技能”方式兼容 Claude Code、OpenCode 和其他代码型 AI：把 `SKILL.md`、`templates/`、`docs/` 放到它们能读取的工作区，让 agent 按说明选择模板、生成 `content-ir.json`、写静态 HTML/CSS/JS。

差异主要在工具层：

- 有图片模型/插件：直接生成 PNG/WebP 到 `assets/`。
- 有命令行或 API 图片模型，例如 z-image：通过项目配置调用。
- 没有图片模型：输出 `image-prompts.json`，同时用 SVG/CSS 做信息图 fallback。

推荐配置：

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

不要把 API Key 写进 skill 或 deck 文件，只写环境变量名。

如果当前产品能生成图：

- 先生成图片，再写 HTML/CSS。
- 仍然保存或导出资产清单，保证 HTML 使用本地或可交付路径。
- 先做前三页视觉试样，再扩展到全 deck。

如果当前产品不能生成图：

- 输出 `image-prompts.json`，列出每张图的用途、提示词、比例、风格、放置位置、最大宽度。
- HTML 中可以使用清晰的 SVG/CSS fallback 做信息图、图标、结构框架和轻装饰，但不能假装已经完成真实电影图或 PNG 质感组件。
- 等用户或宿主产品生成图片后，再把路径填回 `content-ir.json` 和 HTML。

## 小图批量原则

- 10-15 页 deck 通常准备 6-12 张小图；前三页试样准备 2-4 张小图。
- 小图服务观点，不做随机装饰。
- 正文页小图通常控制在页面宽度 18%-32%，或放进卡片、右侧栏、底部条。
- 封面和章节页可以用大图，但必须保留标题安全区和暗色/浅色遮罩。
- 同一 deck 不混用写实、动漫、3D、扁平矢量等多套画风，除非用户明确要求拼贴感。

## 失败时的检查

- 如果输出只有 SVG：检查是否误判为“无图像生成能力”，或提示词是否没有写“不要用SVG冒充插图”。
- 如果图片太大：要求“除封面外，小图最大 28% 页面宽度，围绕观点放在卡片边角或右侧栏”。
- 如果画风乱：要求“前三页先锁视觉语言，后续沿用同一镜头、光线、色调、材质和情绪”。
- 如果 PPT 一塌糊涂：先让模型只做前三页试样并截图检查，再扩展全 deck。
