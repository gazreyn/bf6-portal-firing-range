import { PlayerState } from "./systems/player";

const vendingMachineID: number = 100;

export function OnPlayerJoinGame(eventPlayer: mod.Player): void {
    PlayerState.get(eventPlayer); // Initialize player state
}

export function OnPlayerLeaveGame(playerId: number): void {
    PlayerState.remove(playerId);
}

export function OnPlayerInteract(eventPlayer: mod.Player, interactPoint: mod.InteractPoint): void {
    let playerState = PlayerState.get(eventPlayer);
    let interactionId = mod.GetObjId(interactPoint);

    if(!playerState) return;

    if (interactionId === vendingMachineID) {
        playerState.weaponCatalog?.open();
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