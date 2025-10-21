import { s } from "../../lib/string-macro";
import { getAttachments, type WeaponAttachmentSlot, type WeaponAttachment, attachmentGroups } from "./attachments";

export const weaponCategories = ['assault', 'carbine', 'sniper', 'smg', 'lmg', 'shotgun', 'pistol', 'dmr'] as const;
export type WeaponCategory = typeof weaponCategories[number];
export type WeaponDefinition = { id: string, weapon: mod.Weapons, name: string, category: WeaponCategory, attachmentSlots: WeaponAttachmentSlot[], attachments: WeaponAttachment[] };

export function getWeaponsByCategory(category: WeaponCategory): WeaponDefinition[] {
    return weapons.filter(w => w.category === category);
}

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

export const weapons: WeaponDefinition[] = [
    {
        id: 'gun_AssaultRifle_M433',
        weapon: mod.Weapons.AssaultRifle_M433,
        name: s`M433`,
        category: "assault",
        attachmentSlots: ["muzzle", "barrel", "scope", "underbarrel", "right_accessory", "top_accessory", "optic_accessory", "ergonomics", "magazine", "ammunition"],
        attachments: [
            ...getAttachments(attachmentGroups.AssaultRifle_M433),
        ]
    },
    {
        id: 'gun_AssaultRifle_B36A4',
        weapon: mod.Weapons.AssaultRifle_B36A4,
        name: s`B36A4`,
        category: "assault",
        attachmentSlots: ["muzzle", "barrel", "scope", "underbarrel", "right_accessory", "top_accessory", "optic_accessory", "ergonomics", "magazine", "ammunition"],
        attachments: [
            ...getAttachments(attachmentGroups.AssaultRifle_B36A4),
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