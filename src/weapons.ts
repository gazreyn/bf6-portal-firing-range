import { s } from "../lib/string-macro";

export const weaponCategories = ['assault', 'carbine', 'sniper', 'smg', 'lmg', 'shotgun', 'pistol', 'dmr'] as const;
export const weaponAttachmentSlots = ['muzzle', 'barrel', 'scope', 'right_accessory', 'top_accessory', 'optic_accessory', 'ergonomics', 'underbarrel', 'magazine', 'ammunition'] as const;
export type WeaponCategory = typeof weaponCategories[number];
export type WeaponAttachmentSlot = typeof weaponAttachmentSlots[number];
export type WeaponAttachment = { id: string, name: string, attachment: mod.WeaponAttachments, slot: WeaponAttachmentSlot };
export type WeaponDefinition = { id: string, weapon: mod.Weapons, name: string, category: WeaponCategory, attachmentSlots: WeaponAttachmentSlot[], attachments: WeaponAttachment[] };

export function getWeaponsByCategory(category: WeaponCategory): WeaponDefinition[] {
    return weapons.filter(w => w.category === category);
}

// Probably won't need/use this, consider removing later
// export function getWeaponAttachments(weapon_id: mod.Weapons): WeaponAttachment[] {
//     const weapon = weapons.find(w => w.weapon === weapon_id);
//     if (!weapon) return [];
//     return weapon.attachments;
// }

/*
    weapon: mod.Weapons.AssaultRifle_M433,
    slot: muzzle,
    attachments: {
        muzzle: mod.WeaponAttachments.Muzzle_Flash_Hider,
        scope: mod.WeaponAttachments.Scope_Iron_Sights
    }
*/

// TODO: Add function for getting available attachment slots for a weapon
export function getAvailableAttachmentSlots(weapon_id: string): WeaponAttachmentSlot[] {
    const weapon = weapons.find(w => w.id === weapon_id);
    if (!weapon) return [];
    return weapon.attachmentSlots;
}

export function getWeaponAttachmentsBySlot(weapon_id: string, slot: WeaponAttachmentSlot): WeaponAttachment[] {
    const weapon = weapons.find(w => w.id === weapon_id);

    if (!weapon) return [];

    return weapon.attachments.filter(att => att.slot === slot);
}

export function isValidAttachmmentSlotForWeapon(weapon_id: string, slot: WeaponAttachmentSlot): boolean {
    const weapon = weapons.find(w => w.id === weapon_id);
    if (!weapon) return false;
    return weapon.attachmentSlots.includes(slot);
}

export function getWeaponById(id: string): WeaponDefinition | undefined {
    return weapons.find(w => w.id === id);
}

export function getWeaponAttachment(weapon_id: string, attachment_id: string): WeaponAttachment | undefined {
    const weapon = weapons.find(w => w.id === weapon_id);
    if (!weapon) return undefined;
    return weapon.attachments.find(att => att.id === attachment_id);
}

export function getCategoriesWithAvailableWeapons(): WeaponCategory[] {
    const categories: Set<WeaponCategory> = new Set();

    weapons.forEach(weapon => {
        categories.add(weapon.category);
    });

    return Array.from(categories);
}

// Consider using a weapon definition object instead of just weapon name, or if not then just mod.Weapons enum
export function createRandomWeaponPackage(weapon_id: string): { weapon: WeaponDefinition, package: mod.WeaponPackage } | null {
    const targetWeapon = getWeaponById(weapon_id);

    if(!targetWeapon) {
        // Invalid/missing weapon id
        return null;
    }

    const weaponPackage = mod.CreateNewWeaponPackage();

    targetWeapon.attachmentSlots.forEach(slot => {
        const attachmentsForSlot = getWeaponAttachmentsBySlot(targetWeapon.id, slot);
        mod.AddAttachmentToWeaponPackage(attachmentsForSlot[Math.floor(Math.random() * attachmentsForSlot.length)].attachment, weaponPackage);
    });

    // We're essentially returning the same weapon id that was passed in, but this way the caller can be sure that the weapon id is valid. Is this necessary?
    return { weapon: targetWeapon, package: weaponPackage };
}

export const weapons: WeaponDefinition[] = [
    {
        id: 'gun_M433',
        weapon: mod.Weapons.AssaultRifle_M433,
        name: s`M433`,
        category: "assault",
        attachmentSlots: ["muzzle", "barrel", "scope", /*"right_accessory", "top_accessory", "optic_accessory", "ergonomics", "underbarrel", "magazine", "ammunition"*/],
        attachments: [
            { id: "attachment_muzzle_flash_hider", name: s`Flash Hider`, attachment: mod.WeaponAttachments.Muzzle_Flash_Hider, slot: "muzzle" },
            { id: "attachment_muzzle_double_port_brake", name: s`Double Port Brake`, attachment: mod.WeaponAttachments.Muzzle_Double_port_Brake, slot: "muzzle" },
            { id: "attachment_muzzle_linear_comp", name: s`Linear Compensator`, attachment: mod.WeaponAttachments.Muzzle_Linear_Comp, slot: "muzzle" },
            { id: "attachment_muzzle_standard_suppressor", name: s`Standard Suppressor`, attachment: mod.WeaponAttachments.Muzzle_Standard_Suppressor, slot: "muzzle" },
            { id: "attachment_muzzle_long_suppressor", name: s`Long Suppressor`, attachment: mod.WeaponAttachments.Muzzle_Long_Suppressor, slot: "muzzle" },
            { id: "attachment_muzzle_cqb_suppressor", name: s`CQB Suppressor`, attachment: mod.WeaponAttachments.Muzzle_CQB_Suppressor, slot: "muzzle" },
            { id: "attachment_muzzle_compensated_brake", name: s`Compensated Brake`, attachment: mod.WeaponAttachments.Muzzle_Compensated_Brake, slot: "muzzle" },
            { id: "attachment_muzzle_lightened_suppressor", name: s`Lightened Suppressor`, attachment: mod.WeaponAttachments.Muzzle_Lightened_Suppressor, slot: "muzzle" },
            { id: "attachment_barrel_165_rifle", name: s`16.5" Rifle`, attachment: mod.WeaponAttachments.Barrel_165_Rifle, slot: "barrel" },
            { id: "attachment_barrel_189_prototype", name: s`18.9" Prototype`, attachment: mod.WeaponAttachments.Barrel_189_Prototype, slot: "barrel" },
            { id: "attachment_barrel_145_standard", name: s`14.5" Standard`, attachment: mod.WeaponAttachments.Barrel_145_Standard, slot: "barrel" },
            { id: "attachment_barrel_165_fluted", name: s`16.5" Fluted`, attachment: mod.WeaponAttachments.Barrel_165_Fluted, slot: "barrel" },
            { id: "attachment_scope_iron_sights", name: s`Iron Sights`, attachment: mod.WeaponAttachments.Scope_Iron_Sights, slot: "scope" },
            { id: "attachment_scope_mini_flex_100x", name: s`Mini Flex 1.00x`, attachment: mod.WeaponAttachments.Scope_Mini_Flex_100x, slot: "scope" },
            { id: "attachment_scope_sdo_350x", name: s`SDO 3.5x`, attachment: mod.WeaponAttachments.Scope_SDO_350x, slot: "scope" },
        ]
    }
];

export const weaponCategoryNames: Record<WeaponCategory, string> = {
    assault: s`ASSAULT`,
    carbine: s`CARBINE`,
    sniper: s`SNIPER`,
    smg: s`SMG`,
    lmg: s`LMG`,
    shotgun: s`SHOTGUN`,
    pistol: s`PISTOL`,
    dmr: s`DMR`,
};

export const weaponAttachmentSlotNames: Record<WeaponAttachmentSlot, string> = {
    muzzle: s`MUZZLE`,
    barrel: s`BARREL`,
    scope: s`SCOPE`,
    right_accessory: s`RIGHT ACCESSORY`,
    top_accessory: s`TOP ACCESSORY`,
    optic_accessory: s`OPTIC ACCESSORY`,
    ergonomics: s`ERGONOMICS`,
    underbarrel: s`UNDERBARREL`,
    magazine: s`MAGAZINE`,
    ammunition: s`AMMUNITION`,
};