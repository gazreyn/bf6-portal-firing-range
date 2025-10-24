import { s } from "../../lib/string-macro";
import { weaponCategoryNames, weaponAttachmentSlotNames } from "./weapons";
import { ParseUI } from "../../lib/ui";
import { type UIRegistry } from "../ui";
import { type WeaponCatalogState } from "./index";

export const LAYOUT = {
  Catalog: { width: 1200, height: 600, padding: 16 },
  Sidebar: { width: 250, button: { height: 50, textSize: 24, spacing: 4 } },
  Header: { height: 60, padding: 8, back: { size: 40 }, close: { size: 40 } },
  Grid: {
    item: { width: 250, height: 166, textWidth: 250, imagePaddingX: 16 },
    gap: { x: 16, y: 16 },
    pagePadding: 16,
  },
  Slots: {
    item: { width: 200, height: 50 },
    gap: { x: 16, y: 16 },
  },
  Attachments: {
    item: { width: 200, height: 50 },
    gap: { x: 16, y: 16 },
  },
} as const;

export const THEME = {
  colors: {
    surfaceBg: [0, 0, 0] as number[],
    elementBg: [0.05, 0.05, 0.05] as number[],
    textPrimary: [1, 1, 1] as number[],
    textAccent: [1, 0.98, 0.65] as number[],
  },
  alpha: {
    surface: 0.75,
    sidebar: 0.5,
    solid: 1.0,
  },
} as const;

export const IDS = {
  buttons: { 
    close: "__closeBtn", 
    back: "__backBtn", 
    categoryPrefix: "__categoryBtn_",
    slotPrefix: "attachmentSlot_",
    attachmentPrefix: "attachment_"
  },
  header: { 
    title: "__mainHeaderTitle" 
  },
} as const;

export const TEXT = {
  icons: { 
    close: s`X`, 
    back: s`<` 
  },
} as const;

// ID helper functions
export function idCategory(i: number): string { 
  return IDS.buttons.categoryPrefix + i; 
}

export function idWeapon(id: string): string { 
  return id; // weapon ids already unique
}

export function idSlot(slot: string): string { 
  return IDS.buttons.slotPrefix + slot; 
}

export function idAttachment(id: string): string { 
  return IDS.buttons.attachmentPrefix + id; 
}

/**
 * Header management functions
 */
export class HeaderManager {
  private registry: UIRegistry;
  private mainAreaWidth: number;

  constructor(registry: UIRegistry) {
    this.registry = registry;
    this.mainAreaWidth = LAYOUT.Catalog.width - LAYOUT.Sidebar.width;
  }

  /**
   * Create the header UI elements
   */
  createHeader(parent: mod.UIWidget, initialCategory: string): { 
    header: mod.UIWidget | undefined; 
    backButton: mod.UIWidget | undefined; 
    title: mod.UIWidget | undefined; 
  } {
    const header = ParseUI({
      type: "Container",
      parent: parent,
      size: [this.mainAreaWidth, LAYOUT.Header.height],
      position: [0, 0],
      anchor: mod.UIAnchor.TopLeft,
      bgFill: mod.UIBgFill.None,
      padding: LAYOUT.Header.padding,
      children: [
        {
          type: "Text",
          name: IDS.header.title,
          position: [0, 0],
          size: [(this.mainAreaWidth - LAYOUT.Header.padding * 2 - 40), (LAYOUT.Header.height - LAYOUT.Header.padding * 2)],
          anchor: mod.UIAnchor.CenterLeft,
          bgFill: mod.UIBgFill.None,
          textLabel: mod.Message(s`{}`, initialCategory),
          textSize: 24,
          textAnchor: mod.UIAnchor.CenterLeft,
          textColor: THEME.colors.textPrimary,
        },
        // Close Button
        {
          type: "Button",
          name: IDS.buttons.close,
          size: [LAYOUT.Header.close.size, LAYOUT.Header.close.size],
          anchor: mod.UIAnchor.CenterRight,
          bgFill: mod.UIBgFill.Solid,
          bgColor: [1, 0.3, 0.3],
          bgAlpha: 1,
        },
        {
          type: "Text",
          size: [LAYOUT.Header.close.size, LAYOUT.Header.close.size],
          anchor: mod.UIAnchor.CenterRight,
          bgFill: mod.UIBgFill.None,
          textLabel: mod.Message(TEXT.icons.close),
          textAnchor: mod.UIAnchor.Center,
          textSize: 36,
        }
      ]
    });

    if (header) {
      this.registry.add("header", header);
    }

    const backButton = ParseUI({
      type: "Container",
      parent: header,
      size: [LAYOUT.Header.back.size, LAYOUT.Header.back.size],
      anchor: mod.UIAnchor.CenterLeft,
      bgFill: mod.UIBgFill.None,
      visible: false,
      children: [
        {
          type: "Button",
          name: IDS.buttons.back,
          size: [LAYOUT.Header.back.size, LAYOUT.Header.back.size],
          anchor: mod.UIAnchor.TopLeft,
          bgFill: mod.UIBgFill.Solid,
          bgColor: THEME.colors.surfaceBg,
          bgAlpha: 1,
        },
        {
          type: "Text",
          size: [LAYOUT.Header.back.size, LAYOUT.Header.back.size],
          anchor: mod.UIAnchor.TopLeft,
          bgFill: mod.UIBgFill.None,
          textLabel: mod.Message(TEXT.icons.back),
          textAnchor: mod.UIAnchor.Center,
          textSize: 36,
        },
      ]
    });

    if (backButton) {
      this.registry.add("backButton", backButton);
    }

    const title = header ? mod.FindUIWidgetWithName(IDS.header.title, header) : undefined;
    if (title) {
      this.registry.add("headerTitle", title);
    }

    return { header, backButton, title };
  }

  /**
   * Update header based on current catalog state
   */
  updateHeader(state: WeaponCatalogState): void {
    const title = this.registry.get("headerTitle");
    if (!title) return;

    // Show back button only if not on weapon selection page
    this.showBackButton(state.pageState !== "weaponSelection");

    switch (state.pageState) {
      case "weaponSelection":
        const categoryName = weaponCategoryNames[state.weaponCategories[state.selectedCategoryIndex] as keyof typeof weaponCategoryNames];
        mod.SetUITextLabel(title, mod.Message(s`{}`, categoryName));
        break;
      case "attachmentSlotSelection":
        if (!state.selectedWeapon) return;
        mod.SetUITextLabel(title, mod.Message(s`{} / {}`, 
          weaponCategoryNames[state.selectedWeapon.category as keyof typeof weaponCategoryNames], 
          state.selectedWeapon.name));
        break;
      case "attachmentSelection":
        if (!state.selectedWeapon || !state.selectedAttachmentSlot) return;
        mod.SetUITextLabel(title, mod.Message(s`{} / {} / {}`, 
          weaponCategoryNames[state.selectedWeapon.category as keyof typeof weaponCategoryNames], 
          state.selectedWeapon.name, 
          weaponAttachmentSlotNames[state.selectedAttachmentSlot as keyof typeof weaponAttachmentSlotNames]));
        break;
    }
  }

  /**
   * Show or hide the back button and adjust title positioning
   */
  private showBackButton(show: boolean): void {
    const backButton = this.registry.get("backButton");
    const title = this.registry.get("headerTitle");
    
    if (!backButton || !title) return;

    const initialHeaderTitleWidth = this.mainAreaWidth - LAYOUT.Header.padding * 2 - LAYOUT.Header.back.size;
    const initialHeaderTitleHeight = LAYOUT.Header.height - LAYOUT.Header.padding * 2;

    if (show) {
      mod.SetUIWidgetVisible(backButton, true);
      mod.SetUIWidgetPosition(title, mod.CreateVector(LAYOUT.Header.back.size + LAYOUT.Header.padding, 0, 0));
      mod.SetUIWidgetSize(title, mod.CreateVector((initialHeaderTitleWidth - LAYOUT.Header.padding - LAYOUT.Header.back.size), (initialHeaderTitleHeight), 0));
    } else {
      mod.SetUIWidgetVisible(backButton, false);
      mod.SetUIWidgetPosition(title, mod.CreateVector(0, 0, 0));
      mod.SetUIWidgetSize(title, mod.CreateVector(initialHeaderTitleWidth, initialHeaderTitleHeight, 0));
    }
  }
}
