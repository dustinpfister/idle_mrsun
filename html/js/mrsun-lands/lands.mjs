// lands.mjs - for idle_mrsun
import { Decimal }  from "../decimal/10.4.3/decimal.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { canvasMod } from '../canvas/canvas.mjs'
import { Sprite, SpriteSheet } from '../object2d-sprite/sprite.mjs'
import { utils }  from "../mrsun-utils/utils.mjs"
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// Decimal
//-------- ----------
Decimal.set(constant.DECIMAL_OPTIONS);
//-------- ----------
// SpriteLandSectonWorld Class ( for world state )
//-------- ----------
// draw a single texel for a single slot ( in world state )
const drawSectionSlotTexel = (ctx, slot, v2, rad_center, texelX, texelY) => {
    const block = slot.block;
    let img = constant.IMG.locked;
    if(!slot.locked){
        img = constant.IMG[block.type];
    }
    const i_ci = texelY * img.w + texelX;
    const fillStyle = img.palette[ img.color_indices[ i_ci ] ];
    const rad_texel_delta = constant.SLOT_RADIAN_DELTA * 2 / 10 / img.w;
    const radius_texel_delta = constant.SLOT_RADIUS_DELTA  / img.h;

//    utils.drawSectionArc(ctx, slot.x, slot.y, v2, rad_center, rad_texel_delta, radius_texel_delta, texelX, texelY, fillStyle);

   utils.drawSectionArc2(ctx, {
       slotX: slot.x,
       slotY: slot.y,
       v2: v2,
       rad_center: rad_center,
       rad_delta_texel: rad_texel_delta,
       radius_texel_delta: radius_texel_delta,
       texelX: texelX, texelY: texelY,
       fillStyle: fillStyle
   });

};
// create a render sheet for the given section object
const createSectionRenderSheet = (section, drawSectionSlot) => {
    const can = canvasMod.create({
        size: 1024,
        state: {
            section: section
        },
        draw: (canObj, ctx, canvas, state) => {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            const section = state.section;
            const sprite = section.sprite_world;
            let i = 0;
            while(i < constant.SLOT_GRID_LEN){
                const bx = i % constant.SLOT_GRID_WIDTH;
                const by = Math.floor(i / constant.SLOT_GRID_WIDTH);
                const i_slot = by * constant.SLOT_GRID_WIDTH + bx;
                const slot = section.slots[i_slot];
                drawSectionSlot(ctx, section, slot)
                i += 1;
            }
        }
    });
    const sheet = new SpriteSheet(can.canvas);
    sheet.setCellDataToGrid( new Vector2(128, 128) );
    sheet.can = can;
    return sheet;
};
class SpriteLandSectionWorld extends Sprite {
    constructor (section) {
        super();
        this.section = section;
        this.type = 'SpriteLandSectonWorld';
        this.size.set(128, 128);
        this.sheets[0] = createSectionRenderSheet(this.section, this.drawSectionSlot);
        this.cellIndices[0] = 0;
    }
    // draw a section arc for a single slot object to be used in world state
    drawSectionSlot (ctx, section, slot) {
        const block = slot.block;
        let img = constant.IMG.locked;
        if(!slot.locked){
            img = constant.IMG[block.type];
        }
        const radian = Math.PI + Math.PI * 2 / constant.LAND_OBJECT_COUNT  * section.i;
        // get a vector2 that is on the edge of the sun area
        //const v1 = new Vector2(64 + Math.cos(radian) * constant.radius_land, 64 + Math.sin(radian) * constant.radius_land );
        // get a vector2 that is the center location
        const v2 = new Vector2(
            64 + Math.cos(radian) * constant.LAND_RADIUS_TOCENTER, 
            64 + Math.sin(radian) * constant.LAND_RADIUS_TOCENTER);
        let rad_center = Math.PI * 2 / constant.LAND_OBJECT_COUNT * section.i;
        // draw texels
        const len = img.w * img.h;
        let i_texel = 0;
        while(i_texel < len){
            const x = i_texel % img.w;
            const y = Math.floor(i_texel / img.w);
            drawSectionSlotTexel(ctx, slot, v2, rad_center, x, y);
            i_texel += 1;
        }
    }
    update(){
        canvasMod.update(this.sheets[0].can);
    }
};
//-------- ----------
// SpriteLandSectonLand Class ( for land state )
//-------- ----------
class SpriteLandSectionLand extends Sprite {
    constructor(section) {
        super();
        this.section = section;
        this.type = 'SpriteLandSectonLand';
        this.size.set(500, 280);
        this.sheets[0] = createSectionRenderSheet( this.section, this.drawSectionSlot );
        this.cellIndices[0] = 0;
    }
    // draw a single slot for the section object
    drawSectionSlot(ctx, section, slot){
        const block = slot.block;
        let img = constant.IMG.locked;
        if(!slot.locked){
            img = constant.IMG[block.type];
        }
        // draw texels
        const len = img.w * img.h;
        const block_width = 128 / 10;
        const block_height = 128 / 8;
        const texel_width = block_width / img.w;
        const texel_height = block_height / img.h;
        let i_texel = 0;
        while(i_texel < len){
            const texelX = i_texel % img.w;
            const texelY = Math.floor(i_texel / img.w);
            const i_ci = texelY * img.w + texelX;
            ctx.fillStyle = img.palette[ img.color_indices[ i_ci ] ];
            ctx.fillRect(
                slot.x * block_width + texel_width * texelX, 
                slot.y * block_height + texel_height * texelY, 
                texel_width, texel_height);
            i_texel += 1;
        }
    }
    update(){
        canvasMod.update(this.sheets[0].can);
    }
};
//-------- ----------
// BLOCK CLASS
//-------- ----------
class Block {
    constructor(opt) {
        opt = opt || {};
        this.type = opt.type || 'blank';
        this.mana_base = 0;
        this.mana_temp = 0;
        this.mana_value = null;
        this.upgradeCost = 0;
        this.setLevel(opt.level, this.type, 1);
    }
    // set the mana value object for this block
    setManaValue () {
        // by default value is just the powers of 10 added up
        const mv_level = utils.addPows(10, this.level - 1);
        const obj_value = {
           mv_level: new Decimal(mv_level),
           valueOf: function(){
               return this.mv_level;
            }
        };
        // if blank the value should be zero
        if(this.type === 'blank'){
            obj_value.mv_level = new Decimal(0);
        }
        this.mana_value = obj_value;
    }
    // get the upgrade cost AT the given CURRENT block level
    getUpgradeCost (level_current, level_target) {
        level_target === undefined ? level_current + 1 : level_target;
        return new Decimal( utils.addPows(10, level_target - 1, level_current) );
        //return Decimal.pow(10, level_current === undefined ? this.level : level_current);
    }
    getMaxLevel (mana, level_current) {
        level_current = level_current === undefined ? this.level : level_current;
        let level_target = level_current;
        let mana_cost = 0;
        while(mana_cost <= mana){
            level_target += 1;
            mana_cost = this.getUpgradeCost(level_current, level_target).toNumber();
        }
        return level_target - 1;
    }
    // set mana stats without doing anything with level or type
    setManaStats (sunspot_multi = 1) {
        const TYPE_DEF = constant.BLOCKS[this.type];
        this.mana_base = TYPE_DEF.mana_base * sunspot_multi * this.level;
        this.mana_temp = Math.pow(TYPE_DEF.mana_temp * sunspot_multi, this.level);
        // for non blank types I want to make sure mana temp does not go below 1
        if(this.type != 'blank'){
            this.mana_temp = this.mana_temp < 1 ? 1 : this.mana_temp;
        }
    }
    // set the current level of the block, can also change type
    setLevel (level, type, sunspot_multi = 1 ) {
        this.level = level === undefined ? 1 : parseInt(level);
        this.type = type || this.type;
        this.setManaStats(sunspot_multi);
        this.mana_value = null;
        this.upgradeCost = this.getUpgradeCost(this.level, this.level + 1);
        this.setManaValue();
    }
    // copy some other block to this block
    copy (block) {
        this.setLevel(block.level, block.type, 1);
    }
    // clear a block to blank type
    clear () {
        this.setLevel(1, 'blank', 1);
    }
};
//-------- ----------
// SLOT CLASS
//-------- ----------
class Slot {
    constructor(opt) {
        opt = opt || {};
        this.i = opt.i === undefined ? 0 : opt.i;
        this.x = opt.x === undefined ? 0 : opt.x;
        this.y = opt.y === undefined ? 0 : opt.y;
        this.block = new Block({ type: 'blank'});
        this.locked = true;
    }
    // set auto block type such as 'water' block type
    autoSetBlockType () {
       
        // if the slot is NOT locked, and the type is NOT Locked
        // then it is possible for the block to end up being auto set
        if( !this.locked && this.block.type != 'rock' && this.block.type != 'water_life'){
            // by default the block will be blank
            this.block.setLevel(1, 'blank', 1);

            const yMin = constant.SLOT_GRID_HEIGHT - constant.WATER_LEVEL;
            if(this.y >= yMin){
                this.block.setLevel(1, 'water', 1);
            }
        }
        // if slot is locked, make sure block type is blank
        if(this.locked){
            this.block.setLevel(1, 'blank', 1);
        }
    }
};
//-------- ----------
// Land Section
//-------- ----------
class LandSection {
    constructor(i, cx, cy, sectionData) {
        sectionData = sectionData || {};
        this.i = i;
        this.a = Math.PI * 2 * ( i / constant.LAND_OBJECT_COUNT);
        // use the vector2 class
        this.position = new Vector2();
        this.position.x = cx + Math.cos(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS );
        this.position.y = cy + Math.sin(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS );
        this.r = constant.LAND_RADIUS;
        this.slots = [];
        this.slot_unlock_count = 0;
        // counts_of_block_types/next_cost_of_somehting.
        this.bt_counts = {};  // counts for all block types for all slots 'blank, rock, ect'
        // temp
        this.d_alpha = 0;
        this.temp = 0;
        this.climate_zone_index = 0;
        this.setClimateIndex(0);
        this.createSlotGrid();
        // starting unlock slots
        this.applySectionData(sectionData)
        // update the counts
        this.setBlockTypeCounts();
        // world state sprite object
        this.sprite_world = new SpriteLandSectionWorld(this);
        this.sprite_world.position.set(this.position.x, this.position.y);
        // land sprite sprite object
        this.sprite_land = new SpriteLandSectionLand(this);
        this.sprite_land.position.set(320, 240);
        // total mana value
        this.mana_total = new Decimal(0);
        // mana delta for this section
        this.mana_delta = new Decimal(0);
    }
    isHabitable () {
        const climate = constant.CLIMATE_ZONES[this.climate_zone_index];
        return this.bt_counts.water > 0 && !!climate.habitability;
    }
    // apply section data
    applySectionData(sectionData){
        const unlock = sectionData.cols_unlock_slots;
        const blockdata = sectionData.cols_block_data || [];
        if(unlock){
            let x = 0;
            while(x < constant.SLOT_GRID_WIDTH){
                let y = constant.SLOT_GRID_HEIGHT - 1;
                let ct = unlock[x];
                let bd = [];
                if(blockdata[x]){
                    bd = blockdata[x].split(';');
                }
                while(ct > 0){
                    const slot = this.getSlot(x, y);
                    slot.locked = false;
                    const i_bd = unlock[x] - ct;
                    if( bd[ i_bd] ){
                        const str = bd[ i_bd];
                        const arr = str.split(',');
                        if(arr[0] === 'b'){
                            slot.block.clear();
                        }
                        if(arr[0] === 'r'){
                            slot.block.setLevel(arr[1], 'rock', 1);
                        }
                        if(arr[0] === 'w'){
                            slot.block.setLevel(arr[1], 'water', 1);
                        }
                    }
                    y -= 1;
                    ct -= 1;
                }
                x += 1;
            }
        }
    }
    // get a section data object used for save states
    getSectionData(){
        const sectionData = {
            cols_unlock_slots: [],
            cols_block_data: []
        };
        let x = 0;
        while(x < constant.SLOT_GRID_WIDTH){
            let y = constant.SLOT_GRID_HEIGHT -  1;
            let unlock_ct = 0;
            let bd_str = '';
            while(y >= 0){
                const slot = this.getSlot(x, y);
                unlock_ct = slot.locked ? unlock_ct : unlock_ct + 1;
                if(!slot.locked){
                   if(slot.block.type === 'rock'){
                       bd_str += 'r,' + slot.block.level + ';';
                   }
                   if(slot.block.type === 'blank'){
                       bd_str += 'b,1;';
                   }
                   if(slot.block.type === 'water'){
                       bd_str += 'w,1;';
                   }
                   if(slot.block.type === 'water_life'){
                       bd_str += 'w,1;';
                   }
                }
                y -= 1;
            }
            sectionData.cols_block_data.push( bd_str );
            sectionData.cols_unlock_slots.push( unlock_ct );
            x += 1;
        }
        return sectionData;
    }
    // get a slot object by index or grid position
    getSlot(xi, y){
        let i = xi;
        if(y != undefined){
            i = this.getSlotIndex(xi, y);
        }
        return this.slots[i];
    }
    // get a slot index number if x and y are known
    getSlotIndex(x, y){
        return y * constant.SLOT_GRID_WIDTH + x;
    }
    // get a slot i, x, y object when just i is known
    getSlotXY (i) {
        return {
            i: i,
            x: i % constant.SLOT_GRID_WIDTH,
            y: Math.floor(i / constant.SLOT_GRID_WIDTH)
        }
    }
    // for each slot
    forEachSlot(func) {
        let i_slot = 0;
        const len = this.slots.length;
        while(i_slot < len){
            const slot = this.slots[i_slot];
            func.call(this, slot, i_slot, this);
            i_slot += 1;
        }
    }
    // set climate index by given temp alpha value
    setClimateIndex( a_temp ) {
        const zone_array = constant.CLIMATE_ZONES;
        const len = zone_array.length;
        let i = 0;
        this.climate_zone_index = 0; // default is whatever index 0 is
        if(a_temp <= 0){
            return;
        }
        if(a_temp >= 1){
            this.climate_zone_index = len - 1;
            return;
        }
        while(i < len){
            const zone = zone_array[i];
            if( a_temp > zone.temp_alphas[0] && a_temp <= zone.temp_alphas[1]){
                this.climate_zone_index = i;
                break;
            }
            i += 1;
        }
    }
    // set block type counts
    setBlockTypeCounts() {
        const bt_counts = this.bt_counts = Object.keys(constant.BLOCKS).reduce( (acc, typeKey) => {
            acc[typeKey] = 0;
            return acc;
        }, {});
        let slot_unlock_count = 0;
        this.forEachSlot( (slot) => {
            const ct = bt_counts[ slot.block.type ];
            bt_counts[ slot.block.type ] = ct === undefined ? 1 : ct + 1;
            slot_unlock_count += slot.locked ? 0 : 1;
        });
        this.slot_unlock_count = slot_unlock_count;
    }
    // create the Slot Grid
    createSlotGrid() {
        let i_slot = 0;
        this.slots = [];
        while(i_slot < constant.SLOT_GRID_LEN){
            const slot = new Slot( this.getSlotXY(i_slot) );
            this.slots.push(slot);
            i_slot += 1;
        }
    }
    // drop down blocks at a given slot
    dropDownBlocks(slot) {
        let y = slot.y;
        while(y >= 1){
            const slot_current = this.slots[ this.getSlotIndex( slot.x, y ) ];
            const slot_up = this.slots[ this.getSlotIndex( slot.x, y - 1 ) ];
            if(slot_up.block.type != 'blank'){
                slot_current.block.copy(slot_up.block);
                slot_up.block.clear();
            }
            y -= 1;
        }
    }
};
//-------- ----------
// Lands Class
//-------- ----------
class Lands {
    constructor(opt) {
        opt = opt || {};
        opt = Object.assign({}, { sectionData: [] }, opt);
        this.sections = [];
        this.bt_counts = {}; // block type grand total counts
        this.slot_unlock_cost = 0;
        this.slot_unlock_count = 0;
        this.slot_total = constant.SLOT_GRID_LEN * constant.LAND_OBJECT_COUNT;
        // total mana value
        this.mana_total = new Decimal(0);
        let i = 0;
        while(i < constant.LAND_OBJECT_COUNT){
            const sectionData = opt.sectionData[i] || {};
            const section = new LandSection(i, constant.SUN_CENTER.x, constant.SUN_CENTER.y, sectionData);
            this.sections.push(section);
            i += 1;
        }
        this.setBlockTypeCounts();
    }
    // call a function for each slot, of each land Section
    forEachSection (func) {
        let si = 0;
        const len = this.sections.length;
        while(si < len){
            const section = this.sections[si];
            func.call(this, section, si, this);
            si += 1;
        }
    }
    getSectionDataArray(){
        const array = [];
        this.forEachSection( (section) => {
           array.push(section.getSectionData());
        });
        return array;
    }
    // set grand total block type counts, slot unlock counts, and update slot unlock cost
    setBlockTypeCounts() {
        const bt_counts = this.bt_counts = Object.keys(constant.BLOCKS).reduce( (acc, typeKey) => {
            acc[typeKey] = 0;
            return acc;
        }, {});
        let slot_unlock_count = 0;
        this.forEachSection( (section) => {
            section.setBlockTypeCounts();
            Object.keys(constant.BLOCKS).forEach((typeKey)=>{
                bt_counts[typeKey] += section.bt_counts[typeKey];
            });
            slot_unlock_count += section.slot_unlock_count;
        });
        this.slot_unlock_count = slot_unlock_count;
        // update slot unlock cost
        const n = this.slot_unlock_count;
        const d = this.slot_total;
        this.slot_unlock_cost = Decimal.pow(10, constant.SLOT_UNLOCK_MAXEXP * ( n / d ) ).ceil().sub(1);
    }
};

//-------- ----------
// EXPORT
//-------- ----------
export { Lands, LandSection, Slot, Block };
