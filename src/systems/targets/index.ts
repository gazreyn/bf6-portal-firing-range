type BotTargetBehavior = {
    onSpawn: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
    onDeath: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
    onHit: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
};

class SpawnLocation {
    position: ReturnType<typeof mod.CreateVector>;
    behavior: BotTargetBehavior;

    constructor(position: { x: number; y: number; z: number }, behavior: BotTargetBehavior) {
        this.position = mod.CreateVector(position.x, position.y, position.z);
        this.behavior = behavior;
    }

    getPosition(): ReturnType<typeof mod.CreateVector> {
        return this.position;
    }
}

class BotTarget {
    public isAlive: boolean = false;
    public isActive: boolean = false;
    public spawnPointID: number;
    #behavior: BotTargetBehavior;
    #player: mod.Player;

    constructor(player: mod.Player, spawnPointID: number, behavior: BotTargetBehavior = defaultBehavior) {
        this.#player = player;
        this.spawnPointID = spawnPointID;
        this.#behavior = behavior;
    }

    initialize() {
        console.log(`Initializing BotTarget at spawn point ${this.spawnPointID}`);
        this.onSpawn();
    }

    getSpawnPointID(): number {
        return this.spawnPointID;
    }

    getPlayer(): mod.Player {
        return this.#player;
    }

    onSpawn() {
        console.log(`BotTarget onSpawn (${this.spawnPointID})`);
        this.#behavior.onSpawn(this.#player, this);
    }

    onDeath() {
        this.#behavior.onDeath(this.#player, this);
    }

    onHit() {
        this.#behavior.onHit(this.#player, this);
    }
}

export class BotTargetManager {

    static reservedSpawnPoints: Map<number, BotTarget> = new Map();
    static spawnedTargets: Map<number, BotTarget> = new Map();

    static assignAsTarget(player: mod.Player) {
        const botId = mod.GetObjId(player);

        if (this.spawnedTargets.has(botId)) return; // Already assigned, maybe better handling

        // Find an available spawn point
        const availableSpawnId = this.getValidSpawnPoint();

        if (availableSpawnId === null) {
            console.log("No available spawn points for new target");
            mod.Kill(player);
            return;
        }

        // Create target with the assigned spawn point
        const target = new BotTarget(player, availableSpawnId);
        
        this.spawnedTargets.set(botId, target);
        this.reservedSpawnPoints.set(availableSpawnId, target);
        
        console.log(`Assigned target to spawn point ${availableSpawnId}`);
        target.initialize();
    }

    static removeTarget(playerId: number) {
        const target = BotTargetManager.spawnedTargets.get(playerId);
        if (!target) return;
        
        // Remove from spawn points map using the target's spawn point ID
        BotTargetManager.reservedSpawnPoints.delete(target.spawnPointID);
        BotTargetManager.spawnedTargets.delete(playerId); // Test this
        console.log(`Freed spawn point ${target.spawnPointID}`);
        console.log(`Removed target with player ID ${playerId}`);
    }

    static getValidSpawnPoint(): number | null {
        // Check each possible spawn point (9, 10, 11) to see if it's available
        const possibleSpawnIds = Object.keys(spawnLocations).map(Number);
        
        for (const spawnId of possibleSpawnIds) {
            if (!this.reservedSpawnPoints.has(spawnId)) {
                return spawnId; // Found an available spawn point
            }
        }
        
        return null; // No available spawn points
    }

    static isValidSpawnPoint(spawnPointID: number): boolean {
        return !this.reservedSpawnPoints.has(spawnPointID);
    }

    static spawnBot(spawnPointID: number) {
        mod.SpawnAIFromAISpawner(mod.GetSpawner(spawnPointID), mod.SoldierClass.Assault, mod.GetTeam(2));
    }

    static async spawnBots() {
        for (const key of Object.keys(spawnLocations)) {
            BotTargetManager.spawnBot(Number(key));
        }
    }

    static async respawnBotAfterTime(spawnPointID: number, timeSeconds: number) {
        await mod.Wait(timeSeconds);
        BotTargetManager.spawnBot(spawnPointID);
    }

    // Event Handlers
    static onBotTargetSpawned(player: mod.Player) {
        BotTargetManager.assignAsTarget(player);
    }

    static onBotTargetDied(player: mod.Player) {
        const botId = mod.GetObjId(player);
        const target = BotTargetManager.spawnedTargets.get(botId);
        if (!target)  return;

        target.onDeath();
        BotTargetManager.removeTarget(botId);
        BotTargetManager.respawnBotAfterTime(target.spawnPointID, 2);
    }

    static onBotTargetHit(player: mod.Player, attacker: mod.Player, dmgType: mod.DamageType) {
        const botId = mod.GetObjId(player);
        const target = BotTargetManager.spawnedTargets.get(botId);
        if (!target) return;
        target.onHit();
    }
}

const defaultBehavior: BotTargetBehavior = {
    onSpawn: async (player, botTarget) => {
        mod.AIEnableShooting(player, false);
        mod.AIEnableTargeting(player, false);
        mod.RemoveEquipment(player, mod.InventorySlots.SecondaryWeapon);
        mod.RemoveEquipment(player, mod.InventorySlots.Throwable);
        console.log(`[Default Behavior][onSpawn] Applying BotTarget behavior. (${botTarget.spawnPointID})`);
    },
    onDeath: async (_player, botTarget) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${botTarget.spawnPointID})`);
    },
    onHit: async (_player, botTarget) => {
        console.log(`[Default Behavior][onHit] BotTarget has been hit.(${botTarget.spawnPointID})`);
    }
};

const spawnLocations: Record<number, SpawnLocation> = {
    9: new SpawnLocation({ x: -0.159, y: 0.413, z: 4.992 }, defaultBehavior), // Front target
    10: new SpawnLocation({ x: 0.316, y: -0.72, z: -9.945 }, defaultBehavior), // Middle target
    11: new SpawnLocation({ x: 1.153, y: -2.064, z: -36.263 }, defaultBehavior), // Back target
};
