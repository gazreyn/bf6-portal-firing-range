import type { PlayerState } from "../player";
import { ParseUI } from "../../lib/ui";
import { getWeaponById, getWeaponsByCategory, weaponCategories, weaponCategoryNames, weaponAttachmentSlotNames, type WeaponDefinition, getAvailableAttachmentSlots, getWeaponAttachmentsBySlot, getWeaponAttachment } from "./weapons";
import { type WeaponAttachmentSlot } from "./attachments";
import { LAYOUT, THEME, IDS, idCategory, idSlot, idAttachment, HeaderManager } from "./weapon-catalog.view";
import { UIRegistry } from "../ui";

export interface WeaponCatalogState {
  pageState: "weaponSelection" | "attachmentSlotSelection" | "attachmentSelection";
  selectedCategoryIndex: number;
  selectedWeapon: { category: string; name: string; id: string } | null;
  selectedAttachmentSlot: WeaponAttachmentSlot | null;
  weaponCategories: typeof weaponCategories;
}

export class WeaponCatalog {
    #playerState: PlayerState;
    #isOpen: boolean = false;
    public state: WeaponCatalogState = {
        pageState: "weaponSelection",
        selectedCategoryIndex: 0,
        selectedWeapon: null,
        selectedAttachmentSlot: null,
        weaponCategories: weaponCategories
    };
    #selectedAttachments: { [slot in WeaponAttachmentSlot]?: mod.WeaponAttachments } = {};

    // UI Registry for tracking widgets
    #uiRegistry: UIRegistry = new UIRegistry();

    // Main Header Area
    #headerManager: HeaderManager = new HeaderManager(this.#uiRegistry);

    // UI Related Properties
    #uiCatalog: mod.UIWidget | undefined;
    #uiCatalogSidebar: mod.UIWidget | undefined;
    #uiMainCatalogArea: mod.UIWidget | undefined;

    // Pages
    #catalogWeaponCategoryPages: mod.UIWidget[] = [];
    #catalogAttachmentSlotSelectionPage: mod.UIWidget | undefined;
    #catalogAttachmentSelectionPage: mod.UIWidget | undefined;

    // Sidebar Area
    #catalogSidebarButtons: mod.UIWidget[] = [];

    #uiMainCatalogAreaHeaderBackButton: mod.UIWidget | undefined;
    #uiMainCatalogAreaHeader: mod.UIWidget | undefined;
    #uiMainCatalogAreaHeaderTitle: mod.UIWidget | undefined;

    // Weapon Items Layout
    #weaponButtons: { [key: string]: { widget: mod.UIWidget, weapon: WeaponDefinition } } = {};

    constructor(player: PlayerState) {
        this.#playerState = player;

        this.#createUI();
    }

    #createUI() {
        this.#uiCatalog = ParseUI({
            type: "Container",
            size: [LAYOUT.Catalog.width, LAYOUT.Catalog.height],
            position: [0, 0],
            anchor: mod.UIAnchor.Center,
            bgFill: mod.UIBgFill.Solid,
            bgColor: THEME.colors.surfaceBg,
            bgAlpha: THEME.alpha.surface,
            depth: mod.UIDepth.AboveGameUI,
            playerId: this.#playerState.player,
            visible: false
        });

        if (this.#uiCatalog) {
            this.#uiRegistry.add("catalog", this.#uiCatalog);
        }

        this.#createUISidebar();
        this.#createUIMainCatalogArea();
    }

    #createUISidebar() {
        // Sidebar Container
        this.#uiCatalogSidebar = ParseUI({
            type: "Container",
            parent: this.#uiCatalog,
            size: [LAYOUT.Sidebar.width, LAYOUT.Catalog.height],
            position: [0, 0],
            anchor: mod.UIAnchor.TopLeft,
            bgFill: mod.UIBgFill.Solid,
            bgColor: THEME.colors.surfaceBg,
            bgAlpha: THEME.alpha.sidebar,
        });

        if (this.#uiCatalogSidebar) {
            this.#uiRegistry.add("sidebar", this.#uiCatalogSidebar);
        }

        // Sidebar Buttons
        this.state.weaponCategories.forEach((category, index) => {
            let buttonYPos = (LAYOUT.Sidebar.button.spacing + index * (LAYOUT.Sidebar.button.height + LAYOUT.Sidebar.button.spacing)) - LAYOUT.Sidebar.button.spacing;
            let buttonPosition = [0, buttonYPos];
            const button = ParseUI({
                type: "Button",
                name: idCategory(index),
                parent: this.#uiCatalogSidebar,
                size: [LAYOUT.Sidebar.width, LAYOUT.Sidebar.button.height],
                bgFill: mod.UIBgFill.GradientLeft,
                bgColor: THEME.colors.surfaceBg,
                bgAlpha: 1,
                position: buttonPosition,
                anchor: mod.UIAnchor.TopLeft,
            });

            if (button) {
                this.#uiRegistry.add(`categoryButton_${index}`, button);
            }

            const buttonText = ParseUI({
                type: "Text",
                parent: this.#uiCatalogSidebar,
                position: buttonPosition,
                padding: 16,
                size: [LAYOUT.Sidebar.width, LAYOUT.Sidebar.button.height],
                textLabel: mod.Message(weaponCategoryNames[category as keyof typeof weaponCategoryNames]),
                textSize: LAYOUT.Sidebar.button.textSize,
                textAnchor: mod.UIAnchor.CenterLeft,
                textColor: index === 0 ? THEME.colors.textAccent : THEME.colors.textPrimary
            });

            if (!buttonText) return;
            this.#catalogSidebarButtons.push(buttonText);
            this.#uiRegistry.add(`categoryButtonText_${index}`, buttonText);
        });
    }

    #createUIMainCatalogArea() {
        this.#uiMainCatalogArea = ParseUI({
            type: "Container",
            parent: this.#uiCatalog,
            size: [LAYOUT.Catalog.width - LAYOUT.Sidebar.width, LAYOUT.Catalog.height],
            position: [LAYOUT.Sidebar.width, 0],
            anchor: mod.UIAnchor.TopLeft,
            bgFill: mod.UIBgFill.Solid,
            bgColor: THEME.colors.surfaceBg,
            bgAlpha: 0,
        });

        if (this.#uiMainCatalogArea) {
            this.#uiRegistry.add("mainArea", this.#uiMainCatalogArea);
        }

        this.#createUIMainHeader();
        this.#createCategoryPages(this.state.weaponCategories);
    }

    #createUIMainHeader() {
        if (!this.#uiMainCatalogArea) return; // Can't add the header if there's no main area

        const initialCategory = weaponCategoryNames[this.state.weaponCategories[0] as keyof typeof weaponCategoryNames];
        const { header, backButton, title } = this.#headerManager.createHeader(this.#uiMainCatalogArea, initialCategory);
        
        this.#uiMainCatalogAreaHeader = header;
        this.#uiMainCatalogAreaHeaderBackButton = backButton;
        this.#uiMainCatalogAreaHeaderTitle = title;
    }

    #createCategoryPages(categories: typeof weaponCategories) {
        const pageWidth = LAYOUT.Catalog.width - LAYOUT.Sidebar.width;
        const pageHeight = LAYOUT.Catalog.height - LAYOUT.Header.height;

        categories.forEach((category, index) => {
            const categoryPage = ParseUI({
                type: "Container",
                parent: this.#uiMainCatalogArea,
                padding: LAYOUT.Grid.pagePadding,
                visible: index === 0,
                size: [pageWidth, pageHeight],
                position: [0, LAYOUT.Header.height],
                anchor: mod.UIAnchor.TopLeft,
                bgFill: mod.UIBgFill.None // Set to None, this is just to help visualize the area during development
            });

            if (!categoryPage) return;
            this.#catalogWeaponCategoryPages.push(categoryPage);
            this.#uiRegistry.add(`categoryPage_${index}`, categoryPage);

            // Create category-specific UI elements here (e.g., weapon list)
            const weapons = getWeaponsByCategory(category);
            this.#addWeaponsToPage(index, weapons);
        });
    }

    #addWeaponsToPage(pageIndex: number, weapons: WeaponDefinition[]) {
        const weaponsPerRow = this.#calculateItemsPerRow(LAYOUT.Grid.item.width, LAYOUT.Grid.gap.x);

        weapons.forEach((weapon, index) => {

            const xColNum = Math.floor(index % weaponsPerRow);
            const yRowNum = Math.floor(index / weaponsPerRow);
            const x = xColNum * (LAYOUT.Grid.item.width + LAYOUT.Grid.gap.x);
            const y = yRowNum * (LAYOUT.Grid.item.height + LAYOUT.Grid.gap.y);
            const itemPos = [x, y];

            const widget = ParseUI({
                type: "Container",
                parent: this.#catalogWeaponCategoryPages[pageIndex],
                position: itemPos,
                size: [LAYOUT.Grid.item.width, LAYOUT.Grid.item.height],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: weapon.id,
                        size: [LAYOUT.Grid.item.width, LAYOUT.Grid.item.height],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: THEME.colors.elementBg,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [LAYOUT.Grid.item.textWidth, 100],
                        anchor: mod.UIAnchor.BottomCenter,
                        position: [0, 8],
                        bgFill: mod.UIBgFill.None,
                        textLabel: weapon.name,
                        textAnchor: mod.UIAnchor.BottomCenter,
                        textSize: 20
                    }
                ]
            });

            if (!widget) return;

            this.#uiRegistry.add(`weaponTile_${weapon.id}`, widget);

            mod.AddUIWeaponImage(
                weapon.name,
                mod.CreateVector(LAYOUT.Grid.item.imagePaddingX, 0, 0),
                mod.CreateVector(LAYOUT.Grid.item.width - (LAYOUT.Grid.item.imagePaddingX * 2), LAYOUT.Grid.item.height, 1),
                mod.UIAnchor.TopLeft,
                weapon.weapon,
                widget
            );
            this.#weaponButtons[weapon.id] = {
                widget,
                weapon
            }
        });
    }

    #selectCategory(index: number) {
        if (index < 0 || index >= this.state.weaponCategories.length) return;

        if (this.state.selectedCategoryIndex === index) return; // No change

        // Set previous button color back to normal
        mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.state.selectedCategoryIndex], false);
    mod.SetUITextColor(this.#catalogSidebarButtons[this.state.selectedCategoryIndex], mod.CreateVector(THEME.colors.textPrimary[0], THEME.colors.textPrimary[1], THEME.colors.textPrimary[2]));

        this.state.selectedCategoryIndex = index;
        mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.state.selectedCategoryIndex], true);
    mod.SetUITextColor(this.#catalogSidebarButtons[this.state.selectedCategoryIndex], mod.CreateVector(THEME.colors.textAccent[0], THEME.colors.textAccent[1], THEME.colors.textAccent[2]));

        if(this.state.pageState !== "weaponSelection") {
            this.#setPage("weaponSelection");
        }

        this.#updateHeader();
    }

    #generateAttachmentSlotSelectionUI() {
        if(!this.state.selectedWeapon) return;

        if(this.#catalogAttachmentSlotSelectionPage) {
            this.#uiRegistry.remove("attachmentSlotPage");
            this.#catalogAttachmentSlotSelectionPage = undefined;
        }
        
        this.#catalogAttachmentSlotSelectionPage = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogArea,
            padding: LAYOUT.Grid.pagePadding,
            position: [0, LAYOUT.Header.height],
            size: [LAYOUT.Catalog.width, LAYOUT.Catalog.height],
            bgFill: mod.UIBgFill.None,
        });

        if (this.#catalogAttachmentSlotSelectionPage) {
            this.#uiRegistry.add("attachmentSlotPage", this.#catalogAttachmentSlotSelectionPage);
        }

        const availableSlots = getAvailableAttachmentSlots(this.state.selectedWeapon.id);
    const attachmentSlotsPerRow = this.#calculateItemsPerRow(LAYOUT.Slots.item.width, LAYOUT.Slots.gap.x);     

        availableSlots.forEach((slot, index) => {
            const xColNum = Math.floor(index % attachmentSlotsPerRow);
            const yRowNum = Math.floor(index / attachmentSlotsPerRow);
            const x = xColNum * (LAYOUT.Slots.item.width + LAYOUT.Slots.gap.x);
            const y = yRowNum * (LAYOUT.Slots.item.height + LAYOUT.Slots.gap.y);
            const itemPos = [x, y];

            const slotWidget = ParseUI({
                type: "Container",
                parent: this.#catalogAttachmentSlotSelectionPage,
                position: itemPos,
                padding: 0,
                size: [LAYOUT.Slots.item.width, LAYOUT.Slots.item.height],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: idSlot(slot),
                        padding: 0,
                        position: [0, 0],
                        anchor: mod.UIAnchor.TopLeft,
                        size: [LAYOUT.Slots.item.width, LAYOUT.Slots.item.height],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: THEME.colors.elementBg,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [LAYOUT.Slots.item.width, LAYOUT.Slots.item.height],
                        anchor: mod.UIAnchor.TopLeft,
                        position: [0, 0],
                        bgFill: mod.UIBgFill.None,
                        textLabel: weaponAttachmentSlotNames[slot],
                        textAnchor: mod.UIAnchor.Center,
                        textSize: 20
                    }
                ]
            });

            if (slotWidget) {
                this.#uiRegistry.add(`slotTile_${slot}`, slotWidget);
            }
        });
    }

    #generateAttachmentSelectionUI() {
        if(!this.state.selectedWeapon || !this.state.selectedAttachmentSlot) return;

        // Clean up previous attachment selection page if it exists
        if (this.#catalogAttachmentSelectionPage) {
            // Remove individual attachment tiles from registry first
            const previousAttachments = getWeaponAttachmentsBySlot(this.state.selectedWeapon.id, this.state.selectedAttachmentSlot);
            previousAttachments.forEach((attachment) => {
                this.#uiRegistry.remove(`attachmentTile_${attachment.id}`);
            });
            // Remove the page itself
            this.#uiRegistry.remove("attachmentSelectionPage");
            this.#catalogAttachmentSelectionPage = undefined;
        }

        this.#catalogAttachmentSelectionPage = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogArea,
            padding: LAYOUT.Grid.pagePadding,
            position: [0, LAYOUT.Header.height],
            size: [LAYOUT.Catalog.width, LAYOUT.Catalog.height],
            bgFill: mod.UIBgFill.None,
        });

        if (this.#catalogAttachmentSelectionPage) {
            this.#uiRegistry.add("attachmentSelectionPage", this.#catalogAttachmentSelectionPage);
        }

        const availableAttachments = getWeaponAttachmentsBySlot(this.state.selectedWeapon.id, this.state.selectedAttachmentSlot);
    const attachmentsPerRow = this.#calculateItemsPerRow(LAYOUT.Attachments.item.width, LAYOUT.Attachments.gap.x);

        availableAttachments.forEach((attachment, index) => {
            const xColNum = Math.floor(index % attachmentsPerRow);
            const yRowNum = Math.floor(index / attachmentsPerRow);
            const x = xColNum * (LAYOUT.Attachments.item.width + LAYOUT.Attachments.gap.x);
            const y = yRowNum * (LAYOUT.Attachments.item.height + LAYOUT.Attachments.gap.y);
            const itemPos = [x, y];

            const attachmentWidget = ParseUI({
                type: "Container",
                parent: this.#catalogAttachmentSelectionPage,
                position: itemPos,
                padding: 0,
                size: [LAYOUT.Attachments.item.width, LAYOUT.Attachments.item.height],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: idAttachment(attachment.id),
                        padding: 0,
                        position: [0, 0],
                        anchor: mod.UIAnchor.TopLeft,
                        size: [LAYOUT.Attachments.item.width, LAYOUT.Attachments.item.height],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: THEME.colors.elementBg,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [LAYOUT.Attachments.item.width, LAYOUT.Attachments.item.height],
                        anchor: mod.UIAnchor.TopLeft,
                        position: [0, 0],
                        bgFill: mod.UIBgFill.None,
                        textLabel: attachment.name,
                        textAnchor: mod.UIAnchor.Center,
                        textSize: 20
                    }
                ]
            });

            if (attachmentWidget) {
                this.#uiRegistry.add(`attachmentTile_${attachment.id}`, attachmentWidget);
            }
        });
    }

    toggle() {
        this.#isOpen ? this.close() : this.open();
    }

    open() {
        if (!this.#uiCatalog) return;
        mod.EnableUIInputMode(true, this.#playerState.player);
        mod.SetUIWidgetVisible(this.#uiCatalog, true);
        this.#isOpen = true;
    }

    close() {
        mod.EnableUIInputMode(false, this.#playerState.player);
        if (!this.#uiCatalog) return;
        mod.SetUIWidgetVisible(this.#uiCatalog, false);
        this.#isOpen = false;
    }

    destroy() {
        // Disable input mode first
        mod.EnableUIInputMode(false, this.#playerState.player);
        
        // Clean up all UI widgets through the registry
        this.#uiRegistry.removeAll();
        
        // Clear all widget references
        this.#uiCatalog = undefined;
        this.#uiCatalogSidebar = undefined;
        this.#uiMainCatalogArea = undefined;
        this.#uiMainCatalogAreaHeader = undefined;
        this.#uiMainCatalogAreaHeaderBackButton = undefined;
        this.#uiMainCatalogAreaHeaderTitle = undefined;
        this.#catalogAttachmentSlotSelectionPage = undefined;
        this.#catalogAttachmentSelectionPage = undefined;
        
        // Clear arrays and objects
        this.#catalogWeaponCategoryPages = [];
        this.#catalogSidebarButtons = [];
        this.#weaponButtons = {};
        
        // Reset state
        this.#isOpen = false;
        this.state.pageState = "weaponSelection";
        this.state.selectedCategoryIndex = 0;
        this.state.selectedWeapon = null;
        this.state.selectedAttachmentSlot = null;
        this.#selectedAttachments = {};
    }

    onUIButtonEvent(widget: mod.UIWidget, _event: mod.UIButtonEvent) {
        const widgetName = mod.GetUIWidgetName(widget);

        // Close Button
        if (widgetName === IDS.buttons.close) {
            this.close();
            return;
        }

        // Back Button
        if (widgetName === IDS.buttons.back) {
            this.#handleBackButton();
            return;
        }

        // Category Sidebar Buttons
        if (widgetName.startsWith(IDS.buttons.categoryPrefix)) {
            const indexStr = widgetName.replace(IDS.buttons.categoryPrefix, "");
            const index = parseInt(indexStr);
            if (isNaN(index)) return;
            this.#selectCategory(index);
            return;
        }

        // Handle weapon selection
        if (widgetName.startsWith("gun_")) {
            this.#handleWeaponSelection(widgetName);
        }

        // Handle attachment slot selection
        if (widgetName.startsWith(IDS.buttons.slotPrefix)) {
            const slotStr = widgetName.replace(IDS.buttons.slotPrefix, "") as WeaponAttachmentSlot;
            this.#handleAttachmentSlotSelection(slotStr);
        }

        // Handle attachment selection
        if (widgetName.startsWith(IDS.buttons.attachmentPrefix)) {
            const attachmentId = widgetName.replace(IDS.buttons.attachmentPrefix, "");
            this.#handleAttachmentSelection(attachmentId);
        }
    }

    #handleBackButton() {
        switch (this.state.pageState) {
            case "attachmentSelection":
                this.#setPage("attachmentSlotSelection");
                break;
            case "attachmentSlotSelection":
                this.#setPage("weaponSelection");
                break;
            case "weaponSelection":
                return; // Already at top level, nothing to do. Can't really happen
        }

        this.#updateHeader();
    }

    #updateHeader() {
        this.#headerManager.updateHeader(this.state);
    }

    #setPage(page: "weaponSelection" | "attachmentSlotSelection" | "attachmentSelection") {
        this.state.pageState = page;

        // Clean up previous page UI if necessary
        if(page !== "attachmentSlotSelection" && this.#catalogAttachmentSlotSelectionPage) {
            // Remove individual slot tiles from registry first
            if (this.state.selectedWeapon) {
                const availableSlots = getAvailableAttachmentSlots(this.state.selectedWeapon.id);
                availableSlots.forEach((slot) => {
                    this.#uiRegistry.remove(`slotTile_${slot}`);
                });
            }
            // Remove the page itself
            this.#uiRegistry.remove("attachmentSlotPage");
            this.#catalogAttachmentSlotSelectionPage = undefined;
        }

        if(page !== "attachmentSelection" && this.#catalogAttachmentSelectionPage) {
            // Remove individual attachment tiles from registry first
            if (this.state.selectedWeapon && this.state.selectedAttachmentSlot) {
                const availableAttachments = getWeaponAttachmentsBySlot(this.state.selectedWeapon.id, this.state.selectedAttachmentSlot);
                availableAttachments.forEach((attachment) => {
                    this.#uiRegistry.remove(`attachmentTile_${attachment.id}`);
                });
            }
            // Remove the page itself
            this.#uiRegistry.remove("attachmentSelectionPage");
            this.#catalogAttachmentSelectionPage = undefined;
        }

        // Consideration: This will be applied every page change, might want to optimize later
        if(page !== "weaponSelection") {
            mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.state.selectedCategoryIndex], false);
        }

        switch (page) {
            case "weaponSelection":
                // Show weapon selection UI
                // Maybe this is where we reset selected weapon and attachment slot
                this.state.selectedWeapon = null;
                this.state.selectedAttachmentSlot = null;
                this.#selectedAttachments = {};
                mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.state.selectedCategoryIndex], true);
                break;
            case "attachmentSlotSelection":
                this.#generateAttachmentSlotSelectionUI();
                break;
            case "attachmentSelection":
                this.#generateAttachmentSelectionUI();
                break;
        }

        this.#updateHeader(); // Update header title based on new page
    }

    #giveWeaponToPlayer() {
        const weaponPackage = mod.CreateNewWeaponPackage();

        if(!this.state.selectedWeapon) return; // Do nothing if none selected.

        // Get the full weapon object from the id
        const weapon = getWeaponById(this.state.selectedWeapon.id);
        if (!weapon) return;

        // Add Attachments
        for (const slot in this.#selectedAttachments) {
            const attachment = this.#selectedAttachments[slot as WeaponAttachmentSlot] as mod.WeaponAttachments;
            mod.AddAttachmentToWeaponPackage(attachment, weaponPackage);
        }

        // Give Base Weapon
        mod.AddEquipment(this.#playerState.player, weapon.weapon, weaponPackage);


        mod.ForceSwitchInventory(this.#playerState.player, mod.InventorySlots.PrimaryWeapon);
    }

    #handleWeaponSelection(weapon_id: string) {
        const weapon = getWeaponById(weapon_id);
        if (!weapon) return;

        this.state.selectedWeapon = {
            category: weapon.category,
            name: weapon.name,
            id: weapon.id
        };
        this.#giveWeaponToPlayer();
        this.#setPage("attachmentSlotSelection");

        // Update Header Title - TODO: Maybe wrap this in a updateHeader() method
        /*if (!this.#uiMainCatalogAreaHeaderTitle) return; // Can't update if there's no header
        const categoryName = weaponCategoryNames[weapon.category];
        mod.SetUITextLabel(this.#uiMainCatalogAreaHeaderTitle, mod.Message(s`{} / {}`, categoryName, weapon.name));
        this.#showBackButton(true);*/

        /*
            TODO: Update necessary states and create methods to dynamically generate attachment selection UI

            Step 1: Update State i.e.
                this.#selectedWeaponId = weapon_id;
                this.selectedAttachmentSlot = null;
                this.#selectedAttachments = {};

            Step 2: Generate Attachment Slot Selection UI i.e.
                this.#generateAttachmentSlotSelectionUI(weapon); // Wouldn't need to pass weapon id again since we have it in state

            Step 3: Once an attachment slot is chosen, update state and generate attachment selection UI i.e.
                this.selectedAttachmentSlot = chosenSlot;
                this.#generateAttachmentSelectionUI(weapon, attachmentSlot); // Would use weapon id and slot from state

            Step 4: Once an attachment is chosen, update state i.e.
                this.#selectedAttachments[attachmentSlot] = chosenAttachment;

            Step 5: Create method to finalize and give weapon package to player i.e.
                this.#finalizeWeaponPackage();

            Step 6: Update UI accordingly at each step. Also consider adding a "Back" button to go back to previous steps.

            Step 7: Ensure we have functions to reset selections and UI when needed (e.g., changing category, closing catalog, etc.) i.e.
                this.#resetSelectionsAndUI();
        */
    }

    #handleAttachmentSlotSelection(slot: WeaponAttachmentSlot) {
        if (!this.state.selectedWeapon) return;

        // TODO: Handle this part
        this.state.selectedAttachmentSlot = slot;
        this.#setPage("attachmentSelection");
    }

    #handleAttachmentSelection(attachment_id: string) {
        if (!this.state.selectedWeapon || !this.state.selectedAttachmentSlot) return;

        const attachment = getWeaponAttachment(this.state.selectedWeapon.id, attachment_id);

        if (!attachment) return;

        this.#selectedAttachments[this.state.selectedAttachmentSlot] = attachment.attachment;
        this.#giveWeaponToPlayer();
    }

    #calculateItemsPerRow(itemWidth: number, horizontalSpacing: number): number {
        const pageWidth = LAYOUT.Catalog.width - LAYOUT.Sidebar.width - (LAYOUT.Grid.pagePadding * 2); // padding on each side
        const itemsPerRow = Math.floor(pageWidth / (itemWidth + horizontalSpacing));
        return itemsPerRow;
    }
}