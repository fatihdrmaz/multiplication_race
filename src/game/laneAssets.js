// Kenney Racing Pack (CC0) — https://kenney.nl/assets/racing-pack

// HOT_WHEELS_CARS id → yukarıdan görünen araba sprite'ı
export const CAR_SPRITES = {
    1: require('../../assets/kenney/cars/car_red_1.png'),
    2: require('../../assets/kenney/cars/car_blue_2.png'),
    3: require('../../assets/kenney/cars/car_green_3.png'),
    4: require('../../assets/kenney/cars/car_yellow_4.png'),
    5: require('../../assets/kenney/cars/car_black_5.png'),
    6: require('../../assets/kenney/cars/car_red_5.png'),
};

export const RIVAL_SPRITES = {
    default: require('../../assets/kenney/cars/car_black_1.png'),
    alt: require('../../assets/kenney/cars/car_blue_1.png'), // Oyuncu siyah araba seçtiyse
};

export const CAR_ASPECT = 131 / 71; // yükseklik / genişlik

export const CURB_TILE = require('../../assets/kenney/tiles/curb.png');
export const CURB_TILE_SIZE = 128;
export const CURB_WIDTH = 22; // Karonun iki yanındaki bordür şeridi (gölge dahil)

export const DECOR = {
    treeLarge: { src: require('../../assets/kenney/objects/tree_large.png'), w: 214, h: 212 },
    treeSmall: { src: require('../../assets/kenney/objects/tree_small.png'), w: 141, h: 141 },
    tiresRed: { src: require('../../assets/kenney/objects/tires_red.png'), w: 56, h: 56 },
    tiresWhite: { src: require('../../assets/kenney/objects/tires_white.png'), w: 56, h: 56 },
    tribune: { src: require('../../assets/kenney/objects/tribune_full.png'), w: 448, h: 223 },
    cone: { src: require('../../assets/kenney/objects/cone_straight.png'), w: 45, h: 44 },
    barrel: { src: require('../../assets/kenney/objects/barrel_red.png'), w: 56, h: 56 },
    rock: { src: require('../../assets/kenney/objects/rock1.png'), w: 89, h: 72 },
};

export const COLORS = {
    asphalt: '#A6C9CB',
    grass: '#27AE60',
    grassDark: '#229A54',
    laneLine: 'rgba(255, 255, 255, 0.75)',
};
