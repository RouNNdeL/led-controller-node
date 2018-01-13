function jsonToBin(json) {
    const array = new Uint8Array(4);
    let index = 0;

    //Health
    if(json.player === undefined || json.player.state === undefined) {
        array[index++] = 0;
    }
    else {
        array[index++] = Math.ceil(json.player.state.health * 2.55);
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
    
    //Bomb timer
    array[index++] = 0;

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

module.exports.jsonToBin = jsonToBin;