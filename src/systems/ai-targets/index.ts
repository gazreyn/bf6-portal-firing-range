// Another angle to think about it is to create a target instance similar to player which then get assigned to a spawner OR we spawn them and set position

type Vector3 = { x: number; y: number; z: number };

export const targetSpawnPoints: Record<number, Vector3> = {
    9: { x: -0.159, y: 0.413, z: 4.992 },
    10: { x: 0.316, y: -0.72, z: -9.945 },
    11: { x: 1.153, y: -2.064, z: -36.263 },
}

export type AITargetBehaviour = {
    onSpawn: (player: mod.Player, target: AITarget) => void | Promise<void>;
    onDeath: (player: mod.Player, target: AITarget) => void | Promise<void>;
    onDamaged: (player: mod.Player, target: AITarget) => void | Promise<void>;
}

export type AITargetConfig = {
    health?: number;
    stance?: mod.Stance;
    soldierClass?: mod.SoldierClass;
    spawnPointID?: number;
}

const baseTargetBehaviour: AITargetBehaviour = {
    onSpawn: async (player,) => {
        mod.AIEnableShooting(player, false);
        mod.AIEnableTargeting(player, false);
    },
    onDeath: async (_player, target) => {
        // TODO: Respawn Logic
        RespawnTargetAfterTime(target.spawnPointID, 3);
        console.log(`AITarget has died.`);
    },
    onDamaged: async (_player, _target) => {
        console.log(`AITarget has been damaged.`);
    }
}

export class AITarget {
    public health: number;
    public stance: mod.Stance;
    public soldierClass: mod.SoldierClass;
    public spawnPointID: number;
    public player?: mod.Player;

    constructor(private behaviour: AITargetBehaviour, config: AITargetConfig = {}) {
        this.health = config.health ?? 100;
        this.stance = config.stance ?? mod.Stance.Stand;
        this.soldierClass = config.soldierClass ?? mod.SoldierClass.Assault;
        this.spawnPointID = config.spawnPointID ?? 9;
    }

    async initialize(player: mod.Player) {
        this.player = player;
        mod.AIEnableShooting(player, false);
        mod.SetPlayerMaxHealth(player, this.health);
        mod.AISetStance(player, this.stance);

        await this.behaviour.onSpawn(player, this)
    }

    async onDeath(player: mod.Player) {
        await this.behaviour.onDeath(player, this);
    }

    async onDamaged(player: mod.Player) {
        await this.behaviour.onDamaged(player, this);
    }
}

export class AITargetSpawner {
    static spawnedTargets = new Map<number, AITarget>();
    // static targetSpawnTicks: Set<number> = new Set();

    static async spawnTarget(
        behaviour: AITargetBehaviour,
        config: AITargetConfig = {}
    ) {
        const target = new AITarget(behaviour, config);

        AITargetSpawner.spawnedTargets.set(target.spawnPointID, target);
        mod.SpawnAIFromAISpawner(mod.GetSpawner(target.spawnPointID), target.soldierClass, mod.GetTeam(2));
        console.log(`Spawning AITarget at Spawner ID: ${target.spawnPointID}`);
        console.log(`Class is: ${target.soldierClass}`);
    }

    static async assignBehaviour(target: mod.Player) {
        let closestSpawnerID: number | null = null;

        for(const key in targetSpawnPoints) {
            if(mod.IsPlayerValid(target) && mod.GetSoldierState(target, mod.SoldierStateBool.IsAISoldier) && targetSpawnPoints.hasOwnProperty(Number(key))) {
                const convertedToBFVector = mod.CreateVector(
                    targetSpawnPoints[Number(key)].x,
                    targetSpawnPoints[Number(key)].y,
                    targetSpawnPoints[Number(key)].z
                );
                const targetPos = mod.GetSoldierState(target, mod.SoldierStateVector.GetPosition);

                const distanceCheck = mod.DistanceBetween(convertedToBFVector, targetPos);

                if (distanceCheck <= 5) {
                    closestSpawnerID = Number(key);
                    break;
                }
            }
        }

        if(closestSpawnerID === null) {
            mod.Kill(target);
            console.log("Could not find spawner for AI Target, killing target.");
            return;
        }
        
        const targetObjID = mod.GetObjId(target);
        const targetAtSpawnPoint = AITargetSpawner.spawnedTargets.get(closestSpawnerID);

        if(!targetAtSpawnPoint) {
            mod.Kill(target);
            console.log("No AITarget found at spawner ID, killing target.");
            return;
        }
        
        targetAtSpawnPoint.initialize(target);
        // AITargetSpawner.spawnedTargets.set(targetObjID, targetAtSpawnPoint);
    }

    static async targetDied(player: mod.Player) {
        const targetID = mod.GetObjId(player);
        const target = AITargetSpawner.spawnedTargets.get(targetID);

        if (target) {
            await target.onDeath(player);
            AITargetSpawner.spawnedTargets.delete(targetID);
        }
    }

    static getSpawnerIDByPlayer(player: mod.Player): AITarget | undefined {
        const targetID = mod.GetObjId(player);
        return AITargetSpawner.spawnedTargets.get(targetID);
    }

    static async targetDamaged(player: mod.Player) {
        const targetID = mod.GetObjId(player);
        const target = AITargetSpawner.spawnedTargets.get(targetID);

        if (target) {
            await target.onDamaged(player);
        }
    }
}

export async function RespawnTargetAfterTime(id: number, timeSeconds: number) {
    await mod.Wait(timeSeconds);
    AITargetSpawner.spawnTarget(baseTargetBehaviour, { spawnPointID: id, health: 100 });
}

export function SpawnTargets() {
    AITargetSpawner.spawnTarget(baseTargetBehaviour, { soldierClass: mod.SoldierClass.Assault, spawnPointID: 9, health: 100 });
    AITargetSpawner.spawnTarget(baseTargetBehaviour, { soldierClass: mod.SoldierClass.Assault, spawnPointID: 10, health: 100 });
    AITargetSpawner.spawnTarget(baseTargetBehaviour, { soldierClass: mod.SoldierClass.Assault, spawnPointID: 11, health: 100 });
}

// export function initializeSpawners() {
//     for (let index = 9; index < 12; index++) {
//         mod.SetUnspawnDelayInSeconds(mod.GetSpawner(index), 3);
//     }
// }