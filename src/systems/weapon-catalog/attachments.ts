import { s } from "../../lib/string-macro";

export const weaponAttachmentSlots = ['muzzle', 'barrel', 'scope', 'right_accessory', 'top_accessory', 'optic_accessory', 'ergonomics', 'underbarrel', 'magazine', 'ammunition'] as const;
export type WeaponAttachmentSlot = typeof weaponAttachmentSlots[number];
export type WeaponAttachment = { id: string, name: string, attachment: mod.WeaponAttachments, slot: WeaponAttachmentSlot };

// Central attachment registry - each attachment defined once
export const attachmentRegistry: Record<string, WeaponAttachment> = {
    // Muzzle attachments
    "attachment_Muzzle_Flash_Hider": { 
        id: "attachment_Muzzle_Flash_Hider", 
        name: s`FLASH HIDER`, 
        attachment: mod.WeaponAttachments.Muzzle_Flash_Hider, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Double_port_Brake": { 
        id: "attachment_Muzzle_Double_port_Brake", 
        name: s`DOUBLE PORT BRAKE`, 
        attachment: mod.WeaponAttachments.Muzzle_Double_port_Brake, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Linear_Comp": { 
        id: "attachment_Muzzle_Linear_Comp", 
        name: s`LINEAR COMPENSATOR`, 
        attachment: mod.WeaponAttachments.Muzzle_Linear_Comp, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Standard_Suppressor": { 
        id: "attachment_Muzzle_Standard_Suppressor", 
        name: s`STANDARD SUPPRESSOR`, 
        attachment: mod.WeaponAttachments.Muzzle_Standard_Suppressor, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Long_Suppressor": { 
        id: "attachment_Muzzle_Long_Suppressor", 
        name: s`LONG SUPPRESSOR`, 
        attachment: mod.WeaponAttachments.Muzzle_Long_Suppressor, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_CQB_Suppressor": { 
        id: "attachment_Muzzle_CQB_Suppressor", 
        name: s`CQB SUPPRESSOR`, 
        attachment: mod.WeaponAttachments.Muzzle_CQB_Suppressor, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Compensated_Brake": { 
        id: "attachment_Muzzle_Compensated_Brake", 
        name: s`COMPENSATED BRAKE`, 
        attachment: mod.WeaponAttachments.Muzzle_Compensated_Brake, 
        slot: "muzzle" 
    },
    "attachment_Muzzle_Lightened_Suppressor": { 
        id: "attachment_Muzzle_Lightened_Suppressor", 
        name: s`LIGHTENED SUPPRESSOR`, 
        attachment: mod.WeaponAttachments.Muzzle_Lightened_Suppressor, 
        slot: "muzzle" 
    },

    // Barrel attachments
    "attachment_Barrel_165_Rifle": { 
        id: "attachment_Barrel_165_Rifle", 
        name: s`16.5" RIFLE`, 
        attachment: mod.WeaponAttachments.Barrel_165_Rifle, 
        slot: "barrel" 
    },
    "attachment_Barrel_189_Prototype": { 
        id: "attachment_Barrel_189_Prototype", 
        name: s`18.9" PROTOTYPE`, 
        attachment: mod.WeaponAttachments.Barrel_189_Prototype, 
        slot: "barrel" 
    },
    "attachment_Barrel_145_Standard": { 
        id: "attachment_Barrel_145_Standard", 
        name: s`14.5" STANDARD`, 
        attachment: mod.WeaponAttachments.Barrel_145_Standard, 
        slot: "barrel" 
    },
    "attachment_Barrel_165_Fluted": { 
        id: "attachment_Barrel_165_Fluted", 
        name: s`16.5" FLUTED`, 
        attachment: mod.WeaponAttachments.Barrel_165_Fluted, 
        slot: "barrel" 
    },
    "attachment_Barrel_480mm_Factory": {
        id: "attachment_Barrel_480mm_Factory",
        name: s`480MM FACTORY`,
        attachment: mod.WeaponAttachments.Barrel_480mm_Factory,
        slot: "barrel"
    },
    "attachment_Barrel_480mm_MG": {
        id: "attachment_Barrel_480mm_MG",
        name: s`480MM MG`,
        attachment: mod.WeaponAttachments.Barrel_480mm_MG,
        slot: "barrel"
    },
    "attachment_Barrel_510mm_Fluted": {
        id: "attachment_Barrel_510mm_Fluted",
        name: s`510MM FLUTED`,
        attachment: mod.WeaponAttachments.Barrel_510mm_Fluted,
        slot: "barrel"
    },
    "attachment_Barrel_480mm_Fluted": {
        id: "attachment_Barrel_480mm_Fluted",
        name: s`480MM FLUTED`,
        attachment: mod.WeaponAttachments.Barrel_480mm_Fluted,
        slot: "barrel"
    },
    "attachment_Barrel_510mm_DMR": {
        id: "attachment_Barrel_510mm_DMR",
        name: s`510MM DMR`,
        attachment: mod.WeaponAttachments.Barrel_510mm_DMR,
        slot: "barrel"
    },
    "attachment_Barrel_391mm_CQB": {
        id: "attachment_Barrel_391mm_CQB",
        name: s`391MM CQB`,
        attachment: mod.WeaponAttachments.Barrel_391mm_CQB,
        slot: "barrel"
    },

    // Scope attachments
    "attachment_Scope_Iron_Sights": { 
        id: "attachment_Scope_Iron_Sights", 
        name: s`IRON SIGHTS`, 
        attachment: mod.WeaponAttachments.Scope_Iron_Sights, 
        slot: "scope" 
    },
    "attachment_Scope_Mini_Flex_100x": { 
        id: "attachment_Scope_Mini_Flex_100x", 
        name: s`MINI FLEX 1.00x`, 
        attachment: mod.WeaponAttachments.Scope_Mini_Flex_100x, 
        slot: "scope" 
    },
    "attachment_Scope_R_MR_100x": { 
        id: "attachment_Scope_R_MR_100x", 
        name: s`R-MR 1.00x`, 
        attachment: mod.WeaponAttachments.Scope_R_MR_100x, 
        slot: "scope" 
    },
    "attachment_Scope_Osa_7_100x": { 
        id: "attachment_Scope_Osa_7_100x", 
        name: s`OSA-7 1.00x`, 
        attachment: mod.WeaponAttachments.Scope_Osa_7_100x, 
        slot: "scope" 
    },
    "attachment_Scope_CQ_RDS_125x": { 
        id: "attachment_Scope_CQ_RDS_125x", 
        name: s`CQ RDS 1.25x`, 
        attachment: mod.WeaponAttachments.Scope_CQ_RDS_125x, 
        slot: "scope" 
    },
    "attachment_Scope_2PRO_125x": { 
        id: "attachment_Scope_2PRO_125x", 
        name: s`2PRO 1.25x`, 
        attachment: mod.WeaponAttachments.Scope_2Pro_125x, 
        slot: "scope" 
    },
    "attachment_Scope_RO_S_125x": { 
        id: "attachment_Scope_RO_S_125x", 
        name: s`RO-S 1.25x`, 
        attachment: mod.WeaponAttachments.Scope_RO_S_125x, 
        slot: "scope" 
    },
    "attachment_Scope_ROX_150x": { 
        id: "attachment_Scope_ROX_150x", 
        name: s`ROX 1.50x`, 
        attachment: mod.WeaponAttachments.Scope_ROX_150x, 
        slot: "scope" 
    },
    "attachment_Scope_GRIM_150x": { 
        id: "attachment_Scope_GRIM_150x", 
        name: s`GRIM 1.50x`, 
        attachment: mod.WeaponAttachments.Scope_GRIM_150x, 
        slot: "scope" 
    },
    "attachment_Scope_SU_123_150x": { 
        id: "attachment_Scope_SU_123_150x", 
        name: s`SU-123 1.50x`, 
        attachment: mod.WeaponAttachments.Scope_SU_123_150x, 
        slot: "scope" 
    },
    "attachment_Scope_1p87_150x": { 
        id: "attachment_Scope_1p87_150x", 
        name: s`1P87 1.50x`, 
        attachment: mod.WeaponAttachments.Scope_1p87_150x, 
        slot: "scope" 
    },
    "attachment_Scope_RO_M_175x": { 
        id: "attachment_Scope_RO_M_175x", 
        name: s`RO-M 1.75x`, 
        attachment: mod.WeaponAttachments.Scope_RO_M_175x, 
        slot: "scope" 
    },
    "attachment_Scope_3VZR_175x": { 
        id: "attachment_Scope_3VZR_175x", 
        name: s`3VZR 1.75x`, 
        attachment: mod.WeaponAttachments.Scope_3VZR_175x, 
        slot: "scope" 
    },
    "attachment_Scope_A_P2_175x": { 
        id: "attachment_Scope_A_P2_175x", 
        name: s`A-P2 1.75x`, 
        attachment: mod.WeaponAttachments.Scope_A_P2_175x, 
        slot: "scope" 
    },
    "attachment_Scope_CCO_200x": { 
        id: "attachment_Scope_CCO_200x", 
        name: s`CCO 2.00x`, 
        attachment: mod.WeaponAttachments.Scope_CCO_200x, 
        slot: "scope" 
    },
    "attachment_Scope_R4T_200x": { 
        id: "attachment_Scope_R4T_200x", 
        name: s`R4T 2.00x`, 
        attachment: mod.WeaponAttachments.Scope_R4T_200x, 
        slot: "scope" 
    },
    "attachment_Scope_BF_2M_250x": { 
        id: "attachment_Scope_BF_2M_250x", 
        name: s`BF-2M 2.50x`, 
        attachment: mod.WeaponAttachments.Scope_BF_2M_250x, 
        slot: "scope" 
    },
    "attachment_Scope_Baker_300x": { 
        id: "attachment_Scope_Baker_300x", 
        name: s`BAKER 3.00x`, 
        attachment: mod.WeaponAttachments.Scope_Baker_300x, 
        slot: "scope" 
    },
    "attachment_Scope_PAS_35_300x": { 
        id: "attachment_Scope_PAS_35_300x", 
        name: s`PAS-35 3.00x`, 
        attachment: mod.WeaponAttachments.Scope_PAS_35_300x, 
        slot: "scope" 
    },
    "attachment_Scope_SDO_350x": { 
        id: "attachment_Scope_SDO_350x", 
        name: s`SDO 3.5x`, 
        attachment: mod.WeaponAttachments.Scope_SDO_350x, 
        slot: "scope" 
    },
    "attachment_Scope_PVQ_31_400x": { 
        id: "attachment_Scope_PVQ_31_400x", 
        name: s`PVQ-31 4.00x`, 
        attachment: mod.WeaponAttachments.Scope_PVQ_31_400x, 
        slot: "scope" 
    },
    "attachment_Scope_LDS_450x": { 
        id: "attachment_Scope_LDS_450x", 
        name: s`LDS 4.50x`, 
        attachment: mod.WeaponAttachments.Scope_LDS_450x, 
        slot: "scope" 
    },
    "attachment_Scope_ST_Prisim_500x": { 
        id: "attachment_Scope_ST_Prisim_500x", 
        name: s`ST PRISIM 5.00x`, 
        attachment: mod.WeaponAttachments.Scope_ST_Prisim_500x, 
        slot: "scope" 
    },
    "attachment_Scope_SF_G2_500x": { 
        id: "attachment_Scope_SF_G2_500x", 
        name: s`SF-G2 5.00x`, 
        attachment: mod.WeaponAttachments.Scope_SF_G2_500x, 
        slot: "scope" 
    },
    "attachment_Scope_Mars_F_LPVO": { 
        id: "attachment_Scope_Mars_F_LPVO", 
        name: s`MARS-F LPVO`, 
        attachment: mod.WeaponAttachments.Scope_Mars_F_LPVO, 
        slot: "scope" 
    },
    "attachment_Scope_DVO_LPVO": { 
        id: "attachment_Scope_DVO_LPVO", 
        name: s`DVO LPVO`, 
        attachment: mod.WeaponAttachments.Scope_DVO_LPVO, 
        slot: "scope" 
    },
    "attachment_Scope_MC_CO_LPVO": { 
        id: "attachment_Scope_MC_CO_LPVO", 
        name: s`MC-CO LPVO`, 
        attachment: mod.WeaponAttachments.Scope_MC_CO_LPVO, 
        slot: "scope" 
    },

    // Underbarrel attachments
    "attachment_Bottom_Folding_Vertical": { 
        id: "attachment_Bottom_Folding_Vertical", 
        name: s`FOLDING VERTICAL`, 
        attachment: mod.WeaponAttachments.Bottom_Folding_Vertical, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Alloy_Vertical": { 
        id: "attachment_Bottom_Alloy_Vertical", 
        name: s`ALLOY VERTICAL`, 
        attachment: mod.WeaponAttachments.Bottom_Alloy_Vertical, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Ribbed_Vertical": { 
        id: "attachment_Bottom_Ribbed_Vertical", 
        name: s`RIBBED VERTICAL`, 
        attachment: mod.WeaponAttachments.Bottom_Ribbed_Vertical, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_6H64_Vertical": { 
        id: "attachment_Bottom_6H64_Vertical", 
        name: s`6H64 VERTICAL`, 
        attachment: mod.WeaponAttachments.Bottom_6H64_Vertical, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Classic_Vertical": { 
        id: "attachment_Bottom_Classic_Vertical", 
        name: s`CLASSIC VERTICAL`, 
        attachment: mod.WeaponAttachments.Bottom_Classic_Vertical, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Underslung_Mount": { 
        id: "attachment_Bottom_Underslung_Mount", 
        name: s`UNDERSLUNG MOUNT`, 
        attachment: mod.WeaponAttachments.Bottom_Underslung_Mount, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Folding_Stubby": { 
        id: "attachment_Bottom_Folding_Stubby", 
        name: s`FOLDING STUBBY`, 
        attachment: mod.WeaponAttachments.Bottom_Folding_Stubby, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Ribbed_Stubby": { 
        id: "attachment_Bottom_Ribbed_Stubby", 
        name: s`RIBBED STUBBY`, 
        attachment: mod.WeaponAttachments.Bottom_Ribbed_Stubby, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Canted_Stubby": { 
        id: "attachment_Bottom_Canted_Stubby", 
        name: s`CANTED STUBBY`, 
        attachment: mod.WeaponAttachments.Bottom_Canted_Stubby, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Stippled_Stubby": { 
        id: "attachment_Bottom_Stippled_Stubby", 
        name: s`STIPPLED STUBBY`, 
        attachment: mod.WeaponAttachments.Bottom_Stippled_Stubby, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Full_Angled": { 
        id: "attachment_Bottom_Full_Angled", 
        name: s`FULL ANGLED`, 
        attachment: mod.WeaponAttachments.Bottom_Full_Angled, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_PTT_Grip_Pod": { 
        id: "attachment_Bottom_PTT_Grip_Pod", 
        name: s`PTT GRIP POD`, 
        attachment: mod.WeaponAttachments.Bottom_PTT_Grip_Pod, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Bipod": { 
        id: "attachment_Bottom_Bipod", 
        name: s`BIPOD`, 
        attachment: mod.WeaponAttachments.Bottom_Bipod, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_QD_Grip_Pod": { 
        id: "attachment_Bottom_QD_Grip_Pod", 
        name: s`QD GRIP POD`, 
        attachment: mod.WeaponAttachments.Bottom_QD_Grip_Pod, 
        slot: "underbarrel" 
    },
    "attachment_Bottom_Classic_Grip_Pod": { 
        id: "attachment_Bottom_Classic_Grip_Pod", 
        name: s`CLASSIC GRIP POD`, 
        attachment: mod.WeaponAttachments.Bottom_Classic_Grip_Pod, 
        slot: "underbarrel" 
    },

    // Right accessory attachments
    "attachment_Right_Flashlight": {
        id: "attachment_Right_Flashlight",
        name: s`FLASHLIGHT`,
        attachment: mod.WeaponAttachments.Right_Flashlight,
        slot: "right_accessory" 
    },

    // Top accessory attachments
    "attachment_Top_5_mW_Red": {
        id: "attachment_Top_5_mW_Red",
        name: s`5 MW RED`,
        attachment: mod.WeaponAttachments.Top_5_mW_Red,
        slot: "top_accessory" 
    },
    "attachment_Top_5_mW_Green": {
        id: "attachment_Top_5_mW_Green",
        name: s`5 MW GREEN`,
        attachment: mod.WeaponAttachments.Top_5_mW_Green,
        slot: "top_accessory" 
    },
    "attachment_Top_50_mW_Green": {
        id: "attachment_Top_50_mW_Green",
        name: s`50 MW GREEN`,
        attachment: mod.WeaponAttachments.Top_50_mW_Green,
        slot: "top_accessory" 
    },
    "attachment_Top_50_mW_Blue": {
        id: "attachment_Top_50_mW_Blue",
        name: s`50 MW BLUE`,
        attachment: mod.WeaponAttachments.Top_50_mW_Blue,
        slot: "top_accessory" 
    },
    "attachment_Top_120_mW_Blue": {
        id: "attachment_Top_120_mW_Blue",
        name: s`120 MW BLUE`,
        attachment: mod.WeaponAttachments.Top_120_mW_Blue,
        slot: "top_accessory" 
    },

    // Optic Accessory attachments
    "attachment_Scope_Canted_Iron_Sights": {
        id: "Scope_Canted_Iron_Sights",
        name: s`CANTED IRON SIGHTS`,
        attachment: mod.WeaponAttachments.Scope_Canted_Iron_Sights,
        slot: "optic_accessory" 
    },
    "attachment_Scope_Piggyback_Reflex": {
        id: "Scope_Piggyback_Reflex",
        name: s`PIGGYBACK REFLEX`,
        attachment: mod.WeaponAttachments.Scope_Piggyback_Reflex,
        slot: "optic_accessory" 
    },

    // Ergonimics attachments
    "attachment_Ergonomic_Magwell_Flare":{
        id: "attachment_Ergonomic_Magwell_Flare",
        name: s`MAGWELL FLARE`,
        slot: "ergonomics",
        attachment: mod.WeaponAttachments.Ergonomic_Magwell_Flare
    },
    "attachment_Ergonomic_Match_Trigger":{
        id: "attachment_Ergonomic_Match_Trigger",
        name: s`MAGWELL FLARE`,
        slot: "ergonomics",
        attachment: mod.WeaponAttachments.Ergonomic_Match_Trigger
    },

    // Magazine attachments
    "attachment_Magazine_20rnd_Magazine": {
        id: "attachment_Magazine_20rnd_Magazine",
        name: s`20RND MAGAZINE`,
        attachment: mod.WeaponAttachments.Magazine_20rnd_Magazine,
        slot: "magazine" 
    },
    "attachment_Magazine_20rnd_Fast_Mag": {
        id: "attachment_Magazine_20rnd_Fast_Mag",
        name: s`20RND FAST MAG`,
        attachment: mod.WeaponAttachments.Magazine_20rnd_Fast_Mag,
        slot: "magazine" 
    },
    "attachment_Magazine_30rnd_Magazine": {
        id: "attachment_Magazine_30rnd_Magazine",
        name: s`30RND MAGAZINE`,
        attachment: mod.WeaponAttachments.Magazine_30rnd_Magazine,
        slot: "magazine" 
    },
    "attachment_Magazine_30rnd_Fast_Mag": {
        id: "attachment_Magazine_30rnd_Fast_Mag",
        name: s`30RND FAST MAG`,
        attachment: mod.WeaponAttachments.Magazine_30rnd_Fast_Mag,
        slot: "magazine" 
    },
    "attachment_Magazine_36rnd_Magazine": {
        id: "attachment_Magazine_36rnd_Magazine",
        name: s`36RND MAGAZINE`,
        attachment: mod.WeaponAttachments.Magazine_36rnd_Magazine,
        slot: "magazine" 
    },
    "attachment_Magazine_40rnd_Magazine": {
        id: "attachment_Magazine_40rnd_Magazine",
        name: s`40RND MAGAZINE`,
        attachment: mod.WeaponAttachments.Magazine_40rnd_Magazine,
        slot: "magazine" 
    },
    "attachment_Magazine_40rnd_Fast_Mag": {
        id: "attachment_Magazine_40rnd_Fast_Mag",
        name: s`40RND FAST MAG`,
        attachment: mod.WeaponAttachments.Magazine_40rnd_Fast_Mag,
        slot: "magazine" 
    },
    "attachment_Magazine_45rnd_Magazine": {
        id: "attachment_Magazine_45rnd_Magazine",
        name: s`45RND MAGAZINE`,
        attachment: mod.WeaponAttachments.Magazine_45rnd_Magazine,
        slot: "magazine" 
    },
    "attachment_Magazine_45rnd_Fast_Mag": {
        id: "attachment_Magazine_45rnd_Fast_Mag",
        name: s`45RND FAST MAG`,
        attachment: mod.WeaponAttachments.Magazine_45rnd_Fast_Mag,
        slot: "magazine" 
    },

    // Ammunition attachments
    "attachment_Ammo_FMJ": {
        id: "attachment_Ammo_FMJ",
        name: s`FMJ`,
        attachment: mod.WeaponAttachments.Ammo_FMJ,
        slot: "ammunition" 
    },
    "attachment_Ammo_Tungsten_Core": {
        id: "attachment_Ammo_Tungsten_Core",
        name: s`TUNGSTEN CORE`,
        attachment: mod.WeaponAttachments.Ammo_Tungsten_Core,
        slot: "ammunition" 
    },
    "attachment_Ammo_Hollow_Point": {
        id: "attachment_Ammo_Hollow_Point",
        name: s`HOLLOW POINT`,
        attachment: mod.WeaponAttachments.Ammo_Hollow_Point,
        slot: "ammunition" 
    },
    "attachment_Ammo_Polymer_Case": {
        id: "attachment_Ammo_Polymer_Case",
        name: s`POLYMER CASE`,
        attachment: mod.WeaponAttachments.Ammo_Polymer_Case,
        slot: "ammunition" 
    },
    "attachment_Ammo_Frangible": {
        id: "attachment_Ammo_Frangible",
        name: s`FRANGIBLE`,
        attachment: mod.WeaponAttachments.Ammo_Frangible,
        slot: "ammunition" 
    },
    "attachment_Ammo_Synthetic_Tip": {
        id: "attachment_Ammo_Synthetic_Tip",
        name: s`SYNTHETIC TIP`,
        attachment: mod.WeaponAttachments.Ammo_Synthetic_Tip,
        slot: "ammunition" 
    },
};

// Helper function to get attachments by their IDs
export function getAttachments(ids: string[]): WeaponAttachment[] {
    return ids.map(id => attachmentRegistry[id]).filter(Boolean);
}

// Common attachment groups for different weapon types
export const attachmentGroups = {
    "AssaultRifle_M433": [
        "attachment_Muzzle_Flash_Hider",
        "attachment_Muzzle_Double_port_Brake",
        "attachment_Muzzle_Compensated_Brake",
        "attachment_Muzzle_Linear_Comp",
        "attachment_Muzzle_Standard_Suppressor",
        "attachment_Muzzle_Long_Suppressor",
        "attachment_Muzzle_CQB_Suppressor",
        "attachment_Muzzle_Lightened_Suppressor",
        "attachment_Barrel_165_Rifle",
        "attachment_Barrel_189_Prototype",
        "attachment_Barrel_145_Standard",
        "attachment_Barrel_165_Fluted",
        "attachment_Scope_Iron_Sights",
        "attachment_Scope_Mini_Flex_100x",
        "attachment_Scope_R_MR_100x",
        "attachment_Scope_Osa_7_100x",
        "attachment_Scope_CQ_RDS_125x",
        "attachment_Scope_2PRO_125x",
        "attachment_Scope_RO_S_125x",
        "attachment_Scope_ROX_150x",
        "attachment_Scope_GRIM_150x",
        "attachment_Scope_SU_123_150x",
        "attachment_Scope_1p87_150x",
        "attachment_Scope_RO_M_175x",
        "attachment_Scope_3VZR_175x",
        "attachment_Scope_A_P2_175x",
        "attachment_Scope_CCO_200x",
        "attachment_Scope_R4T_200x",
        "attachment_Scope_BF_2M_250x",
        "attachment_Scope_Baker_300x",
        "attachment_Scope_PAS_35_300x",
        "attachment_Scope_SDO_350x",
        "attachment_Scope_PVQ_31_400x",
        "attachment_Scope_LDS_450x",
        "attachment_Scope_ST_Prisim_500x",
        "attachment_Scope_SF_G2_500x",
        "attachment_Scope_Mars_F_LPVO",
        "attachment_Scope_DVO_LPVO",
        "attachment_Scope_MC_CO_LPVO",
        "attachment_Bottom_Folding_Vertical",
        "attachment_Bottom_Alloy_Vertical",
        "attachment_Bottom_Ribbed_Vertical",
        "attachment_Bottom_6H64_Vertical",
        "attachment_Bottom_Classic_Vertical",
        "attachment_Bottom_Underslung_Mount",
        "attachment_Bottom_Folding_Stubby",
        "attachment_Bottom_Ribbed_Stubby",
        "attachment_Bottom_Canted_Stubby",
        "attachment_Bottom_Stippled_Stubby",
        "attachment_Bottom_Full_Angled",
        "attachment_Bottom_PTT_Grip_Pod",
        "attachment_Bottom_Bipod",
        "attachment_Bottom_QD_Grip_Pod",
        "attachment_Bottom_Classic_Grip_Pod",
        "attachment_Right_Flashlight",
        "attachment_Top_5_mW_Red",
        "attachment_Top_5_mW_Green",
        "attachment_Top_50_mW_Green",
        "attachment_Top_50_mW_Blue",
        "attachment_Top_120_mW_Blue",
        "attachment_Scope_Canted_Iron_Sights",
        "attachment_Scope_Piggyback_Reflex",
        "attachment_Ergonomic_Magwell_Flare",
        "attachment_Ergonomic_Match_Trigger",
        "attachment_Magazine_20rnd_Magazine",
        "attachment_Magazine_20rnd_Fast_Mag",
        "attachment_Magazine_30rnd_Magazine",
        "attachment_Magazine_30rnd_Fast_Mag",
        "attachment_Magazine_36rnd_Magazine",
        "attachment_Magazine_40rnd_Magazine",
        "attachment_Magazine_40rnd_Fast_Mag",
        "attachment_Ammo_FMJ",
        "attachment_Ammo_Tungsten_Core",
        "attachment_Ammo_Hollow_Point",
        "attachment_Ammo_Polymer_Case",
        "attachment_Ammo_Frangible",
    ],
    // Muzzles same, barrels different
    "AssaultRifle_B36A4": [
        "attachment_Muzzle_Flash_Hider",
        "attachment_Muzzle_Double_port_Brake",
        "attachment_Muzzle_Compensated_Brake",
        "attachment_Muzzle_Linear_Comp",
        "attachment_Muzzle_Standard_Suppressor",
        "attachment_Muzzle_Long_Suppressor",
        "attachment_Muzzle_CQB_Suppressor",
        "attachment_Muzzle_Lightened_Suppressor",
        "attachment_Barrel_391mm_CQB",
        "attachment_Barrel_480mm_Factory",
        "attachment_Barrel_480mm_MG",
        "attachment_Barrel_480mm_Fluted",
        "attachment_Barrel_510mm_Fluted",
        "attachment_Barrel_510mm_DMR",
        "attachment_Right_Flashlight",
        "attachment_Right_Flashlight",
        "attachment_Top_5_mW_Red",
        "attachment_Top_5_mW_Green",
        "attachment_Top_50_mW_Green",
        "attachment_Top_50_mW_Blue",
        "attachment_Top_120_mW_Blue",
        "attachment_Scope_Iron_Sights",
        "attachment_Scope_Mini_Flex_100x",
        "attachment_Scope_R_MR_100x",
        "attachment_Scope_Osa_7_100x",
        "attachment_Scope_CQ_RDS_125x",
        "attachment_Scope_2PRO_125x",
        "attachment_Scope_RO_S_125x",
        "attachment_Scope_ROX_150x",
        "attachment_Scope_GRIM_150x",
        "attachment_Scope_SU_123_150x",
        "attachment_Scope_1p87_150x",
        "attachment_Scope_RO_M_175x",
        "attachment_Scope_3VZR_175x",
        "attachment_Scope_A_P2_175x",
        "attachment_Scope_CCO_200x",
        "attachment_Scope_R4T_200x",
        "attachment_Scope_BF_2M_250x",
        "attachment_Scope_Baker_300x",
        "attachment_Scope_PAS_35_300x",
        "attachment_Scope_SDO_350x",
        "attachment_Scope_PVQ_31_400x",
        "attachment_Scope_LDS_450x",
        "attachment_Scope_ST_Prisim_500x",
        "attachment_Scope_SF_G2_500x",
        "attachment_Scope_Mars_F_LPVO",
        "attachment_Scope_DVO_LPVO",
        "attachment_Scope_MC_CO_LPVO",
        "attachment_Scope_Canted_Iron_Sights",
        "attachment_Ergonomic_Match_Trigger",
        "attachment_Ammo_FMJ",
        "attachment_Ammo_Tungsten_Core",
        "attachment_Ammo_Hollow_Point",
        "attachment_Ammo_Polymer_Case",
        "attachment_Ammo_Frangible",
        "attachment_Ammo_Synthetic_Tip",
        "attachment_Magazine_20rnd_Magazine",
        "attachment_Magazine_20rnd_Fast_Mag",
        "attachment_Magazine_30rnd_Magazine",
        "attachment_Magazine_30rnd_Fast_Mag",
        "attachment_Magazine_36rnd_Magazine",
        "attachment_Magazine_40rnd_Magazine",
        "attachment_Magazine_40rnd_Fast_Mag",
        "attachment_Magazine_45rnd_Magazine",
        "attachment_Magazine_45rnd_Fast_Mag",
        "attachment_Bottom_Folding_Vertical",
        "attachment_Bottom_Alloy_Vertical",
        "attachment_Bottom_Ribbed_Vertical",
        "attachment_Bottom_6H64_Vertical",
        "attachment_Bottom_Classic_Vertical",
        "attachment_Bottom_Underslung_Mount",
        "attachment_Bottom_Folding_Stubby",
        "attachment_Bottom_Ribbed_Stubby",
        "attachment_Bottom_Canted_Stubby",
        "attachment_Bottom_Stippled_Stubby",
        "attachment_Bottom_Full_Angled",
        "attachment_Bottom_PTT_Grip_Pod",
        "attachment_Bottom_Bipod",
        "attachment_Bottom_QD_Grip_Pod",
        "attachment_Bottom_Classic_Grip_Pod",
    ]

};