import { PlayerState } from "./systems/player";
import { BotTargetManager } from "./systems/targets";
import { isValidAI } from "./lib/helpers";

const vendingMachineID: number = 100;

export async function OnGameModeStarted() {
    BotTargetManager.spawnTargets();
}

export async function OnPlayerJoinGame(eventPlayer: mod.Player) {
    if(isValidAI(eventPlayer)) {
        console.log(`(AI) Player ${mod.GetObjId(eventPlayer)} joined the game`);
        return;
    }
    PlayerState.findOrCreate(eventPlayer);
}

export function OnPlayerInteract(eventPlayer: mod.Player, interactPoint: mod.InteractPoint) {
    let playerState = PlayerState.findOrCreate(eventPlayer);
    let interactionId = mod.GetObjId(interactPoint);

    if(!playerState) return;

    if (interactionId === vendingMachineID) {
        playerState.weaponCatalog?.open();
    }
}

export async function OnSpawnerSpawned(eventPlayer: mod.Player, eventSpawner: mod.Spawner) {
    await mod.Wait(1); // Wait a tick to ensure the AI is fully spawned
    const spawnerID = mod.GetObjId(eventSpawner);
    console.log(`Spawner with id ${spawnerID} has spawned Player ${mod.GetObjId(eventPlayer)}`);
    BotTargetManager.assignAsTarget(eventPlayer, spawnerID);
}

export function OnPlayerDied(eventPlayer: mod.Player, attacker: mod.Player, _type: mod.DeathType, _evWepUnlock: mod.WeaponUnlock): void {
    if(isValidAI(eventPlayer)) {
        BotTargetManager.onBotTargetDied(eventPlayer);
    }
}

export function OnPlayerDamaged(eventPlayer: mod.Player, attacker: mod.Player, dmgType: mod.DamageType, _evWepUnlock: mod.WeaponUnlock): void {
    if(isValidAI(eventPlayer)) {
        BotTargetManager.onBotTargetHit(eventPlayer, attacker, dmgType);
    }
}

export function OnPlayerUIButtonEvent(
    eventPlayer: mod.Player,
    eventUIWidget: mod.UIWidget,
    eventUIButtonEvent: mod.UIButtonEvent
): void {
    const player = PlayerState.findOrCreate(eventPlayer);

    if(!player) return; // Can happen if eventPlayer id is invalid or an AI

    player.weaponCatalog?.onUIButtonEvent(eventUIWidget, eventUIButtonEvent);
}

export function OnPlayerLeaveGame(playerId: number): void {
    console.log(`Player ${playerId} left the game`);
    PlayerState.remove(playerId);
}