// bilogy.mjs - for idle_mrsun
import { constant } from '../mrsun-constant/constant.mjs'

const Biology = {};

// find out what the life status is of all lands by checking bt counts
// of all sections
const getLandsLifeStatus = (game) => {
   let i = game.lands.sections.length;
   while(i--){
      const section = game.lands.sections[i];
      if(section.bt_counts.water_life > 0){
          return true;
      }
   }
   return false;
};
// get section indices that have at least one water block
const getWaterSectionIndices = (game) => {
   let i = game.lands.sections.length;
   const indices = [];
   while(i--){
      const section = game.lands.sections[i];
      if(section.bt_counts.water >= 1){
          indices.push(i);
      }
   }
   return indices;
};
// get water slot
const getWaterSlot = (game, i_section) => {
    const section = game.lands.sections[i_section];
    const slots_water = section.slots.filter( (slot) => {
        return slot.block.type === 'water';
    });
    const len = slots_water.length;
    return slots_water[ Math.floor( len * Math.random() )  ];
};
// main public update method for Biology
Biology.update = (game) => {
    const live_world = getLandsLifeStatus(game);

    // if dead world there should be a way for an abiogenesis
    if( game.tick_delta > 0 && !live_world){
        const indices = getWaterSectionIndices(game);
        const len = indices.length;
        if(len > 0){
            const i = indices[ Math.floor( len * Math.random() ) ];
            const slot = getWaterSlot(game, i);
            console.log('Abiogenesis:');
            console.log('section index: ' + i);
            if(slot){
                //slot.block.setLevel(1, 'water_life', 1);
            }
        }
    }

};

//-------- ----------
// EXPORT
//-------- ----------
export { Biology };
