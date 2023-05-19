// state_world.mjs - for idle_mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
import { canvasMod } from '../canvas/canvas.mjs'
//-------- ----------
// RENDER FUNCTIONS 
//-------- ----------
// render the sunarea
const render_sunarea = (sm, ctx, canvas, data) => {
    const sun = sm.game.sun;
    // sun area
    const md = constant.SUNAREA_RADIUS;
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(sun.center.x, sun.center.y, md, 0, Math.PI * 2);
    ctx.fill();
    // sun back
    ctx.fillStyle = 'rgba(255,255,0,0.5)';
    ctx.beginPath();
    ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
};
// render the world state display
const render_display = (sm, ctx, canvas, data) => {
    // disp
    utils.drawCommonDisp(sm, ctx, canvas);
    // world disp
    ctx.font = '9px monospace';
    const sx = 10, sy = 45, yd = 9;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('rocks: ' + sm.game.lands.bt_counts.rock, sx, sy);
    ctx.fillText('slots unlocked: ' + sm.game.lands.slot_unlock_count + '/' + sm.game.lands.slot_total,sx, sy + yd * 1);
    ctx.fillText('mana level: ' + sm.game.mana_level, sx, sy + yd * 2);
};
// render just the text for the given land section object
const render_section_text = (ctx, section) => {
    ctx.lineWidth = 1;
    ctx.font = 'bold 30px arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(section.temp, section.position.x, section.position.y);
    ctx.strokeText(section.temp, section.position.x, section.position.y);
};

const render_slot_location = (ctx, section, slotX, slotY, fillStyle, imgWidth, a_imgwidth, invert ) => {
    const radian = Math.PI + Math.PI * 2 / constant.LAND_OBJECT_COUNT  * section.i;
    const v2 = new Vector2(
       Math.cos(radian) * constant.LAND_RADIUS_TOCENTER, 
       Math.sin(radian) * constant.LAND_RADIUS_TOCENTER);
    v2.add(section.position);
    const rad_center = Math.PI * 2 / constant.LAND_OBJECT_COUNT * section.i;
    const rad_texel_delta = constant.SLOT_RADIAN_DELTA * 2 / constant.SLOT_GRID_WIDTH / imgWidth;
    const radius_texel_delta = constant.SLOT_RADIUS_DELTA;
    // img width is 1
    //let texelX = 0;
    //const texelY = 0;

    const opt = {
        slotX: slotX, slotY: slotY, 
        v2: v2, 
        rad_center: rad_center, rad_delta_texel: rad_texel_delta, 
        radius_texel_delta : radius_texel_delta,
        texelX:0, texelY:0,
        fillStyle: fillStyle,
        strokeStyle: null
    }

    if(imgWidth === 1){
       utils.drawSectionArc2(ctx, opt);
       //utils.drawSectionArc(ctx, slotX, slotY, v2, rad_center, rad_texel_delta, radius_texel_delta, texelX, texelY, fillStyle);
       return;
    }
    // img width is > 1
    if(!invert){
        opt.texelX = 0;
        while(opt.texelX < Math.ceil( imgWidth * a_imgwidth) ){
            utils.drawSectionArc2(ctx, opt);
            //utils.drawSectionArc(ctx, slotX, slotY, v2, rad_center, rad_texel_delta, radius_texel_delta, texelX, texelY, fillStyle);
            opt.texelX += 1;
        }
    }
    if(invert){
        opt.texelX = imgWidth - 1;
        while(opt.texelX >= imgWidth - Math.ceil( imgWidth * a_imgwidth ) ){
            utils.drawSectionArc2(ctx, opt);
            //utils.drawSectionArc(ctx, slotX, slotY, v2, rad_center, rad_texel_delta, radius_texel_delta, texelX, texelY, fillStyle);
            opt.texelX -= 1;
        }
    }
};
// render the mana delta % arc for a given section
const render_section_manadelta = (ctx, section, game) => {
    let fillStyle = '#ffffff';
    let imgWidth = 1;
    const alpha = section.mana_delta.div(game.mana_per_tick).toNumber();
    let x = constant.SLOT_GRID_WIDTH * alpha / 2;
    let x_intstart = Math.round( x );
    let x_int = x_intstart;
    let a_imgwidth = x % 1;
    while(x_int >= 0){
        //fillStyle = '#afafaf';
        imgWidth = 1;
        if(x_int === x_intstart){
        //   fillStyle = 'red';
           imgWidth = 8;
        }
        render_slot_location(ctx, section, 5 + x_int, -1, fillStyle, imgWidth, a_imgwidth, false);
        render_slot_location(ctx, section, 4 - x_int, -1, fillStyle, imgWidth, a_imgwidth, true);
        x_int -= 1;
    }
};
// RENDER DETAIL
const render_detail = (sm, ctx, canvas, data) => {
    utils.render_background(sm, ctx, canvas, data);
    render_sunarea(sm, ctx, canvas, data);
    utils.drawSprite(sm.game.sun, ctx, canvas);
    sm.game.lands.sections.forEach((section, i) => {
        //section.sprite_world.update();
        utils.drawSprite(section.sprite_world, ctx, canvas);
        // climate color overlay
        const zone = constant.CLIMATE_ZONES[section.climate_zone_index];
        ctx.fillStyle = zone.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(section.position.x, section.position.y, section.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        render_section_text(ctx, section);
        render_section_manadelta(ctx, section, sm.game);
    });
    render_display(sm, ctx, canvas, data)
};
//-------- ----------
// section and slot outline canvas
//-------- ----------
const can_section_outline = canvasMod.create({
    size: 640,
    state: {
        game: {},
        sections: [
            {
               i_section: 0,       // the current section index
               i_slot: [0, 1, 2]   // slot indices to draw overlays for
            }
        ]
    },
    draw: (canObj, ctx, canvas, state) => {
        const game = state.game;
        if(!game.lands){
            return;
        }
    }
});
//-------- ----------
// STATE OBJECT FOR WORLD 
//-------- ----------
const state_world = {
    data: {
        render_world_lt: 0,  // last game tick that rendering was done
        render_world_si: 0   // current section index to render
    },
    init: (sm, data) => {},
    start: (sm, opt) => {
        const sun = sm.game.sun;
        // I might still want to do a full render of all land sections once on each start
        sm.game.lands.sections.forEach((section, i) => {
            section.sprite_world.update();
        });
    },
    update: (sm, secs, data) => {
       // real time update of land sections, but on a section by section basis once per tick
       if( sm.game.tick > data.render_world_lt ){
           data.render_world_lt = sm.game.tick;
           const section = sm.game.lands.sections[data.render_world_si];
           section.sprite_world.update();
           data.render_world_si += 1;
           data.render_world_si %= 12;
       }
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        render_detail(sm, ctx, canvas, data);
    },
    events: {
        pointerdown : (sm, pos, e, data) => {
            const sun = sm.game.sun;
            const d = pos.distanceTo(sun.center);
            // clicked in the sun area?
            if(d < constant.SUNAREA_RADIUS){
                gameMod.setSunPos(sm.game, pos);
                return;
            }
            // clicked land object?
            const land = gameMod.getSectionByPos(sm.game, pos);
            if(land){
                sm.landIndex = land.i;
                sm.setState('land', {});
                return;
            }
            // state switcher UI
            utils.button_state_switcher(sm, pos);
        },
        onkey: (sm, key, down, e, data) => {},
        onkeyfirst: (sm, key, down, e, data) => {
            const sun = sm.game.sun;
            if(down){
                const a_lencurrent = sun.getLengthAlpha();
                if(key ==='ArrowRight'){
                    gameMod.stepSunPos(sm.game, 'dir', 1, 1);
                }
                if(key ==='ArrowLeft'){
                    gameMod.stepSunPos(sm.game, 'dir', -1, 1);
                }
                if(key ==='ArrowUp'){
                    gameMod.stepSunPos(sm.game, 'length', 1, 10);
                }
                if(key ==='ArrowDown'){
                    gameMod.stepSunPos(sm.game, 'length', -1, 10);
                }
                if(key.toLowerCase() ==='c'){
                    gameMod.centerSun(sm.game);
                }
                sm.commonNumKey(key);
            }
        },
        onkeyrepeat: (sm, key, down, e, data) => {}
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_world };
