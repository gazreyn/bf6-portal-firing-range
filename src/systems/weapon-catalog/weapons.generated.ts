// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-weapons' to regenerate.

import { s } from "../../lib/string-macro";
import { getAttachments, weaponAttachments, type WeaponAttachmentSlot, type WeaponAttachment, type AttachmentKey } from "./attachments.generated";

export const weaponCategories = ["assault","carbine","dmr","lmg","shotgun","pistol","smg","sniper"] as const;
export type WeaponCategory = typeof weaponCategories[number];

export type WeaponDefinition = { 
    id: string; 
    weapon: mod.Weapons; 
    name: string; 
    category: WeaponCategory; 
    attachmentSlots: WeaponAttachmentSlot[]; 
    attachments: WeaponAttachment[] 
};

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
        id: 'gun_AssaultRifle_AK4D',
        weapon: mod.Weapons.AssaultRifle_AK4D,
        name: s`AK4D`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_AK4D'] || [])
    },
    {
        id: 'gun_AssaultRifle_B36A4',
        weapon: mod.Weapons.AssaultRifle_B36A4,
        name: s`B36A4`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_B36A4'] || [])
    },
    {
        id: 'gun_AssaultRifle_KORD_6P67',
        weapon: mod.Weapons.AssaultRifle_KORD_6P67,
        name: s`KORD 6P67`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_KORD_6P67'] || [])
    },
    {
        id: 'gun_AssaultRifle_L85A3',
        weapon: mod.Weapons.AssaultRifle_L85A3,
        name: s`L85A3`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_L85A3'] || [])
    },
    {
        id: 'gun_AssaultRifle_M433',
        weapon: mod.Weapons.AssaultRifle_M433,
        name: s`M433`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_M433'] || [])
    },
    {
        id: 'gun_AssaultRifle_NVO_228E',
        weapon: mod.Weapons.AssaultRifle_NVO_228E,
        name: s`NVO 228E`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_NVO_228E'] || [])
    },
    {
        id: 'gun_AssaultRifle_SOR_556_Mk2',
        weapon: mod.Weapons.AssaultRifle_SOR_556_Mk2,
        name: s`SOR 556 MK2`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_SOR_556_Mk2'] || [])
    },
    {
        id: 'gun_AssaultRifle_TR_7',
        weapon: mod.Weapons.AssaultRifle_TR_7,
        name: s`TR 7`,
        category: "assault",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['AssaultRifle_TR_7'] || [])
    },
    {
        id: 'gun_Carbine_AK_205',
        weapon: mod.Weapons.Carbine_AK_205,
        name: s`AK 205`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_AK_205'] || [])
    },
    {
        id: 'gun_Carbine_GRT_BC',
        weapon: mod.Weapons.Carbine_GRT_BC,
        name: s`GRT BC`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_GRT_BC'] || [])
    },
    {
        id: 'gun_Carbine_M277',
        weapon: mod.Weapons.Carbine_M277,
        name: s`M277`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_M277'] || [])
    },
    {
        id: 'gun_Carbine_M417_A2',
        weapon: mod.Weapons.Carbine_M417_A2,
        name: s`M417 A2`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_M417_A2'] || [])
    },
    {
        id: 'gun_Carbine_M4A1',
        weapon: mod.Weapons.Carbine_M4A1,
        name: s`M4A1`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_M4A1'] || [])
    },
    {
        id: 'gun_Carbine_QBZ_192',
        weapon: mod.Weapons.Carbine_QBZ_192,
        name: s`QBZ 192`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_QBZ_192'] || [])
    },
    {
        id: 'gun_Carbine_SG_553R',
        weapon: mod.Weapons.Carbine_SG_553R,
        name: s`SG 553R`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_SG_553R'] || [])
    },
    {
        id: 'gun_Carbine_SOR_300SC',
        weapon: mod.Weapons.Carbine_SOR_300SC,
        name: s`SOR 300SC`,
        category: "carbine",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Carbine_SOR_300SC'] || [])
    },
    {
        id: 'gun_DMR_LMR27',
        weapon: mod.Weapons.DMR_LMR27,
        name: s`LMR27`,
        category: "dmr",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['DMR_LMR27'] || [])
    },
    {
        id: 'gun_DMR_M39_EMR',
        weapon: mod.Weapons.DMR_M39_EMR,
        name: s`M39 EMR`,
        category: "dmr",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['DMR_M39_EMR'] || [])
    },
    {
        id: 'gun_DMR_SVDM',
        weapon: mod.Weapons.DMR_SVDM,
        name: s`SVDM`,
        category: "dmr",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['DMR_SVDM'] || [])
    },
    {
        id: 'gun_DMR_SVK_86',
        weapon: mod.Weapons.DMR_SVK_86,
        name: s`SVK 86`,
        category: "dmr",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","left_accessory","top_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['DMR_SVK_86'] || [])
    },
    {
        id: 'gun_LMG_DRS_IAR',
        weapon: mod.Weapons.LMG_DRS_IAR,
        name: s`DRS IAR`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_DRS_IAR'] || [])
    },
    {
        id: 'gun_LMG_KTS100_MK8',
        weapon: mod.Weapons.LMG_KTS100_MK8,
        name: s`KTS100 MK8`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_KTS100_MK8'] || [])
    },
    {
        id: 'gun_LMG_L110',
        weapon: mod.Weapons.LMG_L110,
        name: s`L110`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_L110'] || [])
    },
    {
        id: 'gun_LMG_M_60',
        weapon: mod.Weapons.LMG_M_60,
        name: s`M 60`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_M_60'] || [])
    },
    {
        id: 'gun_LMG_M123K',
        weapon: mod.Weapons.LMG_M123K,
        name: s`M123K`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_M123K'] || [])
    },
    {
        id: 'gun_LMG_M240L',
        weapon: mod.Weapons.LMG_M240L,
        name: s`M240L`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_M240L'] || [])
    },
    {
        id: 'gun_LMG_M250',
        weapon: mod.Weapons.LMG_M250,
        name: s`M250`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_M250'] || [])
    },
    {
        id: 'gun_LMG_RPKM',
        weapon: mod.Weapons.LMG_RPKM,
        name: s`RPKM`,
        category: "lmg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['LMG_RPKM'] || [])
    },
    {
        id: 'gun_Shotgun__185KS_K',
        weapon: mod.Weapons.Shotgun__185KS_K,
        name: s` 185KS K`,
        category: "shotgun",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Shotgun__185KS_K'] || [])
    },
    {
        id: 'gun_Shotgun_M1014',
        weapon: mod.Weapons.Shotgun_M1014,
        name: s`M1014`,
        category: "shotgun",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Shotgun_M1014'] || [])
    },
    {
        id: 'gun_Shotgun_M87A1',
        weapon: mod.Weapons.Shotgun_M87A1,
        name: s`M87A1`,
        category: "shotgun",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Shotgun_M87A1'] || [])
    },
    {
        id: 'gun_Sidearm_ES_57',
        weapon: mod.Weapons.Sidearm_ES_57,
        name: s`ES 57`,
        category: "pistol",
        attachmentSlots: ["muzzle","scope","magazine","ammunition","barrel","ergonomics","underbarrel"],
        attachments: getAttachments(weaponAttachments['Sidearm_ES_57'] || [])
    },
    {
        id: 'gun_Sidearm_GGH_22',
        weapon: mod.Weapons.Sidearm_GGH_22,
        name: s`GGH 22`,
        category: "pistol",
        attachmentSlots: ["muzzle","scope","magazine","ammunition","barrel","underbarrel","ergonomics"],
        attachments: getAttachments(weaponAttachments['Sidearm_GGH_22'] || [])
    },
    {
        id: 'gun_Sidearm_M44',
        weapon: mod.Weapons.Sidearm_M44,
        name: s`M44`,
        category: "pistol",
        attachmentSlots: ["scope","magazine","ammunition","barrel"],
        attachments: getAttachments(weaponAttachments['Sidearm_M44'] || [])
    },
    {
        id: 'gun_Sidearm_M45A1',
        weapon: mod.Weapons.Sidearm_M45A1,
        name: s`M45A1`,
        category: "pistol",
        attachmentSlots: ["muzzle","scope","magazine","ammunition","barrel","ergonomics","underbarrel"],
        attachments: getAttachments(weaponAttachments['Sidearm_M45A1'] || [])
    },
    {
        id: 'gun_Sidearm_P18',
        weapon: mod.Weapons.Sidearm_P18,
        name: s`P18`,
        category: "pistol",
        attachmentSlots: ["muzzle","scope","magazine","ammunition","barrel","ergonomics","underbarrel"],
        attachments: getAttachments(weaponAttachments['Sidearm_P18'] || [])
    },
    {
        id: 'gun_SMG_KV9',
        weapon: mod.Weapons.SMG_KV9,
        name: s`KV9`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_KV9'] || [])
    },
    {
        id: 'gun_SMG_PW5A3',
        weapon: mod.Weapons.SMG_PW5A3,
        name: s`PW5A3`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_PW5A3'] || [])
    },
    {
        id: 'gun_SMG_PW7A2',
        weapon: mod.Weapons.SMG_PW7A2,
        name: s`PW7A2`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_PW7A2'] || [])
    },
    {
        id: 'gun_SMG_SCW_10',
        weapon: mod.Weapons.SMG_SCW_10,
        name: s`SCW 10`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_SCW_10'] || [])
    },
    {
        id: 'gun_SMG_SGX',
        weapon: mod.Weapons.SMG_SGX,
        name: s`SGX`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","top_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_SGX'] || [])
    },
    {
        id: 'gun_SMG_SL9',
        weapon: mod.Weapons.SMG_SL9,
        name: s`SL9`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_SL9'] || [])
    },
    {
        id: 'gun_SMG_UMG_40',
        weapon: mod.Weapons.SMG_UMG_40,
        name: s`UMG 40`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_UMG_40'] || [])
    },
    {
        id: 'gun_SMG_USG_90',
        weapon: mod.Weapons.SMG_USG_90,
        name: s`USG 90`,
        category: "smg",
        attachmentSlots: ["muzzle","barrel","scope","right_accessory","left_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['SMG_USG_90'] || [])
    },
    {
        id: 'gun_Sniper_M2010_ESR',
        weapon: mod.Weapons.Sniper_M2010_ESR,
        name: s`M2010 ESR`,
        category: "sniper",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","top_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Sniper_M2010_ESR'] || [])
    },
    {
        id: 'gun_Sniper_Mini_Scout',
        weapon: mod.Weapons.Sniper_Mini_Scout,
        name: s`MINI SCOUT`,
        category: "sniper",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Sniper_Mini_Scout'] || [])
    },
    {
        id: 'gun_Sniper_PSR',
        weapon: mod.Weapons.Sniper_PSR,
        name: s`PSR`,
        category: "sniper",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","top_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Sniper_PSR'] || [])
    },
    {
        id: 'gun_Sniper_SV_98',
        weapon: mod.Weapons.Sniper_SV_98,
        name: s`SV 98`,
        category: "sniper",
        attachmentSlots: ["muzzle","barrel","scope","underbarrel","right_accessory","left_accessory","optic_accessory","ergonomics","magazine","ammunition"],
        attachments: getAttachments(weaponAttachments['Sniper_SV_98'] || [])
    }
];

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
    ammunition: s`AMMUNITION`,
};
