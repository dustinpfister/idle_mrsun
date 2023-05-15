// state_supernova.mjs - for electionjs-example-mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// RENDER FUNCTIONS 
//-------- ----------
const render_info = (sm, ctx, canvas) => {
    // super nova cost object
    const snc = gameMod.getSupernovaCost(sm.game);
    const sx = 25, sy = 100, yd = 20;
    ctx.lineWidth = 1;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '15px monospace';
    ctx.fillText('current sunspots     : ' + utils.formatDecimal(sm.game.sunspots, 4), sx, sy + yd * 0);
    ctx.fillText('sunspots delta       : ' + utils.formatDecimal(sm.game.sunspots_delta, 4), sx, sy + yd * 1);
    const dec = sm.game.sunspots.add( sm.game.sunspots_delta );
    const m = gameMod.getSunSpotMulti( dec.toNumber() );
    ctx.fillText('new sunspots         : ' + utils.formatDecimal(dec, 4), sx, sy + yd * 2 );
    ctx.fillText('new multiplier       : ' + m.toFixed(4) + 'x', sx, sy + yd * 3 );
    const ts = utils.formatDecimal(sm.game.mana_spent, 2)
    ctx.fillText('total mana spent     : ' + ts, sx, sy + yd * 4 );
    ctx.fillText('supernova count      : ' + sm.game.supernova_count, sx, sy + yd * 5 );
    ctx.fillText('supernova start cost : ' + utils.formatDecimal(snc.startcost_dec, 2), sx, sy + yd * 6 );
    ctx.fillText('supernova cost       : ' + utils.formatDecimal(snc.cost_dec, 2), sx, sy + yd * 7 );
    // game start date
    ctx.fillText('game start date      : ' + utils.formatDate(sm.game.start_date), sx, sy + yd * 8 );
};
//-------- ----------
// STATE OBJECT FOR SUPERNOVA
//-------- ----------
const state_supernova = {
    data: {
        button_newgame : {  desc: 'New Game', progress: 0.75, position: new Vector2(60, 420), r: 40 }
    },
    start: (sm, opt) => {},
    update: (sm, secs) => {
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
       // update newe game button progress
       const snc = gameMod.getSupernovaCost(sm.game);
       const button = state_supernova.data.button_newgame;
       button.progress = (snc.startcost - snc.cost) / snc.startcost;
       button.desc = 'Not Ready';
       if( snc.cost_dec.lte(0) ){
           button.desc = 'New Game';
       }
    },
    render: (sm, ctx, canvas, data) => {
        // background
        utils.render_background(sm, ctx, canvas);
        // new game button
        utils.drawButton(sm, data.button_newgame, sm.ctx, sm.canvas);
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
        render_info(sm, ctx, canvas );
    },
    events: {
        pointerdown : (sm, pos, e, data) => {
            // state switcher UI
            utils.button_state_switcher(sm, pos);
            // was supernova button clicked?
            utils.button_check(data, 'button_newgame', pos, (button, data, key, pos) => {
                const snc = gameMod.getSupernovaCost(sm.game);
                //if( sm.game.mana.gte( snc.cost_dec ) ){
                if( snc.cost_dec.lte(0) ){
                    const sp = sm.game.sunspots.add(sm.game.sunspots_delta);
                    const start_date = sm.game.start_date;
                    sm.game = gameMod.create({ 
                        platform: sm.platform,
                        supernova_count: parseInt(sm.game.supernova_count) + 1,
                        sunspots: sp.toString(),
                        start_date: start_date
                    });
                    console.log('starting a new game with: ');
                    console.log( sm.game.sunspots );
                    console.log( sm.game.start_date );
                    sm.setState('world', {});
                }else{
                    console.log('cost is over 0');
                }
            });
        },
        onkeyfirst: (sm, key, down, e, data) => {
            const sun = sm.game.sun;
            if(down){
                sm.commonNumKey(key);
            }
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_supernova };
