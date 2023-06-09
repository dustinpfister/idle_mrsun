// state_land.mjs - for idle_mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// RENDERING HELPERS
//-------- ----------
// draw just an outline for a block
const drawBlockOutline = (ctx, x, y, opt) => {
    const sx = opt.grid_w / 2 * -1;
    const sy = opt.grid_h / 2 * -1;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.rect(x, y, opt.block_width, opt.block_height);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0, 0.15)';
    ctx.fill();
};
// draw block level text
const drawBlockLevelText = (ctx, x, y, block, opt) => {
    ctx.font = '9px arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if(block.type === 'rock' && opt.block_infodisp){
        ctx.fillStyle = 'white';
        ctx.fillText(block.level, x + 5, y + 5);
    }
};
// draw level up cost info
const drawBlockLevelUpInfo = (ctx, x, y, slot, section, sm, opt) => {
    const block = slot.block;
    ctx.font = '9px arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    if(block.type === 'rock' && opt.block_infodisp){
        ctx.fillStyle = 'white';
        const ug_button = sm.states.land.data.button_bm_upgrade;
        const level_data = ug_button.options[ug_button.i_option];
        const ug_info = gameMod.getBlockUpgradeInfo(sm.game, section.i, slot.i, level_data);
        ctx.fillStyle = '#ffffff';
        if(!ug_info.afford){
            ctx.fillStyle = '#ff0000';
        }
        ctx.fillText(ug_info.cost_str, x + 5, y + 16);
    }
};
// main draw land section helper
const drawLandSection = (sm, ctx, canvas, section, opt ) => {
    opt = opt || {};
    opt.block_infodisp = opt.block_infodisp || false;
    ctx.save();
    ctx.translate(opt.grid_cx , opt.grid_cy);
    ctx.rotate(opt.grid_radian);
    const sx = opt.grid_w / 2 * -1;
    const sy = opt.grid_h / 2 * -1;
    let i = 0;
    while(i < constant.SLOT_GRID_LEN){
        const bx = i % constant.SLOT_GRID_WIDTH;
        const by = Math.floor(i / constant.SLOT_GRID_WIDTH);
        const i_slot = by * constant.SLOT_GRID_WIDTH + bx;
        const slot = section.slots[i_slot];
        const block = slot.block;
        const x = sx + opt.block_width * bx;
        const y = sy + opt.block_height * by;
        // render a block
        drawBlockOutline(ctx, x, y, opt);
        drawBlockLevelText(ctx, x, y, block, opt);
        drawBlockLevelUpInfo(ctx, x, y, slot, section, sm, opt);
        i += 1;
    }
    ctx.restore();
};
//-------- ----------
// NEXT AND LAST LAND SECTIONS
//-------- ----------
const next_section = (sm, next) => {
    if(next){
        sm.landIndex = (sm.landIndex + 1) % 12;
    }
    if(!next){
        let n = sm.landIndex - 1;
        n = n < 0 ? 11 : n;
        sm.landIndex = n;
    }
};
//-------- ----------
// STATE OBJECT FOR LAND
//-------- ----------
const state_land = {
    data: {
        block_mode: 'unlock',    // 'unlock', 'create', 'absorb', 'upgrade', and 'info' modes
        block_info_disp: false,  // display block info or not?
        block: null,
        button_next : {  desc: 'Next', position: new Vector2(640 - 60, 430), r: 30 },
        button_last : {  desc: 'Last', position: new Vector2(60, 430), r: 30 },
        // 'Block Mode' buttons
        button_bm_unlock :  {  active: true, desc: 'Unlock', position: new Vector2(35, 125), r: 25 },
        button_bm_create :  {  active: false, desc: 'Create', position: new Vector2(35, 180), r: 25 },
        button_bm_absorb :  {  active: false, desc: 'Absorb', position: new Vector2(35, 235), r: 25 },
        button_bm_upgrade : {  active: false, 
                               options: ['x1', 'x2', 'x5', 'mod5', 'max'],
                               i_option: 3,
                               desc: 'Upgrade',
                               position: new Vector2(35, 290), r: 25 },
        button_bm_info :    {  active: false, desc: 'Info', position: new Vector2(35, 345), r: 25 },
        grid_cx: 320,
        grid_cy: 240,
        grid_w: 0, grid_h:0,
        block_width: 50,
        block_height: 35,
        grid_radian: 0,
        block_infodisp: true
    },
    // the init hook will ONLY BE CALLED ONCE when the state machine is started
    init: (sm, data) => {
        console.log('init hook for land state');
        data.grid_w = data.block_width * constant.SLOT_GRID_WIDTH;
        data.grid_h = data.block_height * constant.SLOT_GRID_HEIGHT;
    },
    // the start hook will be called each time this state is started
    start: (sm, opt, data) => {
        console.log('land state start...');
        const lands = sm.game.lands;
        const bt_counts = sm.game.lands.bt_counts;
        utils.button_set(data, 'unlock');
        if(lands.slot_unlock_count > 0 && bt_counts.rock === 0 ){
            console.log('more than zero slots unlocked, but no rocks? So create then yes.');
            utils.button_set(data, 'create');
        }
        if(bt_counts.rock > 0){
            console.log('more than 1 rock, so upgrade then maybe.');
            utils.button_set(data, 'upgrade');
        }
    },
    // update called in main app loop function
    update: (sm, secs, data) => {
        gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        ctx.lineWidth = 1;
        const sun = sm.game.sun;
        const section = sm.game.lands.sections[sm.landIndex];
        // render the common background
        utils.render_background(sm, ctx, canvas, data);
        // the sprite object for land state
        section.sprite_land.update();
        utils.drawSprite(section.sprite_land, ctx, canvas);
        drawLandSection(sm, ctx, canvas, section, data);
        // buttons
        utils.drawButton(sm, data.button_next, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_last, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_unlock, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_create, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_absorb, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_upgrade, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_info, sm.ctx, sm.canvas);
        // common disp
        utils.drawCommonDisp(sm, ctx, canvas);
        // land disp
        ctx.font = '10px arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('temp: ' + section.temp, 15, 45);
        ctx.fillText('rocks: ' + section.bt_counts.rock, 15, 55);
        ctx.fillText('slot unlock cost: ' + utils.formatDecimal(sm.game.lands.slot_unlock_cost, 4), 15, 65);
        ctx.fillText('section mana value: ' +  utils.formatDecimal(section.mana_total), 15, 75);
        ctx.fillText('sunspots delta world value: ' + utils.formatDecimal(sm.game.sunspots_delta_world_value, 4), 170, 45);
        ctx.fillText('section mana delta: ' + utils.formatDecimal(section.mana_delta, 4), 170, 55);
        ctx.fillText('climate: ' + constant.CLIMATE_ZONES[section.climate_zone_index].desc, 170, 65);
        // current land index
        ctx.font = '50px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LAND ' + sm.landIndex, 320, 430);
        if(data.block_info_disp){
            const sx = 320 - 150, sy = 240 - 100;
            const block = data.block;
            ctx.fillStyle = 'rgba(0,0,0, 0.5)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(sx, sy, 300, 200)
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.fillText('type: ' + block.type, 320, sy + 20);
            ctx.fillText('mana_value: ' + utils.formatDecimal(block.mana_value.valueOf(), 4),320, sy + 40   );
            ctx.fillText('mana_base: ' + block.mana_base.toFixed(2), 320, sy + 60   );
            ctx.fillText('mana_temp: ' + block.mana_temp.toFixed(2), 320, sy + 80   );
        }
    },
    events: {
        pointerdown: (sm, pos, e, data) => {
            const section = sm.game.lands.sections[sm.landIndex];
            if(data.block_info_disp){
                data.block_info_disp = false;
            }else{
                // state switcher UI
                utils.button_state_switcher(sm, pos);
                // next and last buttons
                utils.button_check(data, 'button_next', pos, () => {
                    next_section(sm, true);
                });
                utils.button_check(data, 'button_last', pos, () => {
                    next_section(sm, false);
                });
                utils.button_check_blockmode(data, 'unlock', pos);
                utils.button_check_blockmode(data, 'create', pos);
                utils.button_check_blockmode(data, 'absorb', pos);
                utils.button_check_blockmode(data, 'upgrade', pos);
                utils.button_check_blockmode(data, 'info', pos);
                // grid clicked?
                const sx = data.grid_cx - data.grid_w / 2;
                const sy = data.grid_cy - data.grid_h / 2;
                if( utils.boundingBox(pos.x, pos.y, 1, 1, sx, sy, data.grid_w, data.grid_h) ){
                    const bx = Math.floor( ( pos.x - sx - 0.01) / data.block_width );
                    const by = Math.floor( ( pos.y - sy - 0.01) / data.block_height );
                    const i = by * constant.SLOT_GRID_WIDTH + bx;
                    const slot = section.slots[i];
                    // no slot!?
                    if(!slot){
                        console.log('no slot at this location.');
                        console.log(bx, by);
                        return;
                    }
                    const block = slot.block;
                    // action will differ based on block mode
                    if(data.block_mode === 'unlock'){
                        gameMod.unlockSlot(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'create'){
                        gameMod.createBlock(sm.game, sm.landIndex, i, 1);
                    }
                    if(data.block_mode === 'absorb'){
                        gameMod.absorbBlock(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'upgrade'){
                        const button = data.button_bm_upgrade;
                        const option_str = button.options[button.i_option];
                        console.log('trying an ' + option_str + ' upgrade');
                        gameMod.upgradeBlock(sm.game, sm.landIndex, i, option_str);
                    }
                    if(data.block_mode === 'info'){
                        data.block_info_disp = true;
                        data.block = block;
                        gameMod.saveGame(sm.game);
                    }
                }
            }
        },
        onkeyfirst: (sm, key, down, e, data) => {
            const sun = sm.game.sun;
                if(key ==='ArrowRight'){
                    next_section(sm, true);
                }
                if(key ==='ArrowLeft'){
                    next_section(sm, false);
                }
            if(down){
                sm.commonNumKey(key);
            }
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_land };