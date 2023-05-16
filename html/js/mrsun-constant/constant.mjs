// constant.mjs - for electionjs-example-mrsun
import { Decimal }  from "../decimal/10.4.3/decimal.mjs"
import { Vector2 }  from "../vector2/vector2.mjs"
//-------- ----------
// CONSTANT OBJECT
//-------- ----------
const constant = {};
//-------- ----------
// GAME - general game constants used in game.mjs, lands.mjs, sun.mjs, and any addtional assets that need them
//-------- ----------
constant.SUN_RADIUS = 40;
constant.LAND_RADIUS = 40;
constant.SUNAREA_RADIUS = 150;
constant.SUN_CENTER = new Vector2(320, 240);
constant.SUN_DMAX = constant.SUNAREA_RADIUS * 2 - constant.SUN_RADIUS * 2;
constant.LAND_OBJECT_COUNT = 12;
constant.LAND_RADIUS_TOCENTER = constant.LAND_RADIUS + constant.SUNAREA_RADIUS;
constant.BLOCK_MAX_LEVEL = 99;
constant.MANA_MAX = new Decimal('1e100');
constant.MANA_START = '5';
constant.TEMP_MAX = 999;
constant.MAX_BLOCK_POW = Math.log(10000000) / Math.log(2);
constant.SLOT_UNLOCK_MAXEXP = 30;
constant.SLOT_GRID_WIDTH = 10;
constant.SLOT_GRID_HEIGHT = 8;
constant.SLOT_GRID_LEN = constant.SLOT_GRID_WIDTH * constant.SLOT_GRID_HEIGHT;
constant.SLOT_RADIUS_DELTA = 68 / constant.SLOT_GRID_HEIGHT;
constant.SLOT_RADIAN_DELTA = Math.PI / 180 * 15;
constant.BLOCK_LAND_MAX = Math.round(constant.SLOT_GRID_LEN); //!!! might do away with this
constant.LANDS_START_SECTION_DATA = [];
constant.DEFAULT_CREATE_OPTIONS = {
    mana: constant.MANA_START,
    mana_spent: '0',
    mana_level: 1,
    supernova_count: 0,
    sunspots: '0', 
    sectionData: constant.LANDS_START_SECTION_DATA
};
constant.WATER_LEVEL = 1;
//-------- ----------
// CLIMATE - 
//-------- ----------
constant.CLIMATE_ZONES = [
    {
        desc: 'Tundra',
        i: 0,
        color: '#dfdfdf',
        temp_alphas: [0, 0.4],
        mana_multi: 1
    },
    {
        desc: 'Deciduous',
        i: 1,
        color: '#00ff00',
        temp_alphas: [0.4, 0.6],
        mana_multi: 1.2
    },
    {
        desc: 'Desert',
        i: 2,
        color: '#ffff00',
        temp_alphas: [0.6, 0.85],
        mana_multi: 1.4
    },
    {
        desc: 'Hellscape',
        i: 3,
        color: '#ff0000',
        temp_alphas: [0.85, 1],
        mana_multi: 1.75
    }
];
//-------- ----------
// DECIMAL.JS - options
//-------- ----------
constant.DECIMAL_OPTIONS = { 
    precision: 40,
    maxE: 100,
    minE: -100
};
//-------- ----------
// SUPERNOVA / SUNSPOTS
//-------- ----------
constant.SUPERNOVA_STARTCOST_BASE = 2;       // 10000 * Math.pow(2, 115) = 4.15...e+38
constant.SUPERNOVA_STARTCOST_MAXPOW = 115;
constant.SUPERNOVA_STARTCOST_NUM = 10000;
constant.SUNSPOTS_WORLDVALUE_BASE_MAX = 10;
constant.SUNSPOTS_WORLDVALUE_BASE_MIN = 1.0005;
constant.SUNSPOTS_WORLDVALUE_MAXMANA = Math.pow(10, 10);
//-------- ----------
// BLOCK TYPES
//-------- ----------
constant.BLOCKS = {};
constant.BLOCKS.blank = {
    type: 'blank',
    mana_base: 0,
    mana_temp: 0
};
constant.BLOCKS.water = {
    type: 'water',
    mana_base: 0,
    mana_temp: 0
};
constant.BLOCKS.rock = {
    type: 'rock',
    mana_base: 1.00,
    mana_temp: 0.75
};
//-------- ----------
// IMG DATA OBJECTS ( used to render slots / blocks )
//-------- ----------
const IMG = constant.IMG = {};
IMG.locked = {
    palette: ['blue', 'cyan'],
    w: 2, h: 2,
    color_indices: [
        0, 1,
        1, 0
    ]
};
IMG.blank = {
    palette: ['black'],
    w: 1, h: 1,
    color_indices: [0]
};
// 2 by 2 rock
IMG.rock = {
    palette: [
        '#2a2a2a', 
        '#664400', '#442200', 
    ],
    w: 4, h: 4,
    color_indices: [
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 2, 1, 2,
        2, 1, 2, 1
   ]
};
//-------- ----------
// HARD CODED SAVE? - add lz-string compessed save, or set as empty string
//-------- ----------
constant.SAVE_STRING = '';
//-------- ----------
// EXPORT
//-------- ----------
export { constant };
