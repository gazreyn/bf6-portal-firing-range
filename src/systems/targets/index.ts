import { PlayerState } from "../player";

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
    public isAlive: boolean = false;
    public isActive: boolean = false;
    #behavior: TargetBehavior;
    #player: mod.Player;
    spawnerID: number;
    spawnPoint: TargetSpawnPoint;
    health: number = 1000;
    lastHit: number = 0;

    constructor(player: mod.Player, spawnerID: number, behavior: TargetBehavior = defaultBehavior) {
        this.#player = player;
        this.#behavior = behavior;
        this.spawnerID = spawnerID; // Probably don't need this as we store in the spawnPoint
        this.spawnPoint = this.getSpawnPoint(spawnerID);
    }

    initialize() {
        console.log(`Initializing BotTarget with spawn id ${this.spawnPoint.id}`);
        this.onSpawn();
    }

    getPlayer(): mod.Player {
        return this.#player;
    }

    onSpawn() {
        console.log(`BotTarget onSpawn (Spawn Point ${this.spawnPoint.id})`);
        this.#behavior.onSpawn(this.#player, this);
    }

    onDeath() {
        this.#behavior.onDeath(this.#player, this);
    }

    onHit() {
        this.#behavior.onHit(this.#player, this);

        // General Logic
        const currentHealth = mod.GetSoldierState(this.#player, mod.SoldierStateNumber.CurrentHealth);
        const damageTaken = this.health - currentHealth;
        this.health = currentHealth;
        this.lastHit = damageTaken;

        this.heal();
    }

    heal() {
        this.health = 1000;
        mod.Heal(this.#player, 1000);
    }

    getSpawnPoint(spawnerID: number): TargetSpawnPoint {
        console.log("Getting spawn point for bot + name for bot");
        return SPAWNS.find(spawn => spawn.id === spawnerID) || SPAWNS[0];
    }
}

export class BotTargetManager {

    static targets: Map<number, BotTarget> = new Map(); // Player ID to BotTarget
    static spawnerTargets: Map<number, number> = new Map(); // Spawner ID to Player ID

    static assignAsTarget(player: mod.Player, spawnerID: number) {

        // First check if the spawner already has a target assigned
        const playerId = mod.GetObjId(player);
        const existingTargetID = BotTargetManager.spawnerTargets.get(spawnerID);
        const target = BotTargetManager.targets.get(playerId);

        if(existingTargetID || target) {
            console.log(`BotTargetManager: Spawner with id ${spawnerID} already has target assigned with id ${existingTargetID}.`);
            mod.Kill(player); // Prevent duplicate bots with the same name in the same position
            return;
        }

        console.log(`BotTargetManager: Assigning Player ${mod.GetObjId(player)} as BotTarget.`);;

        const spawnBehavior = SPAWNS.find(spawn => spawn.id === spawnerID)?.behaviour || defaultBehavior;

        const botTarget = new BotTarget(player, spawnerID, spawnBehavior);

        console.log(`BotTargetManager: Created BotTarget for Player ${mod.GetObjId(player)} with spawn point ${botTarget.spawnPoint.id}.`);

        BotTargetManager.targets.set(playerId, botTarget);
        BotTargetManager.spawnerTargets.set(spawnerID, playerId);
        botTarget.initialize();

        console.log(`BotTargetManager: Assigned Player ${mod.GetObjId(player)} as BotTarget with id ${botTarget.spawnPoint.id}.`);
    }

    static removeTarget(player: mod.Player) {
        const playerId = mod.GetObjId(player);
        const target = BotTargetManager.targets.get(playerId);

        if (!target) {
            console.log(`BotTargetManager: No target found for Player ID ${playerId} on removal.`);
            return;
        }

        BotTargetManager.targets.delete(playerId);
        BotTargetManager.spawnerTargets.delete(target.spawnPoint.id);
        console.log(`Freed spawn point ${target.spawnPoint.id}`);
        console.log(`Removed target spawn id ${target.spawnPoint.id}`);
    }

    static spawnTarget(spawnPoint: TargetSpawnPoint) {
        mod.SpawnAIFromAISpawner(mod.GetSpawner(spawnPoint.id), mod.SoldierClass.Assault, mod.GetTeam(2));
    }

    static spawnTargets() {
        SPAWNS.forEach(spawnPoint => {
            BotTargetManager.spawnTarget(spawnPoint);
        });
    }

    static async respawnTargetAfterTime(spawnPoint: TargetSpawnPoint, timeSeconds: number) {
        await mod.Wait(timeSeconds);
        BotTargetManager.spawnTarget(spawnPoint);
    }

    // Event Handlers
    static onBotTargetDied(player: mod.Player) {

        const playerId = mod.GetObjId(player);
        const target = BotTargetManager.targets.get(playerId);

        if(!target) {
            console.log(`BotTargetManager: No target found for Player ID ${playerId} on death.`);
            return;
        }

        target.onDeath();
        BotTargetManager.removeTarget(player);
        BotTargetManager.respawnTargetAfterTime(target.spawnPoint, 2);
    }

    static onBotTargetHit(player: mod.Player, attacker: mod.Player, dmgType: mod.DamageType) {
        const playerId = mod.GetObjId(player);
        const target = BotTargetManager.targets.get(playerId);
        if (!target) return;

        target.onHit();

        // Temp: Do some logic here but maybe it goes in to behavior in the future? maybe not
        const attackerState = PlayerState.get(attacker);
        if(!attackerState) return;

        attackerState.updateRecentHitDamage(target.lastHit);

    }
}

const defaultBehavior: TargetBehavior = {
    onSpawn: async (player, target) => {
        mod.AIEnableShooting(player, false);
        mod.AIEnableTargeting(player, false);
        mod.RemoveEquipment(player, mod.InventorySlots.SecondaryWeapon);
        mod.RemoveEquipment(player, mod.InventorySlots.Throwable);
        mod.AIIdleBehavior(player);
        mod.SetPlayerMaxHealth(player, 1000);
        console.log(`[Default Behavior][onSpawn] Applying BotTarget behavior. (${target.spawnPoint.id})`);
    },
    onDeath: async (_player, target) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${target.spawnPoint.id})`);
    },
    onHit: async (_player, target) => {
        console.log(`[Default Behavior][onHit] BotTarget has been hit.(${target.spawnPoint.id})`);
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

const SPAWNS: TargetSpawnPoint[] = [
    {id: 9, behaviour: defaultBehavior},
    {id: 10, behaviour: crouchBehavior},
    {id: 11, behaviour: defaultBehavior}
];