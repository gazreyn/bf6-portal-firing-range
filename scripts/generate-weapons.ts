import { Project } from "ts-morph";
import path from "node:path";
import fs from "node:fs/promises";

// Type definitions for our generated data
type WeaponCategory = 'assault' | 'carbine' | 'sniper' | 'smg' | 'lmg' | 'shotgun' | 'pistol' | 'dmr';
type WeaponAttachmentSlot = 'muzzle' | 'barrel' | 'scope' | 'underbarrel' | 'right_accessory' | 'left_accessory' | 'top_accessory' | 'optic_accessory' | 'ergonomics' | 'magazine' | 'ammunition';

interface CSVAttachmentEntry {
    attachmentName: string;
    slot: string;
    weaponName: string;
}

interface WeaponAttachment {
    id: string;
    name: string;
    attachment: string;
    slot: WeaponAttachmentSlot;
}

interface WeaponDefinition {
    id: string;
    weapon: string;
    name: string;
    category: WeaponCategory;
    attachmentSlots: WeaponAttachmentSlot[];
    attachments: string[]; // Array of attachment IDs
}

// CSV processing functions
function parseCSV(csvContent: string): CSVAttachmentEntry[] {
    const lines = csvContent.trim().split('\n');
    const entries: CSVAttachmentEntry[] = [];
    
    // Skip header row if present
    const startIndex = lines[0].toLowerCase().includes('attachment') || lines[0].toLowerCase().includes('weapon') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV with potential commas in quoted fields
        const fields = parseCSVLine(line);
        if (fields.length >= 3) {
            entries.push({
                attachmentName: fields[0].trim(), // Column 1: Attachment name
                slot: fields[1].trim(),           // Column 2: Slot
                weaponName: fields[2].trim()      // Column 3: Weapon name (WeaponUnlock)
            });
        }
    }
    
    return entries;
}

function parseCSVLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    fields.push(current);
    return fields;
}

// Fuzzy matching functions
function normalizeForMatching(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/^(attachment_|gun_)/, ''); // Remove common prefixes
}

function calculateSimilarity(str1: string, str2: string): number {
    const normalized1 = normalizeForMatching(str1);
    const normalized2 = normalizeForMatching(str2);
    
    // Exact match
    if (normalized1 === normalized2) return 1.0;
    
    // Check if one contains the other
    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
        return 0.8;
    }
    
    // Levenshtein distance-based similarity
    const distance = levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    return 1 - (distance / maxLength);
}

function levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,     // deletion
                matrix[j - 1][i] + 1,     // insertion
                matrix[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    
    return matrix[str2.length][str1.length];
}

function findBestAttachmentMatch(csvAttachmentName: string, enumAttachments: string[], expectedSlot?: WeaponAttachmentSlot): string | null {
    let bestMatch = null;
    let bestScore = 0;
    const threshold = 0.6; // Minimum similarity threshold
    
    for (const enumAttachment of enumAttachments) {
        let score = calculateSimilarity(csvAttachmentName, enumAttachment);
        
        // If we have slot information, boost score for slot-compatible matches
        if (expectedSlot && score >= threshold) {
            const derivedSlot = deriveAttachmentSlot(enumAttachment);
            if (derivedSlot === expectedSlot) {
                score += 0.3; // Boost score for slot matches
            }
        }
        
        if (score > bestScore && score >= threshold) {
            bestScore = score;
            bestMatch = enumAttachment;
        }
    }
    
    return bestMatch;
}

function findBestWeaponMatch(csvWeaponName: string, enumWeapons: string[]): string | null {
    let bestMatch = null;
    let bestScore = 0;
    const threshold = 0.6;
    
    for (const enumWeapon of enumWeapons) {
        const score = calculateSimilarity(csvWeaponName, enumWeapon);
        if (score > bestScore && score >= threshold) {
            bestScore = score;
            bestMatch = enumWeapon;
        }
    }
    
    return bestMatch;
}

// Pattern matching functions
function mapCSVSlotToWeaponSlot(csvSlot: string): WeaponAttachmentSlot {
    const slot = csvSlot.toLowerCase().trim();
    
    switch (slot) {
        case 'muzzle': return 'muzzle';
        case 'barrel': return 'barrel';
        case 'scope': return 'scope';
        case 'underbarrel': return 'underbarrel';
        case 'right accessory': return 'right_accessory';
        case 'left accessory': return 'left_accessory';
        case 'top accessory': return 'top_accessory';
        case 'optic accessory': return 'optic_accessory';
        case 'ergonomics': return 'ergonomics';
        case 'magazine': return 'magazine';
        case 'ammunition': return 'ammunition';
        default:
            console.warn(`Unknown CSV slot type: ${csvSlot}`);
            return 'scope'; // fallback
    }
}

function deriveAttachmentSlot(attachmentName: string): WeaponAttachmentSlot {
    const name = attachmentName.toLowerCase();
    
    if (name.includes('muzzle_')) return 'muzzle';
    if (name.includes('barrel_')) return 'barrel';
    if (name.includes('scope_')) return 'scope';
    if (name.includes('bottom_') || name.includes('underbarrel_')) return 'underbarrel';
    if (name.includes('right_')) return 'right_accessory';
    if (name.includes('top_')) return 'top_accessory';
    if (name.includes('left_')) return 'left_accessory';
    if (name.includes('ergonomic_')) return 'ergonomics';
    if (name.includes('magazine_')) return 'magazine';
    if (name.includes('ammo_')) return 'ammunition';
    
    // Fallback
    console.warn(`Could not determine slot for attachment: ${attachmentName}`);
    return 'scope';
}

function formatDisplayName(enumName: string): string {
    // Remove common prefixes
    let name = enumName
        .replace(/^(AssaultRifle_|Carbine_|Sniper_|SMG_|LMG_|Shotgun_|Sidearm_|DMR_)/, '')
        .replace(/^(Muzzle_|Barrel_|Scope_|Bottom_|Right_|Top_|Left_|Ergonomic_|Magazine_|Ammo_)/, '');
    
    // Handle special cases and formatting
    name = name
        .replace(/_/g, ' ')
        .replace(/\b\d+x\b/g, (match) => match.toUpperCase()) // 125x -> 1.25X
        .replace(/\b(\d+)(\d{2})x\b/g, '$1.$2X') // 125x -> 1.25X
        .replace(/\bmm\b/g, 'MM')
        .replace(/\bmW\b/g, 'MW')
        .replace(/\brnd\b/g, 'RND')
        .toUpperCase();
    
    return name;
}

// Pattern matching functions for weapons
function deriveWeaponCategory(weaponName: string): WeaponCategory {
    const name = weaponName.toLowerCase();
    if (name.startsWith('assaultrifle_')) return 'assault';
    if (name.startsWith('carbine_')) return 'carbine';
    if (name.startsWith('sniper_')) return 'sniper';
    if (name.startsWith('smg_')) return 'smg';
    if (name.startsWith('lmg_')) return 'lmg';
    if (name.startsWith('shotgun_')) return 'shotgun';
    if (name.startsWith('sidearm_')) return 'pistol';
    if (name.startsWith('dmr_')) return 'dmr';
    
    // Fallback
    console.warn(`Could not determine category for weapon: ${weaponName}`);
    return 'assault';
}

function getDefaultAttachmentSlots(category: WeaponCategory): WeaponAttachmentSlot[] {
    const baseSlots: WeaponAttachmentSlot[] = ['muzzle', 'barrel', 'scope', 'underbarrel', 'right_accessory', "left_accessory", 'top_accessory', 'optic_accessory', 'ergonomics', 'magazine', 'ammunition'];
    
    switch (category) {
        case 'pistol':
            return ['muzzle', 'scope', 'right_accessory', 'top_accessory', 'magazine', 'ammunition'];
        case 'sniper':
            return ['muzzle', 'barrel', 'scope', 'underbarrel', 'right_accessory', 'top_accessory', 'left_accessory', 'optic_accessory', 'ergonomics', 'magazine', 'ammunition'];
        default:
            return baseSlots;
    }
}

async function loadCSVData(csvPath: string): Promise<CSVAttachmentEntry[]> {
    try {
        const csvContent = await fs.readFile(csvPath, 'utf-8');
        return parseCSV(csvContent);
    } catch (error) {
        console.warn(`⚠️  Could not load CSV file at ${csvPath}:`, error);
        return [];
    }
}

// Weapons to exclude from generation (for testing or content filtering)
const EXCLUDED_WEAPONS: Set<string> = new Set([
    // 'Carbine_SOR_300SC',
    // 'Sidearm_GGH_22',
    // 'Sniper_Mini_Scout',
    // Add other weapons you want to exclude
]);

// Attachments to exclude from CSV processing (don't exist in mod types)
const EXCLUDED_ATTACHMENTS: Set<string> = new Set([
    // 'Canted Reflex',
    // '60RND Fast Mag',
    // Add other CSV attachments that don't exist in the TypeScript enums
]);

async function main() {
    console.log('🔧 Generating attachments registry from TypeScript enums...');
    
    // Initialize TypeScript project
    const project = new Project({
        tsConfigFilePath: "tsconfig.json",
    });
    
    // Load the mod declaration file
    const modFile = project.addSourceFileAtPath("types/mod/index.d.ts");
    
    // Extract enums from the mod namespace
    const modNamespace = modFile.getModule("mod");
    if (!modNamespace) {
        throw new Error("Could not find 'mod' namespace in declaration file");
    }
    
    const weaponsEnum = modNamespace.getEnum("Weapons");
    const attachmentsEnum = modNamespace.getEnum("WeaponAttachments");
    
    if (!weaponsEnum || !attachmentsEnum) {
        throw new Error("Could not find Weapons or WeaponAttachments enum in mod declaration file");
    }
    
    const weaponNames = weaponsEnum.getMembers().map(m => m.getName());
    const attachmentNames = attachmentsEnum.getMembers().map(m => m.getName());
    
    console.log(`📊 Found ${weaponNames.length} weapons and ${attachmentNames.length} attachments`);
    
    // Load CSV data if available
    const csvPath = path.join(process.cwd(), 'data', 'BF6 Master Attachments List - BF6 Attachments.csv');
    const csvData = await loadCSVData(csvPath);
    console.log(`📋 Loaded ${csvData.length} entries from CSV`);
    
    // Generate attachments registry
    const attachments: WeaponAttachment[] = [];
    const attachmentRegistry: Record<string, WeaponAttachment> = {};
    
    for (const enumName of attachmentNames) {
        const attachment: WeaponAttachment = {
            id: `attachment_${enumName}`,
            name: formatDisplayName(enumName),
            attachment: `mod.WeaponAttachments.${enumName}`,
            slot: deriveAttachmentSlot(enumName)
        };
        
        attachments.push(attachment);
        attachmentRegistry[attachment.id] = attachment;
    }
    
    console.log(`✅ Generated ${attachments.length} attachments`);
    
    // First, create a mapping of attachment names to their correct slots from CSV
    const attachmentSlotMapping: Record<string, WeaponAttachmentSlot> = {};
    if (csvData.length > 0) {
        console.log('🔍 Building attachment slot mappings from CSV...');
        
        for (const entry of csvData) {
            // Skip excluded attachments
            if (EXCLUDED_ATTACHMENTS.has(entry.attachmentName)) {
                continue;
            }
            
            // Find matching attachment with slot consideration
            const expectedSlot = mapCSVSlotToWeaponSlot(entry.slot);
            const attachmentMatch = findBestAttachmentMatch(entry.attachmentName, attachmentNames, expectedSlot);
            if (attachmentMatch) {
                const attachmentKey = `attachment_${attachmentMatch}`;
                
                // Override the slot if we have better information from CSV
                if (attachmentRegistry[attachmentKey]) {
                    attachmentRegistry[attachmentKey].slot = expectedSlot;
                }
                
                attachmentSlotMapping[attachmentMatch] = expectedSlot;
            }
        }
        
        console.log(`✅ Updated slots for ${Object.keys(attachmentSlotMapping).length} attachments from CSV`);
    }

    // Process CSV data to create weapon-attachment mappings
    const weaponAttachments: Record<string, string[]> = {};
    const unmatchedAttachments: string[] = [];
    const unmatchedWeapons: string[] = [];
    
    if (csvData.length > 0) {
        console.log('🔍 Processing CSV weapon-attachment mappings...');
        
        for (const entry of csvData) {
            // Skip excluded attachments
            if (EXCLUDED_ATTACHMENTS.has(entry.attachmentName)) {
                continue;
            }
            
            // Find matching attachment with slot consideration
            const expectedSlot = mapCSVSlotToWeaponSlot(entry.slot);
            const attachmentMatch = findBestAttachmentMatch(entry.attachmentName, attachmentNames, expectedSlot);
            if (!attachmentMatch) {
                unmatchedAttachments.push(entry.attachmentName);
                continue;
            }

            // Find matching weapon
            const weaponMatch = findBestWeaponMatch(entry.weaponName, weaponNames);
            if (!weaponMatch) {
                unmatchedWeapons.push(entry.weaponName);
                continue;
            }

            // Add to weapon-attachment mapping
            const weaponKey = weaponMatch;
            const attachmentKey = `attachment_${attachmentMatch}`;

            if (!weaponAttachments[weaponKey]) {
                weaponAttachments[weaponKey] = [];
            }

            if (!weaponAttachments[weaponKey].includes(attachmentKey)) {
                weaponAttachments[weaponKey].push(attachmentKey);
            }
        }        console.log(`✅ Mapped ${Object.keys(weaponAttachments).length} weapons with attachments`);
        
        if (unmatchedAttachments.length > 0) {
            console.warn(`⚠️  ${unmatchedAttachments.length} attachments from CSV could not be matched:`);
            unmatchedAttachments.slice(0, 10).forEach(name => console.warn(`   - ${name}`));
            if (unmatchedAttachments.length > 10) {
                console.warn(`   ... and ${unmatchedAttachments.length - 10} more`);
            }
        }
        
        if (unmatchedWeapons.length > 0) {
            console.warn(`⚠️  ${unmatchedWeapons.length} weapons from CSV could not be matched:`);
            unmatchedWeapons.slice(0, 10).forEach(name => console.warn(`   - ${name}`));
            if (unmatchedWeapons.length > 10) {
                console.warn(`   ... and ${unmatchedWeapons.length - 10} more`);
            }
        }
    }
    
    // Generate weapons
    const weapons: WeaponDefinition[] = [];
    
    for (const enumName of weaponNames) {
        // Skip excluded weapons
        if (EXCLUDED_WEAPONS.has(enumName)) {
            console.log(`⏭️  Skipping excluded weapon: ${enumName}`);
            continue;
        }
        
        const category = deriveWeaponCategory(enumName);
        const weaponAttachmentIds = weaponAttachments[enumName] || [];
        
        const weapon: WeaponDefinition = {
            id: `gun_${enumName}`,
            weapon: `mod.Weapons.${enumName}`,
            name: formatDisplayName(enumName),
            category,
            attachmentSlots: getDefaultAttachmentSlots(category),
            attachments: weaponAttachmentIds
        };
        
        weapons.push(weapon);
    }
    
    console.log(`✅ Generated ${weapons.length} weapons`);
    
    // Generate TypeScript files
    await generateAttachmentsFile(attachments, attachmentRegistry, weaponAttachments);
    await generateWeaponsFile(weapons);
    
    console.log('🎉 Generation complete!');
    console.log(`📝 Generated files:`);
    console.log(`   - src/systems/weapon-catalog/attachments.generated.ts`);
    console.log(`   - src/systems/weapon-catalog/weapons.generated.ts`);
    console.log(`💡 Review the generated files and update your imports as needed.`);
    
    if (csvData.length === 0) {
        console.log(`📋 To enable weapon-attachment mapping, create a CSV file at: data/weapon-attachments.csv`);
        console.log(`   Expected format: attachment_name,weapon_name`);
    }
}

async function generateAttachmentsFile(
    attachments: WeaponAttachment[], 
    attachmentRegistry: Record<string, WeaponAttachment>,
    weaponAttachments: Record<string, string[]>
) {
    const content = `// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-weapons' to regenerate.

import { s } from "../../lib/string-macro";

export const weaponAttachmentSlots = ['muzzle', 'barrel', 'scope', 'right_accessory', 'top_accessory', 'left_accessory', 'optic_accessory', 'ergonomics', 'underbarrel', 'magazine', 'ammunition'] as const;
export type WeaponAttachmentSlot = typeof weaponAttachmentSlots[number];

export type WeaponAttachment = { 
    id: string; 
    name: string; 
    attachment: mod.WeaponAttachments; 
    slot: WeaponAttachmentSlot 
};

export type AttachmentKey = keyof typeof attachmentRegistry;

export const attachmentRegistry = {
${Object.entries(attachmentRegistry).map(([key, attachment]) => 
    `    "${key}": {
        id: "${attachment.id}",
        name: s\`${attachment.name}\`,
        attachment: ${attachment.attachment},
        slot: "${attachment.slot}"
    }`
).join(',\n')}
} as const;

export function getAttachments(ids: AttachmentKey[]): WeaponAttachment[] {
    return ids.map(id => attachmentRegistry[id]);
}

// Weapon-attachment mappings generated from CSV data
export const weaponAttachments: Record<string, AttachmentKey[]> = {
${Object.entries(weaponAttachments).map(([weapon, attachments]) => 
    `    "${weapon}": [
        ${attachments.map(a => `"${a}"`).join(',\n        ')}
    ]`
).join(',\n')}
};
`;

    await fs.writeFile(
        path.join(process.cwd(), 'src/systems/weapon-catalog/attachments.generated.ts'),
        content,
        'utf-8'
    );
}

async function generateWeaponsFile(weapons: WeaponDefinition[]) {
    const categories = [...new Set(weapons.map(w => w.category))];
    
    const content = `// This file is auto-generated. Do not edit manually.
// Run 'npm run generate-weapons' to regenerate.

import { s } from "../../lib/string-macro";
import { getAttachments, weaponAttachments, type WeaponAttachmentSlot, type WeaponAttachment, type AttachmentKey } from "./attachments.generated";

export const weaponCategories = ${JSON.stringify(categories)} as const;
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
${weapons.map(weapon => {
    const weaponKey = weapon.weapon.replace('mod.Weapons.', ''); // Extract enum name
    return `    {
        id: '${weapon.id}',
        weapon: ${weapon.weapon},
        name: s\`${weapon.name}\`,
        category: "${weapon.category}",
        attachmentSlots: ${JSON.stringify(weapon.attachmentSlots)},
        attachments: getAttachments(weaponAttachments['${weaponKey}'] || [])
    }`;
}).join(',\n')}
];

export const weaponCategoryNames: Record<WeaponCategory, string> = {
${categories.map(cat => `    ${cat}: s\`${cat.toUpperCase()}\``).join(',\n')}
};

export const weaponAttachmentSlotNames: Record<WeaponAttachmentSlot, string> = {
    muzzle: s\`MUZZLE\`,
    barrel: s\`BARREL\`,
    scope: s\`SCOPE\`,
    right_accessory: s\`RIGHT ACCESSORY\`,
    top_accessory: s\`TOP ACCESSORY\`,
    left_accessory: s\`LEFT ACCESSORY\`,
    optic_accessory: s\`OPTIC ACCESSORY\`,
    ergonomics: s\`ERGONOMICS\`,
    underbarrel: s\`UNDERBARREL\`,
    magazine: s\`MAGAZINE\`,
    ammunition: s\`AMMUNITION\`,
};
`;

    await fs.writeFile(
        path.join(process.cwd(), 'src/systems/weapon-catalog/weapons.generated.ts'),
        content,
        'utf-8'
    );
}

main().catch(err => {
    console.error('❌ Generation failed:', err);
    process.exit(1);
});
