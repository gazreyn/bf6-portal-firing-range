import { WeaponCatalog } from "../weapon-catalog";
import { isAI } from "../../lib/helpers";

export class PlayerState {
    player: mod.Player;
    weaponCatalog: WeaponCatalog | undefined;

    static playerInstances: mod.Player[] = [];
    static #allPlayerStates: { [key: number]: PlayerState } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        PlayerState.playerInstances.push(this.player);

        // Extra check to prevent AI from getting a weapon catalog, but we check this 
        if (isAI(player)) return;

        this.weaponCatalog = new WeaponCatalog(this);
    }

    static findOrCreate(player: mod.Player) {
        const playerId = mod.GetObjId(player);

        if (playerId < 0) return undefined; // Invalid player

        return PlayerState.#allPlayerStates[playerId] ??= new PlayerState(player);
    }

    static remove(playerId: number) {
        // Clean up any invalid player instances
        PlayerState.playerInstances.forEach((player, index) => {
            if(mod.GetObjId(player) < 0) {
                PlayerState.playerInstances.splice(index, 1);
            }
        });

        // Destroy any UI's and remove from allPlayerStates
        PlayerState.#allPlayerStates[playerId]?.destroyUI();
        delete PlayerState.#allPlayerStates[playerId];
    }

    destroyUI() {
        this.weaponCatalog?.destroy();
        this.weaponCatalog = undefined;
    }
}