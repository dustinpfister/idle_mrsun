// utils.js - for idle_mrsun
import { Decimal }  from "../decimal/10.4.3/decimal.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// MAIN UTILS PUBLIC OBJECT
//-------- ----------
const utils = {};
//-------- ----------
// BUTTON METHODS
//-------- ----------
// set the current button by mode string
utils.button_set = (data, mode) => {
    const key = 'button_bm_' + mode;
    const button = data[key];
    data['button_bm_' + data.block_mode].active = false;
    button.active = true;
    data.block_mode = mode;
};
utils.button_check = (data, key, pos, onClick) => {
    let button = key;
    if(typeof key === 'string'){
        button = data[key];
    }
    if( button.position.distanceTo( pos ) <= button.r ){
        onClick(button, data, key, pos);
    }
};
utils.button_state_switcher = (sm, pos ) => {
    // was the main button clicked?
    utils.button_check(sm, 'button_switcher', pos, (button) => {
        console.log('menu button was clicked');
        button.active = !button.active;
    });
    const button_switcher = sm.button_switcher;
    if(button_switcher.active){
        let i = 0;
        const len = button_switcher.children.length;
        while(i < len){
            const button_child = button_switcher.children[i];
            utils.button_check(sm, button_child, pos, (button) => {
                sm.setState(button_child.stateKey, {});
            });
            i += 1;
        }
    }
};
utils.button_check_blockmode = (data, new_block_mode, pos) => {
    const key = 'button_bm_' + new_block_mode;
    utils.button_check(data, key, pos, (button) => {
        const button_bm_current = data['button_bm_' + data.block_mode];
        if(button_bm_current === button){
            console.log('block mode button all ready selected.');
            if(button.options){
                console.log('we have options though. I can step that.');
                button.i_option += 1;
                button.i_option %= button.options.length;
            }
        }
        if(button_bm_current != button){
            console.log('block mode switch');
            button_bm_current.active = false;
            button.active = true;
            data.block_mode = new_block_mode;
        }
    });
};
//-------- ----------
// DATES
//-------- ----------
utils.formatDate = (date) => {
    date = typeof date === 'string' ? new Date(date) : date;
    const month_str = new Intl.DateTimeFormat('en-US', { month: "long" }).format(date);
    const date_str = date.getDate();
    const year_str = date.getFullYear();
    const time_str = date.getHours() + ':' + date.getMinutes();
    return month_str + '/' + date_str + '/' + year_str + ' ' + time_str;
};
//-------- ----------
// MATH UTILIES
//-------- ----------
utils.logOnce = (function(){
    let count = 0;
    return (mess) => {
       if(count < 1){
           console.log(mess)
       }
       count += 1;
    };
}());
// bounding box
utils.boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        (y1 + h1) < y2 ||
        y1 > (y2 + h2) ||
        (x1 + w1) < x2 ||
        x1 > (x2 + w2));
};
// format a decimal object
utils.formatDecimal = (function(){
    // the names array should be consistant with what I have come to like when playing swarmsin
    // https://www.swarmsim.com/#/decimallegend
    const NAMES = [ 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc'];
    return (n, dp) => {
        dp = dp === undefined ? 2 : dp;
        if(n.e < 3){
            return n.toString();
        }
        const er = n.e % 3;
        const i_name = Math.floor( n.e / 3 ) - 1;
        const a = parseFloat( n.toExponential(dp, Decimal.ROUND_DOWN).split('e')[0] );
        if(i_name < NAMES.length){
            let dp2 = dp - er;
            dp2 = dp2 < 0 ? 0: dp2;
            return (a * Math.pow( 10, er ) ).toFixed( dp2 ) + '' + NAMES[i_name];
        }
        return n.toExponential(dp);
    };
}());
// add up pows from start exp down to zero
utils.addPows = (base, exp_start, exp_end) => {
    exp_end = exp_end === undefined ? 0 : exp_end;
    let e = exp_start;
    let n = 0;
    while(e >= exp_end){
        const p = Math.pow(base, e);
        n += p;
        e -= 1;
    }
    return n;
};
//-------- ----------
// IMG OBJECTS
//-------- ----------
utils.getSlotIMG = ( slot, layer = 'block') => {
    const block = slot.block;
    // if the slot is locked, just return the locked image
    if(slot.locked){
        return constant.IMG.locked;
    }

    if(layer === 'block'){
        return constant.IMG[block.type];
    }

    // try to see if there is an 'item' for the 'layer'
    const contentKey = block.contents[layer];
    if(contentKey){
        // if we have the content key, check for the item
        const img_item = constant.IMG[layer + '_' + contentKey];
        if(img_item){
            return img_item;
        }
    }

    return constant.IMG.locked;
};

//!!! MIGHT NOT USE THIS
utils.createSlotIMG = ( slot ) => {
    const block = slot.block;
    // if the slot is locked, just return the locked image
    if(slot.locked){
        return constant.IMG.locked;
    }

    const img_type = constant.IMG[block.type];
    const img_array = [ img_type ];
    let w = img_type.w;
    let h = img_type.h;

    const keys = Object.keys( block.contents );

    let i = keys.length;
    while(i--){
          const kind = keys[i];
          const order = block.contents[ kind ];
          if( order){
              const img_layer = constant.IMG[ kind + '_' + order ];
              img_array.push( img_layer );
              w = img_layer.w > w ? img_layer.w : w;
              h = img_layer.h > h ? img_layer.h : h;
          }
    }

    const img = {
       w: w,
       h: h
    };

    return img;
};

//-------- ----------
// RENDER HELPERS
//-------- ----------
// render the common background
utils.render_background = (sm, ctx, canvas) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
};
// draw a button
utils.drawButton = ( sm, button, ctx, canvas ) => {
    ctx.fillStyle = button.active ? '#004400' : '#444444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(button.position.x, button.position.y, button.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // if progress
    if(button.progress){
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        const radian_start = Math.PI * 1.5 ;
        const radian = radian_start + Math.PI * 2 * button.progress;
        ctx.beginPath();
        ctx.arc(button.position.x, button.position.y, button.r, radian_start, radian);
        ctx.fill();
        ctx.stroke();
    }
    // desc
    ctx.fillStyle = 'white';
    ctx.font = '12px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(button.desc || 'foo', button.position.x, button.position.y);
    // if options draw text for current option
    if(button.options){
        ctx.font = '10px arial';
        const str = button.options[button.i_option];
        ctx.fillText(str, button.position.x, button.position.y + 14);
    }
    // if button is active and has children
    if(button.children && button.active){
        button.children.forEach( (button_child) => {
            utils.drawButton( sm, button_child, ctx, canvas );
        });
    }
};
utils.drawSprite = (sprite, ctx, canvas) => {
    ctx.strokeStyle = '#00ff00';
    ctx.save();
    ctx.translate( sprite.position.x, sprite.position.y );
    if(sprite.sheets){
        let i_sheet = 0, len = sprite.sheets.length;
        while(i_sheet < len){
            const source = sprite.getCell(i_sheet);
            ctx.drawImage(sprite.sheets[i_sheet].image, 
                source.sx, source.sy, source.sw, source.sh,
                sprite.size.x / 2 * -1, sprite.size.y / 2 * -1, sprite.size.x, sprite.size.y 
            );
            i_sheet += 1;
        }
    }
    if(sprite.sheets.length === 0){
        ctx.beginPath();
        ctx.rect(sprite.size.x / 2 * -1, sprite.size.y / 2 * -1, sprite.size.x, sprite.size.y);
        ctx.stroke();
    }
    ctx.restore();
};
// draw a common display that you would want to have over all states
utils.drawCommonDisp = (sm, ctx, canvas) => {
    ctx.fillStyle = 'white';
    ctx.font = '15px arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    // mana bar
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(10, 4, 250, 17);
    ctx.fillStyle = '#0044dd';
    const a_mana = sm.game.mana.div(sm.game.mana_cap);
    ctx.fillRect(10, 4, 250 * a_mana, 17);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('mana: ' + utils.formatDecimal(sm.game.mana, 2) + ' / ' +
         utils.formatDecimal(sm.game.mana_cap, 2) + 
         ' (+' + utils.formatDecimal(sm.game.mana_per_tick, 4) + ') ', 15, 5);
    // sunspots count
    ctx.fillStyle = '#888888';
    ctx.fillText('sunspots: ' + utils.formatDecimal( sm.game.sunspots, 2 ) + ' (' + sm.game.sunspot_multi.toFixed(2) + 'X)', 275, 5);
    // tick count
    ctx.fillText('tick: ' + sm.game.tick, 10, 25);
    utils.drawButton(sm, sm.button_switcher, sm.ctx, sm.canvas);
};
// draw a section arc
const DRAW_SECTION_ARC_DEFAULTS = {
    slotX: 0, slotY:0, 
    v2: new Vector2(0,0), 
    rad_center: 0, rad_delta_texel:0, 
    radius_texel_delta : 0,
    texelX:0, texelY:0,
    fillStyle: '#ffffff'
};
utils.drawSectionArc2 = (ctx, opt) => {
    opt = Object.assign({}, DRAW_SECTION_ARC_DEFAULTS, opt || {});
    const rad_edge = opt.rad_center - constant.SLOT_RADIAN_DELTA;
    const rad_slot_start = rad_edge + Math.PI / 180 * ( 30 / 10 * opt.slotX );
    const rad_start = rad_slot_start + opt.rad_delta_texel * opt.texelX;
    const rad_end = rad_start + opt.rad_delta_texel;
    const radius_slot_low = constant.LAND_RADIUS_TOCENTER - constant.LAND_RADIUS + constant.SLOT_RADIUS_DELTA  * opt.slotY;
    const radius_low = radius_slot_low + opt.radius_texel_delta * opt.texelY;
    const radius_high = radius_low + opt.radius_texel_delta;
    // draw arcs
    ctx.beginPath();
    ctx.arc(opt.v2.x, opt.v2.y, radius_low, rad_start, rad_end  );
    ctx.arc(opt.v2.x, opt.v2.y, radius_high, rad_end, rad_start, true  );
    ctx.closePath();
    if(opt.fillStyle){
        ctx.fillStyle = opt.fillStyle;
        ctx.fill();
    }
    if(opt.strokeStyle){
        ctx.strokeStyle = opt.strokeStyle;
        ctx.stroke();
    }


};
/*
utils.drawSectionArc = (ctx, slotX, slotY, v2, rad_center, rad_delta_texel, radius_texel_delta, texelX, texelY, fillStyle) => {
    const rad_edge = rad_center - constant.SLOT_RADIAN_DELTA;
    const rad_slot_start = rad_edge + Math.PI / 180 * ( 30 / 10 * slotX );
    const rad_start = rad_slot_start + rad_delta_texel * texelX;
    const rad_end = rad_start + rad_delta_texel;
    const radius_slot_low = constant.LAND_RADIUS_TOCENTER - constant.LAND_RADIUS + constant.SLOT_RADIUS_DELTA  * slotY;
    const radius_low = radius_slot_low + radius_texel_delta * texelY;
    const radius_high = radius_low + radius_texel_delta;
    // draw arcs
    ctx.beginPath();
    ctx.arc(v2.x, v2.y, radius_low, rad_start, rad_end  );
    ctx.arc(v2.x, v2.y, radius_high, rad_end, rad_start, true  );
    ctx.closePath();
    ctx.fillStyle = fillStyle
    ctx.fill();
};
*/
//-------- ----------
// FORMAT DECIMAL TEST
//-------- ----------
/*
const total = 960;
let unlock_count = 0;
while(unlock_count < total){
    const n = Decimal.pow(10, 30 * ( unlock_count / total ) ).ceil().sub(1);
    console.log( unlock_count, utils.formatDecimal(n, 2), n.toExponential(8) );
    unlock_count += 1;
}
*/
//-------- ----------
// EXPORT
//-------- ----------
export { utils };