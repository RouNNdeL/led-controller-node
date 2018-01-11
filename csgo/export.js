function jsonToBin(json) {
    const array = new Uint8Array(3);

    array[0] = Math.ceil(json.player.state.health * 2.55);

    let activeWeapon = getActiveWeapon(json.player.weapons);
    if(activeWeapon === null || activeWeapon.ammo_clip === undefined || activeWeapon.ammo_clip_max === undefined) {
        array[1] = 0;
    }
    else {
        array[1] = (activeWeapon.ammo_clip / activeWeapon.ammo_clip_max) * 255;
    }
    array[2] = 0;

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

module.exports.jsonToBin = jsonToBin;