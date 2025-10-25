type TargetBehavior = {
    onSpawn: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
    onDeath: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
    onHit: (player: mod.Player, enemy: BotTarget) => void | Promise<void>;
};

type TargetSpawnPoint = {
    id: number;
    behaviour: TargetBehavior;
};

class BotTarget {
    #behavior: TargetBehavior;
    #player: mod.Player;
    #spawnerID: number;
    #spawnPoint: TargetSpawnPoint;

    constructor(player: mod.Player, spawnerID: number, behavior: TargetBehavior = defaultBehavior) {
        this.#player = player;
        this.#behavior = behavior;
        this.#spawnerID = spawnerID; // Probably don't need this as we store in the spawnPoint
        this.#spawnPoint = SPAWNS.find(spawn => spawn.id === spawnerID) || SPAWNS[0];
    }

    get player(): mod.Player {
        return this.#player;
    }

    get spawnPoint(): TargetSpawnPoint {
        return this.#spawnPoint;
    }

    get spawnerID(): number {
        return this.#spawnerID;
    }

    onSpawn() {
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

    static #targets: Map<number, BotTarget> = new Map(); // Player ID to BotTarget
    static #spawners: Map<number, number> = new Map(); // Spawner ID to Player ID

    static assignAsTarget(player: mod.Player, spawnerID: number) {

        // First check if the spawner already has a target assigned
        const playerId = mod.GetObjId(player);
        const existingTargetID = this.#spawners.get(spawnerID);
        const target = this.#targets.get(playerId);

        if(existingTargetID || target) {
            mod.Kill(player); // Prevent duplicate bots with the same name in the same position. Consider what happens onDeath
            return;
        }

        const spawnBehavior = SPAWNS.find(spawn => spawn.id === spawnerID)?.behaviour || defaultBehavior;
        const botTarget = new BotTarget(player, spawnerID, spawnBehavior);

        this.#targets.set(playerId, botTarget);
        this.#spawners.set(spawnerID, playerId);
        botTarget.onSpawn();
    }

    static removeTarget(player: mod.Player) {
        const playerId = mod.GetObjId(player);
        const target = this.#targets.get(playerId);

        if (!target) return;

        this.#targets.delete(playerId);
        this.#spawners.delete(target.spawnPoint.id);
    }

    static spawnTarget(spawnPoint: TargetSpawnPoint) {
        mod.SpawnAIFromAISpawner(mod.GetSpawner(spawnPoint.id), mod.SoldierClass.Assault, mod.GetTeam(2));
    }

    static spawnTargets() {
        SPAWNS.forEach(spawnPoint => {
            this.spawnTarget(spawnPoint);
        });
    }

    static async respawnTargetAfterTime(spawnPoint: TargetSpawnPoint, timeSeconds: number) {
        await mod.Wait(timeSeconds);
        this.spawnTarget(spawnPoint);
    }

    // Event Handlers
    static onBotTargetDied(player: mod.Player) {
        const playerId = mod.GetObjId(player);
        const target = this.#targets.get(playerId); // This won't exist if an AI somehow spawns for a spawn that's already taken

        if(!target) return;

        target.onDeath();
        this.removeTarget(player);
        this.respawnTargetAfterTime(target.spawnPoint, 2);
    }

    static onBotTargetHit(player: mod.Player, _attacker: mod.Player, _dmgType: mod.DamageType) {
        const playerId = mod.GetObjId(player);
        const target = this.#targets.get(playerId);

        if (!target) return;

        target.onHit();
    }
}

// Define some target behaviors here
const defaultBehavior: TargetBehavior = {
    onSpawn: async (player, target) => {
        mod.AIEnableShooting(player, false);
        mod.AIEnableTargeting(player, false);
        mod.RemoveEquipment(player, mod.InventorySlots.SecondaryWeapon);
        mod.RemoveEquipment(player, mod.InventorySlots.Throwable);
        mod.AIIdleBehavior(player);
        mod.AISetFocusPoint(player, facingPoint, false);
        mod.SetPlayerMaxHealth(player, 100);
        console.log(`BotTarget onSpawn (Spawn Point ${target.spawnPoint.id})`);
        console.log(`[Default Behavior][onSpawn] Applying BotTarget behavior. (${target.spawnPoint.id})`);
    },
    onDeath: async (_player, target) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${target.spawnPoint.id})`);
    },
    onHit: async (_player, _target) => {
        return; // No action on hit
    }
};

const crouchBehavior: TargetBehavior = {
    onSpawn: async (player, target) => {
        mod.AIEnableShooting(player, false);
        mod.AIEnableTargeting(player, false);
        mod.RemoveEquipment(player, mod.InventorySlots.SecondaryWeapon);
        mod.RemoveEquipment(player, mod.InventorySlots.Throwable);
        mod.AISetStance(player, mod.Stance.Crouch);
        mod.SetPlayerMaxHealth(player, 1000);

        console.log(`[Alternative Behavior][onSpawn] Applying BotTarget behavior. (${target.spawnPoint.id})`);
    },
    onDeath: async (_player, target) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${target.spawnPoint.id})`);
    },
    onHit: async (_player, target) => {
        console.log(`[Default Behavior][onHit] BotTarget has been hit.(${target.spawnPoint.id})`);
    }
};

const facingPoint = mod.CreateVector(-0.26, 4.397, 19.589);

const SPAWNS: TargetSpawnPoint[] = [
    {id: 9, behaviour: defaultBehavior},
    {id: 10, behaviour: defaultBehavior},
    {id: 11, behaviour: defaultBehavior}
];