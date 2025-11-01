import { s } from "../../lib/string-macro";
import { generatedAttachmentRegistry, generatedWeaponAttachments } from "./generated/attachments";
import { weaponRecords } from "./generated/weapons";

export const weaponAttachmentSlots = [
    "muzzle",
    "barrel",
    "scope",
    "right_accessory",
    "top_accessory",
    "left_accessory",
    "optic_accessory",
    "ergonomics",
    "underbarrel",
    "magazine",
    "ammunition"
] as const;
export type WeaponAttachmentSlot = typeof weaponAttachmentSlots[number];

export type WeaponAttachment = {
    id: string;
    name: string;
    attachment: mod.WeaponAttachments;
    slot: WeaponAttachmentSlot;
};

export type AttachmentKey = keyof typeof generatedAttachmentRegistry;

const attachmentRegistryData = generatedAttachmentRegistry as Record<AttachmentKey, WeaponAttachment>;
const weaponAttachmentsData = generatedWeaponAttachments as Record<string, readonly AttachmentKey[]>;

export const attachmentRegistry = attachmentRegistryData;
export const weaponAttachments = weaponAttachmentsData;

export const weaponCategories = [
    "assault",
    "carbine",
    "dmr",
    "lmg",
    "shotgun",
    "pistol",
    "smg",
    "sniper"
] as const;
export type WeaponCategory = typeof weaponCategories[number];

export type WeaponRecord = {
    id: string;
    weapon: mod.Weapons;
    name: string;
    category: WeaponCategory;
    attachmentSlots: readonly WeaponAttachmentSlot[];
    attachmentIds: readonly AttachmentKey[];
};

const records = weaponRecords as readonly WeaponRecord[];

export type WeaponDefinition = {
    id: string;
    weapon: mod.Weapons;
    name: string;
    category: WeaponCategory;
    attachmentSlots: WeaponAttachmentSlot[];
    attachments: WeaponAttachment[];
};

const weaponsList: WeaponDefinition[] = records.map((record) => ({
    id: record.id,
    weapon: record.weapon,
    name: record.name,
    category: record.category,
    attachmentSlots: [...record.attachmentSlots],
    attachments: record.attachmentIds.map((attachmentId) => attachmentRegistryData[attachmentId])
}));

const weaponsById = new Map<string, WeaponDefinition>(weaponsList.map((weapon) => [weapon.id, weapon]));

export const weapons = weaponsList;

export const weaponCategoryNames: Record<WeaponCategory, string> = {
    assault: s`ASSAULT`,
    carbine: s`CARBINE`,
    dmr: s`DMR`,
    lmg: s`LMG`,
    shotgun: s`SHOTGUN`,
    pistol: s`PISTOL`,
    smg: s`SMG`,
    sniper: s`SNIPER`
};

export const weaponAttachmentSlotNames: Record<WeaponAttachmentSlot, string> = {
    muzzle: s`MUZZLE`,
    barrel: s`BARREL`,
    scope: s`SCOPE`,
    right_accessory: s`RIGHT ACCESSORY`,
    top_accessory: s`TOP ACCESSORY`,
    left_accessory: s`LEFT ACCESSORY`,
    optic_accessory: s`OPTIC ACCESSORY`,
    ergonomics: s`ERGONOMICS`,
    underbarrel: s`UNDERBARREL`,
    magazine: s`MAGAZINE`,
    ammunition: s`AMMUNITION`
};

export function getWeaponsByCategory(category: WeaponCategory): WeaponDefinition[] {
    return weapons.filter((weapon) => weapon.category === category);
}

export function getAvailableAttachmentSlots(weaponId: string): WeaponAttachmentSlot[] {
    return weaponsById.get(weaponId)?.attachmentSlots ?? [];
}

export function getWeaponAttachmentsBySlot(weaponId: string, slot: WeaponAttachmentSlot): WeaponAttachment[] {
    const weapon = weaponsById.get(weaponId);
    if (!weapon) return [];
    return weapon.attachments.filter((attachment) => attachment.slot === slot);
}

export function isValidAttachmentSlotForWeapon(weaponId: string, slot: WeaponAttachmentSlot): boolean {
    const weapon = weaponsById.get(weaponId);
    return weapon ? weapon.attachmentSlots.includes(slot) : false;
}

export function getWeaponById(id: string): WeaponDefinition | undefined {
    return weaponsById.get(id);
}

export function getWeaponAttachment(weaponId: string, attachmentId: string): WeaponAttachment | undefined {
    const weapon = weaponsById.get(weaponId);
    if (!weapon) return undefined;
    return weapon.attachments.find((attachment) => attachment.id === attachmentId);
}

export function getAttachments(ids: AttachmentKey[]): WeaponAttachment[] {
    return ids.map((id) => attachmentRegistryData[id]);
}

export function getCategoriesWithAvailableWeapons(): WeaponCategory[] {
    const categorySet = new Set<WeaponCategory>();
    weapons.forEach((weapon) => categorySet.add(weapon.category));
    return Array.from(categorySet);
}
