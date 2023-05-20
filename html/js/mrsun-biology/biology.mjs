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
/*
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
*/
// get Habitable section Indices ( water and habitable climate )
const getWaterHabitableIndices = (game) => {
   return game.lands.sections.filter( (section) => {
       return section.isHabitable();
   }).map( (section, i) => {
       return section.i;
   });
};
// get water slot
const getWaterSlot = (game, section) => {
    //const section = game.lands.sections[i_section];
    const slots_water = section.slots.filter( (slot) => {
        return slot.block.type === 'water';
    });
    const len = slots_water.length;
    return slots_water[ Math.floor( len * Math.random() )  ];
};
// The abiogenesis process
const abiogenesis = (game, live_world) => {
    //const indices = getWaterSectionIndices(game);
    const indices = getWaterHabitableIndices(game);
    const len = indices.length;
    if( len === 0 ){
        // if there are no sections where life can start...
    }
    if( len > 0 ){
        // we have at least one section where lif can start.
        const i = indices[ Math.floor( len * Math.random() ) ];
        const section = game.lands.sections[i];
        const slot = getWaterSlot(game, section);
        console.log('Abiogenesis:');
        console.log('section index: ' + i);
        if(slot){
            slot.block.setLevel(1, 'water_life', 1);
            section.setBlockTypeCounts();
        }
    }
};
// check the current habitability of a section
// if a section is no longer habitable then all life must die
const habitability = (game, section) => {
    const habitable = section.isHabitable();

    // if the section is NOT habitable, and there is life on it, then all that life will die
    if(!habitable && section.bt_counts.water_life > 0){

        console.log('life on a section that is not habitable');
        const slots = section.slots.filter( (slot) => {
            return slot.block.type === 'water_life';
        });
        slots.forEach( (slot) => {
            slot.block.setLevel(1, 'water', 1);
            section.setBlockTypeCounts();
        });
    }
    // if the section is habitable
    if(habitable){
    }
};
// main public update method for Biology
Biology.update = (game) => {
    const live_world = getLandsLifeStatus(game);
    if(game.tick_delta > 0 && !live_world){
        abiogenesis(game, live_world);
    }
    if(game.tick_delta > 0 && live_world){
        let i = 0;
        const len = game.lands.sections.length;
        while(i < len){
            const section = game.lands.sections[i];
            habitability(game, section);
            i += 1;
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { Biology };
