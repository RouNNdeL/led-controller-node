/* Regex to update these from C /([A-Z_]+) = (.*?,)/ replace: '$1: $2,' */
const effects = {
    BREATHE: 0x00,
    FADE: 0x01,
    FILLING_FADE: 0x02,
    RAINBOW: 0x03,
    FILL: 0x04,
    ROTATING: 0x05,
    PIECES: 0x0C
};

/* Regex to update these from C #define /([A-Z_\d]*) (.*)/ replace: '$1 : $2,' */
const args = {
    ARG_BIT_PACK: 0,

    DIRECTION: (1 << 0),
    SMOOTH: (1 << 1),

    FILL_FADE_RETURN: (1 << 2),

    RAINBOW_MODE: (1 << 2),
    RAINBOW_SIMPLE: (1 << 3),

    ARG_BREATHE_START: 1,
    ARG_BREATHE_END: 2,

    ARG_FILL_PIECE_COUNT: 1,
    ARG_FILL_COLOR_COUNT: 2,
    ARG_FILL_PIECE_DIRECTIONS1: 3,
    ARG_FILL_PIECE_DIRECTIONS2: 4,

    ARG_RAINBOW_BRIGHTNESS: 1,
    ARG_RAINBOW_SOURCES: 2,

    ARG_PIECES_COLOR_COUNT: 1,
    ARG_PIECES_PIECE_COUNT: 2,

    ARG_ROTATING_COLOR_COUNT: 1,
    ARG_ROTATING_ELEMENT_COUNT: 2,
    ARG_ROTATING_LED_COUNT: 3
};

module.exports.effects = effects;
module.exports.args = args;