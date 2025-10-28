/**
 * UI Registry for tracking and managing widget lifecycle
 */
export class UIRegistry {
  private _widgets = new Map<string, mod.UIWidget>();

  add(name: string, widget: mod.UIWidget): void {
    this._widgets.set(name, widget);
  }

  get(name: string): mod.UIWidget | undefined {
    return this._widgets.get(name);
  }

  safeVisible(name: string, visible: boolean): void {
    const widget = this._widgets.get(name);
    if (widget) {
      mod.SetUIWidgetVisible(widget, visible);
    }
  }

  remove(name: string): void {
    const widget = this._widgets.get(name);
    if (widget) {
      mod.DeleteUIWidget(widget);
      this._widgets.delete(name);
    }
  }

  removeAll(): void {
    for (const [_name, widget] of this._widgets) {
      mod.DeleteUIWidget(widget);
    }
    this._widgets.clear();
  }

  has(name: string): boolean {
    return this._widgets.has(name);
  }

  size(): number {
    return this._widgets.size;
  }
}