const examples = require("./examples");

function exportToBin(effect) {
    const array = new Uint8Array(62*6);

    for(let i = 0; i < effect.devices.length; i++) {
        let index = 62*i;
        const device = effect.devices[i];

        array[index++] = device.effect;
        array[index++] = device.color_count;
        array[index++] = device.color_cycles;

        for(let j = 0; j < 6; j++) {
            array[index++] = device.times[j];
        }
        for(let j = 0; j < 5; j++) {
            array[index++] = device.args[j];
        }

        for(let j = 0; j < 16; j++) {
            let color = device.colors[j];
            array[index++] = (color >> 16);
            array[index++] = (color >> 8);
            array[index++] = color;
        }
    }

    return array;
}

module.exports.exportToBin = exportToBin;