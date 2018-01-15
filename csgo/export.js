function jsonToBin(json) {
    const array = new Uint8Array(6);
    let index = 0;

    //Health na flashed
    if(json.player === undefined || json.player.state === undefined) {
        array[index++] = 0;
        array[index++] = 0;
    }
    else {
        array[index++] = (json.player.state.health / 100) * 255;
        array[index++] = json.player.state.flashed;
    }

    //Ammo
    let activeWeapon = getActiveWeapon(json.player.weapons);
    if(activeWeapon === null || activeWeapon.ammo_clip === undefined || activeWeapon.ammo_clip_max === undefined) {
        array[index++] = 0;
    }
    else {
        array[index++] = (activeWeapon.ammo_clip / activeWeapon.ammo_clip_max) * 255;
    }

    //Weapon slot
    if(activeWeapon === null) {
        array[index++] = 0;
    } else {
        array[index++] = getActiveWeaponSlot(activeWeapon);
    }

    //Bomb state
    array[index++] = getBombState(json);

    //Round win
    if(json.round === undefined || json.round.win_team === undefined)
        array[index] = 0;
    else
        array[index] = json.round.win_team === "T" ? 1 : 2;

    return array;
}

function getActiveWeapon(weapons) {
    for(let k in weapons) {
        if(!weapons.hasOwnProperty(k))
            continue;
        if(weapons[k].state === "active" || weapons[k].state === "reloading") {
            return weapons[k];
        }
    }
    return null;
}

function getActiveWeaponSlot(weapon) {
    if(weapon.name === "weapon_taser")
        return 3;
    switch(weapon.type.toLowerCase()) {
        case "c4":
            return 5;
        case "grenade":
            return 4;
        case "knife":
            return 4;
        case "pistol":
            return 2;
        default:
            return 1;
    }
}

function getBombState(json) {
    if(json.round === undefined)
        return 0;
    switch(json.round.bomb)
    {
        case "planted":
            return 1;
        case "exploded":
            return 2;
        case "defused":
            return 3;
        default:
            return 0;
    }
}

module.exports.jsonToBin = jsonToBin;