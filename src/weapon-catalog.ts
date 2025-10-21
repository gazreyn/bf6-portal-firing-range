import { s } from "../lib/string-macro";
import type { PlayerState } from "./player-state";
import { ParseUI } from "./ui";
import { getWeaponById, getWeaponsByCategory, weaponCategories, weaponCategoryNames, weaponAttachmentSlotNames, type WeaponAttachmentSlot, type WeaponDefinition, getAvailableAttachmentSlots, getWeaponAttachmentsBySlot, getWeaponAttachment } from "./weapons";

export class WeaponCatalog {
    // State
    #playerState: PlayerState;
    #isOpen: boolean = false; // Whether the catalog UI is currently open
    #pageState: "weaponSelection" | "attachmentSlotSelection" | "attachmentSelection" = "weaponSelection";
    #weaponCategories: typeof weaponCategories = weaponCategories;
    #selectedCategoryIndex: number = 0;
    #selectedWeapon: WeaponDefinition | null = null;
    #selectedAttachmentSlot: WeaponAttachmentSlot | null = null;
    #selectedAttachments: { [slot in WeaponAttachmentSlot]?: mod.WeaponAttachments } = {};

    // UI Related Properties
    #uiCatalog: mod.UIWidget | undefined;
    #uiCatalogSidebar: mod.UIWidget | undefined;
    #uiMainCatalogArea: mod.UIWidget | undefined;

    // Pages
    #catalogWeaponCategoryPages: mod.UIWidget[] = [];
    #catalogAttachmentSlotSelectionPage: mod.UIWidget | undefined;
    #catalogAttachmentSelectionPage: mod.UIWidget | undefined;

    // Main Catalog
    #catalogWidth: number = 1200;
    #catalogHeight: number = 600;

    // Sidebar Area
    #categorySidebarButtonPrefix: string = "__categoryBtn_";
    #catalogSidebarWidth: number = 250;
    #catalogSidebarButtonHeight: number = 50;
    #catalogSidebarButtonTextSize: number = 24;
    #catalogSidebarButtonSpacing: number = 4;
    #catalogSidebarButtons: mod.UIWidget[] = [];

    // Main Header Area
    #closeButtonName: string = "__closeBtn";
    #backButtonName: string = "__backBtn";
    #uiMainCatalogAreaHeaderBackButton: mod.UIWidget | undefined;
    #catalogMainHeaderTitleName: string = "__mainHeaderTitle";
    #uiMainCatalogAreaHeader: mod.UIWidget | undefined;
    #uiMainCatalogAreaHeaderTitle: mod.UIWidget | undefined;
    #catalogMainHeaderHeight: number = 60;
    #catalogMainHeaderPadding: number = 8;

    // Weapon Items Layout
    #weaponItemTextWidth: number = 250;
    #weaponItemWidth: number = 250;
    #weaponItemHeight: number = 166;
    #weaponItemSpacingHorizontal: number = 16;
    #weaponItemSpacingVertical: number = 16;
    #weaponButtons: { [key: string]: { widget: mod.UIWidget, weapon: WeaponDefinition } } = {};

    // 

    // UI Colors
    #surfaceColor: number[] = [0, 0, 0]; // Black
    #elementColor: number[] = [0.05, 0.05, 0.05]; // Dark Gray

    constructor(player: PlayerState) {
        this.#playerState = player;

        this.#createUI();
    }

    #createUI() {
        this.#uiCatalog = ParseUI({
            type: "Container",
            size: [this.#catalogWidth, this.#catalogHeight],
            position: [0, 0],
            anchor: mod.UIAnchor.Center,
            bgFill: mod.UIBgFill.Solid,
            bgColor: this.#surfaceColor,
            bgAlpha: 0.75,
            depth: mod.UIDepth.AboveGameUI,
            playerId: this.#playerState.player,
            visible: false
        });

        this.#createUISidebar();
        this.#createUIMainCatalogArea();
    }

    #createUISidebar() {
        // Sidebar Container
        this.#uiCatalogSidebar = ParseUI({
            type: "Container",
            parent: this.#uiCatalog,
            size: [this.#catalogSidebarWidth, this.#catalogHeight],
            position: [0, 0],
            anchor: mod.UIAnchor.TopLeft,
            bgFill: mod.UIBgFill.Solid,
            bgColor: this.#surfaceColor,
            bgAlpha: 0.5,
        });

        // Sidebar Buttons
        this.#weaponCategories.forEach((category, index) => {
            let buttonYPos = (this.#catalogSidebarButtonSpacing + index * (this.#catalogSidebarButtonHeight + this.#catalogSidebarButtonSpacing)) - this.#catalogSidebarButtonSpacing;
            let buttonPosition = [0, buttonYPos];
            ParseUI({
                type: "Button",
                name: this.#categorySidebarButtonPrefix + index,
                parent: this.#uiCatalogSidebar,
                size: [this.#catalogSidebarWidth, this.#catalogSidebarButtonHeight],
                bgFill: mod.UIBgFill.GradientLeft,
                bgColor: this.#surfaceColor,
                bgAlpha: 1,
                position: buttonPosition,
                anchor: mod.UIAnchor.TopLeft,
            });

            const buttonText = ParseUI({
                type: "Text",
                parent: this.#uiCatalogSidebar,
                position: buttonPosition,
                padding: 16,
                size: [this.#catalogSidebarWidth, this.#catalogSidebarButtonHeight],
                textLabel: mod.Message(weaponCategoryNames[category]),
                textSize: this.#catalogSidebarButtonTextSize,
                textAnchor: mod.UIAnchor.CenterLeft,
                textColor: index === 0 ? [1, 0.98, 0.65] : [1, 1, 1]
            });

            if (!buttonText) return;
            this.#catalogSidebarButtons.push(buttonText);
        });
    }

    #createUIMainCatalogArea() {
        this.#uiMainCatalogArea = ParseUI({
            type: "Container",
            parent: this.#uiCatalog,
            size: [this.#catalogWidth - this.#catalogSidebarWidth, this.#catalogHeight],
            position: [this.#catalogSidebarWidth, 0],
            anchor: mod.UIAnchor.TopLeft,
            bgFill: mod.UIBgFill.Solid,
            bgColor: this.#surfaceColor,
            bgAlpha: 0,
        });

        this.#createUIMainHeader();
        this.#createCategoryPages(this.#weaponCategories);
    }

    #createUIMainHeader() {
        if (!this.#uiMainCatalogArea) return; // Can't add the header if there's no main area

        const mainAreaWidth = this.#catalogWidth - this.#catalogSidebarWidth;

        this.#uiMainCatalogAreaHeader = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogArea,
            size: [mainAreaWidth, this.#catalogMainHeaderHeight],
            position: [0, 0],
            anchor: mod.UIAnchor.TopLeft,
            bgFill: mod.UIBgFill.None,
            padding: this.#catalogMainHeaderPadding,
            children: [
                {
                    type: "Text",
                    name: this.#catalogMainHeaderTitleName,
                    position: [0, 0],
                    size: [(mainAreaWidth - this.#catalogMainHeaderPadding * 2 - 40), (this.#catalogMainHeaderHeight - this.#catalogMainHeaderPadding * 2)], // Full width minus padding on both sides and close button
                    anchor: mod.UIAnchor.CenterLeft,
                    bgFill: mod.UIBgFill.None,
                    textLabel: mod.Message(weaponCategoryNames[this.#weaponCategories[0]]), // Defaults to first category
                    textSize: 24,
                    textAnchor: mod.UIAnchor.CenterLeft,
                    textColor: [1, 1, 1]
                },
                // Close Button
                {
                    type: "Button",
                    name: this.#closeButtonName,
                    size: [40, 40],
                    anchor: mod.UIAnchor.CenterRight,
                    bgFill: mod.UIBgFill.Solid,
                    bgColor: [1, 0.3, 0.3],
                    bgAlpha: 1,
                },
                {
                    type: "Text",
                    size: [40, 40],
                    anchor: mod.UIAnchor.CenterRight,
                    bgFill: mod.UIBgFill.None,
                    textLabel: mod.Message(s`X`),
                    textAnchor: mod.UIAnchor.Center,
                    textSize: 36,
                }
            ]
        });

        if (!this.#uiMainCatalogAreaHeader) return; // Can't update if there's no header

        this.#uiMainCatalogAreaHeaderBackButton = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogAreaHeader,
            size: [40, 40],
            anchor: mod.UIAnchor.CenterLeft,
            bgFill: mod.UIBgFill.None,
            visible: false,
            children: [
                {
                    type: "Button",
                    name: this.#backButtonName,
                    size: [40, 40],
                    anchor: mod.UIAnchor.TopLeft,
                    bgFill: mod.UIBgFill.Solid,
                    bgColor: this.#surfaceColor,
                    bgAlpha: 1,
                },
                {
                    type: "Text",
                    size: [40, 40],
                    anchor: mod.UIAnchor.TopLeft,
                    bgFill: mod.UIBgFill.None,
                    textLabel: mod.Message(s`<`),
                    textAnchor: mod.UIAnchor.Center,
                    textSize: 36,
                },
            ]
        })

        this.#uiMainCatalogAreaHeaderTitle = mod.FindUIWidgetWithName(this.#catalogMainHeaderTitleName, this.#uiMainCatalogAreaHeader);
    }

    #createCategoryPages(categories: typeof weaponCategories) {
        const pageWidth = this.#catalogWidth - this.#catalogSidebarWidth;
        const pageHeight = this.#catalogHeight - this.#catalogMainHeaderHeight;

        categories.forEach((category, index) => {
            const categoryPage = ParseUI({
                type: "Container",
                parent: this.#uiMainCatalogArea,
                padding: 16,
                visible: index === 0,
                size: [pageWidth, pageHeight],
                position: [0, this.#catalogMainHeaderHeight],
                anchor: mod.UIAnchor.TopLeft,
                bgFill: mod.UIBgFill.None // Set to None, this is just to help visualize the area during development
            });

            if (!categoryPage) return;
            this.#catalogWeaponCategoryPages.push(categoryPage);

            // Create category-specific UI elements here (e.g., weapon list)
            const weapons = getWeaponsByCategory(category);
            this.#addWeaponsToPage(index, weapons);
        });
    }

    #addWeaponsToPage(pageIndex: number, weapons: WeaponDefinition[]) {
        const weaponsPerRow = this.#calculateItemsPerRow(this.#weaponItemWidth, this.#weaponItemSpacingHorizontal);

        weapons.forEach((weapon, index) => {

            const xColNum = Math.floor(index % weaponsPerRow);
            const yRowNum = Math.floor(index / weaponsPerRow);
            const x = xColNum * (this.#weaponItemWidth + this.#weaponItemSpacingHorizontal);
            const y = yRowNum * (this.#weaponItemHeight + this.#weaponItemSpacingVertical);
            const itemPos = [x, y];

            const widget = ParseUI({
                type: "Container",
                parent: this.#catalogWeaponCategoryPages[pageIndex],
                position: itemPos,
                size: [this.#weaponItemWidth, this.#weaponItemHeight],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: weapon.id,
                        size: [this.#weaponItemWidth, this.#weaponItemHeight],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: this.#elementColor,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [this.#weaponItemTextWidth, 100],
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

            mod.AddUIWeaponImage(weapon.name, mod.CreateVector(16, 0, 0), mod.CreateVector(this.#weaponItemWidth - 32, this.#weaponItemHeight, 1), mod.UIAnchor.TopLeft, weapon.weapon, widget);
            this.#weaponButtons[weapon.id] = {
                widget,
                weapon
            }
        });
    }

    #selectCategory(index: number) {
        if (index < 0 || index >= this.#weaponCategories.length) return;

        if (this.#selectedCategoryIndex === index) return; // No change

        // Set previous button color back to normal
        mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.#selectedCategoryIndex], false);
        mod.SetUITextColor(this.#catalogSidebarButtons[this.#selectedCategoryIndex], mod.CreateVector(1, 1, 1));

        this.#selectedCategoryIndex = index;
        mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.#selectedCategoryIndex], true);
        mod.SetUITextColor(this.#catalogSidebarButtons[this.#selectedCategoryIndex], mod.CreateVector(1, 0.98, 0.65));

        if(this.#pageState !== "weaponSelection") {
            this.#setPage("weaponSelection");
        }

        this.#updateHeader();
    }

    #generateAttachmentSlotSelectionUI() {
        if(!this.#selectedWeapon) return;

        if(this.#catalogAttachmentSlotSelectionPage) {
            mod.DeleteUIWidget(this.#catalogAttachmentSlotSelectionPage); // Clean up previous page if it exists and recreate
            this.#catalogAttachmentSlotSelectionPage = undefined;
        }
        
        this.#catalogAttachmentSlotSelectionPage = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogArea,
            padding: 16,
            position: [0, this.#catalogMainHeaderHeight],
            size: [this.#catalogWidth, this.#catalogHeight],
            bgFill: mod.UIBgFill.None,
        });

        const availableSlots = getAvailableAttachmentSlots(this.#selectedWeapon.id);
        const attachmentSlotsPerRow = this.#calculateItemsPerRow(200, 16);      

        availableSlots.forEach((slot, index) => {
            const xColNum = Math.floor(index % attachmentSlotsPerRow);
            const yRowNum = Math.floor(index / attachmentSlotsPerRow);
            const x = xColNum * (200 + 16);
            const y = yRowNum * (50 + 16);
            const itemPos = [x, y];

            ParseUI({
                type: "Container",
                parent: this.#catalogAttachmentSlotSelectionPage,
                position: itemPos,
                padding: 0,
                size: [200, 50],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: `attachmentSlot_${slot}`,
                        padding: 0,
                        position: [0, 0],
                        anchor: mod.UIAnchor.TopLeft,
                        size: [200, 50],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: this.#elementColor,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [200, 50],
                        anchor: mod.UIAnchor.TopLeft,
                        position: [0, 0],
                        bgFill: mod.UIBgFill.None,
                        textLabel: weaponAttachmentSlotNames[slot],
                        textAnchor: mod.UIAnchor.Center,
                        textSize: 20
                    }
                ]
            });
        });
    }

    #generateAttachmentSelectionUI() {
        if(!this.#selectedWeapon || !this.#selectedAttachmentSlot) return;

        this.#catalogAttachmentSelectionPage = ParseUI({
            type: "Container",
            parent: this.#uiMainCatalogArea,
            padding: 16,
            position: [0, this.#catalogMainHeaderHeight],
            size: [this.#catalogWidth, this.#catalogHeight],
            bgFill: mod.UIBgFill.None,
        });

        const availableAttachments = getWeaponAttachmentsBySlot(this.#selectedWeapon.id, this.#selectedAttachmentSlot);
        const attachmentsPerRow = this.#calculateItemsPerRow(200, 16);

        availableAttachments.forEach((attachment, index) => {
            const xColNum = Math.floor(index % attachmentsPerRow);
            const yRowNum = Math.floor(index / attachmentsPerRow);
            const x = xColNum * (200 + 16);
            const y = yRowNum * (50 + 16);
            const itemPos = [x, y];

            ParseUI({
                type: "Container",
                parent: this.#catalogAttachmentSelectionPage,
                position: itemPos,
                padding: 0,
                size: [200, 50],
                bgFill: mod.UIBgFill.None,
                children: [
                    {
                        type: "Button",
                        name: `attachment_${attachment.id}`,
                        padding: 0,
                        position: [0, 0],
                        anchor: mod.UIAnchor.TopLeft,
                        size: [200, 50],
                        bgFill: mod.UIBgFill.Solid,
                        bgColor: this.#elementColor,
                        bgAlpha: 1
                    },
                    {
                        type: "Text",
                        size: [200, 50],
                        anchor: mod.UIAnchor.TopLeft,
                        position: [0, 0],
                        bgFill: mod.UIBgFill.None,
                        textLabel: attachment.name,
                        textAnchor: mod.UIAnchor.Center,
                        textSize: 20
                    }
                ]
            });
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

    onUIButtonEvent(widget: mod.UIWidget, _event: mod.UIButtonEvent) {
        const widgetName = mod.GetUIWidgetName(widget);

        // Close Button
        if (widgetName === this.#closeButtonName) {
            this.close();
            return;
        }

        // Back Button
        if (widgetName === this.#backButtonName) {
            this.#handleBackButton();
            return;
        }

        // Category Sidebar Buttons
        if (widgetName.startsWith(this.#categorySidebarButtonPrefix)) {
            const indexStr = widgetName.replace(this.#categorySidebarButtonPrefix, "");
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
        if (widgetName.startsWith("attachmentSlot_")) {
            const slotStr = widgetName.replace("attachmentSlot_", "") as WeaponAttachmentSlot;
            this.#handleAttachmentSlotSelection(slotStr);
        }

        // Handle attachment selection
        if (widgetName.startsWith("attachment_")) {
            const attachmentId = widgetName.replace("attachment_", "");
            this.#handleAttachmentSelection(attachmentId);
        }
    }

    #showBackButton(show: boolean) {
        if(!this.#uiMainCatalogAreaHeaderBackButton || !this.#uiMainCatalogAreaHeaderTitle) return; // Can't update if there's no header elements

        const initialHeaderTitleWidth = this.#catalogWidth - this.#catalogSidebarWidth - this.#catalogMainHeaderPadding * 2 - 40;
        const initialHeaderTitleHeight = this.#catalogMainHeaderHeight - this.#catalogMainHeaderPadding * 2;

        if(show) {
            mod.SetUIWidgetVisible(this.#uiMainCatalogAreaHeaderBackButton, true);
            mod.SetUIWidgetPosition(this.#uiMainCatalogAreaHeaderTitle, mod.CreateVector(40 + this.#catalogMainHeaderPadding, 0, 0));
            mod.SetUIWidgetSize(this.#uiMainCatalogAreaHeaderTitle, mod.CreateVector((initialHeaderTitleWidth - this.#catalogMainHeaderPadding - 40), (initialHeaderTitleHeight), 0)); // Adjust width to account for back button
        } else {
            mod.SetUIWidgetVisible(this.#uiMainCatalogAreaHeaderBackButton, false);
            mod.SetUIWidgetPosition(this.#uiMainCatalogAreaHeaderTitle, mod.CreateVector(0, 0, 0));
            mod.SetUIWidgetSize(this.#uiMainCatalogAreaHeaderTitle, mod.CreateVector(initialHeaderTitleWidth, initialHeaderTitleHeight, 0)); // Reset to full width
        }
    }

    #handleBackButton() {
        switch (this.#pageState) {
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
        // Based on current page state, #selectedCategoryIndex, #selectedWeaponId, etc., update the header title accordingly
        if (!this.#uiMainCatalogAreaHeaderTitle) return; // Can't update if there's no header

        // Show the back button only if not on weapon selection page
        this.#showBackButton(this.#pageState !== "weaponSelection");

        switch (this.#pageState) {
            case "weaponSelection":
                const categoryName = weaponCategoryNames[this.#weaponCategories[this.#selectedCategoryIndex]];
                mod.SetUITextLabel(this.#uiMainCatalogAreaHeaderTitle, mod.Message(s`{}`, categoryName));
                break;
            case "attachmentSlotSelection":
                if (!this.#selectedWeapon) return;
                mod.SetUITextLabel(this.#uiMainCatalogAreaHeaderTitle, mod.Message(s`{} / {}`, weaponCategoryNames[this.#selectedWeapon.category], this.#selectedWeapon.name));
                break;
            case "attachmentSelection":
                if (!this.#selectedWeapon || !this.#selectedAttachmentSlot) return;
                mod.SetUITextLabel(this.#uiMainCatalogAreaHeaderTitle, mod.Message(s`{} / {} / {}`, weaponCategoryNames[this.#selectedWeapon.category], this.#selectedWeapon.name, weaponAttachmentSlotNames[this.#selectedAttachmentSlot]));
                break;
        }
    }

    #setPage(page: "weaponSelection" | "attachmentSlotSelection" | "attachmentSelection") {
        this.#pageState = page;

        // Clean up previous page UI if necessary
        if(page !== "attachmentSlotSelection" && this.#catalogAttachmentSlotSelectionPage) {
            mod.DeleteUIWidget(this.#catalogAttachmentSlotSelectionPage);
            this.#catalogAttachmentSlotSelectionPage = undefined;
        }

        if(page !== "attachmentSelection" && this.#catalogAttachmentSelectionPage) {
            mod.DeleteUIWidget(this.#catalogAttachmentSelectionPage);
            this.#catalogAttachmentSelectionPage = undefined;
        }

        // Consideration: This will be applied every page change, might want to optimize later
        if(page !== "weaponSelection") {
            mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.#selectedCategoryIndex], false);
        }

        switch (page) {
            case "weaponSelection":
                // Show weapon selection UI
                // Maybe this is where we reset selected weapon and attachment slot
                this.#selectedWeapon = null;
                this.#selectedAttachmentSlot = null;
                this.#selectedAttachments = {};
                mod.SetUIWidgetVisible(this.#catalogWeaponCategoryPages[this.#selectedCategoryIndex], true);
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

        if(!this.#selectedWeapon) return; // Do nothing if none selected.

        // Add Attachments
        for (const slot in this.#selectedAttachments) {
            const attachment = this.#selectedAttachments[slot as WeaponAttachmentSlot] as mod.WeaponAttachments;
            mod.AddAttachmentToWeaponPackage(attachment, weaponPackage);
        }

        // Give Base Weapon
        mod.AddEquipment(this.#playerState.player, this.#selectedWeapon.weapon, weaponPackage);


        mod.ForceSwitchInventory(this.#playerState.player, mod.InventorySlots.PrimaryWeapon);
    }

    #handleWeaponSelection(weapon_id: string) {
        const weapon = getWeaponById(weapon_id);
        if (!weapon) return;

        this.#selectedWeapon = weapon;
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
                this.#selectedAttachmentSlot = null;
                this.#selectedAttachments = {};

            Step 2: Generate Attachment Slot Selection UI i.e.
                this.#generateAttachmentSlotSelectionUI(weapon); // Wouldn't need to pass weapon id again since we have it in state

            Step 3: Once an attachment slot is chosen, update state and generate attachment selection UI i.e.
                this.#selectedAttachmentSlot = chosenSlot;
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
        if (!this.#selectedWeapon) return;

        // TODO: Handle this part
        this.#selectedAttachmentSlot = slot;
        this.#setPage("attachmentSelection");
    }

    #handleAttachmentSelection(attachment_id: string) {
        if (!this.#selectedWeapon || !this.#selectedAttachmentSlot) return;

        const attachment = getWeaponAttachment(this.#selectedWeapon.id, attachment_id);

        if (!attachment) return;

        this.#selectedAttachments[this.#selectedAttachmentSlot] = attachment.attachment;
        this.#giveWeaponToPlayer();
    }

    #calculateItemsPerRow(itemWidth: number, horizontalSpacing: number): number {
        const pageWidth = this.#catalogWidth - this.#catalogSidebarWidth - 32; // 32 for padding (16 on each side)
        const itemsPerRow = Math.floor(pageWidth / (itemWidth + horizontalSpacing));
        return itemsPerRow;
    }
}