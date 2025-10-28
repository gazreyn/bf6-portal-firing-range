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
    private _behavior: TargetBehavior;
    private _player: mod.Player;
    private readonly _spawnerID: number;
    private readonly _spawnPoint: TargetSpawnPoint;

    constructor(player: mod.Player, spawnerID: number, behavior: TargetBehavior = defaultBehavior) {
        this._player = player;
        this._behavior = behavior;
        this._spawnerID = spawnerID; // Probably don't need this as we store in the spawnPoint
        this._spawnPoint = SPAWNS.find(spawn => spawn.id === spawnerID) ?? SPAWNS[0];
    }

    getPlayer(): mod.Player {
        return this._player;
    }

    getSpawnPoint(): TargetSpawnPoint {
        return this._spawnPoint;
    }

    getSpawnerID(): number {
        return this._spawnerID;
    }

    onSpawn() {
        this._behavior.onSpawn(this._player, this);
    }

    onDeath() {
        this._behavior.onDeath(this._player, this);
    }

    onHit() {
        this._behavior.onHit(this._player, this);
    }
}

export class BotTargetManager {

    private static _targets: Map<number, BotTarget> = new Map(); // Player ID to BotTarget
    private static _spawners: Map<number, number> = new Map(); // Spawner ID to Player ID

    static assignAsTarget(player: mod.Player, spawnerID: number) {
        const playerId = mod.GetObjId(player);

        if(this._spawners.has(spawnerID) || this._targets.has(playerId)) {
            mod.Kill(player); // Prevent duplicate bots with the same name in the same position. Consider what happens onDeath
            return;
        }

        const spawnBehavior = SPAWNS.find(spawn => spawn.id === spawnerID)?.behaviour || defaultBehavior;
        const botTarget = new BotTarget(player, spawnerID, spawnBehavior);

        this._targets.set(playerId, botTarget);
        this._spawners.set(spawnerID, playerId);
        botTarget.onSpawn();
    }

    static removeTarget(player: mod.Player) {
        const playerId = mod.GetObjId(player);
        const target = this._targets.get(playerId);

        if (!target) return;

        this._targets.delete(playerId);
        this._spawners.delete(target.getSpawnPoint().id);
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
        const target = this._targets.get(playerId); // This won't exist if an AI somehow spawns for a spawn that's already taken

        if(!target) return;

        target.onDeath();
        this.removeTarget(player);
        this.respawnTargetAfterTime(target.getSpawnPoint(), 2);
    }

    static onBotTargetHit(player: mod.Player, _attacker: mod.Player, _dmgType: mod.DamageType) {
        const playerId = mod.GetObjId(player);
        const target = this._targets.get(playerId);

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
        console.log(`BotTarget onSpawn (Spawn Point ${target.getSpawnPoint().id})`);
        console.log(`[Default Behavior][onSpawn] Applying BotTarget behavior. (${target.getSpawnPoint().id})`);
    },
    onDeath: async (_player, target) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${target.getSpawnPoint().id})`);
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

        console.log(`[Alternative Behavior][onSpawn] Applying BotTarget behavior. (${target.getSpawnPoint().id})`);
    },
    onDeath: async (_player, target) => {
        console.log(`[Default Behavior][onDeath] BotTarget has died.(${target.getSpawnPoint().id})`);
    },
    onHit: async (_player, target) => {
        console.log(`[Default Behavior][onHit] BotTarget has been hit.(${target.getSpawnPoint().id})`);
    }
};

const facingPoint = mod.CreateVector(-0.26, 4.397, 19.589);

const SPAWNS: TargetSpawnPoint[] = [
    {id: 9, behaviour: defaultBehavior},
    {id: 10, behaviour: defaultBehavior},
    {id: 11, behaviour: defaultBehavior}
];