import { WeaponCatalog } from "./weapon-catalog";

export class PlayerState {
    player: mod.Player;
    weaponCatalog: WeaponCatalog | undefined;

    static playerInstances: mod.Player[] = [];
    static #allPlayerStates: { [key: number]: PlayerState } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        PlayerState.playerInstances.push(this.player);

        // Create and assign any relevant UI's here
        // Never create UI elements for AI soldiers, because late joining players will inherit their Object IDs, and thus their UI
        if (mod.GetSoldierState(this.player, mod.SoldierStateBool.IsAISoldier)) return;

        this.weaponCatalog = new WeaponCatalog(this);
    }

    static get(player: mod.Player) {
        const id = mod.GetObjId(player);
        if (id < 0) return undefined;

        PlayerState.#allPlayerStates[id] ??= new PlayerState(player);

        return PlayerState.#allPlayerStates[id];
    }

    static remove(playerId: number) {
        // Remove from playerInstances
        PlayerState.playerInstances.forEach((_player, index) => {
            if(mod.GetObjId(PlayerState.playerInstances[index]) < 0) {
                PlayerState.playerInstances.splice(index, 1);
            }
        });

        // Destroy any UI's and remove from allPlayerStates
        PlayerState.#allPlayerStates[playerId]?.destroyUI();
        delete PlayerState.#allPlayerStates[playerId];
    }

    destroyUI() {
        this.weaponCatalog?.close();
    }
}