import { FileView, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { extractPreview } from "cad-preview";

const VIEW_TYPE = "skp-preview";

class SketchUpPreviewView extends FileView {
  private objectUrl: string | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.file?.basename ?? "SketchUp Preview";
  }

  async onLoadFile(file: TFile): Promise<void> {
    await super.onLoadFile(file);
    await this.renderPreview(file);
  }

  async onUnloadFile(file: TFile): Promise<void> {
    this.releaseObjectUrl();
    await super.onUnloadFile(file);
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

  private async renderPreview(file: TFile): Promise<void> {
    this.releaseObjectUrl();
    const root = this.contentEl;
    root.empty();
    root.addClass("skp-preview-view");

    const header = root.createDiv({ cls: "skp-preview-header" });
    header.createEl("strong", { text: file.name });
    header.createSpan({ text: ` · ${(file.stat.size / 1024).toFixed(1)} KB` });

    try {
      const data = new Uint8Array(await this.app.vault.readBinary(file));
      const preview = extractPreview(data, { filename: file.name });
      if (!preview) {
        root.createEl("p", {
          cls: "skp-preview-message",
          text: "此 SKP 文件没有可读取的内嵌缩略图。可在 SketchUp 中保存缩略图，或另附一张 PNG/JPG 预览图。",
        });
        return;
      }

      this.objectUrl = URL.createObjectURL(new Blob([preview.data], { type: `image/${preview.format}` }));
      const image = root.createEl("img", { cls: "skp-preview-image" });
      image.src = this.objectUrl;
      image.alt = `${file.basename} 的 SketchUp 内嵌预览`;
      root.createEl("p", {
        cls: "skp-preview-note",
        text: "只读预览：显示 SKP 文件自带缩略图，不上传、不转换、不修改源文件。",
      });
    } catch (error) {
      console.error("SketchUp Preview failed", error);
      root.createEl("p", {
        cls: "skp-preview-message",
        text: "无法读取该 SKP 文件的内嵌缩略图。文件可能损坏或版本暂不兼容。",
      });
    }
  }
}

export default class SketchUpPreviewPlugin extends Plugin {
  async onload(): Promise<void> {
    this.registerView(VIEW_TYPE, (leaf) => new SketchUpPreviewView(leaf));
    this.registerExtensions(["skp"], VIEW_TYPE);
  }
}
