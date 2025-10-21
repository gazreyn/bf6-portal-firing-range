/**
 * UI Registry for tracking and managing widget lifecycle
 */
export class UIRegistry {
  private widgets = new Map<string, mod.UIWidget>();

  add(name: string, widget: mod.UIWidget): void {
    this.widgets.set(name, widget);
  }

  get(name: string): mod.UIWidget | undefined {
    return this.widgets.get(name);
  }

  safeVisible(name: string, visible: boolean): void {
    const widget = this.widgets.get(name);
    if (widget) {
      mod.SetUIWidgetVisible(widget, visible);
    }
  }

  remove(name: string): void {
    const widget = this.widgets.get(name);
    if (widget) {
      mod.DeleteUIWidget(widget);
      this.widgets.delete(name);
    }
  }

  removeAll(): void {
    for (const [_name, widget] of this.widgets) {
      mod.DeleteUIWidget(widget);
    }
    this.widgets.clear();
  }

  has(name: string): boolean {
    return this.widgets.has(name);
  }

  size(): number {
    return this.widgets.size;
  }
}