import { PlayerState } from "./systems/player";
import { BotTargetManager } from "./systems/targets";

const vendingMachineID: number = 100;

export async function OnGameModeStarted(): Promise<void> {
    BotTargetManager.spawnBots();
}

export async function OnPlayerJoinGame(eventPlayer: mod.Player): Promise<void> {
    if(isValidAI(eventPlayer)) {
        console.log(`(AI) Player ${mod.GetObjId(eventPlayer)} joined the game`);
        return;
    }
    PlayerState.get(eventPlayer);
}

export function OnPlayerInteract(eventPlayer: mod.Player, interactPoint: mod.InteractPoint): void {
    let playerState = PlayerState.get(eventPlayer);
    let interactionId = mod.GetObjId(interactPoint);

    if(!playerState) return;

    if (interactionId === vendingMachineID) {
        playerState.weaponCatalog?.open();
    }
}

export async function OnPlayerDeployed(eventPlayer: mod.Player): Promise<void> {
    if(isValidAI(eventPlayer)) {
        console.log(`(AI) Player ${mod.GetObjId(eventPlayer)} deployed`);
        BotTargetManager.assignAsTarget(eventPlayer);
        // BotTargetManager.botTargetSpawned(eventPlayer);
    }
}

export function OnPlayerDied(eventPlayer: mod.Player, attacker: mod.Player, _type: mod.DeathType, _evWepUnlock: mod.WeaponUnlock): void {
    if(isValidAI(eventPlayer)) {
        BotTargetManager.onBotTargetDied(eventPlayer);
    }
}

export function OnPlayerDamaged(eventPlayer: mod.Player, attacker: mod.Player, _dmgType: mod.DamageType, _evWepUnlock: mod.WeaponUnlock): void {
    if(isValidAI(eventPlayer)) {
        BotTargetManager.onBotTargetHit(eventPlayer, attacker, _dmgType);
    }
}

export function OnPlayerUIButtonEvent(
    eventPlayer: mod.Player,
    eventUIWidget: mod.UIWidget,
    eventUIButtonEvent: mod.UIButtonEvent
): void {
    const player = PlayerState.get(eventPlayer);
    if(!player) return;
    player.weaponCatalog?.onUIButtonEvent(eventUIWidget, eventUIButtonEvent);
}

export function OnPlayerLeaveGame(playerId: number): void {
    console.log(`Player ${playerId} left the game`);
    PlayerState.remove(playerId);
}

function isValidAI(player: mod.Player): boolean {
    return mod.IsPlayerValid(player) && isAI(player);
}

function isAI(player: mod.Player): boolean {
    return mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier);
}