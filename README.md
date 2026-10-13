# SketchUp Preview for Obsidian

一个本地只读的 Obsidian 社区插件：打开 SketchUp `.skp` 文件时，展示文件自带的缩略图。

## 特性

- 直接在 Obsidian 中打开 `.skp` 文件。
- 只读取 SKP 内嵌预览图，不上传模型、不转换格式、不写回源文件。
- 不加载完整几何体，适合做文件管理和快速辨认，内存占用远低于完整三维解析。
- 没有内嵌缩略图时给出明确提示，不伪造预览。

## 安装

1. 下载本仓库 Release 中的 `main.js`、`manifest.json` 和 `styles.css`。
2. 在 Obsidian 库中创建目录：`<你的库>/.obsidian/plugins/skp-preview/`。
3. 将上述三个文件放入该目录。
4. 重启 Obsidian，或在“设置 → 社区插件”中重载插件。
5. 启用 **SketchUp Preview**。

之后双击库内的 `.skp` 文件即可查看。

## 已知边界

本插件显示的是 SketchUp 文件已经保存的内嵌缩略图，不是完整的三维模型渲染器。若模型没有保存缩略图，插件无法凭空生成模型画面。

如需在 Obsidian 内旋转、缩放完整模型，建议在 SketchUp 中导出 `.glb` 或 `.gltf`，再用兼容的 3D 查看器打开。

## 开发

```powershell
npm install
npm run build
```

构建结果为 `main.js`。本项目使用 [cad-preview](https://github.com/cinderblock/cad-preview) 从 SKP 二进制文件中提取内嵌预览图。

## 许可

MIT。详见 [LICENSE](LICENSE)。
